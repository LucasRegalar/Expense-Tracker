import Transaction from "./Transaction.js";


class TransactionsManager {
    constructor() {
        this.transactionsArr = [];

        this.dashboardTotalIncome = document.getElementById("dashboard-total-income");
        this.dashboardTotalExpenses = document.getElementById("dashboard-total-expenses");
        this.dashboardTotalBalance = document.getElementById("dashboard-total-balance");
        this.dashboardRecentHistoryList = document.getElementById("dashboard-recent-history-list");
        this.dashboardMinSalary = document.getElementById("dashboard-min-salary");
        this.dashboardMaxSalary = document.getElementById("dashboard-max-salary");
        this.dashboardMinExpense = document.getElementById("dashboard-min-expense");
        this.dashboardMaxExpense = document.getElementById("dashboard-max-expense");
        this.dashboardChart = document.getElementById("dashboard-chart");

        this.transactionOverviewList = document.getElementById("transaction-overview-list");
        this.overviewTotalBalance = document.getElementById("overview-total-balance");

        this.incomeTitleInput = document.getElementById("income-title");
        this.incomeAmountInput = document.getElementById("income-amount");
        this.incomeDateInput = document.getElementById("income-date");
        this.incomeOptionInput = document.getElementById("income-option");
        this.incomeDescriptionInput = document.getElementById("income-description");
        this.incomeAddBtn = document.getElementById("add-income-btn");
        this.incomesList = document.getElementById("incomes-list");
        this.totalIncome = document.getElementById("total-income");
        this.incomeForm = document.getElementById("income-form");
        
        this.expenseTitleInput = document.getElementById("expense-title");
        this.expenseAmountInput = document.getElementById("expense-amount");
        this.expenseDateInput = document.getElementById("expense-date");
        this.expenseOptionInput = document.getElementById("expense-option");
        this.expenseDescriptionInput = document.getElementById("expense-description");
        this.expenseAddBtn = document.getElementById("add-expense-btn");
        this.expensesList = document.getElementById("expenses-list");
        this.totalExpenses = document.getElementById("total-expenses");
        this.expenseForm = document.getElementById("expense-form");

        this.mainRed = getComputedStyle(document.documentElement).getPropertyValue('--main-red');
        this.mainGreen = getComputedStyle(document.documentElement).getPropertyValue('--main-green');
        
        this.expenseAddBtn.addEventListener("click", (event) => {
            this.addBtnClickEvent(event);
        })

        this.incomeAddBtn.addEventListener("click", (event) => {
            this.addBtnClickEvent(event);
        })

        this.expensesList.addEventListener("click", (event) => {
            this.deleteBtnClickEvent(event);
        })

        this.incomesList.addEventListener("click", (event) => {
            this.deleteBtnClickEvent(event);
        })

        this.chart = new Chart(this.dashboardChart, {});
        this.getLocalStorage();
    }


    //Methods

    createChart() {

        const getLabels = (() => {
            let labels = [];
            this.sortArrByDate(this.transactionsArr).reverse().forEach((element) => {
                if (labels.includes(element.date)) {
                    return;
                }
                labels.push(element.date);
            })
            return labels;
        });

        const buildData = ((labels, arr) => {
            
            const labelsAndDataArr = labels.map((element) => {
                return {
                    date: element,
                    amount: 0,
                }
            })

           arr.forEach((element) => {
            if (labels.includes(element.date)) {
                const index = labels.indexOf(element.date);
                labelsAndDataArr[index].amount = Number(labelsAndDataArr[index].amount) + Number(element.amount);
            }
           })
           const cleanDataArr = labelsAndDataArr.map((element) => element.amount);
           return cleanDataArr;
        })

        const labels = getLabels();
        const expenseData = buildData(labels, this.filterExpenses());
        const incomesData = buildData(labels, this.filterIncomes());

        const chart = new Chart(this.dashboardChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Expenses",
                    data: expenseData,
                    borderColor: `${this.mainRed}`,
                }, {
                    label: "Incomes",
                    data: incomesData,
                    borderColor: `${this.mainGreen}`
                }]
            },
            options: {
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                        color: "#18191a"
                    }
                  },
                  x: {
                    grid: {
                        color: "#18191a"
                    }
                  },
                },
              },
          })
          return chart;
    }

    addBtnClickEvent(event) {
        event.preventDefault();
        const type = event.target.id.split("-")[1];
        if (!this.getTransactionForm(type).checkValidity()) {
            this.getTransactionForm(type).reportValidity();
            return;
        }
        this.addTransaction(type);
    }


    deleteBtnClickEvent(event) {
        if (event.target.closest(".delete-btn") === null) {
            return;
        }
        const deleteBtnId =  event.target.closest(".delete-btn").id;
        if (deleteBtnId.includes("delete")) {
            const transactionId = parseInt(deleteBtnId.split("-")[2]);

            this.deleteTransaction(transactionId);
        }
    }


    setLocalStorage () {
        localStorage.setItem("transactions", JSON.stringify(this.transactionsArr));
    }

    
    getLocalStorage () {
        const savedTransactionJSON = localStorage.getItem("transactions");
        const savedTransactions = JSON.parse(savedTransactionJSON);
        
        if (!savedTransactions) {
            return;
        }

        this.transactionsArr = savedTransactions.map((transaction) => {
            return new Transaction(
                transaction.id,
                transaction.type,
                transaction.title,
                transaction.amount,
                transaction.date,
                transaction.category,
                transaction.description
            );
        })

        this.updateView();
    }



    getTransactionTitleInput (type) {
       return type === "expense" ? this.expenseTitleInput : this.incomeTitleInput;
    }

    getTransactionAmountInput (type) {
        return type === "expense" ? this.expenseAmountInput : this.incomeAmountInput;
    }

    getTransactionDateInput (type) {
        return type === "expense" ? this.expenseDateInput : this.incomeDateInput;
    }

    getTransactionOptionInput (type) {
        return type === "expense" ? this.expenseOptionInput : this.incomeOptionInput;
    }

    getTransactionDescriptionInput (type) {
        return type === "expense" ? this.expenseDescriptionInput : this.incomeDescriptionInput;
    }

    getTransactionList (type) {
        return type === "expense" ? this.expensesList : this.incomesList;
    }

    getTransactionForm (type) {
        return type === "expense" ? this.expenseForm : this.incomeForm;
    }



    filterExpenses() {
        return this.transactionsArr.filter((element) => {
            return element.type === "expense";
        })
    }

    filterIncomes() {
        return this.transactionsArr.filter((element) => {
            return element.type === "income";
        })
    }


    
    addTransaction (type) {
        //Amount Format add 0 automatically
        const amount = this.amountFormating(this.getTransactionAmountInput(type).value);

        //Date Format to DD/MM/YYYY
        const date = this.getTransactionDateInput(type).value.split("-").reverse().join("/");
        
        const id = this.generateUniqueId();

        //Adding Task to Arr
        this.transactionsArr.push(new Transaction(
            id,
            type, //income or expense
            this.getTransactionTitleInput(type).value,
            amount,
            date,
            this.getTransactionOptionInput(type).value,
            this.getTransactionDescriptionInput(type).value,
        ))
        
    
        //clean Inputs
        this.getTransactionTitleInput(type).value = "";
        this.getTransactionAmountInput(type).value ="";
        this.getTransactionDateInput(type).value = "";
        this.getTransactionDateInput(type).type = "text";
        this.getTransactionOptionInput(type).value = "";
        this.getTransactionDescriptionInput(type).value = "";

        this.updateView();
        this.setLocalStorage();
    }


    amountFormating(input) {
        //dd.d -> dd.d0
        const regexAddOneDecimal = /^(-)?(\d+)(\.)(\d{1})$/;
        if (regexAddOneDecimal.test(input)) {
            return input + "0";
        }

        // dd -> dd.00
        const regexAddTwoDecimals = /^(-)?(\d+)$/
        if (regexAddTwoDecimals.test(input)) {
            return input + ".00";
        }

        return input;
    }


    //Only for display. Doesn't work doing it in the constructor of the Transactions Class, because the "." is necassary for calculations
    dotToKomma(input) {
        const regex = /\./g
        return input.replace(regex, ",");
    }


    generateUniqueId() {
        const timestamp = new Date().getTime();
        return timestamp;
    }


    deleteTransaction(transactionId) {
        const filteredArr = this.transactionsArr.filter((element) => {
            return element.id !== transactionId;
        });

        if (this.transactionsArr.length === filteredArr.length) {
            alert("ERROR: Id not found. Please contact software-administrator.");

            return;
        }

        this.transactionsArr = filteredArr;
        this.updateView();
        this.setLocalStorage();
    }
    


    updateView() {
        this.displayExpensesIncomesSctns();
        this.displayDashboardSctn();
        this.displayTransactionOverviewSctn();
    }

    displayExpensesIncomesSctns() {
        this.incomesList.innerHTML = "";
        this.expensesList.innerHTML = "";

        const sortedArr = this.sortArrByDate(this.transactionsArr);

        sortedArr.forEach((element) => {
            const transactionList = this.getTransactionList(element.type);
            transactionList.innerHTML += element.displayTransactionHTML();
        });

        this.totalExpenses.innerHTML = `-${this.dotToKomma(this.calculateTotalExpenses())}€`;
        this.totalIncome.innerHTML = `${this.dotToKomma(this.calculateTotalIncome())}€`;
    }


    displayDashboardSctn() {
        this.dashboardTotalExpenses.innerHTML = `${this.dotToKomma(this.calculateTotalExpenses())}€`;
        this.dashboardTotalIncome.innerHTML = `${this.dotToKomma(this.calculateTotalIncome())}€`;
        
        this.dashboardTotalBalance.innerHTML = `${this.dotToKomma(this.calculateTotalBalance())}€`
        this.dashboardTotalBalance.classList.remove("red-text", "green-text");
        const colorClass = this.calculateTotalBalance() < 0 ? "red-text" : "green-text";
        this.dashboardTotalBalance.classList.add(colorClass);

        this.dashboardRecentHistoryList.innerHTML = "";
        const sortedArr = this.sortArrByDate(this.transactionsArr);
        const firstThreeElements = sortedArr.slice(0, 3);
        firstThreeElements.forEach((element) => {
            this.dashboardRecentHistoryList.innerHTML += element.displayRecentHistoryHTML();
        })
        const sortedIncomesArr = this.sortArrByAmount(this.filterIncomes());
        if (sortedIncomesArr.length === 0) {
            this.dashboardMinSalary.innerHTML = "0€";
            this.dashboardMaxSalary.innerHTML = "0€";
        } else {
            this.dashboardMinSalary.innerHTML = `${this.dotToKomma(sortedIncomesArr[sortedIncomesArr.length - 1].amount)}€`;
            this.dashboardMaxSalary.innerHTML = `${this.dotToKomma(sortedIncomesArr[0].amount)}€`;
        };
        const sortedExpensesArr = this.sortArrByAmount(this.filterExpenses());
        if (sortedExpensesArr.length === 0) {
            this.dashboardMinExpense.innerHTML = "0€";
            this.dashboardMaxExpense.innerHTML = "0€";
        } else {
            this.dashboardMinExpense.innerHTML = `${this.dotToKomma(sortedExpensesArr[sortedExpensesArr.length - 1].amount)}€`
            this.dashboardMaxExpense.innerHTML = `${this.dotToKomma(sortedExpensesArr[0].amount)}€`
        }

        this.chart.destroy();
        this.chart = this.createChart();
    }


    displayTransactionOverviewSctn() {
        this.transactionOverviewList.innerHTML = "";

        const sortedArr = this.sortArrByDate(this.transactionsArr);

        sortedArr.forEach((element) => {
            this.transactionOverviewList.innerHTML += element.displayOverviewHTML();
        })

        this.overviewTotalBalance.innerHTML = `${this.dotToKomma(this.calculateTotalBalance())}€`
        this.overviewTotalBalance.classList.remove("red-text", "green-text");

        const colorClass = this.calculateTotalBalance() < 0 ? "red-text" : "green-text";
        this.overviewTotalBalance.classList.add(colorClass);
    }


    //Calculations
    calculateTotalExpenses() {
        let totalExpenses = 0;
        this.filterExpenses().forEach((expense) => {
            totalExpenses = totalExpenses + Number(expense.amount);
        })

        return this.amountFormating(totalExpenses);
    }

    calculateTotalIncome() {
        let totalIncome = 0;
        this.filterIncomes().forEach((income) => {
            totalIncome = totalIncome + Number(income.amount);
        })

        return this.amountFormating(totalIncome);
    }

    calculateTotalBalance() {
        let totalBalance = 0;
        this.filterIncomes().forEach((income) => {
            totalBalance = totalBalance + Number(income.amount);
        })
        this.filterExpenses().forEach((expense) => {
            totalBalance = totalBalance - Number(expense.amount);
        })

        return this.amountFormating(totalBalance);
    }

    
    sortArrByDate(arr) {
        // Date Format DD//MM//YYYY
        return arr.sort((a,b) => {
            const aString = a.date.split("/").reverse().join("");
            const bString = b.date.split("/").reverse().join("");

            return bString - aString;
        });
    }

    sortArrByAmount(arr) {
        // Biggest to smallest
        return arr.sort((a,b) => {
            return Number(b.amount) - Number(a.amount);
        });
    }
}


export default TransactionsManager;
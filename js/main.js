import TransactionsManager from "./TransactionsManager.js";
const manager = new TransactionsManager;

//Navigation
const navigation = document.getElementById("navigation");

const dashboard = document.getElementById("dashboard-sctn");
const transactions = document.getElementById("transactions-sctn");
const incomes = document.getElementById("incomes-sctn");
const expenses = document.getElementById("expenses-sctn");

navigation.addEventListener("click", (e) => {
    const targetId = e.target.id;

    //clicked between buttons will not do anything
    if (targetId === "") {
        return;
    }

    dashboard.style.display = "none";
    transactions.style.display = "none";
    incomes.style.display = "none";
    expenses.style.display = "none";

    if (targetId === "dashboard-btn") {
        dashboard.style.display = "block";
    } else if (targetId === "transactions-btn") {
        transactions.style.display = "block";
    } else if (targetId === "incomes-btn") {
        incomes.style.display = "block";
    } else if (targetId === "expenses-btn") {
        expenses.style.display = "block";
    }
})
class Transaction {
    constructor(id, type, title, amount, date, category, description) {
        this.id = id;
        this.type = type; //income or expense
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.description = description;
    }

    //Only for display. Doesn't work doing it in the constructor, because the "." is necassary for calculations
    dotToKomma(input) {
        const regex = /\./g
        return input.replace(regex, ",");
    }

    //HTML Incomes-List, Expenses-List
    displayTransactionHTML () {
        const dotColor = this.type === "expense" ? "dot--red" : "dot--green";
        const iconHTML = this.categoryIconHTML();
        const innerHTML = `
            <div class="inner-card inner-card__transaction-item-container">
                <div class="inner-card__transaction-item-container__icon-container">
                    ${iconHTML}
                    <div class="inner-card__transaction-item-container__icon-container__inner-container">
                        <div class="inner-card__transaction-list__item-heading">
                            <div class="dot ${dotColor}"></div>
                            <p>${this.title}</p>
                        </div>
                        <div>
                            <p>${this.dotToKomma(this.amount)}€</p>
                            <span>
                                <i class="fa-regular fa-calendar i--less-margin"></i>
                                <p>${this.date}</p>
                            </span>
                            <span>
                                <i class="fa-regular fa-comment i--less-margin"></i>
                                <p>${this.description}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <button class="delete-btn" id="delete-btn-${this.id}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `

        return innerHTML;
    }

    //HTML for Transaction-Overview-List
    displayOverviewHTML () {
        const textColor = this.type === "expense" ? "red-text" : "green-text";
        const minusOrPlus = this.type === "expense" ? "-" : "+";
        const dotColor = this.type === "expense" ? "dot--red" : "dot--green";
        const iconHTML = this.categoryIconHTML();
        const innerHTML = `
            <div class="inner-card inner-card__transaction-item-container">
                <div class="inner-card__transaction-item-container__icon-container">
                    ${iconHTML}
                    <div>
                        <div class="inner-card__transaction-list__item-heading">
                            <div class="dot ${dotColor}"></div>
                            <p>${this.title}</p>
                        </div>
                        <div>
                            <span>
                                <i class="fa-regular fa-calendar i--less-margin"></i>
                                <p>${this.date}</p>
                            </span>
                            <span>
                                <i class="fa-regular fa-comment i--less-margin"></i>
                                <p>${this.description}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <p class="${textColor} font-size-500">${minusOrPlus}${this.dotToKomma(this.amount)}€</p>
            </div>
        `

        return innerHTML;
    }


    //HTML for Dashboard-Recent-History
    displayRecentHistoryHTML() {
        const textColor = this.type === "expense" ? "red-text" : "green-text";
        const minusOrPlus = this.type === "expense" ? "-" : "+";
        const innerHTML = `
        <div class="inner-card inner-card__recent-history-item ${textColor}">
            <p>${this.title}</p>
            <p>${minusOrPlus}${this.dotToKomma(this.amount)}€</p>
        </div> 
        `

        return innerHTML;
    }

    categoryIconHTML() {
        switch(this.category) {
            //icome-categories
            case "salary": 
                return '<i class="fa-solid fa-sack-dollar i--big"></i>';
            case "freelancing": 
                return '<i class="fa-solid fa-hand-holding-dollar i--big"></i>';
            case "investments": 
                return '<i class="fa-solid fa-piggy-bank i--big"></i>';
            case "stocks": 
                return '<i class="fa-solid fa-money-bill-trend-up i--big"></i>';
            case "bitcoin": 
                return '<i class="fa-brands fa-btc i--big"></i>';
            case "bank-transfer": 
                return '<i class="fa-solid fa-money-check-dollar i--big"></i>';
            case "youtube": 
                return '<i class="fa-brands fa-youtube i--big"></i>';
            case "other": 
                return '<i class="fa-solid fa-coins i--big"></i>';
            //expense-categories
            case "education": 
                return '<i class="fa-solid fa-user-graduate i--big"></i>';
            case "groceries": 
                return '<i class="fa-solid fa-cart-shopping i--big"></i>';
            case "health": 
                return '<i class="fa-solid fa-briefcase-medical i--big"></i>';
            case "subsribtions": 
                return '<i class="fa-solid fa-circle-dollar-to-slot i--big"></i>';
            case "takeaways": 
                return '<i class="fa-solid fa-circle-dollar-to-slot i--big"></i>';
            case "clothings": 
                return '<i class="fa-solid fa-shirt i--big"></i>';
            case "travelling": 
                return '<i class="fa-solid fa-plane-departure i--big"></i>';
            default:
                return '<i class="fa-solid fa-notdef i--big i--big"></i>';
        }
    }
}


export default Transaction;
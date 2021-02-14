const modal_overlay = document.querySelector('.modal-overlay')

const toggle = () => {
    modal_overlay.classList.toggle('active')
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("finances.dev:transaction")) || []
    },
    set(transactions) {
        localStorage.setItem("finances.dev:transaction", JSON.stringify(transactions))
    }
}
 
const Transaction = {
    all: Storage.get(),

    add(transaction){
         Transaction.all.push(transaction);

         App.reload();
     },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
     },
    incomes(){
        let income = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0 ){
                income += transaction.amount;
            }
        })
    
        return income;
    },
    expenses(){
        let expense = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0 ){
                expense += transaction.amount;
            }
        })
    
        return expense;
    },
    total(){
        return Transaction.incomes() + Transaction.expenses();
    }
}

const inputInTable = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = inputInTable.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        inputInTable.transactionsContainer.appendChild(tr)
    },
 
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Minus">
            </td>
        </tr>
        `
        return html
    },

    updateBalance() {
        document.querySelector('#incomeOutPut').innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.querySelector('#expenseOutPut').innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.querySelector('#totalOutPut').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        inputInTable.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100

        return value
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[0]}/${splittedDate[1]}/${splittedDate[2]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description : document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),

    getValues() {
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields(){
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },


    formatData(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
              description,
              amount,
              date,
        }
    },


    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try{
           Form.validateFields()
           const transaction = Form.formatData()
           Transaction.add(transaction)
           Form.clearFields()
           toggle()
        }
        catch(error){
            alert(error.message)
        }
        Form.formatData( )
    }
}



const App = {
    init(){
       Transaction.all.forEach(inputInTable.addTransaction)
       
       
       inputInTable.updateBalance()
       
        Storage.set(Transaction.all )
    },
    reload(){
        inputInTable.clearTransactions()
        App.init()
    },
}

App.init()



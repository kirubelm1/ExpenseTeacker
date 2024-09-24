let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = JSON.parse(localStorage.getItem("totalBalance")) || 0;
const balanceEl = document.getElementById("balance");
const incomeSourceEl = document.getElementById("income-source");
const incomeAmountEl = document.getElementById("income-amount");
const expenseDescriptionEl = document.getElementById("expense-description");
const expenseAmountEl = document.getElementById("expense-amount");
const addIncomeBtn = document.getElementById("add-income");
const addExpenseBtn = document.getElementById("add-expense");
const historyListEl = document.getElementById("history-list");
const remindersEl = document.getElementById("reminders");
function updateBalance() {
    balanceEl.innerText = `$${totalBalance.toFixed(2)}`;
    localStorage.setItem("totalBalance", JSON.stringify(totalBalance));
}
function addIncome() {
    const source = incomeSourceEl.value;
    const amount = parseFloat(incomeAmountEl.value);
    if (source && amount > 0) {
        totalBalance += amount;
        transactions.push({ type: 'income', source, amount, date: new Date().toLocaleDateString() });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateBalance();
        displayHistory();
        clearInputs();
    }
}
function addExpense() {
    const description = expenseDescriptionEl.value;
    const amount = parseFloat(expenseAmountEl.value);
    if (description && amount > 0 && totalBalance >= amount) {
        totalBalance -= amount;
        transactions.push({ type: 'expense', description, amount, date: new Date().toLocaleDateString() });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateBalance();
        displayHistory();
        displayReminders();
        clearInputs();
    } else if (totalBalance < amount) {
        alert("Insufficient balance");
    }
}
function displayHistory() {
    historyListEl.innerHTML = "";
    transactions.forEach(transaction => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.date} - ${transaction.type === 'income' ? transaction.source : transaction.description}: $${transaction.amount.toFixed(2)}`;
        historyListEl.appendChild(li);
    });
}
function clearInputs() {
    incomeSourceEl.value = '';
    incomeAmountEl.value = '';
    expenseDescriptionEl.value = '';
    expenseAmountEl.value = '';
}
function displayReminders() {
    const futurePayments = transactions.filter(transaction => transaction.type === 'expense');
    if (futurePayments.length > 0) {
        remindersEl.innerText = "Upcoming payments to track";
    } else {
        remindersEl.innerText = "No upcoming payments";
    }
}
function displayChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const monthlyExpenses = Array(12).fill(0);
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            const month = new Date(transaction.date).getMonth();
            monthlyExpenses[month] += transaction.amount;
        }
    });
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyExpenses,
                backgroundColor: 'rgba(0, 112, 186, 0.2)',
                borderColor: '#0070ba',
                fill: true,
            }]
        }
    });
}
addIncomeBtn.addEventListener("click", addIncome);
addExpenseBtn.addEventListener("click", addExpense);

document.addEventListener("DOMContentLoaded", () => {
    updateBalance();
    displayHistory();
    displayReminders();
    displayChart();
});

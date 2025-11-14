const btnPay = document.querySelector('.btn-pay') as HTMLButtonElement;
const amountInput = document.querySelector('#amount') as HTMLInputElement;
const categoryInput = document.querySelector('#Categories') as HTMLSelectElement;
const paymentForm = document.querySelector('.payment-form') as HTMLFormElement;
const trasactionHistory = document.querySelector('.transaction') as HTMLDivElement;
const btnPayment = document.querySelector('.btn-payment') as HTMLButtonElement;
const paymentContainer = document.querySelector('.payment-container') as HTMLDivElement;
const btnCancel = document.querySelector('.btn-Cancel') as HTMLButtonElement;
const btnIncome = document.querySelector('.btn-income') as HTMLButtonElement;
const addMoneyContainer = document.querySelector('.add-money-container') as HTMLDivElement;
const btnCancelForm = document.querySelector('.btn-Cancel-form') as HTMLButtonElement;
const addAmountInput = document.querySelector('#Add-amount') as HTMLInputElement;
const addMoneyForm = document.querySelector('.add-money-form') as HTMLFormElement;
const btnAddMoney = document.querySelector('.btn-add') as HTMLButtonElement;
const balanceText = document.querySelector('.balance span') as HTMLDivElement;
const btnReminder = document.querySelector('.btn-reminder') as HTMLButtonElement;
const reminderContainer = document.querySelector('.reminder-container') as HTMLDivElement;
const btnCancelReminder = document.querySelector('.btn-Cancel-reminder') as HTMLButtonElement;
const btnAddTask = document.querySelector('.btn-add-task') as HTMLButtonElement;
const taskDescriptionInput = document.querySelector('#task') as HTMLTextAreaElement;
const reminderDateInput = document.querySelector('#date') as HTMLInputElement;
const reminderHistory = document.querySelector('.reminder') as HTMLDivElement;
const billsBalance = document.querySelector('.BU-balance span') as HTMLSpanElement;
const foodAndDrinkBalance = document.querySelector('.FD-balance span') as HTMLSpanElement;
const otherBalance = document.querySelector('.other span') as HTMLSpanElement;
const schoolBalance = document.querySelector('.School-balance span') as HTMLSpanElement;
const checkboxInput = document.querySelector('#checkbox') as HTMLInputElement;
const setReminderForm = document.querySelector('.set-reminder-form') as HTMLFormElement;
const userName = document.querySelector('.user') as HTMLSpanElement;
const body = document.querySelector('main') as HTMLBodyElement;
console.log(paymentContainer);

type Transactions = {
    category: string;
    amount: number;
    date: Date;
}

type Reminder = {
    description: string,
    date: string,
    complete: boolean
}

type CategoryAmount = {
    category: string;
    amount: number;
}

declare const Chart: any;




const currentUserEmail = localStorage.getItem("current_user_email");
const reminderArray: Reminder[] = loadReminders();
const transactions: Transactions[] = loadTransactions();
const balance: number[] = loadBalance();
const schoolFees: number[] = loadSchoolFees();
const foodAndDrink: number[] = loadFoodAndDrink();
const billsAndUtilities: number[] = loadBills();
const other: number[] = loadOther();
const names: string[] = (currentUserEmail as string).split('@');



function displayUser(): void{
    userName.textContent = `Welcome ${names[0]}`
}
function loadReminders(): Reminder[] {
    const retrievedReminders = localStorage.getItem(`reminder_${currentUserEmail}`);
    return retrievedReminders ? JSON.parse(retrievedReminders) : [];
}

function loadTransactions(): Transactions[] {
    const loadedValue = localStorage.getItem(`transaction_${currentUserEmail}`);
    return loadedValue ? JSON.parse(loadedValue).map((trans: any) => ({
        ...trans,
        date: typeof trans.date === 'string' ? new Date(trans.date) : trans.date
    })) : [];
}

function loadBalance(): number[] {
    const retrievedBalance = localStorage.getItem(`balance_${currentUserEmail}`);
    return retrievedBalance ? JSON.parse(retrievedBalance) : [];
}

function loadBills(): number[] {
    const loadValue = localStorage.getItem(`bills_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadSchoolFees(): number[] {
    const loadValue = localStorage.getItem(`school_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadOther(): number[] {
    const loadValue = localStorage.getItem(`other_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadFoodAndDrink(): number[] {
    const loadValue = localStorage.getItem(`food_${currentUserEmail}`);
    return loadValue ? JSON.parse(loadValue) : [];
}

const totalSchoolFeesBalance = schoolFees.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalFoodAndDrinkBalance = foodAndDrink.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalOtherBalance = other.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalBills = billsAndUtilities.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

const totalBalance = balance.reduce(function(acc: number, curr: number) {
    return acc + curr;
}, 0);

btnReminder.addEventListener('click', function(e) {
    e.preventDefault();
    reminderContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnCancelReminder.addEventListener('click', function(e) {
    e.preventDefault();
    reminderContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnPayment.addEventListener('click', function(e) {
    e.preventDefault();
    paymentContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnCancel.addEventListener('click', function(e) {
    e.preventDefault();
    paymentContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnCancelForm.addEventListener('click', function(e) {
    e.preventDefault();
    console.log(e.target);
    addMoneyContainer.style.display = 'none';
    body.classList.remove('blurred');
});

btnIncome.addEventListener('click', function(e) {
    e.preventDefault();
    addMoneyContainer.style.display = 'block';
    body.classList.add('blurred');
});

btnPay.addEventListener('click', function(e) {
    e.preventDefault();
    const transactionItem: Transactions = {
        category: categoryInput.value,
        amount: +(amountInput.value),
        date: new Date(),
    }

    const categoryAmount: CategoryAmount = {
        category: categoryInput.value,
        amount: +(amountInput.value),
    }

    // Calculate current balance before categoryUpdate
    const currentTotalBalance = balance.reduce((acc, curr) => acc + curr, 0);
    
    if (categoryAmount.amount <= currentTotalBalance) {
        categoryUpdate(categoryAmount);
        transactions.push(transactionItem);
        updateTransactionStorage();
        renderTransaction(transactionItem);
    } else {
        alert("Insufficient funds, please deposit to withdraw...");
        paymentContainer.style.display = 'none';
        body.classList.remove('blurred');
        paymentForm.reset();
        return;
    }

    // Update the balances dynamically
    updateBalance();
    updateSchoolFeesBalance();
    updateBillsBalance();
    updateOtherBalance();
    updateFoodAndDrinkBalance();
    // Update chart dynamically with new data
    renderChart();
    updateLocalStorage();
    
    paymentContainer.style.display = 'none';
    body.classList.remove('blurred');
    paymentForm.reset();
});

btnAddMoney.addEventListener('click', function(e) {
    e.preventDefault();
    const newAmount = Number(addAmountInput.value);
    balance.push(newAmount);

    updateLocalStorage();
    updateBalance();
    // Update chart dynamically when income is added
    renderChart();
    
    addMoneyContainer.style.display = 'none';
    body.classList.remove('blurred');
    addMoneyForm.reset();
});

btnAddTask.addEventListener('click', function(e) {
    e.preventDefault();
    const reminderItem: Reminder = {
        description: taskDescriptionInput.value,
        date: reminderDateInput.value,
        complete: checkboxInput.checked,
    }

    reminderArray.push(reminderItem);
    displayReminderTask(reminderItem);
    updateReminderStorage();

    reminderContainer.style.display = 'none';
    body.classList.remove('blurred');
    setReminderForm.reset();
});

function displayReminderTask(reminder: Reminder): void {
    const html = `
                     <div>
                            <div>
                                <span>${reminder.description}</span>
                                <input type="checkbox" ${reminder.complete ? 'checked' : ''} onchange="toggleReminderComplete('${reminder.description}')">
                            </div>
                            <br>
                            <div>
                                ${reminder.date}
                            </div>
                            <div>
                                
                                <button onclick="deleteReminder('${reminder.description}')">Delete</button>
                            </div>
                    </div>
                    <br>
                    `;

    reminderHistory.insertAdjacentHTML('afterbegin', html);
}

function renderTransaction(trans: Transactions): void {
    const html = `<div class="transaction-item">
                        <span class="cat ${trans.category}">${trans.category}</span>
                        <span class="amt">ZMW ${(trans.amount).toFixed(2)}</span>
                        <span class="date">${(trans.date.getDate()) + 1}:${trans.date.getMonth() + 1}:${trans.date.getFullYear()}</span>
                    </div>
                    <hr>`;
    trasactionHistory.insertAdjacentHTML('afterbegin', html);
}

function updateBalance(): void {
    const totalBalance = balance.reduce((acc, curr) => acc + curr, 0);
    balanceText.textContent = `${totalBalance}`;
}

function updateSchoolFeesBalance(): void {
    const totalSchoolFeesBalance = schoolFees.reduce((acc, curr) => acc + curr, 0);
    schoolBalance.textContent = `${totalSchoolFeesBalance}`;
}

function updateBillsBalance(): void {
    const totalBills = billsAndUtilities.reduce((acc, curr) => acc + curr, 0);
    billsBalance.textContent = `${totalBills}`;
}

function updateOtherBalance(): void {
    const totalOtherBalance = other.reduce((acc, curr) => acc + curr, 0);
    otherBalance.textContent = `${totalOtherBalance}`;
}

function updateFoodAndDrinkBalance(): void {
    const totalFoodAndDrinkBalance = foodAndDrink.reduce((acc, curr) => acc + curr, 0);
    foodAndDrinkBalance.textContent = `${totalFoodAndDrinkBalance}`;
}

function updateLocalStorage(): void {
    localStorage.setItem(`balance_${currentUserEmail}`, JSON.stringify(balance));
}

function categoryUpdate(catAmount: CategoryAmount) {
    if (catAmount.category === 'School') {
        schoolFees.push(catAmount.amount);
        balance.push((-1) * (catAmount.amount));
        updateSchoolStorage();
        updateSchoolFeesBalance();
    } else if (catAmount.category === 'Food and Drink') {
        foodAndDrink.push(catAmount.amount);
        balance.push((-1) * (catAmount.amount));
        updateFoodAndDrinkStorage();
        updateFoodAndDrinkBalance();
    } else if (catAmount.category === 'Bill and Utilities') {
        billsAndUtilities.push(catAmount.amount);
        balance.push((-1) * (catAmount.amount));
        updateBillAndUtilitiesStorage();
        updateBillsBalance();
    } else if (catAmount.category === 'Other') {
        other.push(catAmount.amount);
        balance.push((-1) * (catAmount.amount));
        updateOtherStorage();
        updateOtherBalance();
    }
    updateLocalStorage();
    updateBalance();
}

function updateReminderStorage() {
    localStorage.setItem(`reminder_${currentUserEmail}`, JSON.stringify(reminderArray));
}

function updateTransactionStorage() {
    localStorage.setItem(`transaction_${currentUserEmail}`, JSON.stringify(transactions));
}

function updateSchoolStorage() {
    localStorage.setItem(`school_${currentUserEmail}`, JSON.stringify(schoolFees));
}

function updateBillAndUtilitiesStorage() {
    localStorage.setItem(`bills_${currentUserEmail}`, JSON.stringify(billsAndUtilities));
}

function updateFoodAndDrinkStorage() {
    localStorage.setItem(`food_${currentUserEmail}`, JSON.stringify(foodAndDrink));
}

function updateOtherStorage() {
    localStorage.setItem(`other_${currentUserEmail}`, JSON.stringify(other));
}

function toggleReminderComplete(description: string): void {
    const reminder = (reminderArray as any[]).find((rem: any) => rem.description === description);
    if (reminder) {
        reminder.complete = !reminder.complete;
        updateReminderStorage();
        renderReminders();
    }
}

function deleteReminder(description: string): void {
    const index = (reminderArray as any[]).findIndex((rem: any) => rem.description === description);
    if (index > -1) {
        reminderArray.splice(index, 1);
        updateReminderStorage();
        renderReminders();
    }
}

let chartInstance: any = null;

function renderChart() {
    const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    const totalSchoolFeesBalance = schoolFees.reduce((acc, curr) => acc + curr, 0);
    const totalFoodAndDrinkBalance = foodAndDrink.reduce((acc, curr) => acc + curr, 0);
    const totalOtherBalance = other.reduce((acc, curr) => acc + curr, 0);
    const totalBills = billsAndUtilities.reduce((acc, curr) => acc + curr, 0);
    const totalBalance = balance.reduce((acc, curr) => acc + curr, 0);
    const totalIncome = totalBalance - totalBills - totalSchoolFeesBalance - totalFoodAndDrinkBalance - totalOtherBalance;

    // Destroy existing chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['School', 'Food and Drink', 'Bills and Utilities', 'Other','Income'],
            datasets: [{
                label: 'Transaction Amount',
                data: [totalSchoolFeesBalance, totalFoodAndDrinkBalance, totalBills, totalOtherBalance, totalIncome],
                backgroundColor: [
                    'rgba(30, 144, 255)',
                    'rgba(255, 99, 71)',
                    'rgba(255, 209, 59)',
                    'rgba(255, 105, 180)',
                    'rgb(98, 255, 25)',
                ],
                borderColor: [
                    'rgba(30, 144, 255)',
                    'rgba(255, 99, 71)',
                    'rgba(255, 209, 59)',
                    'rgba(255, 105, 180)',
                    'rgb(98, 255, 25)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// function renderChart() {
//     var ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
    
//     // Color mapping for each category
//     var categoryColors = {
//         'School': 'rgba(255, 99, 132, 1)', // Red
//         'Food and Drink': 'rgba(255, 159, 64, 1)', // Orange
//         'Bills and Utilities': 'rgb(182, 255, 11, 1)', // Yellow
//         'Other': 'rgba(153, 102, 255, 1)', // Purple
//         'Income': 'rgba(54, 162, 235, 1)' // Blue

//     };

//     var categoryBorderColors = {
//         'School': 'rgba(255, 99, 132, 1)', // Red
//         'Food and Drink': 'rgba(255, 159, 64, 1)', // Orange
//         'Bills and Utilities': 'rgb(182, 255, 11, 1)', // Yellow
//         'Other': 'rgba(153, 102, 255, 1)', // Purple
//         'Income': 'rgba(54, 162, 235, 1)' // Blue
//     };

//     var categoryTotals = {
//         'School': totalSchoolFeesBalance,
//         'Food and Drink': totalFoodAndDrinkBalance,
//         'Bills and Utilities': totalBills,
//         'Other': totalOtherBalance,
//         'Income': balance.reduce(function (acc, curr) { return acc + curr; }, 0) - totalBills - totalSchoolFeesBalance - totalFoodAndDrinkBalance - totalOtherBalance
//     };

//     var labels = Object.keys(categoryTotals);
//     var amounts = Object.values(categoryTotals);
//     var backgroundColors = labels.map(function (label) { return categoryColors[label] || 'rgba(201, 203, 207, 0.2)'; });
//     var borderColors = labels.map(function (label) { return categoryBorderColors[label] || 'rgba(201, 203, 207, 1)'; });

    

//     // Create new chart instance
//     new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Transaction Amount',
//                 data: amounts,
//                 backgroundColor: backgroundColors,
//                 borderColor: borderColors,
//                 borderWidth: 3
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

window.addEventListener('DOMContentLoaded', function() {
    reminderArray.forEach(displayReminderTask);
    transactions.forEach(renderTransaction);
    updateBalance();
    updateSchoolFeesBalance();
    updateBillsBalance();
    updateOtherBalance();
    updateFoodAndDrinkBalance();
    renderChart();
    displayUser()
    // Show upcoming reminders within 3 days on load
    showUpcomingNotifications(3);
});

function parseReminderDate(dateStr: string): Date {
    return new Date(dateStr);
}

function daysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUpcomingReminders(days: number): Reminder[] {
    return reminderArray.filter(r => !r.complete && daysUntil(parseReminderDate(r.date)) <= days);
}

function showUpcomingNotifications(days: number): void {
    const upcoming = getUpcomingReminders(days);
    if (!upcoming || upcoming.length === 0) return;

    // avoid duplicate panel
    if (document.getElementById('upcoming-notifications')) return;

    const panel = document.createElement('div');
    panel.id = 'upcoming-notifications';
    panel.style.position = 'fixed';
    panel.style.right = '20px';
    panel.style.bottom = '20px';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '12px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    panel.style.zIndex = '9999';
    panel.style.maxWidth = '320px';

    const title = document.createElement('div');
    title.textContent = `Upcoming reminders (${upcoming.length})`;
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';
    panel.appendChild(title);

    upcoming.forEach(rem => {
        const item = document.createElement('div');
        item.style.borderTop = '1px solid #eee';
        item.style.paddingTop = '8px';
        item.style.marginTop = '8px';

        const desc = document.createElement('div');
        desc.textContent = rem.description;
        item.appendChild(desc);

        const date = document.createElement('div');
        date.textContent = rem.date;
        date.style.fontSize = '12px';
        date.style.color = '#666';
        item.appendChild(date);

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        controls.style.marginTop = '8px';

        const markBtn = document.createElement('button');
        markBtn.textContent = 'Mark complete';
        markBtn.onclick = function() {
            toggleReminderComplete(rem.description);
            if (item.parentNode) item.parentNode.removeChild(item);
            if (document.getElementById('upcoming-notifications')) {
                // update count
                const t = document.querySelector('#upcoming-notifications div');
                if (t) t.textContent = `Upcoming reminders (${getUpcomingReminders(days).length})`;
            }
        };

        const dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'Dismiss';
        dismissBtn.onclick = function() {
            if (item.parentNode) item.parentNode.removeChild(item);
            if (getUpcomingReminders(days).length === 0) {
                const p = document.getElementById('upcoming-notifications');
                if (p && p.parentNode) p.parentNode.removeChild(p);
            }
        };

        controls.appendChild(markBtn);
        controls.appendChild(dismissBtn);
        item.appendChild(controls);
        panel.appendChild(item);
    });

    const closeAll = document.createElement('button');
    closeAll.textContent = 'Close';
    closeAll.style.marginTop = '10px';
    closeAll.onclick = function() {
        const p = document.getElementById('upcoming-notifications');
        if (p && p.parentNode) p.parentNode.removeChild(p);
    };
    panel.appendChild(closeAll);

    document.body.appendChild(panel);
}

function renderReminders() {
    reminderHistory.innerHTML = '';
    reminderArray.forEach(displayReminderTask);
}

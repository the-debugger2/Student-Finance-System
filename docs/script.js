var btnPay = document.querySelector('.btn-pay');
var amountInput = document.querySelector('#amount');
var categoryInput = document.querySelector('#Categories');
var paymentForm = document.querySelector('.payment-form');
var trasactionHistory = document.querySelector('.transaction');
var btnPayment = document.querySelector('.btn-payment');
var paymentContainer = document.querySelector('.payment-container');
var btnCancel = document.querySelector('.btn-Cancel');
var btnIncome = document.querySelector('.btn-income');
var addMoneyContainer = document.querySelector('.add-money-container');
var btnCancelForm = document.querySelector('.btn-Cancel-form');
var addAmountInput = document.querySelector('#Add-amount');
var addMoneyForm = document.querySelector('.add-money-form');
var btnAddMoney = document.querySelector('.btn-add');
var balanceText = document.querySelector('.balance span');
var btnReminder = document.querySelector('.btn-reminder');
var reminderContainer = document.querySelector('.reminder-container');
var btnCancelReminder = document.querySelector('.btn-Cancel-reminder');
var btnAddTask = document.querySelector('.btn-add-task');
var taskDescriptionInput = document.querySelector('#task');
var reminderDateInput = document.querySelector('#date');
var reminderHistory = document.querySelector('.reminder');
var billsBalance = document.querySelector('.BU-balance span');
var foodAndDrinkBalance = document.querySelector('.FD-balance span');
var otherBalance = document.querySelector('.other span');
var schoolBalance = document.querySelector('.School-balance span');
var checkboxInput = document.querySelector('#checkbox');
var setReminderForm = document.querySelector('.set-reminder-form');
var userName = document.querySelector('.user');
var body = document.querySelector('main');
console.log(paymentContainer);
var currentUserEmail = localStorage.getItem("current_user_email");
var reminderArray = loadReminders();
var transactions = loadTransactions();
var balance = loadBalance();
var schoolFees = loadSchoolFees();
var foodAndDrink = loadFoodAndDrink();
var billsAndUtilities = loadBills();
var other = loadOther();
var names = currentUserEmail.split('@');

function displayUser() {
    userName.textContent = "Welcome ".concat(names[0]);
}

function loadReminders() {
    var retrievedReminders = localStorage.getItem("reminder_".concat(currentUserEmail));
    return retrievedReminders ? JSON.parse(retrievedReminders) : [];
}

function loadTransactions() {
    var loadedValue = localStorage.getItem("transaction_".concat(currentUserEmail));
    return loadedValue ? JSON.parse(loadedValue).map(function(trans) { return { category: trans.category, amount: trans.amount, date: typeof trans.date === 'string' ? new Date(trans.date) : trans.date }; }) : [];
}

function loadBalance() {
    var retrievedBalance = localStorage.getItem("balance_".concat(currentUserEmail));
    return retrievedBalance ? JSON.parse(retrievedBalance) : [];
}

function loadBills() {
    var loadValue = localStorage.getItem("bills_".concat(currentUserEmail));
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadSchoolFees() {
    var loadValue = localStorage.getItem("school_".concat(currentUserEmail));
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadOther() {
    var loadValue = localStorage.getItem("other_".concat(currentUserEmail));
    return loadValue ? JSON.parse(loadValue) : [];
}

function loadFoodAndDrink() {
    var loadValue = localStorage.getItem("food_".concat(currentUserEmail));
    return loadValue ? JSON.parse(loadValue) : [];
}
var totalSchoolFeesBalance = schoolFees.reduce(function(acc, curr) {
    return acc + curr;
}, 0);
var totalFoodAndDrinkBalance = foodAndDrink.reduce(function(acc, curr) {
    return acc + curr;
}, 0);
var totalOtherBalance = other.reduce(function(acc, curr) {
    return acc + curr;
}, 0);
var totalBills = billsAndUtilities.reduce(function(acc, curr) {
    return acc + curr;
}, 0);
var totalBalance = balance.reduce(function(acc, curr) {
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
    var transactionItem = {
        category: categoryInput.value,
        amount: +(amountInput.value),
        date: new Date(),
    };
    var categoryAmount = {
        category: categoryInput.value,
        amount: +(amountInput.value),
    };
    // Calculate current balance before categoryUpdate
    var currentTotalBalance = balance.reduce(function(acc, curr) { return acc + curr; }, 0);
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
    var newAmount = Number(addAmountInput.value);
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
    var reminderItem = {
        description: taskDescriptionInput.value,
        date: reminderDateInput.value,
        complete: checkboxInput.checked,
    };
    reminderArray.push(reminderItem);
    displayReminderTask(reminderItem);
    updateReminderStorage();
    reminderContainer.style.display = 'none';
    body.classList.remove('blurred');
    setReminderForm.reset();
});

function displayReminderTask(reminder) {
    var html = "\n                     <div>\n                            <div>\n                                <span>".concat(reminder.description, "</span>\n                                <input type=\"checkbox\" ").concat(reminder.complete ? 'checked' : '', " onchange=\"toggleReminderComplete('").concat(reminder.description, "')\">\n                            </div>\n                            <br>\n                            <div>\n                                ").concat(reminder.date, "\n                            </div>\n                            <div>\n                                \n                                <button onclick=\"deleteReminder('").concat(reminder.description, "')\">Delete</button>\n                            </div>\n                    </div>\n                    <br>\n                    ");
    reminderHistory.insertAdjacentHTML('afterbegin', html);
}

function renderTransaction(trans) {
    var html = "<div class=\"transaction-item\">\n                        <span class=\"cat ".concat(trans.category, "\">").concat(trans.category, "</span>\n                        <span class=\"amt\">ZMW ").concat((trans.amount).toFixed(2), "</span>\n                        <span class=\"date\">").concat((trans.date.getDate()) + 1, ":").concat(trans.date.getMonth() + 1, ":").concat(trans.date.getFullYear(), "</span>\n                    </div>\n                    <hr>");
    trasactionHistory.insertAdjacentHTML('afterbegin', html);
}

function updateBalance() {
    var totalBalance = balance.reduce(function(acc, curr) { return acc + curr; }, 0);
    balanceText.textContent = "".concat(totalBalance);
}

function updateSchoolFeesBalance() {
    var totalSchoolFeesBalance = schoolFees.reduce(function(acc, curr) { return acc + curr; }, 0);
    schoolBalance.textContent = "".concat(totalSchoolFeesBalance);
}

function updateBillsBalance() {
    var totalBills = billsAndUtilities.reduce(function(acc, curr) { return acc + curr; }, 0);
    billsBalance.textContent = "".concat(totalBills);
}

function updateOtherBalance() {
    var totalOtherBalance = other.reduce(function(acc, curr) { return acc + curr; }, 0);
    otherBalance.textContent = "".concat(totalOtherBalance);
}

function updateFoodAndDrinkBalance() {
    var totalFoodAndDrinkBalance = foodAndDrink.reduce(function(acc, curr) { return acc + curr; }, 0);
    foodAndDrinkBalance.textContent = "".concat(totalFoodAndDrinkBalance);
}

function updateLocalStorage() {
    localStorage.setItem("balance_".concat(currentUserEmail), JSON.stringify(balance));
}

function categoryUpdate(catAmount) {
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
    localStorage.setItem("reminder_".concat(currentUserEmail), JSON.stringify(reminderArray));
}

function updateTransactionStorage() {
    localStorage.setItem("transaction_".concat(currentUserEmail), JSON.stringify(transactions));
}

function updateSchoolStorage() {
    localStorage.setItem("school_".concat(currentUserEmail), JSON.stringify(schoolFees));
}

function updateBillAndUtilitiesStorage() {
    localStorage.setItem("bills_".concat(currentUserEmail), JSON.stringify(billsAndUtilities));
}

function updateFoodAndDrinkStorage() {
    localStorage.setItem("food_".concat(currentUserEmail), JSON.stringify(foodAndDrink));
}

function updateOtherStorage() {
    localStorage.setItem("other_".concat(currentUserEmail), JSON.stringify(other));
}

function toggleReminderComplete(description) {
    var reminder = reminderArray.find(function(rem) { return rem.description === description; });
    if (reminder) {
        reminder.complete = !reminder.complete;
        updateReminderStorage();
        renderReminders();
    }
}

function deleteReminder(description) {
    var index = reminderArray.findIndex(function(rem) { return rem.description === description; });
    if (index > -1) {
        reminderArray.splice(index, 1);
        updateReminderStorage();
        renderReminders();
    }
}
var chartInstance = null;

function renderChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var totalSchoolFeesBalance = schoolFees.reduce(function(acc, curr) { return acc + curr; }, 0);
    var totalFoodAndDrinkBalance = foodAndDrink.reduce(function(acc, curr) { return acc + curr; }, 0);
    var totalOtherBalance = other.reduce(function(acc, curr) { return acc + curr; }, 0);
    var totalBills = billsAndUtilities.reduce(function(acc, curr) { return acc + curr; }, 0);
    var totalBalance = balance.reduce(function(acc, curr) { return acc + curr; }, 0);
    var totalIncome = totalBalance - totalBills - totalSchoolFeesBalance - totalFoodAndDrinkBalance - totalOtherBalance;
    // Destroy existing chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['School', 'Food and Drink', 'Bills and Utilities', 'Other', 'Income'],
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
    displayUser();
    // Show upcoming reminders within 3 days on load
    showUpcomingNotifications(3);
});

function parseReminderDate(dateStr) {
    return new Date(dateStr);
}

function daysUntil(date) {
    var now = new Date();
    var diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUpcomingReminders(days) {
    return reminderArray.filter(function(r) { return !r.complete && daysUntil(parseReminderDate(r.date)) <= days; });
}

function showUpcomingNotifications(days) {
    var upcoming = getUpcomingReminders(days);
    console.log("Upcoming reminders:", upcoming);
    if (!upcoming || upcoming.length === 0) {
        console.log("No upcoming reminders within " + days + " days");
        return;
    }
    // avoid duplicate panel
    if (document.getElementById('upcoming-notifications'))
        return;
    var panel = document.createElement('div');
    panel.id = 'upcoming-notifications';
    panel.style.position = 'fixed';
    panel.style.right = '20px';
    panel.style.bottom = '20px';
    panel.style.background = '#fff';
    panel.style.border = '2px solid #ff6b6b';
    panel.style.padding = '15px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    panel.style.zIndex = '9999';
    panel.style.maxWidth = '320px';
    panel.style.borderRadius = '8px';
    panel.style.fontFamily = 'Arial, sans-serif';
    var title = document.createElement('div');
    title.textContent = "Upcoming reminders (".concat(upcoming.length, ")");
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.color = '#ff6b6b';
    title.style.fontSize = '16px';
    panel.appendChild(title);
    upcoming.forEach(function(rem) {
        var item = document.createElement('div');
        item.style.borderTop = '1px solid #eee';
        item.style.paddingTop = '10px';
        item.style.marginTop = '10px';
        var desc = document.createElement('div');
        desc.textContent = rem.description;
        desc.style.fontWeight = 'bold';
        desc.style.marginBottom = '4px';
        item.appendChild(desc);
        var date = document.createElement('div');
        date.textContent = "Due: " + rem.date;
        date.style.fontSize = '12px';
        date.style.color = '#666';
        date.style.marginBottom = '8px';
        item.appendChild(date);
        var controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        controls.style.marginTop = '8px';
        var markBtn = document.createElement('button');
        markBtn.textContent = 'Mark complete';
        markBtn.style.padding = '4px 8px';
        markBtn.style.backgroundColor = '#4CAF50';
        markBtn.style.color = '#fff';
        markBtn.style.border = 'none';
        markBtn.style.borderRadius = '4px';
        markBtn.style.cursor = 'pointer';
        markBtn.style.fontSize = '12px';
        markBtn.onclick = function() {
            toggleReminderComplete(rem.description);
            if (item.parentNode)
                item.parentNode.removeChild(item);
            if (document.getElementById('upcoming-notifications')) {
                // update count
                var t = document.querySelector('#upcoming-notifications > div:first-child');
                if (t) {
                    var remaining = getUpcomingReminders(days).length;
                    if (remaining === 0) {
                        var p = document.getElementById('upcoming-notifications');
                        if (p && p.parentNode) p.parentNode.removeChild(p);
                    } else {
                        t.textContent = "Upcoming reminders (".concat(remaining, ")");
                    }
                }
            }
        };
        var dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'Dismiss';
        dismissBtn.style.padding = '4px 8px';
        dismissBtn.style.backgroundColor = '#f44336';
        dismissBtn.style.color = '#fff';
        dismissBtn.style.border = 'none';
        dismissBtn.style.borderRadius = '4px';
        dismissBtn.style.cursor = 'pointer';
        dismissBtn.style.fontSize = '12px';
        dismissBtn.onclick = function() {
            if (item.parentNode)
                item.parentNode.removeChild(item);
            if (getUpcomingReminders(days).length === 0) {
                var p = document.getElementById('upcoming-notifications');
                if (p && p.parentNode)
                    p.parentNode.removeChild(p);
            }
        };
        controls.appendChild(markBtn);
        controls.appendChild(dismissBtn);
        item.appendChild(controls);
        panel.appendChild(item);
    });
    var closeAll = document.createElement('button');
    closeAll.textContent = 'Close';
    closeAll.style.marginTop = '12px';
    closeAll.style.width = '100%';
    closeAll.style.padding = '8px';
    closeAll.style.backgroundColor = '#666';
    closeAll.style.color = '#fff';
    closeAll.style.border = 'none';
    closeAll.style.borderRadius = '4px';
    closeAll.style.cursor = 'pointer';
    closeAll.onclick = function() {
        var p = document.getElementById('upcoming-notifications');
        if (p && p.parentNode)
            p.parentNode.removeChild(p);
    };
    panel.appendChild(closeAll);
    document.body.appendChild(panel);
}

function renderReminders() {
    reminderHistory.innerHTML = '';
    reminderArray.forEach(displayReminderTask);
}
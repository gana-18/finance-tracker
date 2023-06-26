document.addEventListener("DOMContentLoaded", function() {

  const pieChart = document.getElementById("pieChart");
  const barChart = document.getElementById("barChart");
  const dailyChart = document.getElementById("dailyChart");
  const waveChart = document.getElementById("waveChart");
  const transactionForm = document.getElementById("transaction-form");
  const transactionType = document.getElementById("transaction-type");
  const transactionDescription = document.getElementById("transaction-description");
  const transactionAmount = document.getElementById("transaction-amount");
  const transactionList = document.getElementById("transaction-list");
  const incomeText=document.getElementsByClassName("income");
  const spendText=document.getElementsByClassName("spend");
  const balanceText=document.getElementsByClassName("balance");
  const boughtText=document.getElementsByClassName("bought");
  const savingsText=document.getElementsByClassName("saving");
  let totalExpenses = 0; 

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  function updateTransactionList() {
    transactionList.innerHTML = "";
    let totalExpenses = 0;
  
    transactions.forEach(function(transaction, index) {
      const tableRow = document.createElement("tr");
  
      const typeCell = document.createElement("td");
      typeCell.textContent = transaction.type;
      tableRow.appendChild(typeCell);
  
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = transaction.description;
      tableRow.appendChild(descriptionCell);
  
      const amountCell = document.createElement("td");
      amountCell.textContent = "$" + transaction.amount.toFixed(2);
      tableRow.appendChild(amountCell);
  
      const dateCell = document.createElement("td");
      const date = new Date(transaction.date);
      dateCell.textContent = date.toLocaleDateString();
      tableRow.appendChild(dateCell);
  
      const timeCell = document.createElement("td");
      timeCell.textContent = date.toLocaleTimeString();
      tableRow.appendChild(timeCell);
  
      const statusCell = document.createElement("td");
      const statusImage = document.createElement("img");
      statusImage.src = "images/icons8-done-32.png";
      statusImage.alt = "Status";
      statusCell.appendChild(statusImage);
      tableRow.appendChild(statusCell);
  
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      const dustbin = document.createElement("img");
      dustbin.src = "images/icons8-trash-can-32.png";
      dustbin.alt = "Delete";
      deleteButton.appendChild(dustbin);
      deleteButton.appendChild(document.createTextNode("Delete"));
      deleteButton.addEventListener("click", function() {
        deleteTransaction(index);
      });
      deleteCell.appendChild(deleteButton);
      tableRow.appendChild(deleteCell);
  
      transactionList.appendChild(tableRow);
  
      if (transaction.type === "expense") {
        totalExpenses += transaction.amount;
      }
    });
  
    boughtText[0].textContent = transactions.filter(transaction => transaction.type === "expense").length;
  
    spendText[0].textContent = totalExpenses.toFixed(2);
    document.getElementById('transaction-description').value = '';
    document.getElementById('transaction-amount').value = '';
    updateBalance();
  }
  

  // Function to calculate and update the balance amount
  function updateBalance() {
    const balance = transactions.reduce(function(total, transaction) {
      return total + (transaction.type === "income" ? transaction.amount : -transaction.amount);
    }, 0);

    incomeText[0].textContent = transactions.filter(transaction => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);

    savingsText[0].textContent = (incomeText[0].textContent - totalExpenses).toFixed(2);

    balanceText[0].textContent = balance.toFixed(2);
  }

  // Function to update the pie chart
  function updatePieChart() {
    const income = transactions.reduce(function(total, transaction) {
      return total + (transaction.type === "income" ? transaction.amount : 0);
    }, 0);
    const expense = transactions.reduce(function(total, transaction) {
      return total + (transaction.type === "expense" ? transaction.amount : 0);
    }, 0);

    const data = {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#36A2EB", "#FF6384"]
      }]
    };

    new Chart(pieChart, {
      type: "pie",
      data: data
    });
  }

  // Function to update the bar chart
  function updateBarChart() {
    const today = new Date();
    const months = [];
    const incomeData = [];
    const expenseData = [];
  
    for (let i = 0; i <= 5; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1).toLocaleString('default', { month: 'short' });
      months.push(month);
    }
  
    for (let i = 0; i < months.length; i++) {
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === today.getMonth() - i && 
          transactionDate.getFullYear() === today.getFullYear()
        );
      });
  
      const income = monthTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "income" ? transaction.amount : 0);
      }, 0);
  
      const expense = monthTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "expense" ? transaction.amount : 0);
      }, 0);
  
      incomeData.push(income);
      expenseData.push(expense);
    }
  
    const monthlyData = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "#36A2EB"
        },
        {
          label: "Expense",
          data: expenseData,
          backgroundColor: "#FF6384"
        }
      ]
    };
  
    new Chart(barChart, {
      type: "bar",
      data: monthlyData
    });
  }
    

  // Function to update the daily chart
  function updateDailyChart() {
    const today = new Date();
    const days = [];
    const incomeData = [];
    const expenseData = [];
    const balanceData = [];
  
    // Get the labels for the last 7 days
    for (let i = 0; i <= 6; i++) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toLocaleString('default', { day: 'numeric' });
      days.push("Day " + day);
    }
  
    for (let i = 0; i < days.length; i++) {
      const dayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getDate() === today.getDate() - i && 
          transactionDate.getMonth() === today.getMonth() && 
          transactionDate.getFullYear() === today.getFullYear()
        );
      });
  
      const income = dayTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "income" ? transaction.amount : 0);
      }, 0);
  
      const expense = dayTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "expense" ? transaction.amount : 0);
      }, 0);
  
      const balance = income - expense;
  
      incomeData.push(income);
      expenseData.push(expense);
      balanceData.push(balance);
    }
  
    const dailyData = {
      labels: days,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "#36A2EB"
        },
        {
          label: "Expense",
          data: expenseData,
          backgroundColor: "#FF6384"
        },
        {
          label: "Balance",
          data: balanceData,
          backgroundColor: "#4CAF50"
        }
      ]
    };
  
    new Chart(dailyChart, {
      type: "bar",
      data: dailyData
    });
  }
  
  

  // Function to update the wave chart
  function updateWaveChart() {
    const today = new Date();
    const months = [];
    const incomeData = [];
    const expenseData = [];
  
    for (let i = 0; i <= 5; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1).toLocaleString('default', { month: 'short' });
      months.push(month);
    }
  
    for (let i = 0; i < months.length; i++) {
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === today.getMonth() - i && 
          transactionDate.getFullYear() === today.getFullYear() 
        );
      });
  
      const income = monthTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "income" ? transaction.amount : 0);
      }, 0);
  
      const expense = monthTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "expense" ? transaction.amount : 0);
      }, 0);
  
      incomeData.push(income);
      expenseData.push(expense);
    }
  
    const waveData = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#36A2EB",
          fill: false
        },
        {
          label: "Expense",
          data: expenseData,
          borderColor: "#FF6384",
          fill: false
        }
      ]
    };
  
    new Chart(waveChart, {
      type: "line",
      data: waveData
    });
  }
  
  

  // Function to delete a transaction
  function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateBalance();
    updatePieChart();
    updateBarChart();
    updateDailyChart();
    updateWaveChart();
  }

  // Function to clear all data
  function clearData() {
    localStorage.removeItem("transactions");
    transactions = [];
    updateTransactionList();
    updateBalance();
    updatePieChart();
    updateBarChart();
    updateDailyChart();
    updateWaveChart();
  }

  // Event listener for the transaction form submission
  transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const type = transactionType.value;
    const description = transactionDescription.value;
    const amount = parseFloat(transactionAmount.value);
    const date = Date.now(); 
    let amount1;
    if(type==="expense"){
      amount1=amount;
    }
    if (type && description && amount) {
      const balance1=parseFloat(incomeText[0].textContent)-parseFloat(spendText[0].textContent)-amount1
      const balance = parseFloat(balanceText[0].textContent);
      if (balance1 < 0 || balance < 0) {
        alert("Insufficient income/savings. Cannot add transaction.");
        transactionDescription.value="";
        transactionAmount.value=""
        return; // Exit if balance is not greater than 0
      }
      const transaction = {
        type: type,
        description: description,
        amount: amount,
        date: date 
      };
  
      transactions.push(transaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      updateTransactionList();
      updateBalance();
      updatePieChart();
      updateBarChart();
      updateDailyChart();
      updateWaveChart();

      
      transactionType.value = "income";
      transactionDescription.value = "";
      transactionAmount.value = "";
    }
  });
  
  function exportData() {
    const data = {
      localStorageData: JSON.stringify(localStorage),
      transactionsData: JSON.stringify(transactions),
    };

    const jsonData = JSON.stringify(data, null, 2);
    const filename = "exportedData.json";

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(jsonData));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  const exportButton = document.getElementById("exportButton");
  exportButton.addEventListener("click", exportData);

  // Initial function calls
  updateTransactionList();
  updateBalance();
  updatePieChart();
  updateBarChart();
  updateDailyChart();
  updateWaveChart();

  window.clearData = clearData;
});

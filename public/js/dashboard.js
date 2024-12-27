document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('financialForm');
  const ctxExpenses = document.getElementById('expensesChart').getContext('2d');
  const ctxBalanceLine = document.getElementById('balanceLineChart').getContext('2d');

  // Initialize the Expenses Chart
  const expensesChart = new Chart(ctxExpenses, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses', 'Savings', 'Other'],
      datasets: [{
        label: 'Daily Financial Data',
        data: [0, 0, 0, 0],
        backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });

  // Initialize the Balance Line Chart
  const balanceLineChart = new Chart(ctxBalanceLine, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Remaining Balance Over Time',
        data: [],
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Remaining Balance ($)' } },
      },
    },
  });

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const other = parseFloat(document.getElementById('other').value);

    if (isNaN(income) || isNaN(expenses) || isNaN(savings) || isNaN(other)) {
      alert('Please enter valid numeric values.');
      return;
    }

    const today = new Date().toLocaleDateString();
    const totalExpenses = expenses + other;
    expensesChart.data.datasets[0].data = [income, totalExpenses, savings, other];
    expensesChart.update();

    const remainingBalance = income - totalExpenses;
    balanceLineChart.data.labels.push(today);
    balanceLineChart.data.datasets[0].data.push(remainingBalance);
    balanceLineChart.update();

    form.reset();

    // Store the data for later use in the PDF
    form.dataset.income = income;
    form.dataset.totalExpenses = totalExpenses;
    form.dataset.savings = savings;
    form.dataset.remainingBalance = remainingBalance;
    form.dataset.date = today;
  });

  // Handle Download PDF
  document.getElementById('downloadPdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Retrieve stored values
    const income = form.dataset.income || 'N/A';
    const totalExpenses = form.dataset.totalExpenses || 'N/A';
    const savings = form.dataset.savings || 'N/A';
    const remainingBalance = form.dataset.remainingBalance || 'N/A';
    const date = form.dataset.date || 'N/A';

    // Add Title
    doc.setFontSize(16);
    doc.text('Finance Tracker Report', 10, 10);

    // Add Summary Data
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 10, 20);
    doc.text(`Income: ${income}`, 10, 30);
    doc.text(`Total Expenses: ${totalExpenses}`, 10, 40);
    doc.text(`Savings: ${savings}`, 10, 50);
    doc.text(`Remaining Balance: ${remainingBalance}`, 10, 60);

    // Save the PDF
    doc.save('Finance_Tracker_Report.pdf');
  });
});

// Expense Distribution Data
const expenseData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Other'],
    datasets: [{
      label: 'Expense Distribution',
      data: [500, 300, 200, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50']
    }]
  };
  // Savings Progress Data
  const savingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Savings Progress',
      data: [500, 700, 900, 1200, 1500, 1800],
      borderColor: '#28a745',
      fill: false
    }]
  };
  // Initialize Expense Distribution Chart
  const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
  const expenseChart = new Chart(expenseChartCtx, {
    type: 'pie',
    data: expenseData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  // Initialize Savings Progress Chart
  const savingsChartCtx = document.getElementById('savings-chart').getContext('2d');
  const savingsChart = new Chart(savingsChartCtx, {
    type: 'line',
    data: savingsData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  // Highlight Chart on Hover
  document.querySelectorAll('.chart').forEach(chart => {
    chart.addEventListener('mouseover', () => {
      chart.style.transform = 'scale(1.05)';
      chart.style.transition = 'transform 0.3s ease';
    });
    chart.addEventListener('mouseout', () => {
      chart.style.transform = 'scale(1)';
    });
  });

// routes/mainRoutes.js
const express = require("express");
const Transaction = require("../models/transcations");
const SavingsGoal = require("../models/savingGoals");
const isAuthenticated = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/landing", { layout: "layouts/panel" });
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Fetch transactions for this user
    const transactions = await Transaction.find({ userId });

    // Initialize totals
    let totalIncome = 0;
    let totalExpenses = 0;

    // Accumulate income and expenses based on transaction type
    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else if (tx.type === 'expense') {
        totalExpenses += tx.amount;
      }
    });

    const totalSavings = totalIncome - totalExpenses;

    // Render dashboard with computed values
    res.render("admin/dashboard", {
      layout: "layouts/panel",
      monthlyIncome: totalIncome,
      totalExpenses,
      totalSavings
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("An error occurred.");
  }
});
 



router.get("/reports", isAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  const transactions = await Transaction.find({ userId });

  const expenseData = transactions.filter(t => t.type === "expense");
  const incomeData = transactions.filter(t => t.type === "income");

  const expensesByCategory = expenseData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const savingsGoals = await SavingsGoal.find({ user_id: userId });
  const savingsProgress = savingsGoals.map(goal => ({
    goalName: goal.goal_name,
    target: goal.target_amount,
    current: goal.current_amount
  }));

  res.render("admin/reports", {
    layout: "layouts/panel", 
    user: req.session.user,
    transactions,
    expensesByCategory,
    savingsProgress,
    incomeData
  });
});

module.exports = router;

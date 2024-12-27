const express = require("express");
const SavingsGoal = require("../models/savingGoals"); // Ensure this matches your SavingsGoal schema
const router = express.Router();
const isAuthenticated = require("../middlewares/auth"); 

// CREATE: Add a new savings goal
router.post("/savingGoals",isAuthenticated, async (req, res) => {
  const { goal_name, target_amount, current_amount, end_date } = req.body;

  try {
    const savingsGoal = new SavingsGoal({
      user_id: req.session.user._id, 
      goal_name,
      target_amount,
      current_amount,
      start_date: Date.now(), // Set start date to current date
      end_date,
    });

    await savingsGoal.save();
    res.redirect("/savingGoals"); // Redirect to the page that shows all savings goals
  } catch (err) {
    console.error("Error creating savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ: Get all savings goals (no user-specific filtering here)
router.get('/savingGoals',  isAuthenticated, async (req, res) => {
 

  try {
    // Fetch all savings goals for the logged-in user
    const savingsGoals = await SavingsGoal.find({ user_id: req.session.user._id });

    // Prepare data for the line chart
    const chartData = savingsGoals.map(goal => ({
      label: goal.goal_name,
      amount: goal.current_amount,
      
    }));

    res.render('admin/savings', {
      layout: 'layouts/panel',
      user: req.session.user,
      savingsGoals,
      chartData: JSON.stringify(chartData) // Pass chart data to the template
    });

  } catch (err) {
    console.error("Error fetching savings goals:", err);
    res.status(500).send("Server error");
  }
});


// READ: Get a specific savings goal by ID
router.get("/savingGoals/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const savingsGoal = await SavingsGoal.findById(id);
    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.status(200).json(savingsGoal); // Return the specific savings goal
  } catch (err) {
    console.error("Error fetching savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Update a savings goal by ID
router.put("/savingGoals/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { goal_name, target_amount, current_amount, end_date } = req.body;

  try {
    const updatedSavingsGoal = await SavingsGoal.findByIdAndUpdate(
      id,
      { goal_name, target_amount, current_amount, end_date },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedSavingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.status(200).json({ message: "Savings goal updated successfully", savingsGoal: updatedSavingsGoal });
  } catch (err) {
    console.error("Error updating savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/savingGoals/:id/delete", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSavingsGoal = await SavingsGoal.findByIdAndDelete(id);
    if (!deletedSavingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.redirect("/savingGoals"); // Redirect to the main page after deletion
  } catch (err) {
    console.error("Error deleting savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/savingGoals/edit/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const savingsGoal = await SavingsGoal.findById(id);
    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.render("admin/editGoal", { savingsGoal ,layout: "layouts/panel"  , user: req.session.user}); // Render the edit form with pre-filled data
  } catch (err) {
    console.error("Error fetching savings goal for editing:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/savingGoals/edit/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { goal_name, target_amount, current_amount, end_date } = req.body;

  try {
    const updatedSavingsGoal = await SavingsGoal.findByIdAndUpdate(
      id,
      { goal_name, target_amount, current_amount, end_date },
      { new: true, runValidators: true } // Return updated data and validate
    );

    if (!updatedSavingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.redirect("/savingGoals"); // Redirect to the main savings goals page after editing
  } catch (err) {
    console.error("Error updating savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/savingGoals/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSavingsGoal = await SavingsGoal.findByIdAndDelete(id);
    if (!deletedSavingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    res.redirect("/savingGoals"); // Redirect to the main page after deletion
  } catch (err) {
    console.error("Error deleting savings goal:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

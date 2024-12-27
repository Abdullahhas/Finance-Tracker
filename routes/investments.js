const express = require("express");
const Investment = require("../../models/investment"); // Replace with your Investment schema path
const router = express.Router();

// CREATE: Add a new investment
router.post("/investments", async (req, res) => {
  const { user_id, investment_type, amount_invested, current_value, investment_date } = req.body;
  try {
    const investment = new Investment({
      user_id,
      investment_type,
      amount_invested,
      current_value,
      investment_date,
    });
    await investment.save();
    res.status(201).json({ message: "Investment created", investmentId: investment._id });
  } catch (err) {
    console.error("Error creating investment:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ: Get all investments
router.get("/investments", async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json(investments); // Return all investments as JSON
  } catch (err) {
    console.error("Error fetching investments:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ: Get investment by ID
router.get("/investments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findById(id);
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }
    res.status(200).json(investment); // Return the specific investment
  } catch (err) {
    console.error("Error fetching investment:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Update an investment
router.put("/investments/:id", async (req, res) => {
  const { id } = req.params;
  const { investment_type, amount_invested, current_value, investment_date } = req.body;

  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(
      id,
      { investment_type, amount_invested, current_value, investment_date },
      { new: true, runValidators: true } // Return updated document and validate input
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }
    res.status(200).json({ message: "Investment updated successfully", investment: updatedInvestment });
  } catch (err) {
    console.error("Error updating investment:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove an investment
router.delete("/investments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvestment = await Investment.findByIdAndDelete(id);
    if (!deletedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }
    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (err) {
    console.error("Error deleting investment:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

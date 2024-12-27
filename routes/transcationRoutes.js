const express = require("express");
const Transaction = require("../models/transcations"); // Ensure this matches your Transaction schema
const router = express.Router();
const isAuthenticated = require("../middlewares/auth"); 

// READ: Get all transactions
router.get("/transactions",isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.session.user._id });
    res.render("admin/transactions", { layout: "layouts/panel", transactions , user: req.session.user });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).send("An error occurred while fetching transactions.");
  }
});

// CREATE: Add a new transaction (form page)
router.get("/transactions/new",isAuthenticated, (req, res) => {
  res.render("admin/new_transaction", { layout: "layouts/panel"  , user: req.session.user});
});

// CREATE: Handle new transaction submission
router.post("/transactions", async (req, res) => {
  try {
    const userId = req.session.user._id; // Ensure user is logged in

    // Create a new transaction, explicitly adding the userId
    const transaction = new Transaction({
      userId,  // Add userId to the transaction
      type: req.body.type,
      category: req.body.category,
      amount: req.body.amount,
      description: req.body.description,
    });

    // Save the transaction
    await transaction.save();

    // Redirect to the transactions list page
    res.redirect("/transactions");
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).send("An error occurred while creating a transaction.");
  }
});


// UPDATE: Edit transaction (form page)
router.get("/transactions/:id/edit",isAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send("Transaction not found.");
    }
    res.render("admin/edit_transaction", { layout: "layouts/panel", transaction  , user: req.session.user});
  } catch (err) {
    console.error("Error fetching transaction for edit:", err);
    res.status(500).send("An error occurred while fetching the transaction.");
  }
});

// UPDATE: Handle transaction update
router.post("/transactions/:id", isAuthenticated, async (req, res) => {
  try {
    await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect("/transactions"); // Redirect to the transactions list
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).send("An error occurred while updating the transaction.");
  }
});

// DELETE: Remove transaction
router.get("/transactions/:id/delete",isAuthenticated, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect("/transactions"); // Redirect to the transactions list
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).send("An error occurred while deleting the transaction.");
  }
});




module.exports = router;

// routes/forgotPassword.js
const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/forgot-password", (req, res) => {
  res.render("admin/forgot-password", { layout: "layouts/panel" });
});

router.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("User not found.");

    user.password = await bcrypt.hash(password, 10);
    await user.save({ validateModifiedOnly: true });

    res.send("Password successfully updated.");
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).send("An error occurred while resetting the password.");
  }
});

module.exports = router;

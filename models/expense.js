const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    dailyIncome: Number,
    dailyExpenses: Number,
    budget: Number,
    savingsGoals: [{ goal: String, progress: Number, target: Number }],
    alerts: [{ type: String, message: String }],
  });

  module.exports = mongoose.model('expense', UserSchema);
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment_type: { type: String, required: true },
  amount_invested: { type: Number, required: true },
  current_value: { type: Number },
  investment_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);


// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const connectionString = "mongodb://localhost:27017/db-project";
  try {
    await mongoose.connect(connectionString);
    console.log(`Connected to MongoDB at ${connectionString}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

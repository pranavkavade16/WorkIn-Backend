const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    throw error;
  }
};

module.exports = { initializeDatabase };
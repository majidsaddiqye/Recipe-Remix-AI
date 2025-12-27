const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DataBase Connected Successfully");
  } catch (error) {
    console.log("DataBase Connect Error", error);
    process.exit(1);
  }
}

module.exports = connectDB;
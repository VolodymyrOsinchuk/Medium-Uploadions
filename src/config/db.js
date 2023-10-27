require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conDB = await mongoose.connect(url);
    if (conDB) {
      console.log("DB is connected");
    } else {
      console.log((error) => error);
    }
  } catch (error) {
    console.log(`Error: ^${error.message}`);
  }
};

module.exports = connectDB;

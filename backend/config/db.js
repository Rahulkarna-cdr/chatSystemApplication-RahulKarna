import mongoose from "mongoose";
import config from "./config.js";

const MONGODB_URI= config.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB database");
  } catch (error) {
    console.error("Failed to connect to MongoDB database:", error);
    process.exit(1);
  }
};

export default connectDB;

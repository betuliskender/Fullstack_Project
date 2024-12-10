import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mainDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB...");
  } catch (error) {
    console.error("Failed connection to MongoDB...", error);
    process.exit(1);
  }
};

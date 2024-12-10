import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mainDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB...");
  } catch (error) {
    console.error("Failed connection to MongoDB...", error);
    process.exit(1);
  }
};

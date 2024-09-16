import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB...");
  } catch (error) {
    console.error("Failed connection to MongoDB...", error);
    process.exit(1);
  }
};

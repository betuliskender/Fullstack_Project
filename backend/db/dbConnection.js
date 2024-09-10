import mongoose from "mongoose";

export const connectUserDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_USER_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB...");
  } catch (error) {
    console.error("Failed connection to Mongodb...", error);
    process.exit(1);
  }
};

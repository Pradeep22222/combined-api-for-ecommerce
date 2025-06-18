import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connStr = process.env.MONGO_CLIENT;

    if (!connStr) {
      console.log("❌ No MongoDB connection string provided in .env");
      return;
    }

    const conn = await mongoose.connect(connStr);

    if (conn) {
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
  }
};

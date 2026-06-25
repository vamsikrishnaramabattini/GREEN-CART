import mongoose from "mongoose";

let isConnected = false; // Tracks connection state across serverless invocations

const connectDB = async () => {
  const uri = process.env.MONGO_URI; 
  
  if (!uri) {
    throw new Error("MONGO_URI is missing from your environment variables!");
  }

  if (isConnected) {
    console.log("🔄 Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    // 🚫 REMOVED process.exit(1) so Vercel worker doesn't hard-crash
    throw error; 
  }
};

export default connectDB;
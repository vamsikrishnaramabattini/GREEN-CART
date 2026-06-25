import "dotenv/config"; // Load environment variables first
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Fix ECONNREFUSED DNS glitch

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectcloudinary from "./configs/cloudinary.js"; 
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js"; 
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const allowedOrigins = ["http://localhost:5173"];

// Stripe webhook route must use raw body
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes Middleware
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Initialize DB + Cloudinary
const init = async () => {
  try {
    await connectDB();
    await connectcloudinary();
    console.log("✅ DB and Cloudinary connected");
  } catch (error) {
    console.error("Initialization error:", error);
  }
};
init();

//  Do NOT call app.listen() on Vercel
//  Just export the app
export default app;

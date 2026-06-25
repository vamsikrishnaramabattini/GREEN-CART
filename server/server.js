import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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

// Stripe webhook
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

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Init DB + Cloudinary
(async () => {
  try {
    await connectDB();
    await connectcloudinary();
    console.log("✅ DB and Cloudinary connected");
  } catch (error) {
    console.error("Initialization error:", error);
  }
})();

// 🚫 No app.listen()
// ✅ Export app for Vercel
export default app;

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

// 1. Stripe webhook
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// 2. Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// 3. Serverless Initialization Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await connectcloudinary();
    next();
  } catch (error) {
    console.error("Initialization error during request:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database or Cloudinary services failed to initialize." 
    });
  }
});

// 4. Test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// 5. API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// 🛑 ONLY RUNS LOCALLY (Does not interfere with Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    try {
      await connectDB();
      await connectcloudinary();
      console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    } catch (err) {
      console.error("Local startup connection error:", err);
    }
  });
}

// ✅ Export app for Vercel
export default app;
import "dotenv/config"; // 1. Load environment variables first!
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // 2. Fix the ECONNREFUSED DNS glitch

import cookiesParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectcloudinary from "./configs/cloudinary.js"; 
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js"; 
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

// ✅ FIXED TYPO AND CASE SENSITIVITY: Points exactly to controllers/orderController.js
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ FIXED CORS: Added both port variations to ensure your frontend can always log in smoothly
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

// Stripe Webhook Middleware must remain raw
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookiesParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes Middleware
app.use('/api/user', userRouter);
app.use('/api/product', productRouter); 
app.use('/api/cart', cartRouter); 
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter); 

// 3. Serverless Optimization: Warm up connection handling for cloud invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await connectcloudinary();
    next();
  } catch (error) {
    console.error("Database connection failure:", error);
    res.status(500).send("Database connection failure");
  }
});

// Start server only if NOT running in production (Vercel handles production routing automatically)
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await connectDB();
      await connectcloudinary(); 
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
};

startServer();

// ... existing imports ...

// REMOVE or COMMENT OUT THIS BLOCK:
/*
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
*/

// Export the app instance for the serverless deployment engine
export default app;
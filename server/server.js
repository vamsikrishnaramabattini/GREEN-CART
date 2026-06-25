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
import Stripe from "stripe";
// ✅ FIXED TYPO: Changed controllers/ordersontrollers.js to controllers/orderController.js
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = ["http://localhost:5173"];

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

// 3. Connect to DB, Cloudinary, and start server only if NOT running in production
const startServer = async () => {
  try {
    await connectDB();
    await connectcloudinary(); 
    
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Initialization error:", error);
  }
};

startServer();

// Export for Vercel
export default app;
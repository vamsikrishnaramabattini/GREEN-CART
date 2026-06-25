import "dotenv/config"; // 1. Load environment variables first!
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // 2. Fix the ECONNREFUSED DNS glitch

import cookiesParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectcloudinary from "./configs/cloudinary.js"; // Import Cloudinary config
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js"; // Import Product Router
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import Stripe from "stripe";
import { stripeWebhooks } from "./controllers/ordercontroller.js";

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = ["http://localhost:5173"];

app.post('/stripe', express.raw({type:'application/json'}),stripeWebhooks)

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Added for multipart form data parsing (Product uploads)
app.use(cookiesParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes Middleware
app.use('/api/user', userRouter);
app.use('/api/product', productRouter); // Mount Product Routes
app.use('/api/cart', cartRouter); 
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter); // ✅ Fixed missing closing parenthesis and semicolon

// 3. Connect to DB, Cloudinary, and then start the server
const startServer = async () => {
  await connectDB();
  await connectcloudinary(); //  Initialize Cloudinary Configuration
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
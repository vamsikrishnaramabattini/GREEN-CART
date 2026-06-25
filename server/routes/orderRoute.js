import express from 'express';
import authUser from '../middlewares/authUser.js';
//  FIXED PATH: Pointing exactly to orderController.js
import { placeOrderCOD, placeOrderStripe, getUserOrders, verifyStripe } from '../controllers/orderController.js';

const orderRouter = express.Router();

// Payment Gateways Routes
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/stripe', authUser, placeOrderStripe);

// Stripe Redirect Verification Route
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// User Features Routes
orderRouter.get('/user', authUser, getUserOrders);

export default orderRouter;
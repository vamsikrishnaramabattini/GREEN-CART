import express from 'express';
import authUser from '../middlewares/authUser.js';
//  Added verifyStripe inside the import brackets below
import { placeOrderCOD, placeOrderStripe, getUserOrders, verifyStripe } from '../controllers/ordercontroller.js';
const orderRouter = express.Router();

// Payment Gateways Routes
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/stripe', authUser, placeOrderStripe);

//  Stripe Redirect Verification Route
orderRouter.post('/verifyStripe', authUser, verifyStripe);

// User Features Routes
orderRouter.get('/user', authUser, getUserOrders);

export default orderRouter;
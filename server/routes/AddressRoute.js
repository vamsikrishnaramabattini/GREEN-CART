import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddress } from '../controllers/Addresscontroller.js';

const addressRouter = express.Router();

// Both endpoints are securely guarded by your token validation middleware
addressRouter.post('/add', authUser, addAddress);
addressRouter.post('/get', authUser, getAddress);

export default addressRouter;
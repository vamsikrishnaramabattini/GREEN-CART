import express from 'express';
import { register, login, isAuth, logout, saveAddress } from '../controllers/usercontroller.js'; // ✅ Added saveAddress import
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout); // Logout clears the local cookie state

// Protected Routes (Require authUser middleware to pass down the user ID securely)
userRouter.get('/is-auth', authUser, isAuth);

//  ADDED: Permanent address saving route protected by your auth middleware
userRouter.post('/save-address', authUser, saveAddress); 

export default userRouter;
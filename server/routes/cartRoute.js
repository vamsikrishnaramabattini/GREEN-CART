import express from "express"; //  Fix: Import express instead of mongoose
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";

//  Fix: Use express.Router() so the router initializes correctly
const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
import express from 'express';
import { upload } from '../configs/multer.js'; // Ensure this points to your multer configuration setup
import { addProduct, productList, productById } from '../controllers/productController.js';

const productRouter = express.Router();

// Route endpoints matching your screenshot design layout
productRouter.post('/add', upload.array('images', 4), addProduct); // Allows uploading up to 4 images at once
productRouter.get('/list', productList);
productRouter.get('/id', productById);

export default productRouter;
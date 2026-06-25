import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// ==========================================
// ADD PRODUCT : /api/product/add
// ==========================================
export const addProduct = async (req, res) => {
  try {
    // Parse product text data sent via multipart form data
    const { name, description, price, category, subCategory, bestSeller } = JSON.parse(req.body.productData);

    // Extract uploaded files from multer middleware
    const images = req.files;

    // Upload all images to Cloudinary concurrently
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Assemble new product object structure
    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: imagesUrl,
      date: Date.now()
    };

    const product = await Product.create(productData);

    res.json({ success: true, message: "Product Added Successfully", product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL PRODUCTS : /api/product/list
// ==========================================
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE PRODUCT : /api/product/id
// ==========================================
export const productById = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
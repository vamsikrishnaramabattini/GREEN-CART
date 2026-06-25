import User from "../models/user.js";

// ==========================================
// UPDATE USER CART DATA : /api/cart/update
// ==========================================
export const updateCart = async (req, res) => {
  try {
    // userId is automatically injected here by your authUser middleware
    const { userId, cartItems } = req.body;

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================================
// REGISTER USER : /api/user/register
// ==========================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const existinguser = await User.findOne({ email });

    if (existinguser)
      return res.json({ success: false, message: 'User already exists' });

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedpassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.json({ success: true, user: { email: newUser.email, name: newUser.name } });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}; 

// ==========================================
// LOGIN USER : /api/user/login
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// CHECK AUTH STATUS : /api/user/is-auth
// ==========================================
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user details but omit the password field
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// LOGOUT USER : /api/user/logout
// ==========================================
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// SAVE USER ADDRESS : /api/user/save-address
// ==========================================
export const saveAddress = async (req, res) => {
  try {
    const { userId, addressData } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized request" });
    }

    // Locate user by the auth-middleware id and overwrite the address string
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { address: addressData }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "Address updated permanently" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
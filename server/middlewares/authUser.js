import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // 1. Get token from cookies
 const token = req.cookies.token || req.headers.token;
  // 2. Check if token exists
  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    // 3. Decode and verify token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // ✅ FIX: Ensure req.body is initialized as an object if it doesn't exist
      if (!req.body) {
        req.body = {};
      }

      // 4. Attach the decoded user ID safely
      req.body.userId = tokenDecode.id;
      
      // 5. Move to the next function/controller
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // allow JWT via cookie or Authorization header
    const tokenFromCookie = req.cookies.jwt;
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    const token = tokenFromCookie || tokenFromHeader;
    
    if (!token) {
    return res.status(401).json({ message: "Unauthorized token not found" });
  }  
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized no decoding" });
  }

  const user= await User.findById(decoded.userId).select("-password");
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user; // Attach the user to the request object
  next();
    
  } catch (error) {
    console.error(`Token verification error: ${error.message}`);
    res.status(500).json({ message: "Unauthorized user" });
  }
}
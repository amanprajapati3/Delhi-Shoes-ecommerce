import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      // Get Token From Header
      token =
        req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // Get User Without Password
    req.user = await User.findById(
      decoded.id
    ).select("-password");

    // User Not Found
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

export default authMiddleware;
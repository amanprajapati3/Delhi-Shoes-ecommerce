import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// GENERATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate Token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // BASIC INFO
    // =========================

    user.name =
      req.body.name || user.name;

    user.phone =
      req.body.phone || user.phone;

    // =========================
    // PROFILE IMAGE
    // =========================

    if (req.file) {
      // DELETE OLD IMAGE
      if (
        user.images &&
        user.images.length > 0
      ) {
        await cloudinary.uploader.destroy(
          user.images[0].public_id
        );
      }

      // UPLOAD NEW IMAGE
      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "users",
          }
        );

      user.images = [
        {
          url: result.secure_url,
          public_id: result.public_id,
        },
      ];
    }

    // =========================
    // ADDRESS UPDATE
    // =========================

    user.address.fullName =
      req.body.fullName || "";

    user.address.phone =
      req.body.addressPhone || "";

    user.address.pincode =
      req.body.pincode || "";

    user.address.state =
      req.body.state || "";

    user.address.city =
      req.body.city || "";

    user.address.house =
      req.body.house || "";

    user.address.area =
      req.body.area || "";

    user.address.landmark =
      req.body.landmark || "";

    // =========================
    // PASSWORD UPDATE
    // =========================

    if (req.body.password) {
      user.password =
        req.body.password;
    }

    // SAVE USER
    const updatedUser =
      await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

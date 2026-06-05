import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controller/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const auth_router = express.Router();

// REGISTER
auth_router.post(
  "/register",
  registerUser
);


// LOGIN
auth_router.post(
  "/login",
  loginUser
);


// GET PROFILE
auth_router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);


// UPDATE PROFILE
auth_router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profileImage"),
  updateUserProfile
);

export default auth_router;
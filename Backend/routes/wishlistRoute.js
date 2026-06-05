import express from "express";

import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "../controller/wishlistController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const wishlist_router = express.Router();


// ADD TO WISHLIST
wishlist_router.post(
  "/add",
  authMiddleware,
  addToWishlist
);


// GET WISHLIST
wishlist_router.get(
  "/",
  authMiddleware,
  getUserWishlist
);


// REMOVE FROM WISHLIST
wishlist_router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromWishlist
);

export default wishlist_router;
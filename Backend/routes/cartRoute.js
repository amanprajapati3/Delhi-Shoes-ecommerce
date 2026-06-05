import express from "express";

import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controller/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const cart_router = express.Router();


// ADD TO CART
cart_router.post(
  "/add",
  authMiddleware,
  addToCart
);


// GET USER CART
cart_router.get(
  "/",
  authMiddleware,
  getUserCart
);


// REMOVE ITEM
cart_router.delete(
  "/remove/:itemId",
  authMiddleware,
  removeFromCart
);


// UPDATE QUANTITY
cart_router.put(
  "/update/:itemId",
  authMiddleware,
  updateCartQuantity
);


// CLEAR CART
cart_router.delete(
  "/clear",
  authMiddleware,
  clearCart
);

export default cart_router;
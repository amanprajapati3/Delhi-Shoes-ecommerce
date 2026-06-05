import express from "express";

import {
  placeOrder,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders, createRazorpayOrder, verifyPayment
} from "../controller/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const order_router = express.Router();

// PLACE ORDER
order_router.post(
  "/place",
  authMiddleware,
  placeOrder
);

// CREATE RAZORPAY ORDER
order_router.post(
  "/razorpay/create-order",
  authMiddleware,
  createRazorpayOrder
);

// VERIFY PAYMENT
order_router.post(
  "/razorpay/verify",
  authMiddleware,
  verifyPayment
);

// GET USER ORDERS
order_router.get(
  "/my-orders",
  authMiddleware,
  getUserOrders
);


// GET SINGLE ORDER
order_router.get(
  "/:id",
  authMiddleware,
  getSingleOrder
);


// GET ALL ORDERS (ADMIN)
order_router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);


// UPDATE ORDER STATUS
order_router.put(
  "/admin/update/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export default order_router;
import express from "express";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const product_router = express.Router();

// ADD PRODUCT
product_router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.array("images"),
  addProduct
);


// GET ALL PRODUCTS
product_router.get(
  "/all",
  getAllProducts
);


// GET SINGLE PRODUCT
product_router.get(
  "/:id",
  getSingleProduct
);


// UPDATE PRODUCT
product_router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images"),
  updateProduct
);


// DELETE PRODUCT
product_router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default product_router;
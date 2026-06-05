import express from "express";

import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controller/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/multerMiddleware.js";

const review_router = express.Router();

// ADD REVIEW
review_router.post(
  "/add",
  authMiddleware,
  upload.array("images"),
  addReview
);


// GET PRODUCT REVIEWS
review_router.get(
  "/:productId",
  getProductReviews
);


// DELETE REVIEW
review_router.delete(
  "/delete/:id",
  authMiddleware,
  deleteReview
);

export default review_router;
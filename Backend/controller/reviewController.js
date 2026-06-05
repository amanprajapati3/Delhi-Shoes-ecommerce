import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";


// ADD REVIEW
export const addReview = async (
  req,
  res
) => {
  try {
    const {
      productId,
      rating,
      comment,
    } = req.body;

    // Check Product
    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check Existing Review
    const existingReview =
      await Review.findOne({
        user: req.user._id,
        product: productId,
      });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product",
      });
    }

    // Upload Review Images
    const uploadedImages = [];

if (req.files) {
  for (const file of req.files) {

    // CHECK FILE PATH
    if (!file.path) continue;

    const result =
      await cloudinary.uploader.upload(
        file.path,
        {
          folder: "reviews",
        }
      );

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }
}
    // Create Review
    const review =
      await Review.create({
        user: req.user._id,

        product: productId,

        rating,

        comment,

        images: uploadedImages,

        userName: req.user.name,

        userProfileImage:
        req.user.images?.[0]?.url ||
  "",

        verifiedPurchase: false,
      });

    // Calculate Average Rating
    const reviews =
      await Review.find({
        product: productId,
      });

    const totalRating =
      reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      );

    product.ratings =
      totalRating / reviews.length;

    product.numOfReviews =
      reviews.length;

    await product.save();

    return res.status(201).json({
      success: true,
      message:
        "Review added successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET PRODUCT REVIEWS
export const getProductReviews =
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          product:
            req.params.productId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// DELETE REVIEW
export const deleteReview = async (
  req,
  res
) => {
  try {
    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found",
      });
    }

    // Check Ownership Or Admin
    if (
      review.user.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized",
      });
    }

    const product =
      await Product.findById(
        review.product
      );

    // Delete Review
    await review.deleteOne();

    // Recalculate Ratings
    const reviews =
      await Review.find({
        product: product._id,
      });

    if (reviews.length > 0) {
      const totalRating =
        reviews.reduce(
          (acc, item) =>
            acc + item.rating,
          0
        );

      product.ratings =
        totalRating /
        reviews.length;

      product.numOfReviews =
        reviews.length;
    } else {
      product.ratings = 0;
      product.numOfReviews = 0;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
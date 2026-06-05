import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Details",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
  {
    url: {
      type: String,
    },

    public_id: {
      type: String,
    },
  },
],

    userName: {
      type: String,
      required: true,
    },

    userProfileImage: {
      type: String,
      default: "",
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const Review =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

export default Review;
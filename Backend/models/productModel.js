import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    comparePrice: {
      type: Number, 
      default: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    images: [
  {
    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },
  },
],

    category: {
      type: String,
      required: true,
    },

    productType: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    variants: [
       {
    size: String,
    color: String,
    stock: Number,
    sku: String,
      }
    ],

    colors: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    gender: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      default: "Unisex",
    },

    material: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product_Details", productSchema);

export default Product;
import Product from "../models/productModel.js";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import Review from "../models/reviewModel.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      price,
      comparePrice,
      category,
      productType,
      brand,
      gender,
      material,
      stock,
      variants,
      featured,
      newArrival,
      bestSeller,
      tags,
    } = req.body;

    // Check Existing Product
    const existingProduct = await Product.findOne({
      title,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Upload Images To Cloudinary
    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Create Product
    const product = await Product.create({
      title,

      slug: slugify(title, {
        lower: true,
      }),

      description,
      shortDescription,
      price,
      comparePrice,
      category,
      productType,
      brand,
      gender,
      material,
      stock,
      variants: typeof variants === "string" ? JSON.parse(variants) : variants,
      featured,
      newArrival,
      bestSeller,
      tags: typeof tags === "string" ? JSON.parse(tags) : tags,

      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // GET REVIEWS OF THIS PRODUCT
    const reviews = await Review.find({
      product: product._id,
    }).populate("user", "name profileImage");

    // TOTAL REVIEWS
    const totalReviews = reviews.length;

    // AVERAGE RATING
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce(
                (acc, item) => acc + item.rating,
                0
              ) / totalReviews
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      success: true,

      product: {
        ...product._doc,

        reviews,
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  req,
  res
) => {
  try {

    // PARSE VARIANTS
    if (req.body.variants) {
      req.body.variants =
        JSON.parse(
          req.body.variants
        );
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // KEEP EXISTING IMAGES
    let uploadedImages =
      product.images;

    // NEW IMAGES
    if (
      req.files &&
      req.files.length > 0
    ) {
      uploadedImages = [];

      for (const file of req.files) {
        const result =
          await cloudinary.uploader.upload(
            file.path,
            {
              folder: "products",
            }
          );

        uploadedImages.push({
          url: result.secure_url,
          public_id:
            result.public_id,
        });
      }
    }

    // UPDATE PRODUCT
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,

          slug: req.body.title
            ? slugify(
                req.body.title,
                {
                  lower: true,
                }
              )
            : product.slug,

          images: uploadedImages,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      updatedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete Images From Cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Delete Product
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

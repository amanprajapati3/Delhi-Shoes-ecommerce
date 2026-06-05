import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// =========================
// ADD TO WISHLIST
// =========================
export const addToWishlist = async (
  req,
  res
) => {
  try {
    const { productId } = req.body;

    // CHECK PRODUCT
    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // FIND USER WISHLIST
    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    // CREATE IF NOT EXISTS
    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          products: [],
        });
    }

    // CHECK EXISTING PRODUCT
    const alreadyExists =
      wishlist.products.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Product already in wishlist",
      });
    }

    // ADD PRODUCT
    wishlist.products.push({
      product: product._id,
    });

    await wishlist.save();

    // IMPORTANT
    // RETURN POPULATED WISHLIST
    const updatedWishlist =
      await Wishlist.findById(
        wishlist._id
      ).populate(
        "products.product"
      );

    return res.status(200).json({
      success: true,
      message:
        "Product added to wishlist",
      wishlist:
        updatedWishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET USER WISHLIST
// =========================
export const getUserWishlist =
  async (req, res) => {
    try {
      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        }).populate(
          "products.product"
        );

      // EMPTY WISHLIST
      if (!wishlist) {
        return res.status(200).json({
          success: true,
          wishlist: {
            products: [],
          },
        });
      }

      return res.status(200).json({
        success: true,
        wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// =========================
// REMOVE FROM WISHLIST
// =========================
export const removeFromWishlist =
  async (req, res) => {
    try {
      const { productId } =
        req.params;

      const wishlist =
        await Wishlist.findOne({
          user: req.user._id,
        });

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message:
            "Wishlist not found",
        });
      }

      // REMOVE PRODUCT
      wishlist.products =
        wishlist.products.filter(
          (item) =>
            item.product.toString() !==
            productId
        );

      await wishlist.save();

      // IMPORTANT
      // RETURN POPULATED WISHLIST
      const updatedWishlist =
        await Wishlist.findById(
          wishlist._id
        ).populate(
          "products.product"
        );

      return res.status(200).json({
        success: true,
        message:
          "Product removed from wishlist",
        wishlist:
          updatedWishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
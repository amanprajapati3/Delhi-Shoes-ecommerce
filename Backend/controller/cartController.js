import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";


// ADD TO CART
export const addToCart = async (
  req,
  res
) => {
  try {
    const {
      productId,
      variantId,
      quantity,
    } = req.body;

    // CHECK PRODUCT
    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // OPTIONAL VARIANT
    let selectedVariant = null;

    if (
      variantId &&
      product.variants?.length > 0
    ) {
      selectedVariant =
        product.variants.id(
          variantId
        );

      if (!selectedVariant) {
        return res.status(404).json({
          success: false,
          message:
            "Variant not found",
        });
      }
    }

    // FIND USER CART
    let cart =
      await Cart.findOne({
        user: req.user._id,
      });

    // CREATE CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // CHECK EXISTING ITEM
    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
            productId &&
          (
            item.variantId?.toString() ||
            ""
          ) ===
            (variantId || "")
      );

    // UPDATE QUANTITY
    if (existingItem) {
      existingItem.quantity +=
        Number(quantity);
    }

    // ADD NEW ITEM
    else {
      cart.items.push({
        product: product._id,

        variantId:
          selectedVariant?._id ||
          null,

        quantity:
          Number(quantity),

        size:
          selectedVariant?.size ||
          "",

        color:
          selectedVariant?.color ||
          "",

        price: product.price,

        image: {
          url:
            product.images?.[0]
              ?.url || "",

          public_id:
            product.images?.[0]
              ?.public_id || "",
        },

        title: product.title,
      });
    }

    // TOTAL ITEMS
    cart.totalItems =
      cart.items.reduce(
        (acc, item) =>
          acc + item.quantity,
        0
      );

    // TOTAL PRICE
    cart.totalPrice =
      cart.items.reduce(
        (acc, item) =>
          acc +
          item.price *
            item.quantity,
        0
      );

    // SAVE
    await cart.save();

    // IMPORTANT
    await cart.populate(
      "items.product"
    );

    return res.status(200).json({
      success: true,
      message:
        "Product added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER CART
export const getUserCart = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// REMOVE FROM CART
export const removeFromCart = async (
  req,
  res
) => {
  try {
    const {
      itemId,
    } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove Item
    cart.items = cart.items.filter(
      (item) =>
        item._id.toString() !== itemId
    );

    // Recalculate Totals
    cart.totalItems = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) =>
        acc +
        item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message:
        "Item removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE CART ITEM QUANTITY
export const updateCartQuantity = async (
  req,
  res
) => {
  try {
    const {
      itemId,
    } = req.params;

    const {
      quantity,
    } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    // Recalculate Totals
    cart.totalItems = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) =>
        acc +
        item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message:
        "Cart updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CLEAR CART
export const clearCart = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
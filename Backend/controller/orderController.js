import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import SiteSettings from "../models/sitesettings.js";
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const placeOrder = async (
  req,
  res
) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    // FIND USER CART
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    // CHECK EMPTY CART
    if (
      !cart ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // CALCULATE SUBTOTAL
    const subtotal =
      cart.items.reduce(
        (acc, item) =>
          acc +
          item.price * item.quantity,
        0
      );

    // SHIPPING
    const shippingCharge = 0;

    // DISCOUNT VARIABLES
    let discountAmount = 0;
    let appliedCouponCode = "";

    // APPLY COUPON
    if (couponCode) {

      const settings =
        await SiteSettings.findOne();

      if (
        !settings ||
        !settings.coupon
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon not found",
        });
      }

      const coupon =
        settings.coupon;

      // CHECK CODE
      if (
        coupon.code !==
        couponCode.toUpperCase()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      // CHECK ACTIVE
      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Coupon inactive",
        });
      }

      // CHECK EXPIRY
      if (
        coupon.expiryDate &&
        new Date() >
          new Date(coupon.expiryDate)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }

      // CHECK MINIMUM PURCHASE
      if (
        subtotal <
        coupon.minimumPurchaseAmount
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ₹${coupon.minimumPurchaseAmount}`,
        });
      }

      // CHECK MINIMUM QUANTITY
      if (
        cart.totalItems <
        coupon.minimumProductQuantity
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum ${coupon.minimumProductQuantity} items required`,
        });
      }

      // CHECK USAGE LIMIT
      if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >=
          coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon usage limit reached",
        });
      }

      // CALCULATE DISCOUNT
      discountAmount =
        (subtotal *
          coupon.discountPercentage) /
        100;

      appliedCouponCode =
        coupon.code;

      // INCREMENT USED COUNT
      coupon.usedCount += 1;
      await settings.save();
    }

    // FINAL TOTAL
    const finalTotal =
      Math.max(
        subtotal - discountAmount,
        0
      ) + shippingCharge;

    // CREATE ORDER
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(
        (item) => ({
          product:
            item.product._id,
          title: item.title,
          images: item.image
            ? [item.image]
            : [],
          price: item.price,
          quantity:
            item.quantity,
          size: item.size,
          color: item.color,
        })
      ),

      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      totalItems:
        cart.totalItems,
      subtotalPrice:
        subtotal,
      discountAmount,
      couponCode:
        appliedCouponCode,
      shippingCharge,
      totalPrice:
        finalTotal,
    });

    // CLEAR CART
    if (paymentMethod === "COD") {
     cart.items = [];
     cart.totalItems = 0;
     cart.totalPrice = 0;
     await cart.save();
    }
    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      orderId: order._id,
      amount: finalTotal,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET USER ORDERS
export const getUserOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      count: orders.length,

      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE ORDER
export const getSingleOrder =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// UPDATE ORDER + PAYMENT STATUS
export const updateOrderStatus =
  async (req, res) => {
    try {
      const {
        orderStatus,
        paymentStatus,
      } = req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      // UPDATE ORDER STATUS
      if (orderStatus) {
        order.orderStatus =
          orderStatus;

        // DELIVERED TIME
        if (
          orderStatus ===
          "delivered"
        ) {
          order.deliveredAt =
            Date.now();
        }
      }

      // UPDATE PAYMENT STATUS
      if (paymentStatus) {
        order.paymentStatus =
          paymentStatus;

        // PAID TIME
        if (
          paymentStatus ===
          "paid"
        ) {
          order.paidAt =
            Date.now();
        }
      }

      await order.save();

      return res.status(200).json({
        success: true,

        message:
          "Order updated successfully",

        order,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: orders.length,

      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// razorpay
export const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    const razorpayOrder =
      await razorpay.orders.create({
        amount: order.totalPrice * 100,
        currency: "INR",
        receipt: order._id.toString(),
      });

    res.json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (
  req,
  res
) => {
  try {

    const {
      orderId,
      razorpay_payment_id,
    } = req.body;

    await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        paidAt: new Date(),
      }
    );

    const order = await Order.findById(orderId);

    const cart = await Cart.findOne({
      user: order.user,
    });

    if (cart) {
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      await cart.save();
    }

    res.json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
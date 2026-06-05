import SiteSettings from "../models/sitesettings.js";


// ==========================================
// CREATE / UPDATE ANNOUNCEMENT BAR
// ==========================================

export const updateAnnouncement = async (req, res) => {
  try {

    const {
      enabled,
      text,
      link,
      backgroundColor,
      textColor,
    } = req.body;

    let content = await SiteSettings.findOne();

    if (!content) {
      content = new SiteSettings();
    }

    content.announcement = {
      enabled,
      text,
      link,
      backgroundColor,
      textColor,
    };

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      content,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// GET ANNOUNCEMENT
// ==========================================

export const getAnnouncement = async (req, res) => {
  try {

    const content = await SiteSettings.findOne();

    return res.status(200).json({
      success: true,
      announcement: content?.announcement || {},
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// CREATE DISCOUNT COUPON
// ==========================================

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercent,
      expiryDate,
      usageLimit,
      minPurchaseAmount,
      minProductQuantity,
    } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    if (!settings.coupon) {
      settings.coupon = {};
    }

    // CHECK DUPLICATE
    if (
      settings.coupon.code &&
      settings.coupon.code === code.toUpperCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // ✅ FIXED MAPPING (IMPORTANT PART)
    settings.coupon = {
      code: code.toUpperCase(),
      discountPercentage: discountPercent,
      expiryDate,
      usageLimit,

      // 🔥 FIXED FIELD NAMES
      minimumPurchaseAmount: minPurchaseAmount,
      minimumProductQuantity: minProductQuantity,

      usedCount: 0,
      isActive: true,
    };

    await settings.save();

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      settings,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL COUPONS
// ==========================================

export const getCoupons = async (req, res) => {
  try {

    const content = await SiteSettings.findOne();

    return res.status(200).json({
      success: true,
      coupons: content?.coupon || [],
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// DELETE COUPON
// ==========================================

export const deleteCoupon = async (req, res) => {
  try {
    const content = await SiteSettings.findOne();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Website content not found",
      });
    }

    // RESET COUPON (since only one exists)
    content.coupon = {
      code: "",
      discountPercentage: 0,
      minimumPurchaseAmount: 0,
      minimumProductQuantity: 1,
      usageLimit: 0,
      usedCount: 0,
      expiryDate: null,
      isActive: false,
    };

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      coupon: content.coupon,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// APPLY COUPON
// ==========================================

export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal, totalQuantity } = req.body;

    const content = await SiteSettings.findOne();

    if (!content || !content.coupon) {
      return res.status(404).json({
        success: false,
        message: "No coupon found",
      });
    }

    const coupon = content.coupon;

    // CHECK CODE
    if (coupon.code.toLowerCase() !== code.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // CHECK ACTIVE
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });
    }

    // CHECK EXPIRY
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    // CHECK USAGE LIMIT
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // CHECK MIN PURCHASE
    if (cartTotal < coupon.minimumPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase should be ₹${coupon.minimumPurchaseAmount}`,
      });
    }

    // CHECK MIN QUANTITY
    if (totalQuantity < coupon.minimumProductQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${coupon.minimumProductQuantity} products required`,
      });
    }

    // CALCULATE DISCOUNT
    const discountAmount =
      (cartTotal * coupon.discountPercentage) / 100;

    const finalPrice = cartTotal - discountAmount;

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
      discountAmount,
      finalPrice,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
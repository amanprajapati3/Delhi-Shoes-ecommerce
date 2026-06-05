import express from "express";

import {
  updateAnnouncement,
  getAnnouncement,
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
} from "../controller/sitesettingController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const setting_router = express.Router();


// ==========================================
// ADMIN CHECK MIDDLEWARE
// ==========================================

const isAdmin = (req, res, next) => {

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

};


// ==========================================
// ANNOUNCEMENT ROUTES
// ==========================================

// ADMIN - CREATE / UPDATE ANNOUNCEMENT
setting_router.put(
  "/announcement",
  authMiddleware,
  isAdmin,
  updateAnnouncement
);

// PUBLIC - GET ANNOUNCEMENT
setting_router.get(
  "/announcement",
  getAnnouncement
);


// ==========================================
// COUPON ROUTES
// ==========================================

// ADMIN - CREATE COUPON
setting_router.post(
  "/coupon",
  authMiddleware,
  isAdmin,
  createCoupon
);

// PUBLIC - GET ALL COUPONS
setting_router.get(
  "/coupons",
  getCoupons
);

// ADMIN - DELETE COUPON
setting_router.delete(
  "/coupon/:couponId",
  authMiddleware,
  isAdmin,
  deleteCoupon
);

// USER - APPLY COUPON
setting_router.post(
  "/apply-coupon",
  applyCoupon
);

export default setting_router;
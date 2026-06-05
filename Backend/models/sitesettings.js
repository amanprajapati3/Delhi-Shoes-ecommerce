import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    // =========================
    // ANNOUNCEMENT BAR
    // =========================
    announcement: {
      text: {
        type: String,
        default: "",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      backgroundColor: {
        type: String,
        default: "#111111",
      },

      textColor: {
        type: String,
        default: "#ffffff",
      },

      speed: {
        type: Number,
        default: 25,
      },
    },

    // =========================
    // DISCOUNT / COUPON
    // =========================
    coupon: {
      code: {
        type: String,
        uppercase: true,
        trim: true,
        default: "",
      },

      discountPercentage: {
        type: Number,
        default: 0,
      },

      minimumPurchaseAmount: {
        type: Number,
        default: 0,
      },

      minimumProductQuantity: {
        type: Number,
        default: 1,
      },

      usageLimit: {
        type: Number,
        default: 0,
      },

      usedCount: {
        type: Number,
        default: 0,
      },

      expiryDate: {
        type: Date,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
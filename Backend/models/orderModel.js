import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product_Details",
          required: true,
        },

        title: {
          type: String,
          required: true,
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

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        size: {
          type: String,
          default: "",
        },

        color: {
          type: String,
          default: "",
        },
      },
    ],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      house: {
        type: String,
        required: true,
      },

      area: {
        type: String,
        required: true,
      },

      landmark: {
        type: String,
        default: "",
      },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "processing",
    },

    totalItems: {
      type: Number,
      required: true,
    },

    subtotalPrice: {
      type: Number,
      required: true,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    couponCode: {
      type: String,
      default: "",
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    trackingId: {
      type: String,
      default: "",
    },

    deliveredAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order =
  mongoose.models.Order || mongoose.model("Product_order", orderSchema);

export default Order;

import mongoose from "mongoose";

const cartSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,
      },

      items: [
        {
          product: {
            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "Product_Details",

            required: true,
          },

          variantId: {
            type:
              mongoose.Schema.Types
                .ObjectId,
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

          price: {
            type: Number,

            required: true,
          },

          image: {
            url: {
              type: String,

              default: "",
            },

            public_id: {
              type: String,

              default: "",
            },
          },

          title: {
            type: String,

            default: "",
          },
        },
      ],

      totalItems: {
        type: Number,

        default: 0,
      },

      totalPrice: {
        type: Number,

        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

const Cart =
  mongoose.models.Cart ||
  mongoose.model(
    "Cart",
    cartSchema
  );

export default Cart;
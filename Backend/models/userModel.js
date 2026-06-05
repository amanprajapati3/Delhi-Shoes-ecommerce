import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // NAME
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // EMAIL
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // PASSWORD
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // PHONE
    phone: {
      type: String,
      default: "",
    },

    // PROFILE IMAGES
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

    // ROLE
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ADDRESS
    address: {
      fullName: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      house: {
        type: String,
        default: "",
      },

      area: {
        type: String,
        default: "",
      },

      landmark: {
        type: String,
        default: "",
      },
    },

    // ACCOUNT STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    // KEEP OLD COLLECTION NAME
    collection: "customers",
  },
);

// PASSWORD HASHING
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    10,
  );

  next();
});

// COMPARE PASSWORD
userSchema.methods.comparePassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password,
    );
  };

// MODEL
const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;
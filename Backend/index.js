import express from "express";
import cors from "cors";
import "dotenv/config";
import dotenv from "dotenv";
import connectDb from "./config/Mongodb.js";
import connectCloudinary from "./config/Cloudinary.js";
import auth_router from "./routes/authRoute.js";
import cart_router from "./routes/cartRoute.js";
import wishlist_router from "./routes/wishlistRoute.js";
import product_router from "./routes/productRoute.js";
import order_router from "./routes/orderRoute.js";
import review_router from "./routes/reviewRoute.js";
import setting_router from "./routes/siteSettingRoute.js";

// App config
const app = express();
dotenv.config();
const port = process.env.PORT || 6000;
connectDb();
connectCloudinary();

// middleware
app.use( 
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(
  cors({
    origin: "https://delhi-shoes-ecommerce.vercel.app/",
    credentials: true,
  })
);

app.use("/api/auth", auth_router);
app.use("/api/products", product_router);
app.use("/api/cart", cart_router);
app.use("/api/wishlist", wishlist_router);
app.use("/api/orders", order_router);
app.use("/api/reviews", review_router);
app.use("/api/setting", setting_router);

// api endpoints
app.get("/", (req, res) => {
  res.send("api working successfully");
});

app.listen(port, () => 
  console.log(`Website is running at http://localhost:${port}`)
);

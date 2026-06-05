import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

// TOAST
import { Toaster } from "react-hot-toast";

// CONTEXTS
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// WEBSITE PAGES
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Contact from "./pages/Contact.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Blog from "./pages/Blog.jsx";
import Auth from "./pages/Auth.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import UserOrder from "./pages/UserOrder.jsx";

// ADMIN LAYOUT
import DashBoard from "./Admin/Components/DashBoard.jsx";

// ADMIN PAGES
import Updates from "./Admin/Updates.jsx";
import Add from "./Admin/Add.jsx";
import Products from "./Admin/Products.jsx";
import Orders from "./Admin/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminProfile from "./Admin/AdminProfile.jsx";
import DashboardHome from "./Admin/DashboardHome.jsx";
import Policy from "./pages/Policy.jsx";
import TermOfService from "./pages/TermOfService.jsx";
import SiteMap from "./pages/SiteMap.jsx";
import Setting from "./Admin/Setting.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              {/* TOAST */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: "#111827",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#22c55e",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />

              <Routes>
                {/* WEBSITE LAYOUT */}
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="orders" element={< UserOrder/>} />
                  <Route path="privacy" element={< Policy/>} />
                  <Route path="terms" element={< TermOfService/>} />
                  <Route path="sitemap" element={< SiteMap/>} />

                  {/* PRODUCT DETAILS */}
                  <Route path="product/:id" element={<ProductDetails />} />
                </Route>

                {/* ADMIN DASHBOARD */}
                <Route path="/dashboard" element={<DashBoard />}>
                  <Route path="dashboardHome" element={<DashboardHome />} />
                  <Route path="add" element={<Add />} />
                  <Route path="update/:id" element={<Updates />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="adminProfile" element={<AdminProfile />} />
                  <Route path="setting" element={<Setting />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

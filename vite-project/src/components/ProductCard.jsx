import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useCart();

  // =========================
  // CHECK WISHLIST
  // =========================

  const alreadyInWishlist =
    isInWishlist(product?._id);

  // =========================
  // CHECK CART
  // =========================

  const cartItem =
    cart?.items?.find((item) => {
      return (
        item?.product?._id ===
          product?._id ||
        item?.product ===
          product?._id
      );
    });

  const alreadyInCart =
    !!cartItem;

  // =========================
  // HANDLE WISHLIST
  // =========================

  const handleWishlist = async (
    e
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error(
        "Please login first"
      );

      navigate("/auth");

      return;
    }

    try {
      // REMOVE
      if (alreadyInWishlist) {
        await removeFromWishlist(
          product._id
        );

        toast.success(
          "Removed from wishlist"
        );
      }

      // ADD
      else {
        await addToWishlist(
          product._id
        );

        toast.success(
          "Added to wishlist"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Wishlist action failed"
      );
    }
  };

  // =========================
  // HANDLE CART
  // =========================

  const handleCart = async (
    e
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error(
        "Please login first"
      );

      navigate("/auth");

      return;
    }

    try {
      // =========================
      // REMOVE FROM CART
      // =========================

      if (alreadyInCart) {
        const cartItemId =
          cartItem?._id;

        if (!cartItemId) {
          toast.error(
            "Cart item not found"
          );

          return;
        }

        await removeFromCart(
          cartItemId
        );

        toast.success(
          "Removed from cart"
        );
      }

      // =========================
      // ADD TO CART
      // =========================

      else {
        // CHECK VARIANTS

        const variants =
          product?.variants || [];

        // FIRST AVAILABLE VARIANT

        const firstVariant =
          variants.find(
            (variant) =>
              variant?.stock > 0
          );

        // NO VARIANT

        if (!firstVariant) {
          toast.error(
            "Product is out of stock"
          );

          return;
        }

        await addToCart(
          product._id,
          firstVariant._id,
          1
        );

        toast.success(
          "Added to cart"
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Cart action failed"
      );
    }
  };

  // =========================
  // PRODUCT DETAILS
  // =========================

  const handleProductDetails =
    () => {
      console.log(product);
      navigate(
        `/product/${product._id}`
      );
    };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">

      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden">

        {/* WISHLIST */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 cursor-pointer  right-3 z-20 p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-300 active:scale-110 ${
            alreadyInWishlist
              ? "bg-red-500 text-white"
              : "bg-white/90 text-black hover:bg-black hover:text-white"
          }`}
        >
          <FaHeart size={14} />
        </button>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">

          {product?.newArrival && (
            <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
              New
            </span>
          )}

          {product?.bestSeller && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
              Bestseller
            </span>
          )}

          {product?.featured && (
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* PRODUCT IMAGE */}
        <div
          onClick={
            handleProductDetails
          }
          className="cursor-pointer"
        >
          <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">

            {/* IMAGE 1 */}
            <img
              src={
                product?.images?.[0]
                  ?.url
              }
              alt={product?.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />

            {/* IMAGE 2 */}
            <img
              src={
                product?.images?.[1]
                  ?.url ||
                product?.images?.[0]
                  ?.url
              }
              alt={product?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>

        {/* HOVER CART BUTTON */}
        <button
          onClick={handleCart}
          className={`absolute cursor-pointer active:scale-110 bottom-3 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg text-sm font-medium

          ${
            alreadyInCart
              ? "bg-red-500 text-white opacity-100 translate-y-0"
              : "bg-black text-white translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }
          `}
        >
          <BsCartPlus size={18} />

          {alreadyInCart
            ? "Remove From Cart"
            : "Add to Cart"}
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4">

        {/* CATEGORY */}
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
          {product?.category}
        </p>

        {/* TITLE */}
        <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 min-h-[42px]">
          {product?.title}
        </h2>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-3">

          {/* PRICE */}
          <span className="text-lg font-bold text-black">
            ₹{product?.price}
          </span>

          {/* COMPARE PRICE */}
          {product?.comparePrice >
            product?.price && (
            <span className="text-sm text-gray-400 line-through">
              ₹
              {
                product?.comparePrice
              }
            </span>
          )}

          {/* DISCOUNT */}
          {product?.comparePrice >
            product?.price && (
            <span className="text-xs text-green-600 font-medium">
              {Math.round(
                ((product.comparePrice -
                  product.price) /
                  product.comparePrice) *
                  100
              )}
              % OFF
            </span>
          )}
        </div>

        {/* DETAILS BUTTON */}
        <div className="mt-4">
          <button
            onClick={
              handleProductDetails
            }
            className="w-full border border-black text-black text-sm py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
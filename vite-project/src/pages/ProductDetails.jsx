import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaTimes,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaShareAlt,
  FaCheck,
  FaRuler,
} from "react-icons/fa";
import { BsCartPlus, BsCartDash, BsBag } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";

import { useProduct } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Review from "./Review";

import Loader from "../components/Loaders";
import "./ProductDetails.css";
import RelatedProduct from "./RelatedProduct";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { loading, singleProduct, getSingleProduct } = useProduct();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const reviewRef = useRef(null);

  useEffect(() => {
    if (id) {
      getSingleProduct(id);
      setSelectedImage(0);
      setSelectedSize("");
      setSelectedColor("");
      setImageLoaded(false);
    }
  }, [id]);

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedImage]);

  const alreadyInWishlist = isInWishlist(singleProduct?._id);

  // CART CHECK

  const cartItem = cart?.items?.find((item) => {
    return (
      item?.product?._id === singleProduct?._id ||
      item?.product === singleProduct?._id
    );
  });

  const alreadyInCart = !!cartItem;

  // PRODUCT VARIANTS

  const productSizes = [
    ...new Set(singleProduct?.variants?.map((v) => v.size)?.filter(Boolean)),
  ];

  const productColors = [
    ...new Set(singleProduct?.variants?.map((v) => v.color)?.filter(Boolean)),
  ];

  // SELECTED VARIANT

  const selectedVariant = singleProduct?.variants?.find((variant) => {
    const sizeMatch = !selectedSize || variant.size === selectedSize;
    const colorMatch = !selectedColor || variant.color === selectedColor;
    return sizeMatch && colorMatch;
  });

  // DISCOUNT PERCENTAGE

  const discountPercent =
    singleProduct?.comparePrice > singleProduct?.price
      ? Math.round(
          ((singleProduct.comparePrice - singleProduct.price) /
            singleProduct.comparePrice) *
            100,
        )
      : null;


const totalReviews = singleProduct?.totalReviews || 0;

const averageRating = singleProduct?.averageRating || 0;

  // IMAGE SLIDER

  const handleNextImage = () => {
    if (selectedImage < singleProduct.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  // WISHLIST

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }
    try {
      if (alreadyInWishlist) {
        await removeFromWishlist(singleProduct._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(singleProduct._id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // VALIDATE VARIANT SELECTION
  // Returns true if valid, false if not

  const validateVariantSelection = () => {
    const variants = singleProduct?.variants || [];
    const hasVariants = variants.length > 0;

    if (hasVariants && productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (hasVariants && productColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    if (hasVariants && !selectedVariant) {
      toast.error("Variant not available");
      return false;
    }
    if (selectedVariant && Number(selectedVariant.stock) <= 0) {
      toast.error("Out of stock");
      return false;
    }
    return true;
  };

  // ADD TO CART (toggle)

  const handleCart = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setAddingToCart(true);
    try {
      if (alreadyInCart) {
        await removeFromCart(cartItem._id);
        toast.success("Removed from cart");
        return;
      }

      if (!validateVariantSelection()) return;

      const variants = singleProduct?.variants || [];
      const hasVariants = variants.length > 0;

      await addToCart(
        singleProduct._id,
        hasVariants ? selectedVariant?._id : null,
        1,
      );
      toast.success("Added to cart");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Cart action failed");
    } finally {
      setAddingToCart(false);
    }
  };

  // BUY NOW
  // Adds to cart ONLY if not already there, then navigates to cart.
  // Does NOT remove if already in cart — just goes to cart.

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setBuyingNow(true);
    try {
      if (!alreadyInCart) {
        if (!validateVariantSelection()) return;

        const variants = singleProduct?.variants || [];
        const hasVariants = variants.length > 0;

        await addToCart(
          singleProduct._id,
          hasVariants ? selectedVariant?._id : null,
          1,
        );
      }
      // Whether already in cart or just added — navigate to cart
      navigate("/cart");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBuyingNow(false);
    }
  };

  // COPY LINK

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  // =========================
  // LOADING
  // =========================

  if (loading || !singleProduct) return <Loader />;

  return (
    <>
      <style>{`
        
      `}</style>

      <div className="pd-root px-4 md:px-10 lg:px-20 py-10">
        {/* BREADCRUMB */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.78rem",
            color: "#999",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Home &nbsp;/&nbsp; {singleProduct?.category} &nbsp;/&nbsp;{" "}
          <span style={{ color: "#1a1a1a" }}>{singleProduct?.title}</span>
        </p>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── LEFT: IMAGES ── */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* THUMBNAILS */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto scrollbar-hide md:max-h-[600px]">
              {singleProduct?.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  onClick={() => setSelectedImage(index)}
                  className={`pd-thumb flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-xl cursor-pointer border-2 border-transparent ${selectedImage === index ? "active" : ""}`}
                />
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div
              className="relative flex-1 rounded-2xl overflow-hidden"
              style={{ background: "#f0ede8", minHeight: "420px" }}
            >
              {/* Discount badge */}
              {discountPercent && (
                <span className="pd-badge absolute top-4 left-4 z-10 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}

              <img
                src={singleProduct?.images?.[selectedImage]?.url}
                alt={singleProduct?.title}
                onLoad={() => setImageLoaded(true)}
                className={`pd-main-img w-full h-full object-fit aspect-[4/5] ${imageLoaded ? "loaded" : "loading"}`}
              />

              {/* Prev */}
              {selectedImage > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="pd-nav-btn absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-md text-gray-700"
                >
                  ←
                </button>
              )}
              {/* Next */}
              {selectedImage < singleProduct.images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="pd-nav-btn absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-md text-gray-700"
                >
                  →
                </button>
              )}

              {/* Dot indicators */}
              {singleProduct.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {singleProduct.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      style={{
                        width: i === selectedImage ? "20px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background:
                          i === selectedImage ? "#1a1a1a" : "rgba(0,0,0,0.25)",
                        transition: "all 0.3s ease",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: INFO ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* CATEGORY TAG */}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#a07840",
                fontWeight: 500,
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              {singleProduct?.category}
            </span>

            {/* TITLE */}
            <h1
              className="pd-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#1a1a1a",
                marginBottom: "0.75rem",
              }}
            >
              {singleProduct?.title}
            </h1>

            {/* review and rating  */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={14}
                    color={
                      star <= Math.round(averageRating) ? "#facc15" : "#d1d5db"
                    }
                  />
                ))}

                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "0.88rem",
                    color: "#666",
                  }}
                >
                  {averageRating} ({totalReviews} Reviews)
                </span>
              </div>

              {/* REVIEW BUTTON */}

              <button
                onClick={() =>
                  reviewRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: "#a07840",
                  textDecoration: "underline",
                  letterSpacing: "0.04em",
                }}
              >
                Write a Review
              </button>
            </div>

            {/* SHORT DESCRIPTION */}
            <p
              style={{
                color: "#6b6459",
                lineHeight: 1.7,
                fontSize: "0.92rem",
                marginBottom: "1.5rem",
              }}
            >
              {singleProduct?.shortDescription}
            </p>

            <hr className="pd-divider" style={{ marginBottom: "1.5rem" }} />

            {/* PRICE */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <span
                className="pd-price-main"
                style={{ fontSize: "2.2rem", color: "#1a1a1a" }}
              >
                ₹{singleProduct?.price?.toLocaleString("en-IN")}
              </span>
              {singleProduct?.comparePrice > singleProduct?.price && (
                <>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      textDecoration: "line-through",
                      color: "#bbb",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    ₹{singleProduct?.comparePrice?.toLocaleString("en-IN")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "#f0ede8",
                      color: "#a07840",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Save ₹
                    {(
                      singleProduct.comparePrice - singleProduct.price
                    ).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            {/* SIZE */}
            {productSizes.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#1a1a1a",
                    }}
                  >
                    Size{" "}
                    {selectedSize && (
                      <span style={{ fontWeight: 400, color: "#a07840" }}>
                        — {selectedSize}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    style={{
                      fontSize: "0.78rem",
                      color: "#888",
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FaRuler size={10} /> Size Guide
                  </button>
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {productSizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`pd-size-btn ${selectedSize === size ? "selected" : ""}`}
                      style={{
                        minWidth: "52px",
                        height: "44px",
                        padding: "0 14px",
                        borderRadius: "8px",
                        border: "1.5px solid",
                        borderColor: selectedSize === size ? "#1a1a1a" : "#ddd",
                        background: selectedSize === size ? "#1a1a1a" : "white",
                        color: selectedSize === size ? "white" : "#1a1a1a",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 0,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLORS */}
            {productColors.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    marginBottom: "0.75rem",
                  }}
                >
                  Color{" "}
                  {selectedColor && (
                    <span style={{ fontWeight: 400, color: "#a07840" }}>
                      — {selectedColor}
                    </span>
                  )}
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {productColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`pd-color-btn ${selectedColor === color ? "selected" : ""}`}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        border: "1.5px solid",
                        borderColor:
                          selectedColor === color ? "#1a1a1a" : "#ddd",
                        background:
                          selectedColor === color ? "#1a1a1a" : "white",
                        color: selectedColor === color ? "white" : "#444",
                        fontSize: "0.82rem",
                        textTransform: "capitalize",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {selectedColor === color && <FaCheck size={10} />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SHARE BUTTON */}
            <button
              onClick={() => setShareOpen(true)}
              style={{
                marginTop: "0.5rem",
                marginBottom: "1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#999",
                fontSize: "0.78rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
            >
              <FaShareAlt size={11} />
              Share this product
            </button>
            <hr className="pd-divider" style={{ marginBottom: "1.5rem" }} />

            {/* CTA BUTTONS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              {/* ADD TO CART */}
              <button
                onClick={handleCart}
                disabled={addingToCart}
                className="pd-btn-cart"
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: alreadyInCart ? "#e74c3c" : "#1a1a1a",
                  color: "white",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: addingToCart ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: addingToCart ? 0.8 : 1,
                }}
              >
                {addingToCart ? (
                  <span className="pd-spinner" />
                ) : alreadyInCart ? (
                  <>
                    <BsCartDash size={15} /> Remove
                  </>
                ) : (
                  <>
                    <BsCartPlus size={15} /> Add to Cart
                  </>
                )}
              </button>

              {/* WISHLIST */}
              <button
                onClick={handleWishlist}
                className={`pd-btn-wish ${alreadyInWishlist ? "wishlisted" : ""}`}
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid",
                  borderColor: alreadyInWishlist ? "#1a1a1a" : "#ddd",
                  background: alreadyInWishlist ? "#1a1a1a" : "white",
                  color: alreadyInWishlist ? "white" : "#444",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {alreadyInWishlist ? (
                  <FaHeart size={13} />
                ) : (
                  <FaRegHeart size={13} />
                )}
                {alreadyInWishlist ? "Saved" : "Wishlist"}
              </button>
            </div>

            {/* BUY NOW */}
            <button
              onClick={handleBuyNow}
              disabled={buyingNow}
              className="pd-btn-buy"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "10px",
                border: "none",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: buyingNow ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: buyingNow ? 0.8 : 1,
              }}
            >
              {buyingNow ? (
                <span className="pd-spinner" />
              ) : (
                <>
                  <BsBag size={15} /> Buy Now
                </>
              )}
            </button>

            {/* ACCORDIONS */}
            <div style={{ marginTop: "2rem", borderTop: "1px solid #ece8e1" }}>
              {[
                {
                  key: "description",
                  label: "Description",
                  content: <p>{singleProduct?.description}</p>,
                },

                {
                  key: "returns",
                  label: "Returns & Exchanges",
                  content: (
                    <ul
                      style={{
                        paddingLeft: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <li>Easy 7-day return and exchange policy.</li>
                      <li>Items must be unused with original tags attached.</li>
                      <li>Exchange available for size or color issues.</li>
                      <li>Refunds are processed within 5-7 business days.</li>
                      <li>Sale items are not eligible for return.</li>
                    </ul>
                  ),
                },

                {
                  key: "shipping",
                  label: "Shipping & Delivery",
                  content: (
                    <ul
                      style={{
                        paddingLeft: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <li>Free shipping on prepaid orders above ₹999.</li>
                      <li>Orders are dispatched within 24-48 hours.</li>
                      <li>Estimated delivery time is 3-7 business days.</li>
                      <li>
                        Real-time tracking details are shared via email/SMS.
                      </li>
                      <li>Cash on Delivery available on selected pincodes.</li>
                    </ul>
                  ),
                },
              ].map(({ key, label, content }) => (
                <div key={key} style={{ borderBottom: "1px solid #ece8e1" }}>
                  <button
                    onClick={() =>
                      setOpenSection(openSection === key ? "" : key)
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.1rem 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "0.85rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#1a1a1a",
                      }}
                    >
                      {label}
                    </span>

                    <span
                      style={{
                        color: "#888",
                        transition: "transform 0.2s",
                        display: "flex",
                        transform:
                          openSection === key ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <FaChevronDown size={12} />
                    </span>
                  </button>

                  {openSection === key && (
                    <div
                      className="pd-accordion-content"
                      style={{
                        paddingBottom: "1.25rem",
                        color: "#6b6459",
                        lineHeight: 1.8,
                        fontSize: "0.9rem",
                      }}
                    >
                      {content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIZE CHART MODAL */}
        {sizeChartOpen && (
          <div
            className="pd-modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSizeChartOpen(false);
            }}
          >
            <div
              className="pd-modal-box"
              style={{
                background: "#fafaf8",
                borderRadius: "16px",
                padding: "2rem",
                width: "100%",
                maxWidth: "480px",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSizeChartOpen(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "#f0ede8",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FaTimes size={12} />
              </button>
              <h2
                className="pd-display"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  marginBottom: "1.5rem",
                }}
              >
                Size Guide
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.88rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f0ede8" }}>
                      {["Size", "Chest (in)", "Waist (in)", "Hip (in)"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 16px",
                              textAlign: "left",
                              fontWeight: 500,
                              letterSpacing: "0.05em",
                              color: "#1a1a1a",
                              borderBottom: "1px solid #e0d9ce",
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["XS", "32", "26", "34"],
                      ["S", "34", "28", "36"],
                      ["M", "36", "30", "38"],
                      ["L", "38", "32", "40"],
                      ["XL", "40", "34", "42"],
                    ].map(([size, chest, waist, hip]) => (
                      <tr
                        key={size}
                        style={{ borderBottom: "1px solid #ece8e1" }}
                      >
                        <td style={{ padding: "10px 16px", fontWeight: 500 }}>
                          {size}
                        </td>
                        <td style={{ padding: "10px 16px", color: "#6b6459" }}>
                          {chest}
                        </td>
                        <td style={{ padding: "10px 16px", color: "#6b6459" }}>
                          {waist}
                        </td>
                        <td style={{ padding: "10px 16px", color: "#6b6459" }}>
                          {hip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SHARE MODAL */}
        {shareOpen && (
          <div
            className="pd-modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShareOpen(false);
            }}
          >
            <div
              className="pd-modal-box"
              style={{
                background: "#fafaf8",
                borderRadius: "16px",
                padding: "2rem",
                width: "100%",
                maxWidth: "380px",
                position: "relative",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => setShareOpen(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "#f0ede8",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FaTimes size={12} />
              </button>
              <h2
                className="pd-display"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 400,
                  marginBottom: "0.5rem",
                }}
              >
                Share
              </h2>
              <p
                style={{
                  color: "#999",
                  fontSize: "0.82rem",
                  marginBottom: "1.75rem",
                }}
              >
                Share this product with friends
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  {
                    Icon: FaWhatsapp,
                    color: "#25D366",
                    label: "WhatsApp",
                    href: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
                  },
                  {
                    Icon: FaFacebookF,
                    color: "#1877F2",
                    label: "Facebook",
                    href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                  },
                  {
                    Icon: FaTwitter,
                    color: "#1DA1F2",
                    label: "Twitter",
                    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
                  },
                  {
                    Icon: FaPinterestP,
                    color: "#E60023",
                    label: "Pinterest",
                    href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}`,
                  },
                ].map(({ Icon, color, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-share-icon"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 4px 14px ${color}44`,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "#999",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
              <button
                onClick={handleCopyLink}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1.5px dashed #d4c9b8",
                  background: "transparent",
                  color: "#666",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0ede8";
                  e.currentTarget.style.borderColor = "#a07840";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#d4c9b8";
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-20">
        <RelatedProduct
          productId={singleProduct?._id}
          category={singleProduct?.category}
          gender={singleProduct?.gender}
        />
      </div>
      {/* REVIEWS */}
      <div className="mt-20" ref={reviewRef}>
        <Review productId={singleProduct?._id} />
      </div>
    </>
  );
};

export default ProductDetails;

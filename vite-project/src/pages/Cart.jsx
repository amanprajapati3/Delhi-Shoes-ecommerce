import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {FaTrash, FaArrowRight, FaShoppingBag, FaShippingFast, FaLock, FaTag, FaTimes, FaCheck, } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loaders";
import { toast } from "react-hot-toast";
import axios from "../services/axios";

// ─── useInView ─────────────────────────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Qty Stepper ───────────────────────────────────────────────────
function QtyStepper({ value, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={onDecrease}
        className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 disabled:opacity-30"
        disabled={value <= 1}
      >
        −
      </button>
      <span className="w-9 text-center text-sm font-bold text-gray-900">
        {value}
      </span>
      <button
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200"
      >
        +
      </button>
    </div>
  );
}

function CouponBar({
  cartTotal,
  totalQuantity,
  setDiscountData,
  discountData,
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // APPLY COUPON
  const applyCoupon = async () => {
    try {
      if (!code.trim()) {
        return toast.error("Enter coupon code");
      }
      setLoading(true);
      const res = await axios.post("/setting/apply-coupon", {
        code,
        cartTotal,
        totalQuantity,
      });
      if (res.data.success) {
        setDiscountData({
          applied: true,
          code: res.data.coupon.code,
          discountPercentage: res.data.coupon.discountPercentage,
          discountAmount: res.data.discountAmount,
          finalPrice: res.data.finalPrice,
        });
        toast.success("Coupon applied successfully");
        localStorage.setItem(
          "appliedCoupon",
          JSON.stringify({
            applied: true,
            code: res.data.coupon.code,
            discountPercentage:
              res.data.coupon.discountPercentage,
            discountAmount:
              res.data.discountAmount,
            finalPrice:
              res.data.finalPrice,
          })
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid coupon");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setDiscountData({
      applied: false,
      code: "",
      discountPercentage: 0,
      discountAmount: 0,
      finalPrice: 0,
    });
    setCode("");
    toast.success("Coupon removed");
    localStorage.removeItem("appliedCoupon");
  };

  return (
    <div className="mt-5">
      <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
        Coupon Code
      </p>
      <div className="flex gap-2">
        <div
          className={`flex-1 flex items-center gap-2 border rounded-2xl px-4 transition-all duration-200
          ${
            discountData.applied
              ? "border-green-400 bg-green-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <FaTag
            className={`text-xs ${
              discountData.applied ? "text-green-500" : "text-gray-400"
            }`}
          />
          <input
            value={discountData.applied ? discountData.code : code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
            disabled={discountData.applied}
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent text-sm font-semibold py-3 outline-none text-gray-700 placeholder-gray-400"
          />
          {discountData.applied && (
            <FaCheck className="text-green-500 text-xs" />
          )}
          {discountData.applied && (
            <button
              onClick={removeCoupon}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
        {!discountData.applied && (
          <button
            onClick={applyCoupon}
            disabled={loading}
            className="bg-gray-900 text-white px-5 rounded-2xl text-sm font-bold hover:bg-gray-700 transition-all duration-200 active:scale-95"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        )}
      </div>
      {discountData.applied && (
        <p className="text-green-600 text-xs mt-1.5 font-medium">
          {discountData.discountPercentage}% discount applied 🎉
        </p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
const Cart = () => {
  const { cart, loading, removeFromCart, updateCart } = useCart();
  const [discountData, setDiscountData] = useState({
  applied: false,
  code: "",
  discountPercentage: 0,
  discountAmount: 0,
  finalPrice: 0,
});

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Removed from cart");
    } catch {
      toast.error("Remove failed");
    }
  };

  const increaseQty = async (item) => {
    try {
      await updateCart(item._id, item.quantity + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;
    try {
      await updateCart(item._id, item.quantity - 1);
    } catch (e) {
      console.log(e);
    }
  };

  const subtotal =
  cart?.items?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  ) || 0;

useEffect(() => {
  try {
    const stored = localStorage.getItem("appliedCoupon");

    if (stored) {
      const parsed = JSON.parse(stored);
      setDiscountData(parsed);
    }
  } catch (err) {
    console.log("Invalid coupon data in storage");
    localStorage.removeItem("appliedCoupon");
  }
}, []);
  const shipping = subtotal > 999 ? 0 : 99;
  const savings =
    cart?.items?.reduce((acc, item) => {
      const diff = (item.product.comparePrice || 0) - item.product.price;
      return acc + (diff > 0 ? diff * item.quantity : 0);
    }, 0) || 0;
  const totalBeforeDiscount = subtotal + shipping;

  const total = discountData.applied
  ? discountData.finalPrice + shipping
  : totalBeforeDiscount;
  const freeShippingLeft = 999 - subtotal;

  if (loading) return <Loader />;

  // ── Empty state ────────────────────────────────────────────────
  if (!cart || cart?.items?.length === 0) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 text-center"
        style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-5xl mb-6 animate-[bounce_2s_ease_infinite]">
          🛒
        </div>
        <h2
          className="text-3xl font-black text-gray-900"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          Your cart is empty
        </h2>
        <p className="text-gray-400 mt-3 max-w-xs text-sm leading-relaxed">
          Looks like you haven't added anything yet. Let's fix that.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-all duration-300 group active:scale-95"
        >
          Start Shopping
          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
        <Link
          to="/"
          className="mt-4 text-sm text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50/70"
      style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Playfair+Display:wght@700;900&display=swap');
        .hero-font { font-family:'Playfair Display',Georgia,serif; }
        .img-zoom { transition:transform 0.5s cubic-bezier(.22,.68,0,1.2); }
        .img-zoom:hover { transform:scale(1.05); }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 md:px-10 lg:px-16 py-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 mb-1">
              Checkout
            </p>
            <h1 className="hero-font text-3xl md:text-4xl font-black text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-700">
            <FaShoppingBag className="text-gray-500 text-xs" />
            {cart?.items?.length} {cart?.items?.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-16 py-8">
        <div className="grid lg:grid-cols-3 gap-7">
          {/* ── LEFT: Cart Items ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping progress */}
            {freeShippingLeft > 0 && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FaShippingFast className="text-indigo-500" />
                      Add{" "}
                      <span className="text-indigo-600 font-black">
                        ₹{freeShippingLeft}
                      </span>{" "}
                      more for free shipping
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {Math.round((subtotal / 999) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((subtotal / 999) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            )}

            {freeShippingLeft <= 0 && (
              <Reveal>
                <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <FaCheck className="text-green-500 text-sm" />
                  <p className="text-sm font-semibold text-green-700">
                    You've unlocked free shipping! 🎉
                  </p>
                </div>
              </Reveal>
            )}

            {/* Cart item cards */}
            {cart?.items?.map((item, i) => {
              const hasDiscount =
                item.product.comparePrice > item.product.price;
              const discountPct = hasDiscount
                ? Math.round(
                    ((item.product.comparePrice - item.product.price) /
                      item.product.comparePrice) *
                      100,
                  )
                : 0;

              return (
                <Reveal key={item._id} delay={i * 0.07}>
                  <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-5 flex gap-4 md:gap-6 group hover:shadow-lg hover:shadow-gray-100 transition-all duration-400">
                    {/* Image */}
                    <Link
                      to={`/product/${item.product._id}`}
                      className="flex-shrink-0 w-28 md:w-36 h-36 md:h-40 rounded-2xl overflow-hidden bg-gray-100 relative"
                    >
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.title}
                        className="img-zoom w-full h-full object-cover"
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          -{discountPct}%
                        </span>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                          {item.product.category}
                        </p>
                        <Link to={`/product/${item.product.slug}`}>
                          <h2 className="text-base md:text-lg font-bold text-gray-900 mt-1 leading-snug hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                            {item.product.title}
                          </h2>
                        </Link>

                        {/* Variants */}
                        {(item.variant?.size || item.variant?.color) && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.variant?.size && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                Size: {item.variant.size}
                              </span>
                            )}
                            {item.variant?.color && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                {item.variant.color}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-xl font-black text-gray-900">
                            ₹{item.product.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through font-medium">
                              ₹{item.product.comparePrice}
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="text-xs text-green-600 font-bold">
                              Save ₹
                              {(item.product.comparePrice -
                                item.product.price) *
                                item.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                        <QtyStepper
                          value={item.quantity}
                          onDecrease={() => decreaseQty(item)}
                          onIncrease={() => increaseQty(item)}
                        />

                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-gray-700">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 font-semibold"
                          >
                            <FaTrash className="text-[10px]" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* ── RIGHT: Order Summary ───────────────────────────── */}
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-24 shadow-sm">
                <h2 className="hero-font text-xl font-black text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="space-y-3">
                  {/* SUBTOTAL */}
                  <div className="flex items-start justify-between text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">
                        Subtotal
                      </span>
                    </div>

                    <span className="font-bold text-gray-800">₹{subtotal}</span>
                  </div>

                  {/* SHIPPING */}
                  <div className="flex items-start justify-between text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">
                        Shipping
                      </span>

                      {shipping > 0 && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Free over ₹999
                        </p>
                      )}
                    </div>

                    <span
                      className={`font-bold ${
                        shipping === 0 ? "text-green-600" : "text-gray-800"
                      }`}
                    >
                      {shipping === 0 ? "Free 🎉" : `₹${shipping}`}
                    </span>
                  </div>

                  {/* TAX */}
                  <div className="flex items-start justify-between text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Tax</span>
                    </div>

                    <span className="font-bold text-gray-800">Included</span>
                  </div>

                  {/* COUPON DISCOUNT */}
                  {discountData.applied && (
                    <div className="flex items-start justify-between text-sm">
                      <div>
                        <span className="text-green-600 font-medium">
                          Coupon Discount
                        </span>

                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {discountData.code} applied
                        </p>
                      </div>

                      <span className="font-bold text-green-600">
                        -₹{discountData.discountAmount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Savings pill */}
                {savings > 0 && (
                  <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
                    <span className="text-xs font-bold text-green-700">
                      You're saving
                    </span>
                    <span className="text-sm font-black text-green-700">
                      ₹{savings}
                    </span>
                  </div>
                )}

                <CouponBar
                  cartTotal={subtotal}
                  totalQuantity={
                    cart?.items?.reduce(
                      (acc, item) => acc + item.quantity,
                      0,
                    ) || 0
                  }
                  discountData={discountData}
                  setDiscountData={setDiscountData}
                />

                <div className="border-t border-gray-100 my-5" />

                {/* Total */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{total}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link to="/checkout">
                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 group active:scale-[0.98]">
                    Proceed to Checkout
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>

                <Link
                  to="/shop"
                  className="block text-center mt-4 text-xs text-gray-400 hover:text-gray-700 font-semibold transition-colors duration-200 underline underline-offset-4"
                >
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-5">
                  {[
                    { icon: <FaLock className="text-xs" />, label: "Secure" },
                    {
                      icon: <FaShippingFast className="text-xs" />,
                      label: "Fast Delivery",
                    },
                    {
                      icon: <FaCheck className="text-xs" />,
                      label: "Easy Returns",
                    },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 text-gray-400"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        {icon}
                      </div>
                      <span className="text-[10px] font-semibold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "../services/Axios";
import Loader from "../components/Loaders";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, getCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [discountData, setDiscountData] = useState({
    applied: false,
    code: "",
    discountPercentage: 0,
    discountAmount: 0,
    finalPrice: 0,
  });

  const finalTotal = discountData.applied
    ? discountData.finalPrice
    : cart?.totalPrice || 0;

  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (!savedCoupon) return;
      const parsed = JSON.parse(savedCoupon);
      // validation safeguard
      if (parsed?.applied && parsed?.code) {
        setDiscountData({
          applied: parsed.applied,
          code: parsed.code || "",
          discountAmount: parsed.discountAmount || 0,
          discountPercentage: parsed.discountPercentage || 0,
          finalPrice: parsed.finalPrice || 0,
        });
      }
    } catch (error) {
      console.log("Coupon parse error:", error);
      localStorage.removeItem("appliedCoupon");
    }
  }, []);

  // SHIPPING ADDRESS
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    house: "",
    area: "",
    landmark: "",
  });

  // LOAD CART
  useEffect(() => {
    getCart();
  }, []);

  // LOAD USER ADDRESS AFTER REFRESH
  useEffect(() => {
    if (user?.address) {
      setShippingAddress({
        fullName: user.address.fullName || "",
        phone: user.address.phone || "",
        pincode: user.address.pincode || "",
        state: user.address.state || "",
        city: user.address.city || "",
        house: user.address.house || "",
        area: user.address.area || "",
        landmark: user.address.landmark || "",
      });
    }
  }, [user]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    try {
      // VALIDATION
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.pincode ||
        !shippingAddress.state ||
        !shippingAddress.city ||
        !shippingAddress.house ||
        !shippingAddress.area
      ) {
        toast.error("Please fill all required address fields");

        return;
      }
      setPlacingOrder(true);
      const res = await axios.post("/orders/place", {
        shippingAddress,
        paymentMethod,
        couponCode: discountData.code || "",
        discountPercentage: discountData.discountPercentage || 0,
        discountAmount: discountData.discountAmount || 0,
        finalPrice: finalTotal,
      });

      if (!res.data.success) return;
      if (paymentMethod === "COD") {
        toast.success("Order placed successfully");
        await getCart();
        navigate("/orders");
        return;
      }

      // online flow
      const razorpayRes = await axios.post("/orders/razorpay/create-order", {
        orderId: res.data.orderId,
      });

      const options = {
        key: razorpayRes.data.key,
        amount: razorpayRes.data.razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayRes.data.razorpayOrder.id,

        name: "Delhi Shoes",

        handler: async function (response) {
          const verifyRes = await axios.post("/orders/razorpay/verify", {
            orderId: res.data.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
          });

          if (verifyRes.data.success) {
            toast.success("Payment Successful");
            await getCart();
            navigate("/orders");
          }
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 lg:px-16 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* SHIPPING */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Shipping Address</h2>

                  <p className="text-sm text-gray-500">
                    Your saved delivery address
                  </p>
                </div>
              </div>

              {/* EDIT ADDRESS */}
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Edit Address
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                value={shippingAddress.fullName}
                readOnly
                placeholder="Full Name"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.phone}
                readOnly
                placeholder="Phone Number"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.pincode}
                readOnly
                placeholder="Pincode"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.state}
                readOnly
                placeholder="State"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.city}
                readOnly
                placeholder="City"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.house}
                readOnly
                placeholder="House / Flat / Building"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.area}
                readOnly
                placeholder="Area / Street"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="text"
                value={shippingAddress.landmark}
                readOnly
                placeholder="Landmark"
                className="border rounded-2xl px-4 py-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center">
                <FaMoneyBillWave className="text-orange-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold">Payment Method</h2>

                <p className="text-sm text-gray-500">
                  Select your payment option
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* COD */}
              <label
                className={`border rounded-2xl p-5 flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaMoneyBillWave className="text-2xl text-green-600" />

                  <div>
                    <h3 className="font-semibold">Cash On Delivery</h3>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
              </label>

              {/* ONLINE */}
              <label
                className={`border rounded-2xl p-5 flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === "ONLINE"
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaCreditCard className="text-2xl text-indigo-600" />

                  <div>
                    <h3 className="font-semibold">Online Payment</h3>

                    <p className="text-sm text-gray-500">
                      UPI, Cards, Net Banking
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* PRODUCTS */}
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
              {cart?.items?.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item?.image?.url || "https://via.placeholder.com/300"}
                    alt={item?.title}
                    className="w-20 h-24 object-cover rounded-2xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>

                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}

                    {item.color && (
                      <p className="text-sm text-gray-500">
                        Color: {item.color}
                      </p>
                    )}

                    <p className="font-bold mt-2">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* PRICE DETAILS */}
            <div className="border-t mt-6 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart?.totalItems} items)</span>

                <span>₹{cart?.totalPrice}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span className="text-green-600">FREE</span>
              </div>
              <div>
                {discountData.applied && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon ({discountData.code})</span>

                    <span>- ₹{discountData.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-bold border-t pt-4">
                  <span>Total</span>

                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full mt-7 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-60"
            >
              {placingOrder ? (
                "Placing Order..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaCheckCircle />
                  Place Order
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

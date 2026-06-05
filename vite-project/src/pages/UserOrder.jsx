import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "../services/axios";

import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

import Loader from "../components/Loaders";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET USER ORDERS
  // =========================

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "/orders/my-orders"
      );

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // =========================
  // ORDER STATUS UI
  // =========================

  const getStatusUI = (status) => {
    switch (status) {
      case "processing":
        return {
          color:
            "bg-yellow-100 text-yellow-700",
          icon: <FaBoxOpen />,
          text: "Processing",
        };

      case "confirmed":
        return {
          color:
            "bg-blue-100 text-blue-700",
          icon: <FaCheckCircle />,
          text: "Confirmed",
        };

      case "shipped":
        return {
          color:
            "bg-indigo-100 text-indigo-700",
          icon: <FaTruck />,
          text: "Shipped",
        };

      case "out_for_delivery":
        return {
          color:
            "bg-purple-100 text-purple-700",
          icon: <FaTruck />,
          text: "Out For Delivery",
        };

      case "delivered":
        return {
          color:
            "bg-green-100 text-green-700",
          icon: <FaCheckCircle />,
          text: "Delivered",
        };

      case "cancelled":
        return {
          color:
            "bg-red-100 text-red-700",
          icon: <FaTimesCircle />,
          text: "Cancelled",
        };

      default:
        return {
          color:
            "bg-gray-100 text-gray-700",
          icon: <FaBoxOpen />,
          text: status,
        };
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 md:px-10 lg:px-16 py-10">
      {/* PAGE HEADER */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[4px] text-gray-400 font-semibold">
          My Orders
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Order History
        </h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Track your orders and view all
          purchased items.
        </p>
      </div>

      {/* EMPTY ORDERS */}
      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <FaBoxOpen className="text-4xl text-gray-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3 max-w-md">
            Looks like you haven’t placed
            any orders yet. Start shopping
            and your orders will appear
            here.
          </p>

          <Link
            to="/shop"
            className="mt-7 bg-black text-white px-7 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-7">
          {orders.map((order) => {
            const status =
              getStatusUI(
                order.orderStatus
              );

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* TOP BAR */}
                <div className="border-b border-gray-100 px-5 md:px-7 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* LEFT */}
                  <div>
                    <p className="text-xs uppercase tracking-[3px] text-gray-400 font-semibold">
                      Order ID
                    </p>

                    <h2 className="font-bold text-gray-900 mt-1 break-all">
                      #{order._id}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      Placed on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* STATUS */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}
                    >
                      {status.icon}
                      {status.text}
                    </div>

                    {/* TOTAL */}
                    <div className="bg-gray-100 px-5 py-2 rounded-full">
                      <span className="text-sm text-gray-500">
                        Total :
                      </span>

                      <span className="ml-2 font-bold text-gray-900">
                        ₹
                        {order.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ORDER BODY */}
                <div className="p-5 md:p-7">
                  {/* PRODUCTS */}
                  <div className="space-y-5">
                    {order.items.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-5 border border-gray-100 rounded-2xl p-4 hover:border-gray-300 transition-all duration-300"
                        >
                          {/* IMAGE */}
                          <div className="w-full sm:w-28 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                            <img
                              src={
                                item
                                  ?.images?.[0]
                                  ?.url
                              }
                              alt={
                                item?.title
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* INFO */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                {
                                  item.title
                                }
                              </h3>

                              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                <p>
                                  Qty :{" "}
                                  <span className="font-medium text-gray-800">
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </p>

                                {item.size && (
                                  <p>
                                    Size :{" "}
                                    <span className="font-medium text-gray-800">
                                      {
                                        item.size
                                      }
                                    </span>
                                  </p>
                                )}

                                {item.color && (
                                  <p>
                                    Color :{" "}
                                    <span className="font-medium text-gray-800 capitalize">
                                      {
                                        item.color
                                      }
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* PRICE */}
                            <div className="mt-4 flex items-center justify-between">
                              <p className="text-2xl font-bold text-black">
                                ₹
                                {
                                  item.price
                                }
                              </p>

                              <Link
                                to={`/orders/${order._id}`}
                                className="flex items-center gap-2 text-sm font-semibold text-black hover:gap-3 transition-all duration-300"
                              >
                                View Details
                                <FaChevronRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* FOOTER INFO */}
                  <div className="grid md:grid-cols-2 gap-5 mt-7">
                    {/* ADDRESS */}
                    <div className="border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-gray-700" />

                        <h3 className="font-semibold text-gray-900">
                          Delivery Address
                        </h3>
                      </div>

                      <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                        <p className="font-semibold text-gray-800">
                          {
                            order
                              ?.shippingAddress
                              ?.fullName
                          }
                        </p>

                        <p>
                          {
                            order
                              ?.shippingAddress
                              ?.house
                          }
                          ,{" "}
                          {
                            order
                              ?.shippingAddress
                              ?.area
                          }
                        </p>

                        <p>
                          {
                            order
                              ?.shippingAddress
                              ?.city
                          }
                          ,{" "}
                          {
                            order
                              ?.shippingAddress
                              ?.state
                          }{" "}
                          -{" "}
                          {
                            order
                              ?.shippingAddress
                              ?.pincode
                          }
                        </p>

                        <p>
                          Phone :{" "}
                          {
                            order
                              ?.shippingAddress
                              ?.phone
                          }
                        </p>
                      </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <FaCreditCard className="text-gray-700" />

                        <h3 className="font-semibold text-gray-900">
                          Payment Details
                        </h3>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">
                            Payment Method
                          </span>

                          <span className="font-semibold text-gray-900">
                            {
                              order.paymentMethod
                            }
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">
                            Payment Status
                          </span>

                          <span
                            className={`font-semibold capitalize ${
                              order.paymentStatus ===
                              "paid"
                                ? "text-green-600"
                                : "text-orange-500"
                            }`}
                          >
                            {
                              order.paymentStatus
                            }
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">
                            Total Items
                          </span>

                          <span className="font-semibold text-gray-900">
                            {
                              order.totalItems
                            }
                          </span>
                        </div>

                        <div className="border-t pt-3 flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            Total Amount
                          </span>

                          <span className="text-xl font-bold text-black">
                            ₹
                            {
                              order.totalPrice
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrder;
import { useEffect, useState } from "react";
import axios from "../services/axios";

const ORDER_STATUS = {
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },

  confirmed: {
    label: "Confirmed",
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },

  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },

  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },

  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },

  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

const PAYMENT_STATUS = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },

  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700",
  },

  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "/orders/admin/all"
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE ORDER STATUS
  const handleStatusChange = async (
    orderId,
    orderStatus
  ) => {
    try {
      await axios.put(
        `/orders/admin/update/${orderId}`,
        {
          orderStatus,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.log(error);
      alert("Error updating order status");
    }
  };

  // UPDATE PAYMENT STATUS
  const handlePaymentStatusChange =
    async (
      orderId,
      paymentStatus
    ) => {
      try {
        await axios.put(
          `/orders/admin/update/${orderId}`,
          {
            paymentStatus,
          }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  paymentStatus,
                }
              : order
          )
        );
      } catch (error) {
        console.log(error);
        alert(
          "Error updating payment status"
        );
      }
    };

  // FILTER
  const filtered = orders.filter(
    (order) => {
      const matchSearch =
        order._id
          ?.slice(-6)
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        order.user?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchStatus =
        filterStatus
          ? order.orderStatus ===
            filterStatus
          : true;

      return (
        matchSearch && matchStatus
      );
    }
  );

  const totalRevenue =
    orders.reduce(
      (acc, order) =>
        acc +
        (order.totalPrice || 0),
      0
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-10">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500 mb-2">
          Admin Panel
        </p>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900">
          Orders
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          {orders.length} Orders · ₹
          {totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-7">

        <input
          type="text"
          placeholder="Search by order id or customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm outline-none focus:border-black"
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
          className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none"
        >
          <option value="">
            All Orders
          </option>

          <option value="processing">
            Processing
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="out_for_delivery">
            Out for Delivery
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      {/* ORDERS */}
      <div className="space-y-5">

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading Orders...
          </div>
        )}

        {!loading &&
          filtered.map((order) => {
            const orderCfg =
              ORDER_STATUS[
                order.orderStatus
              ];

            const paymentCfg =
              PAYMENT_STATUS[
                order.paymentStatus
              ];

            const isExpanded =
              expandedId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >

                {/* TOP */}
                <div
                  onClick={() =>
                    setExpandedId(
                      isExpanded
                        ? null
                        : order._id
                    )
                  }
                  className="p-5 cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}
                    <div>
                      <p className="text-xs font-mono font-bold text-gray-500 mb-2">
                        ORDER ID
                      </p>

                      <h2 className="text-lg font-black text-gray-900">
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </h2>

                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* USER */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                        Customer
                      </p>

                      <h3 className="font-bold text-gray-900">
                        {
                          order.user
                            ?.name
                        }
                      </h3>

                      <p className="text-sm text-gray-500">
                        {
                          order.user
                            ?.email
                        }
                      </p>
                    </div>

                    {/* TOTAL */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                        Amount
                      </p>

                      <h3 className="text-2xl font-black text-black">
                        ₹
                        {Number(
                          order.totalPrice
                        ).toLocaleString()}
                      </h3>
                    </div>

                    {/* ORDER STATUS */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                        Order Status
                      </p>

                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${orderCfg?.color}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${orderCfg?.dot}`}
                        />

                        {
                          orderCfg?.label
                        }
                      </span>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                        Payment
                      </p>

                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold ${paymentCfg?.color}`}
                      >
                        {
                          paymentCfg?.label
                        }
                      </span>
                    </div>

                  </div>
                </div>

                {/* DETAILS */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 space-y-7">

                    {/* PRODUCTS */}
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
                        Ordered Products
                      </h3>

                      <div className="space-y-4">

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="flex gap-4 border border-gray-100 rounded-2xl p-4"
                            >

                              <img
                                src={
                                  item
                                    ?.images?.[0]
                                    ?.url
                                }
                                alt=""
                                className="w-20 h-20 rounded-xl object-cover border"
                              />

                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">
                                  {
                                    item.title
                                  }
                                </h4>

                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                  <span>
                                    Qty:
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <span>
                                    Size:
                                    {
                                      item.size ||
                                      "—"
                                    }
                                  </span>

                                  <span>
                                    Color:
                                    {
                                      item.color ||
                                      "—"
                                    }
                                  </span>
                                </div>

                                <p className="text-lg font-black text-black mt-3">
                                  ₹
                                  {
                                    item.price
                                  }
                                </p>
                              </div>

                            </div>
                          )
                        )}

                      </div>
                    </div>

                    {/* FULL ADDRESS */}
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
                        Shipping Address
                      </h3>

                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

                        <p className="font-bold text-gray-900 text-lg">
                          {
                            order
                              .shippingAddress
                              ?.fullName
                          }
                        </p>

                        <p className="text-gray-600 mt-2">
                          {
                            order
                              .shippingAddress
                              ?.house
                          }
                          ,{" "}
                          {
                            order
                              .shippingAddress
                              ?.area
                          }
                        </p>

                        <p className="text-gray-600">
                          {
                            order
                              .shippingAddress
                              ?.city
                          }
                          ,{" "}
                          {
                            order
                              .shippingAddress
                              ?.state
                          }{" "}
                          -{" "}
                          {
                            order
                              .shippingAddress
                              ?.pincode
                          }
                        </p>

                        <p className="text-gray-600 mt-1">
                          Landmark:{" "}
                          {order
                            .shippingAddress
                            ?.landmark ||
                            "—"}
                        </p>

                        <p className="text-gray-900 font-semibold mt-3">
                          📞{" "}
                          {
                            order
                              .shippingAddress
                              ?.phone
                          }
                        </p>

                      </div>
                    </div>

                    {/* UPDATE SECTION */}
                    <div className="grid md:grid-cols-2 gap-5">

                      {/* ORDER STATUS */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Update Order Status
                        </label>

                        <select
                          value={
                            order.orderStatus
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-black"
                        >
                          <option value="processing">
                            Processing
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="out_for_delivery">
                            Out for Delivery
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                      </div>

                      {/* PAYMENT STATUS */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Update Payment Status
                        </label>

                        <select
                          value={
                            order.paymentStatus
                          }
                          onChange={(e) =>
                            handlePaymentStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-black"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="paid">
                            Paid
                          </option>

                          <option value="failed">
                            Failed
                          </option>
                        </select>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })}

      </div>
    </div>
  );
};

export default Orders;
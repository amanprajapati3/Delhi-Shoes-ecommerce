import { useEffect, useState } from "react";
import axios from "../services/axios";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaRupeeSign,
  FaArrowUp,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const DashboardHome = () => {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    });

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [
    lowStockProducts,
    setLowStockProducts,
  ] = useState([]);

  const [salesData, setSalesData] =
    useState([]);

  // FETCH DASHBOARD DATA
  const fetchDashboardData =
    async () => {
      try {
        setLoading(true);

        const [
          productsRes,
          ordersRes,
        ] = await Promise.all([
          axios.get(
            "/products/all"
          ),

          axios.get(
            "/orders/admin/all"
          ),
        ]);

        const products =
          productsRes.data
            .products || [];

        const orders =
          ordersRes.data.orders ||
          [];

        // TOTAL REVENUE
        const totalRevenue =
          orders.reduce(
            (acc, order) =>
              acc +
              (order.totalPrice ||
                0),
            0
          );

        // RECENT ORDERS
        const latestOrders = [
          ...orders,
        ]
          .reverse()
          .slice(0, 5);

        setRecentOrders(
          latestOrders
        );

        // LOW STOC

        const lowStock =
          products.filter(
            (product) =>
              product.variants?.some(
                (variant) =>
                  variant.stock <= 5
              )
          );

        setLowStockProducts(
          lowStock
        );

        // SALES CHART
        const monthlySales =
          {};

        orders.forEach((order) => {
          const date =
            new Date(
              order.createdAt
            );

          const month =
            date.toLocaleString(
              "en-US",
              {
                month: "short",
              }
            );

          if (
            !monthlySales[month]
          ) {
            monthlySales[
              month
            ] = 0;
          }

          monthlySales[
            month
          ] +=
            order.totalPrice || 0;
        });

        const chartData =
          Object.keys(
            monthlySales
          ).map((month) => ({
            month,

            sales:
              monthlySales[
                month
              ],
          }));

        setSalesData(chartData);

        // STATS
        setStats({
          totalProducts:
            products.length,

          totalOrders:
            orders.length,

          totalRevenue,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <p className="text-sm uppercase tracking-[4px] text-gray-400 font-semibold">
            Admin Dashboard
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">
            Store Overview
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Monitor products,
            orders and revenue.
          </p>
        </div>

        <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 w-fit">
          <FaArrowUp />
          Business Growing
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        <StatCard
          title="Total Products"
          value={
            stats.totalProducts
          }
          icon={<FaBoxOpen />}
          color="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Total Orders"
          value={
            stats.totalOrders
          }
          icon={
            <FaShoppingBag />
          }
          color="from-purple-500 to-pink-500"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={
            <FaRupeeSign />
          }
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* CHART + LOW STOCK */}

      <div className="grid xl:grid-cols-3 gap-6">

        {/* CHART */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Revenue Analytics
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Monthly sales
              overview
            </p>
          </div>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={salesData}
              >
                <defs>
                  <linearGradient
                    id="colorSales"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#000"
                      stopOpacity={
                        0.3
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#000"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>

                <XAxis dataKey="month" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#000"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <FaExclamationTriangle />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Low Stock
              </h2>

              <p className="text-sm text-gray-500">
                Products running
                low
              </p>
            </div>
          </div>

          <div className="space-y-4">

            {lowStockProducts.length ===
            0 ? (
              <p className="text-sm text-gray-500">
                No low stock
                products.
              </p>
            ) : (
              lowStockProducts.map(
                (product) => (
                  <div
                    key={
                      product._id
                    }
                    className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3"
                  >
                    <img
                      src={
                        product
                          ?.images?.[0]
                          ?.url
                      }
                      alt={
                        product.title
                      }
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {
                          product.title
                        }
                      </h3>

                      <p className="text-xs text-red-500 mt-1">
                        Low Stock
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm overflow-x-auto">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest customer
            orders
          </p>
        </div>

        <table className="w-full min-w-[700px]">

          <thead>
            <tr className="text-left border-b border-gray-100">

              <th className="pb-4 text-sm text-gray-500 font-medium">
                Order ID
              </th>

              <th className="pb-4 text-sm text-gray-500 font-medium">
                Customer
              </th>

              <th className="pb-4 text-sm text-gray-500 font-medium">
                Amount
              </th>

              <th className="pb-4 text-sm text-gray-500 font-medium">
                Status
              </th>

              <th className="pb-4 text-sm text-gray-500 font-medium">
                Date
              </th>
            </tr>
          </thead>

          <tbody>

            {recentOrders.map(
              (order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-all"
                >
                  <td className="py-4 font-semibold text-sm">
                    #
                    {order._id.slice(
                      -6
                    )}
                  </td>

                  <td className="py-4 text-sm">
                    {
                      order
                        ?.shippingAddress
                        ?.fullName
                    }
                  </td>

                  <td className="py-4 font-bold text-sm">
                    ₹
                    {
                      order.totalPrice
                    }
                  </td>

                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600 capitalize">
                      {
                        order.orderStatus
                      }
                    </span>
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// STAT CARD
const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-white/70 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-black mt-3">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
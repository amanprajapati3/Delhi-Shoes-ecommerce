import { useEffect, useState } from "react";
import axios from "../services/axios";
import { toast } from "react-hot-toast";

const Setting = () => {
  const [loading, setLoading] = useState(false);

  // =========================
  // ANNOUNCEMENT STATE
  // =========================

  const [announcement, setAnnouncement] = useState({
    text: "",
    isActive: true,
    backgroundColor: "#111111",
    textColor: "#ffffff",
    speed: 10,
  });

  // =========================
  // COUPON STATE
  // =========================

  const [coupon, setCoupon] = useState({
    code: "",
    discountPercent: 0,
    minPurchaseAmount: 0,
    minProductQuantity: 1,
    usageLimit: 0,
    expiryDate: "",
  });

  // =========================
  // FETCH SETTINGS
  // =========================

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // FETCH ANNOUNCEMENT
      const announcementRes = await axios.get(
        "/setting/announcement"
      );

      if (announcementRes.data.announcement) {
        setAnnouncement(
          announcementRes.data.announcement
        );
      }

      // FETCH COUPON
      const couponRes = await axios.get(
        "/setting/coupons"
      );

      if (couponRes.data.coupons) {
        const data = couponRes.data.coupons;

        setCoupon({
          code: data.code || "",
          discountPercent:
            data.discountPercentage || 0,

          minPurchaseAmount:
            data.minimumPurchaseAmount || 0,

          minProductQuantity:
            data.minimumProductQuantity || 1,

          usageLimit:
            data.usageLimit || 0,

          expiryDate: data.expiryDate
            ? data.expiryDate.split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =========================
  // SAVE ANNOUNCEMENT
  // =========================

  const saveAnnouncement = async () => {
    try {
      setLoading(true);

      await axios.put(
        "/setting/announcement",
        announcement
      );

      toast.success(
        "Announcement updated"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update announcement"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE COUPON
  // =========================

  const saveCoupon = async () => {
    try {
      setLoading(true);

      await axios.post(
        "/setting/coupon",
        coupon
      );

      toast.success("Coupon saved");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Website Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage announcement bar &
            coupon discounts
          </p>
        </div>

        {/* ANNOUNCEMENT */}

        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 transition-all duration-300 hover:shadow-md">

          <h2 className="text-2xl font-semibold mb-6">
            Announcement Bar
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* TEXT */}

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Announcement Text
              </label>

              <input
                type="text"
                value={announcement.text}
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    text: e.target.value,
                  })
                }
                placeholder="Enter announcement..."
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* SPEED */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Scroll Speed
              </label>

              <input
                type="number"
                value={announcement.speed}
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    speed: Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* ACTIVE */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Active
              </label>

              <select
                value={announcement.isActive}
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    isActive:
                      e.target.value === "true",
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              >
                <option value={true}>
                  Enabled
                </option>

                <option value={false}>
                  Disabled
                </option>
              </select>
            </div>

            {/* BG COLOR */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Background Color
              </label>

              <input
                type="color"
                value={
                  announcement.backgroundColor
                }
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    backgroundColor:
                      e.target.value,
                  })
                }
                className="w-full h-14 border rounded-xl cursor-pointer"
              />
            </div>

            {/* TEXT COLOR */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Text Color
              </label>

              <input
                type="color"
                value={announcement.textColor}
                onChange={(e) =>
                  setAnnouncement({
                    ...announcement,
                    textColor:
                      e.target.value,
                  })
                }
                className="w-full h-14 border rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={saveAnnouncement}
            disabled={loading}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:scale-[1.02] transition-all duration-300"
          >
            Save Announcement
          </button>
        </div>

        {/* COUPON */}

        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 transition-all duration-300 hover:shadow-md">

          <h2 className="text-2xl font-semibold mb-6">
            Coupon Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* CODE */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Coupon Code
              </label>

              <input
                type="text"
                value={coupon.code}
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    code: e.target.value,
                  })
                }
                placeholder="WELCOME10"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition uppercase"
              />
            </div>

            {/* DISCOUNT */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Discount %
              </label>

              <input
                type="number"
                value={
                  coupon.discountPercent
                }
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    discountPercent:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* MIN PURCHASE */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Minimum Purchase Amount
              </label>

              <input
                type="number"
                value={
                  coupon.minPurchaseAmount
                }
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    minPurchaseAmount:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* MIN QTY */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Minimum Product Quantity
              </label>

              <input
                type="number"
                value={
                  coupon.minProductQuantity
                }
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    minProductQuantity:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* USAGE */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Usage Limit
              </label>

              <input
                type="number"
                value={coupon.usageLimit}
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    usageLimit:
                      Number(e.target.value),
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* EXPIRY */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Expiry Date
              </label>

              <input
                type="date"
                value={coupon.expiryDate}
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    expiryDate:
                      e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          <button
            onClick={saveCoupon}
            disabled={loading}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:scale-[1.02] transition-all duration-300"
          >
            Save Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
import { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCamera,
  FaSave,
  FaUser,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loaders";
import axios from "../services/axios";
import { toast } from "react-hot-toast";

// ─── Reusable Field ───────────────────────────────────────────────
const Field = ({ label, icon: Icon, disabled, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold tracking-widest uppercase text-slate-400">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
      )}
      <input
        disabled={disabled}
        className={`
          w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none
          transition-all duration-300 ease-out
          ${Icon ? "pl-11" : ""}
          ${
            disabled
              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-default"
              : "bg-white border-slate-200 text-slate-800 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm"
          }
          ${className}
        `}
        {...props}
      />
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/80 p-7 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────
const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    user?.images?.[0]?.url || "",
  );
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    // FIX: renamed key to avoid collision with address.phone
    mobilePhone: user?.phone || "",
    address: {
      fullName: user?.address?.fullName || "",
      phone: user?.address?.phone || "",
      pincode: user?.address?.pincode || "",
      state: user?.address?.state || "",
      city: user?.address?.city || "",
      house: user?.address?.house || "",
      area: user?.address?.area || "",
      landmark: user?.address?.landmark || "",
    },
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        mobilePhone: user?.phone || "",
        address: {
          fullName: user?.address?.fullName || "",
          phone: user?.address?.phone || "",
          pincode: user?.address?.pincode || "",
          state: user?.address?.state || "",
          city: user?.address?.city || "",
          house: user?.address?.house || "",
          area: user?.address?.area || "",
          landmark: user?.address?.landmark || "",
        },
      });
      setImagePreview(user?.images?.[0]?.url || "");
    }
  }, [user]);

  // ── Handlers ────────────────────────────────────────────────────

  const ADDRESS_FIELDS = [
    "fullName",
    "pincode",
    "state",
    "city",
    "house",
    "area",
    "landmark",
    "addressPhone",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "addressPhone") {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, phone: value },
      }));
    } else if (ADDRESS_FIELDS.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setEditMode(false);
    // reset preview if changed but not saved
    setImagePreview(user?.images?.[0]?.url || "");
    setImage(null);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      mobilePhone: user?.phone || "",
      address: {
        fullName: user?.address?.fullName || "",
        phone: user?.address?.phone || "",
        pincode: user?.address?.pincode || "",
        state: user?.address?.state || "",
        city: user?.address?.city || "",
        house: user?.address?.house || "",
        area: user?.address?.area || "",
        landmark: user?.address?.landmark || "",
      },
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      // BASIC INFO
      data.append("name", formData.name);
      data.append("phone", formData.mobilePhone);
      // ADDRESS
      data.append("fullName", formData.address.fullName);
      data.append("addressPhone", formData.address.phone);
      data.append("pincode", formData.address.pincode);
      data.append("state", formData.address.state);
      data.append("city", formData.address.city);
      data.append("house", formData.address.house);
      data.append("area", formData.address.area);
      data.append("landmark", formData.address.landmark);
      // PROFILE IMAGE
      if (image) {
        data.append("profileImage", image);
      }

      const res = await axios.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setUser(res.data.user);
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 md:px-10 lg:px-16 py-10 font-[system-ui]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400 mb-1">
            Account
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your personal details and delivery address
          </p>
        </div>

        {/* Edit / Cancel toggle in header on desktop */}
        <button
          onClick={editMode ? handleCancel : () => setEditMode(true)}
          className={`
            hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold
            transition-all duration-300 ease-out
            ${
              editMode
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200"
            }
          `}
        >
          {editMode ? <FaTimes /> : <FaUserEdit />}
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-7">
        {/* ── LEFT: Profile Card ───────────────────────────────── */}
        <div className="space-y-5">
          <Card className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative group">
              <div
                className={`
                w-28 h-28 rounded-full ring-4 overflow-hidden
                transition-all duration-500
                ${editMode ? "ring-indigo-400 ring-offset-4" : "ring-slate-100"}
              `}
              >
                <img
                  src={
                    imagePreview ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {editMode && (
                <label
                  className="
                  absolute -bottom-1 -right-1 w-9 h-9 rounded-full
                  bg-indigo-600 text-white flex items-center justify-center
                  cursor-pointer shadow-lg shadow-indigo-200
                  hover:bg-indigo-700 hover:scale-110
                  transition-all duration-200
                "
                >
                  <FaCamera className="text-xs" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              )}
            </div>

            {/* Name & Email */}
            <h2 className="text-xl font-bold text-slate-800 mt-5">
              {user?.name}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>

            {/* Phone pill */}
            <div className="mt-4 flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-sm text-slate-600 font-medium">
              <FaPhoneAlt className="text-indigo-400 text-xs" />
              {user?.phone || "No phone added"}
            </div>

            {/* Mobile edit toggle */}
            <button
              onClick={editMode ? handleCancel : () => setEditMode(true)}
              className={`
                md:hidden w-full mt-6 py-3 rounded-2xl flex items-center justify-center gap-2
                text-sm font-semibold transition-all duration-300
                ${
                  editMode
                    ? "bg-slate-100 text-slate-600"
                    : "bg-slate-900 text-white hover:bg-indigo-600"
                }
              `}
            >
              {editMode ? <FaTimes /> : <FaUserEdit />}
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </button>
          </Card>

          {/* Stats / info chip card */}
          <Card className="space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-300">
              Quick Info
            </p>
            {[
              { icon: FaUser, label: "Member since", val: "2024" },
              {
                icon: FaEnvelope,
                label: "Email",
                val: user?.email?.split("@")[0] + "…",
              },
              {
                icon: FaMapMarkerAlt,
                label: "City",
                val: user?.address?.city || "—",
              },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Icon className="text-indigo-400 text-xs" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{val}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ── RIGHT: Forms ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-7">
          {/* Personal Info */}
          <Card>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FaUser className="text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h2>
                <p className="text-xs text-slate-400">
                  Your basic profile details
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Your full name"
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                icon={FaEnvelope}
                value={formData.email}
                disabled // email always locked
                placeholder="your@email.com"
              />
              {/* FIX: name is "mobilePhone" so it won't clash with address.phone */}
              <Field
                label="Mobile Number"
                name="mobilePhone"
                type="tel"
                icon={FaPhoneAlt}
                value={formData.mobilePhone}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="+91 00000 00000"
              />
            </div>
          </Card>

          {/* Delivery Address */}
          <Card>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Delivery Address
                </h2>
                <p className="text-xs text-slate-400">
                  Where your orders will be sent
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                name="fullName"
                type="text"
                placeholder="Recipient Full Name"
                value={formData.address.fullName}
                onChange={handleChange}
                disabled={!editMode}
                label="Full Name"
              />
              {/* FIX: name="addressPhone" so handleChange routes to address.phone */}
              <Field
                name="addressPhone"
                type="tel"
                placeholder="Contact Number"
                value={formData.address.phone}
                onChange={handleChange}
                disabled={!editMode}
                label="Phone"
                icon={FaPhoneAlt}
              />
              <Field
                name="pincode"
                type="text"
                placeholder="PIN Code"
                value={formData.address.pincode}
                onChange={handleChange}
                disabled={!editMode}
                label="Pincode"
              />
              <Field
                name="state"
                type="text"
                placeholder="State"
                value={formData.address.state}
                onChange={handleChange}
                disabled={!editMode}
                label="State"
              />
              <Field
                name="city"
                type="text"
                placeholder="City"
                value={formData.address.city}
                onChange={handleChange}
                disabled={!editMode}
                label="City"
              />
              <Field
                name="house"
                type="text"
                placeholder="House / Flat / Building No."
                value={formData.address.house}
                onChange={handleChange}
                disabled={!editMode}
                label="House / Flat"
              />
              <Field
                name="area"
                type="text"
                placeholder="Area / Street / Colony"
                value={formData.address.area}
                onChange={handleChange}
                disabled={!editMode}
                label="Area / Street"
              />
              <Field
                name="landmark"
                type="text"
                placeholder="Nearby Landmark"
                value={formData.address.landmark}
                onChange={handleChange}
                disabled={!editMode}
                label="Landmark"
              />
            </div>

            {/* Save Button */}
            <div
              className={`
                overflow-hidden transition-all duration-500 ease-out
                ${editMode ? "max-h-24 opacity-100 mt-8" : "max-h-0 opacity-0 mt-0"}
              `}
            >
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="
                  flex items-center gap-2.5 px-8 py-3.5 rounded-2xl
                  bg-slate-900 text-white font-semibold text-sm
                  hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200
                  active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-300 ease-out
                "
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";

import axios from "../services/axios";

import {
  FaUserShield,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaCamera,
} from "react-icons/fa";

const AdminProfile = () => {
  const [admin, setAdmin] =
    useState(null);
  const [loading, setLoading] =
    useState(true);
  const [editMode, setEditMode] =
    useState(false);
  const [saving, setSaving] =
    useState(false)
  const [image, setImage] =
    useState(null);
  const [preview, setPreview] =
    useState("");
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",

      address: {
        fullName: "",
        phone: "",
        house: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      },
    });

  // =========================
  // FETCH PROFILE
  // =========================

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "/auth/profile"
      );
      const user = res.data.user;
      setAdmin(user);
      setPreview(
        user?.images?.[0]?.url || ""
      );
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",

        address: {
          fullName:
            user?.address?.fullName ||
            "",
          phone:
            user?.address?.phone || "",
          house:
            user?.address?.house || "",
          area:
            user?.address?.area || "",
          city:
            user?.address?.city || "",
          state:
            user?.address?.state || "",
          pincode:
            user?.address?.pincode ||
            "",
          landmark:
            user?.address?.landmark ||
            "",
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // ADDRESS CHANGE
  // =========================

  const handleAddressChange = (
    e
  ) => {
    setFormData({
      ...formData,

      address: {
        ...formData.address,

        [e.target.name]:
          e.target.value,
      },
    });
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (
    e
  ) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

const handleUpdate = async () => {
  try {
    setSaving(true);
    const data = new FormData();
    // BASIC INFO
    data.append(
      "name",
      formData.name
    );

    data.append(
      "phone",
      formData.phone
    );

    // ADDRESS INFO
    data.append(
      "fullName",
      formData.address.fullName
    );

    data.append(
      "addressPhone",
      formData.address.phone
    );

    data.append(
      "pincode",
      formData.address.pincode
    );

    data.append(
      "state",
      formData.address.state
    );

    data.append(
      "city",
      formData.address.city
    );

    data.append(
      "house",
      formData.address.house
    );

    data.append(
      "area",
      formData.address.area
    );

    data.append(
      "landmark",
      formData.address.landmark
    );

    // IMAGE
    if (image) {
      data.append(
        "profileImage",
        image
      );
    }

    const res = await axios.put(
      "/auth/update-profile",
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    setAdmin(res.data.user);

    setEditMode(false);

    alert(
      "Profile updated successfully"
    );

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data
        ?.message ||
        "Error updating profile"
    );

  } finally {
    setSaving(false);
  }
};

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <p className="text-xs uppercase tracking-[4px] text-gray-400 font-semibold">
            Admin Panel
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">
            Profile Settings
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Manage your admin details
            and shipping address.
          </p>
        </div>

        {!editMode ? (
          <button
            onClick={() =>
              setEditMode(true)
            }
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-[1.02]"
          >
            <FaEdit />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:scale-[1.02]"
          >
            <FaSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-[30px] border border-gray-200 overflow-hidden shadow-sm">

        {/* TOP */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-gray-800 px-6 md:px-10 py-10">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* IMAGE */}
            <div className="relative w-28 h-28">

              <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden shadow-xl">

                {preview ? (
                  <img
                    src={preview}
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserShield className="text-5xl text-white" />
                )}
              </div>

              {/* CAMERA BUTTON */}
              {editMode && (
                <>
                  <label
                    htmlFor="admin-image"
                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg border-2 border-white"
                  >
                    <FaCamera />
                  </label>

                  <input
                    type="file"
                    id="admin-image"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    hidden
                  />
                </>
              )}
            </div>

            {/* INFO */}
            <div className="text-white flex-1">

              <h2 className="text-3xl font-black">
                {admin?.name ||
                  "Admin"}
              </h2>

              <p className="text-white/70 mt-1">
                Administrator
              </p>

              <div className="flex flex-wrap gap-5 mt-5 text-sm">

                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  {admin?.email}
                </div>

                <div className="flex items-center gap-2">
                  <FaPhoneAlt />
                  {admin?.phone ||
                    "No phone"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-8 lg:p-10 grid lg:grid-cols-2 gap-8">

          {/* PERSONAL DETAILS */}
          <div className="border border-gray-200 rounded-3xl p-6 bg-gray-50">

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Personal Details
            </h3>

            <div className="space-y-5">

              <div>
                <label className="label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={
                    handleChange
                  }
                  disabled={!editMode}
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="label">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={
                    handleChange
                  }
                  disabled={!editMode}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="border border-gray-200 rounded-3xl p-6 bg-gray-50">

            <div className="flex items-center gap-3 mb-6">
              <FaMapMarkerAlt className="text-gray-700" />

              <h3 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={
                  formData.address
                    .fullName
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={
                  formData.address
                    .phone
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />

              <input
                type="text"
                name="house"
                placeholder="House / Flat"
                value={
                  formData.address
                    .house
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input sm:col-span-2"
              />

              <input
                type="text"
                name="area"
                placeholder="Area / Street"
                value={
                  formData.address
                    .area
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input sm:col-span-2"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={
                  formData.address
                    .city
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={
                  formData.address
                    .state
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={
                  formData.address
                    .pincode
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />

              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={
                  formData.address
                    .landmark
                }
                onChange={
                  handleAddressChange
                }
                disabled={!editMode}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          .input{
            width:100%;
            border:1px solid #e5e7eb;
            border-radius:18px;
            padding:14px 16px;
            background:white;
            transition:0.3s;
            outline:none;
          }

          .input:focus{
            border-color:black;
          }

          .input:disabled{
            background:#f3f4f6;
            cursor:not-allowed;
          }

          .label{
            display:block;
            margin-bottom:8px;
            font-size:14px;
            font-weight:600;
            color:#4b5563;
          }
        `}
      </style>
    </div>
  );
};

export default AdminProfile;
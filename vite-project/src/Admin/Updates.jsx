import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "../services/axios";

import {
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaImage,
  FaBoxOpen,
} from "react-icons/fa";

const Updates = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      price: "",
      discountPrice: "",
      gender: "",
      collection: "",
      category: "",
      brand: "",
      isFeatured: "false",
    });

  const [variants, setVariants] =
    useState([]);

  const [oldImages, setOldImages] =
    useState([]);

  const [newImages, setNewImages] =
    useState([]);

  // =====================================
  // FETCH PRODUCT
  // =====================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `/products/${id}`
        );

        const product =
          res.data.product;

        setFormData({
          title:
            product.title || "",

          description:
            product.description ||
            "",

          price:
            product.price || "",

          discountPrice:
            product.discountPrice ||
            "",

          gender:
            product.gender || "",

          collection:
            product.collection ||
            "",

          category:
            product.category ||
            "",

          brand:
            product.brand || "",

          isFeatured:
            product.isFeatured
              ? "true"
              : "false",
        });

        setVariants(
          product.variants || []
        );

        setOldImages(
          product.images || []
        );
      } catch (error) {
        console.log(error);

        alert(
          "Error fetching product"
        );
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================
  // VARIANT CHANGE
  // =====================================

  const handleVariantChange = (
    index,
    e
  ) => {
    const updated = [...variants];

    updated[index][e.target.name] =
      e.target.name === "stock"
        ? Number(e.target.value)
        : e.target.value;

    setVariants(updated);
  };

  // =====================================
  // ADD VARIANT
  // =====================================

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        stock: 0,
      },
    ]);
  };

  // =====================================
  // REMOVE VARIANT
  // =====================================

  const removeVariant = (index) => {
    setVariants(
      variants.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================
  // REMOVE OLD IMAGE
  // =====================================

  const removeOldImage = (index) => {
    setOldImages(
      oldImages.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================
  // NEW IMAGE
  // =====================================

  const handleNewImages = (e) => {
    setNewImages(
      Array.from(e.target.files)
    );
  };

  // =====================================
  // SUBMIT UPDATE
  // =====================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {
          if (
            key === "isFeatured"
          ) {
            data.append(
              key,
              formData[key] ===
                "true"
            );
          } else {
            data.append(
              key,
              formData[key]
            );
          }
        }
      );

      data.append(
        "variants",
        JSON.stringify(variants)
      );

      data.append(
        "existingImages",
        JSON.stringify(oldImages)
      );

      newImages.forEach((img) => {
        data.append(
          "images",
          img
        );
      });

      await axios.put(
        `/products/update/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Product Updated Successfully"
      );

      navigate(
        "/dashboard/products"
      );
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data
          ?.message ||
          "Error updating product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-[4px] text-gray-400 font-semibold">
              Admin Panel
            </p>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">
              Update Product
            </h1>
          </div>

          <button
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl hover:bg-gray-100 transition-all"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >

          {/* BASIC INFO */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FaBoxOpen className="text-2xl text-gray-700" />

              <h2 className="text-2xl font-bold text-gray-900">
                Product Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className="label">
                  Product Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                  placeholder="Enter product title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Discount Price
                </label>

                <input
                  type="number"
                  name="discountPrice"
                  value={
                    formData.discountPrice
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  Gender
                </label>

                <select
                  name="gender"
                  value={
                    formData.gender
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="men">
                    Men
                  </option>

                  <option value="women">
                    Women
                  </option>

                  <option value="kids">
                    Kids
                  </option>
                </select>
              </div>

              <div>
                <label className="label">
                  Collection
                </label>

                <select
                  name="collection"
                  value={
                    formData.collection
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                >
                  <option value="">
                    Select Collection
                  </option>

                  <option value="topwear">
                    Top Wear
                  </option>

                  <option value="bottomwear">
                    Bottom Wear
                  </option>

                  <option value="footwear">
                    Footwear
                  </option>

                  <option value="summer">
                    Summer
                  </option>

                  <option value="winter">
                    Winter
                  </option>
                </select>
              </div>

              <div>
                <label className="label">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="tshirt">
                    T-Shirt
                  </option>

                  <option value="shirt">
                    Shirt
                  </option>

                  <option value="hoodie">
                    Hoodie
                  </option>

                  <option value="jeans">
                    Jeans
                  </option>

                  <option value="shoes">
                    Shoes
                  </option>
                </select>
              </div>

              <div>
                <label className="label">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={
                    formData.brand
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                  placeholder="Nike / Puma / Zara"
                />
              </div>

              <div>
                <label className="label">
                  Featured Product
                </label>

                <select
                  name="isFeatured"
                  value={
                    formData.isFeatured
                  }
                  onChange={
                    handleChange
                  }
                  className="input"
                >
                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Yes
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* EXISTING IMAGES */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FaImage className="text-2xl text-gray-700" />

              <h2 className="text-2xl font-bold text-gray-900">
                Product Images
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Remove old images or upload new ones
            </p>

            {/* OLD IMAGES */}

            <div className="flex gap-4 flex-wrap mb-6">
              {oldImages.map(
                (img, index) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-28 h-28 rounded-2xl object-cover border border-gray-200"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOldImage(
                          index
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )
              )}
            </div>

            {/* NEW IMAGES */}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleNewImages
              }
              className="input"
            />

            {/* PREVIEW */}

            {newImages.length >
              0 && (
              <div className="flex gap-4 flex-wrap mt-6">
                {newImages.map(
                  (
                    img,
                    index
                  ) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(
                        img
                      )}
                      alt=""
                      className="w-28 h-28 rounded-2xl object-cover border border-gray-200"
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* VARIANTS */}

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Variants
              </h2>

              <button
                type="button"
                onClick={
                  addVariant
                }
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition-all"
              >
                <FaPlus />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map(
                (
                  variant,
                  index
                ) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4"
                  >

                    <input
                      type="text"
                      name="size"
                      value={
                        variant.size
                      }
                      onChange={(
                        e
                      ) =>
                        handleVariantChange(
                          index,
                          e
                        )
                      }
                      placeholder="Size"
                      className="input"
                    />

                    <input
                      type="text"
                      name="color"
                      value={
                        variant.color
                      }
                      onChange={(
                        e
                      ) =>
                        handleVariantChange(
                          index,
                          e
                        )
                      }
                      placeholder="Color"
                      className="input"
                    />

                    <input
                      type="number"
                      name="stock"
                      value={
                        variant.stock
                      }
                      onChange={(
                        e
                      ) =>
                        handleVariantChange(
                          index,
                          e
                        )
                      }
                      placeholder="Stock"
                      className="input"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          index
                        )
                      }
                      className="bg-red-100 text-red-600 rounded-2xl font-semibold hover:bg-red-200 transition-all"
                    >
                      Remove
                    </button>

                  </div>
                )
              )}
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-60"
          >
            {loading
              ? "Updating Product..."
              : "Update Product"}
          </button>

        </form>
      </div>

      <style>
        {`
          .input{
            width:100%;
            border:1px solid #e5e7eb;
            background:white;
            padding:14px 16px;
            border-radius:16px;
            outline:none;
            transition:0.3s;
            font-size:14px;
          }

          .input:focus{
            border-color:black;
            box-shadow:0 0 0 4px rgba(0,0,0,0.05);
          }

          .label{
            display:block;
            margin-bottom:8px;
            font-size:14px;
            font-weight:600;
            color:#374151;
          }
        `}
      </style>
    </div>
  );
};

export default Updates;
import React, { useState, useRef } from "react";
import axios from "../services/axios";

const CATEGORY_OPTIONS = [
  "topwear",
  "bottomwear",
  "footwear",
  "summer",
  "winter",
];

const PRODUCT_TYPE_OPTIONS = {
  topwear: [
    "tshirt",
    "shirt",
    "polo",
    "hoodie",
    "sweatshirt",
    "kurti",
    "top",
  ],

  bottomwear: [
    "jeans",
    "trousers",
    "joggers",
    "shorts",
    "leggings",
    "skirt",
  ],

  footwear: [
    "sneakers",
    "shoes",
    "heels",
    "sandals",
    "boots",
    "slippers",
  ],

  summer: [
    "summer-shirt",
    "summer-tshirt",
    "summer-shorts",
    "summer-dress",
  ],

  winter: [
    "jacket",
    "coat",
    "hoodie",
    "sweater",
    "cardigan",
  ],
};

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "Free Size",
];

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Brown",
  "Grey",
  "Orange",
  "Beige",
  "Maroon",
];

const MATERIAL_OPTIONS = [
  "Cotton",
  "Linen",
  "Denim",
  "Polyester",
  "Wool",
  "Leather",
  "Rayon",
  "Silk",
];

const BRAND_OPTIONS = [
  "Nike",
  "Adidas",
  "Puma",
  "Zara",
  "H&M",
  "Roadster",
  "Levis",
  "US Polo",
  "Custom Brand",
];

const Add = () => {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  const [variants, setVariants] = useState([
    {
      size: "",
      color: "",
      stock: "",
      sku: "",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",

    price: "",
    comparePrice: "",

    category: "",
    productType: "",

    brand: "",

    gender: "unisex",

    material: "",

    stock: "",

    tags: "",

    shippingCharge: "",

    featured: false,
    newArrival: false,
    bestSeller: false,

    metaTitle: "",
    metaDescription: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // RESET PRODUCT TYPE IF CATEGORY CHANGED
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        productType: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // VARIANTS
  // =========================

  const handleVariantChange = (index, e) => {
    const updated = [...variants];

    updated[index][e.target.name] = e.target.value;

    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        stock: "",
        sku: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);

    setVariants(updated);
  };

  // =========================
  // IMAGES
  // =========================

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const updated = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...updated]);
    
    // Reset file input value so same file can be selected again if removed
    e.target.value = null;
  };

  const removeImage = (index) => {
    const updated = [...images];

    updated.splice(index, 1);

    setImages(updated);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // FORM DATA
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // TAGS
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      data.append("tags", JSON.stringify(tagsArray));

      // COLORS ARRAY FROM VARIANTS
      const colorsArray = [
        ...new Set(
          variants
            .map((v) => v.color)
            .filter((c) => c !== "")
        ),
      ];

      data.append("colors", JSON.stringify(colorsArray));

      // VARIANTS
      data.append("variants", JSON.stringify(variants));

      // IMAGES
      images.forEach((img) => {
        data.append("images", img.file);
      });

      const res = await axios.post(
        "/products/add",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      // RESET
      setFormData({
        title: "",
        description: "",
        shortDescription: "",

        price: "",
        comparePrice: "",

        category: "",
        productType: "",

        brand: "",

        gender: "unisex",

        material: "",

        stock: "",

        tags: "",

        shippingCharge: "",

        featured: false,
        newArrival: false,
        bestSeller: false,

        metaTitle: "",
        metaDescription: "",
      });

      setVariants([
        {
          size: "",
          color: "",
          stock: "",
          sku: "",
        },
      ]);

      setImages([]);
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* BASIC INFO */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-semibold">
            Basic Information
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Full Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* PRICING */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="comparePrice"
              placeholder="Compare Price"
              value={formData.comparePrice}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Product Classification
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* CATEGORY */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg"
            >
              <option value="">
                Select Category
              </option>

              {CATEGORY_OPTIONS.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>

            {/* PRODUCT TYPE */}
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              disabled={!formData.category}
              className="border p-3 rounded-lg disabled:bg-gray-100"
            >
              <option value="">
                Select Product Type
              </option>

              {formData.category &&
                PRODUCT_TYPE_OPTIONS[
                  formData.category
                ]?.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
            </select>

            {/* GENDER */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg"
            >
              <option value="men">
                Men
              </option>

              <option value="women">
                Women
              </option>

              <option value="kids">
                Kids
              </option>

              <option value="unisex">
                Unisex
              </option>
            </select>

            {/* MATERIAL */}
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">
                Select Material
              </option>

              {MATERIAL_OPTIONS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* BRAND */}
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">
                Select Brand
              </option>

              {BRAND_OPTIONS.map((brand) => (
                <option
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>
              ))}
            </select>

            {/* STOCK */}
            <input
              type="number"
              name="stock"
              placeholder="Total Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg"
            />
          </div>
        </div>

        {/* SHIPPING + TAGS */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Additional Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="tags"
              placeholder="Tags separated by comma"
              value={formData.tags}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="shippingCharge"
              placeholder="Shipping Charge"
              value={formData.shippingCharge}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="flex flex-wrap gap-6 mt-5">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              Featured
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />

              New Arrival
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
              />

              Best Seller
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-semibold">
            SEO
          </h2>

          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={4}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* IMAGES */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Product Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative"
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-40 object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                >
                  ×
                </button>
              </div>
            ))}

            {/* ADD MORE BOX */}
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
              <span className="text-3xl text-gray-400">+</span>
              <span className="text-xs text-gray-500 font-medium mt-1">Add Image</span>
            </label>
          </div>
        </div>

        {/* VARIANTS */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">
              Product Variants
            </h2>

            <button
              type="button"
              onClick={addVariant}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Add Variant
            </button>
          </div>

          <div className="space-y-5">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border rounded-xl p-4"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {/* SIZE */}
                  <select
                    name="size"
                    value={variant.size}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        e
                      )
                    }
                    className="border p-3 rounded-lg"
                  >
                    <option value="">
                      Select Size
                    </option>

                    {SIZE_OPTIONS.map((size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    ))}
                  </select>

                  {/* COLOR */}
                  <select
                    name="color"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        e
                      )
                    }
                    className="border p-3 rounded-lg"
                  >
                    <option value="">
                      Select Color
                    </option>

                    {COLOR_OPTIONS.map((color) => (
                      <option
                        key={color}
                        value={color}
                      >
                        {color}
                      </option>
                    ))}
                  </select>

                  {/* STOCK */}
                  <input
                    type="number"
                    name="stock"
                    placeholder="Variant Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        e
                      )
                    }
                    className="border p-3 rounded-lg"
                  />

                  {/* SKU */}
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        e
                      )
                    }
                    className="border p-3 rounded-lg"
                  />
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(index)
                    }
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl text-lg font-semibold"
        >
          {loading
            ? "Adding Product..."
            : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
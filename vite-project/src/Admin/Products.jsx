import { useEffect, useState } from "react";
import axios from "../services/axios";
import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/products/all");
      setProducts(res.data.products || []);
    } catch {
      alert("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`/products/delete/${confirmId}`);
      setProducts((p) => p.filter((x) => x._id !== confirmId));
    } catch {
      alert("Error deleting product");
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender ? p.gender === filterGender : true;
    return matchSearch && matchGender;
  });

  const totalStock = products.reduce(
    (acc, p) => acc + (p.variants?.reduce((a, v) => a + (v.stock || 0), 0) || 0),
    0
  );

  const getStockInfo = (variants) => {
    const s = variants?.reduce((a, v) => a + (v.stock || 0), 0) || 0;
    if (s === 0) return { label: "Out of stock", color: "text-red-500 bg-red-50", dot: "bg-red-400" };
    if (s < 10)  return { label: `${s} left`,   color: "text-orange-500 bg-orange-50", dot: "bg-orange-400" };
    if (s < 30)  return { label: `${s} units`,  color: "text-yellow-600 bg-yellow-50", dot: "bg-yellow-400" };
    return              { label: `${s} units`,  color: "text-emerald-600 bg-emerald-50", dot: "bg-emerald-400" };
  };

  const genderStyles = {
    men:    "bg-blue-50 text-blue-600",
    women:  "bg-pink-50 text-pink-600",
    kids:   "bg-purple-50 text-purple-600",
    unisex: "bg-gray-100 text-gray-500",
  };

  const statCards = [
    { label: "Total Products", value: products.length,  icon: "📦", accent: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Stock",    value: totalStock,        icon: "🏷️", accent: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Low Stock",      value: products.filter((p) => (p.variants?.reduce((a, v) => a + (v.stock || 0), 0) || 0) < 10).length, icon: "⚠️", accent: "text-orange-500", bg: "bg-orange-50" },
    { label: "Filtered",       value: filtered.length,  icon: "🔎", accent: "text-gray-700",    bg: "bg-gray-100" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f6] px-6 py-10 md:px-12 md:py-12">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
        <div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-orange-500 uppercase mb-2">
            Inventory Management
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
            All Products
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            {products.length} products · {totalStock} total units
          </p>
        </div>
        <NavLink
          to="/dashboard/add"
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5"
        >
          <span className="text-base font-black">＋</span>
          Add Product
        </NavLink>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon, accent, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center text-2xl flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className={`text-2xl font-black ${accent}`}>{value}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <FaSearch/>
          </span>
          <input
            type="text"
            placeholder="Search by product name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
          />
        </div>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-600 font-medium focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all shadow-sm min-w-[160px]"
        >
          <option value="">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_160px] gap-6 px-8 py-4 border-b border-gray-100 bg-gray-50/60">
          {["Product", "Price", "Gender", "Collection", "Stock", "Actions"].map((h) => (
            <p key={h} className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.12em]">{h}</p>
          ))}
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_160px] gap-6 items-center px-8 py-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-lg animate-pulse w-1/2" />
                    <div className="h-3 bg-gray-100 rounded-lg animate-pulse w-1/3" />
                  </div>
                </div>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                ))}
                <div className="flex gap-2">
                  <div className="h-10 w-20 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="h-10 w-12 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
            <div className="text-7xl mb-5">{search ? "🔍" : "📦"}</div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">
              {search ? "No results found" : "No products yet"}
            </h3>
            <p className="text-sm text-gray-400 mb-8 max-w-xs">
              {search
                ? `Nothing matched "${search}". Try a different keyword.`
                : "Add your first product to start managing your inventory."}
            </p>
            {!search && (
              <NavLink
                to="/dashboard/add"
                className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
              >
                ＋ Add Product
              </NavLink>
            )}
          </div>
        )}

        {/* ── Product rows ── */}
        {!loading && filtered.length > 0 && (
          <div className="divide-y divide-gray-50">
            {filtered.map((product) => {
              const stock = getStockInfo(product.variants);
              const discount = product.comparePrice && product.price
                ? Math.round((1 - product.price / product.comparePrice) * 100)
                : 0;

              return (
                <div
                  key={product._id}
                  className="group flex flex-col gap-4 md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_160px] md:gap-6 md:items-center px-8 py-6 hover:bg-gray-50/80 transition-colors duration-150"
                >
                  {/* Product info */}
                  <div className="flex items-center gap-5">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-20 h-20 rounded-2xl object-cover border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                        👕
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-base leading-snug line-clamp-2 max-w-[200px]">
                        {product.title}
                      </p>
                      {product.brand && (
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">
                          {product.brand}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">
                        {[product.category, product.productType].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      ₹{Number(product.price).toLocaleString()}
                    </p>
                    {product.comparePrice && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <p className="text-xs text-gray-400 line-through">
                          ₹{Number(product.comparePrice).toLocaleString()}
                        </p>
                        {discount > 0 && (
                          <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold capitalize ${genderStyles[product.gender] || genderStyles.unisex}`}>
                      {product.gender || "unisex"}
                    </span>
                  </div>

                  {/* Collection */}
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{product.collection || "—"}</p>
                  </div>

                  {/* Stock */}
                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${stock.color}`}>
                      <span className={`w-2 h-2 rounded-full ${stock.dot} flex-shrink-0`} />
                      {stock.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <NavLink
                      to={`/dashboard/update/${product._id}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
                    >
                      <FaEdit/> Edit
                    </NavLink>
                    <button
                      onClick={() => setConfirmId(product._id)}
                      className="flex items-center gap-1 px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                    >
                    <MdDeleteOutline/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Table Footer ── */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/60">
            <p className="text-xs text-gray-400 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-600">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-bold text-gray-600">{products.length}</span>{" "}
              products
            </p>
            <p className="text-xs text-gray-400 font-medium">
              Total:{" "}
              <span className="font-bold text-emerald-600">{totalStock} units</span>
            </p>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {confirmId && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mx-auto mb-6">
              🗑️
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Delete Product?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              This will permanently remove the product and all its variants.
              This action <span className="font-bold text-gray-700">cannot be undone</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold transition-all shadow-lg shadow-red-500/25"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
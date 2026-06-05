import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaArrowRight, FaSlidersH, FaTimes, FaChevronDown,
  FaCheck, FaFilter, FaThLarge, FaTh, FaList,
} from "react-icons/fa";
import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loaders";

// ─── useInView ─────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.08, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Filter Pill ───────────────────────────────────────────────────
function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide
      border transition-all duration-250 whitespace-nowrap
      ${active
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
      }
    `}>
      {active && <FaCheck className="text-[9px]" />}
      {children}
    </button>
  );
}

// ─── Sort dropdown ─────────────────────────────────────────────────
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { value: "", label: "Default" },
    { value: "new", label: "Newest First" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "sale", label: "On Sale" },
  ];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = options.find(o => o.value === value)?.label || "Default";

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-all duration-200 bg-white">
        <FaSlidersH className="text-gray-400 text-xs" />
        {label}
        <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100 overflow-hidden z-50">
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm transition-all duration-150 flex items-center justify-between
                ${value === opt.value ? "bg-gray-50 font-bold text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}>
              {opt.label}
              {value === opt.value && <FaCheck className="text-xs text-gray-900" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Filter Drawer ──────────────────────────────────────────
function FilterDrawer({ open, onClose, genderFilter, setGenderFilter, collectionFilter, setCollectionFilter, sortValue, setSortValue }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      {/* Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] transition-transform duration-400 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "85vh", overflowY: "auto" }}>
        <div className="p-6 pb-10">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-lg font-black text-gray-900">Filters</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
              <FaTimes className="text-sm" />
            </button>
          </div>

          {[
            { label: "Gender", options: ["Men", "Women", "Unisex"], value: genderFilter, setter: setGenderFilter },
            { label: "Category", options: ["topwear", "bottomwear", "footwear", "summer", "winter"], value: collectionFilter, setter: setCollectionFilter },
            { label: "Sort By", options: ["new", "sale", "price-asc", "price-desc"], labels: ["Newest", "On Sale", "Price: Low→High", "Price: High→Low"], value: sortValue, setter: setSortValue },
          ].map(({ label, options, labels, value, setter }) => (
            <div key={label} className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">{label}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt, i) => (
                  <Pill key={opt} active={value === opt} onClick={() => setter(v => v === opt ? "" : opt)}>
                    {labels ? labels[i] : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Pill>
                ))}
              </div>
            </div>
          ))}

          <button onClick={onClose}
            className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-all">
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Hero banner per context ───────────────────────────────────────
const HERO_MAP = {
  Men:        { img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1600&auto=format&fit=crop", sub: "Designed for every occasion." },
  Women:      { img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop", sub: "Style with intention." },
  topwear:    { img: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop", sub: "Layering done right." },
  bottomwear: { img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1600&auto=format&fit=crop", sub: "The perfect fit from the ground up." },
  footwear:   { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop", sub: "Step into something new." },
  summer:     { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop", sub: "Light, breezy, effortless." },
  winter:     { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop", sub: "Cosy without compromise." },
  sale:       { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop", sub: "Great prices. Greater style." },
  new:        { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop", sub: "Fresh off the rack." },
  default:    { img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop", sub: "Every style, one place." },
};

// ══════════════════════════════════════════════════════════════════
const Shop = () => {
  const { products, loading } = useProduct();
  const [params, setParams] = useSearchParams();

  // Read URL params
  const urlGender     = params.get("gender") || "";
  const urlCollection = params.get("collection") || "";
  const urlSort       = params.get("sort") || "";

  // Local filter state (synced with URL)
  const [genderFilter,     setGenderFilter]     = useState(urlGender);
  const [collectionFilter, setCollectionFilter] = useState(urlCollection);
  const [sortValue,        setSortValue]        = useState(urlSort);
  const [drawerOpen,       setDrawerOpen]        = useState(false);
  const [gridCols,         setGridCols]          = useState(4); // 2 | 3 | 4

  // Sync local → URL
  useEffect(() => {
    const p = {};
    if (genderFilter)     p.gender     = genderFilter;
    if (collectionFilter) p.collection = collectionFilter;
    if (sortValue)        p.sort       = sortValue;
    setParams(p, { replace: true });
  }, [genderFilter, collectionFilter, sortValue]);

  const collectionMap = useMemo(() => ({
    topwear:    ["tshirt","shirt","hoodie","jacket","kurti","top","sweater","blazer"],
    bottomwear: ["jeans","pants","trousers","shorts","joggers","leggings","skirt"],
    footwear:   ["shoes","sneakers","heels","sandals","boots","slippers"],
    summer:     ["tshirt","shorts","dress","top","sandals"],
    winter:     ["hoodie","jacket","sweater","coat","blazer"],
  }), []);

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (genderFilter) data = data.filter(p => p.gender?.toLowerCase() === genderFilter.toLowerCase());
    if (collectionFilter) {
      const types = collectionMap[collectionFilter.toLowerCase()] || [];
      data = data.filter(p => types.includes(p.productType?.toLowerCase()));
    }
    if (sortValue === "new")        data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortValue === "sale")       data = data.filter(p => p.comparePrice > p.price);
    if (sortValue === "price-asc")  data.sort((a,b) => a.price - b.price);
    if (sortValue === "price-desc") data.sort((a,b) => b.price - a.price);
    return data;
  }, [products, genderFilter, collectionFilter, sortValue, collectionMap]);

  const hasFilters = !!(genderFilter || collectionFilter || sortValue);

  const pageTitle = () => {
    if (sortValue === "new")  return "New Arrivals";
    if (sortValue === "sale") return "Sale";
    let t = "";
    if (genderFilter)     t += genderFilter;
    if (collectionFilter) t += (t ? " " : "") + collectionFilter.charAt(0).toUpperCase() + collectionFilter.slice(1);
    return t || "All Products";
  };

  const heroKey = genderFilter || collectionFilter || sortValue || "default";
  const hero = HERO_MAP[heroKey] || HERO_MAP.default;

  const clearAll = () => { setGenderFilter(""); setCollectionFilter(""); setSortValue(""); };

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[gridCols];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Playfair+Display:wght@700;900&display=swap');
        .hero-font { font-family:'Playfair Display',Georgia,serif; }
        .img-zoom { transition:transform 0.7s cubic-bezier(.22,.68,0,1.2); }
        .img-zoom:hover { transform:scale(1.04); }
      `}</style>

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative h-52 md:h-72 overflow-hidden">
        <img src={hero.img} alt="" className="w-full h-full object-cover" key={heroKey}
          style={{ animation: "none", transition: "opacity 0.6s" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div className="text-white">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/50 font-medium mb-3">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <FaArrowRight className="text-[8px]" />
              <span className="text-white/80">Shop</span>
              {hasFilters && <><FaArrowRight className="text-[8px]" /><span className="text-white">{pageTitle()}</span></>}
            </div>
            <h1 className="hero-font text-4xl md:text-6xl font-black leading-tight">{pageTitle()}</h1>
            <p className="text-white/60 text-sm mt-2">{hero.sub}</p>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ───────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 md:px-10 lg:px-16 py-3 flex items-center justify-between gap-4">

          {/* Left: pills (desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {/* Gender */}
            {["Men","Women","Unisex"].map(g => (
              <Pill key={g} active={genderFilter === g} onClick={() => setGenderFilter(v => v === g ? "" : g)}>{g}</Pill>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1" />
            {/* Collection */}
            {["topwear","bottomwear","footwear","summer","winter"].map(c => (
              <Pill key={c} active={collectionFilter === c} onClick={() => setCollectionFilter(v => v === c ? "" : c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Pill>
            ))}
            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-red-500 font-bold hover:text-red-700 ml-2 transition-colors">
                <FaTimes /> Clear
              </button>
            )}
          </div>

          {/* Mobile: filter button */}
          <button onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-sm font-bold">
            <FaFilter className="text-xs" />
            Filters {hasFilters && `(${[genderFilter, collectionFilter, sortValue].filter(Boolean).length})`}
          </button>

          {/* Right: sort + grid toggle */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Count */}
            <span className="hidden md:block text-xs text-gray-400 font-medium">{filteredProducts.length} items</span>

            <SortDropdown value={sortValue} onChange={setSortValue} />

            {/* Grid toggle (desktop) */}
            <div className="hidden lg:flex items-center border border-gray-200 rounded-xl overflow-hidden">
              {[
                { cols: 4, icon: <FaTh className="text-xs" /> },
                { cols: 3, icon: <FaThLarge className="text-xs" /> },
                { cols: 2, icon: <FaList className="text-xs" /> },
              ].map(({ cols, icon }) => (
                <button key={cols} onClick={() => setGridCols(cols)}
                  className={`w-9 h-9 flex items-center justify-center transition-all duration-200 ${gridCols === cols ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE FILTER CHIPS ─────────────────────────────────── */}
      {hasFilters && (
        <div className="px-4 md:px-10 lg:px-16 py-3 flex items-center gap-2 flex-wrap border-b border-gray-50">
          <span className="text-xs text-gray-400 font-medium">Active:</span>
          {[genderFilter, collectionFilter, sortValue].filter(Boolean).map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <button onClick={() => {
                if (f === genderFilter) setGenderFilter("");
                else if (f === collectionFilter) setCollectionFilter("");
                else setSortValue("");
              }} className="hover:text-red-500 transition-colors">
                <FaTimes className="text-[9px]" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── PRODUCTS GRID ───────────────────────────────────────── */}
      <main className="px-4 md:px-10 lg:px-16 py-10">
        {filteredProducts.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-6">🛍️</div>
              <h2 className="text-2xl font-black text-gray-800">Nothing here yet</h2>
              <p className="text-gray-400 mt-3 max-w-xs text-sm leading-relaxed">
                We couldn't find any products matching your filters. Try adjusting your selection.
              </p>
              <button onClick={clearAll}
                className="mt-7 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-all duration-300">
                Clear All Filters
              </button>
              <Link to="/shop" className="mt-3 text-sm text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors">
                Browse everything
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <div className={`grid gap-4 md:gap-6 ${gridClass}`}>
              {filteredProducts.map((product, i) => (
                <Reveal key={product._id} delay={Math.min(i * 0.04, 0.4)}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            {/* Load more hint */}
            <Reveal>
              <div className="mt-16 text-center border-t border-gray-100 pt-10">
                <p className="text-sm text-gray-400">Showing all <span className="font-bold text-gray-700">{filteredProducts.length}</span> products</p>
                <div className="flex items-center justify-center gap-3 mt-5">
                  <Link to="/shop" className="text-sm font-bold text-gray-900 hover:underline underline-offset-4 flex items-center gap-2">
                    View All Collections <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </>
        )}
      </main>

      {/* ── CATEGORY QUICK LINKS ────────────────────────────────── */}
      {!hasFilters && (
        <section className="px-4 md:px-10 lg:px-16 py-16 bg-gray-950">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500 mb-4">Explore by Category</p>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-8">Browse Collections</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "topwear",    label: "Topwear",    img: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=600&auto=format&fit=crop" },
              { key: "bottomwear", label: "Bottomwear", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop" },
              { key: "footwear",   label: "Footwear",   img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
              { key: "summer",     label: "Summer",     img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" },
              { key: "winter",     label: "Winter",     img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop" },
            ].map(({ key, label, img }, i) => (
              <Reveal key={key} delay={i * 0.08}>
                <button onClick={() => setCollectionFilter(key)}
                  className="relative h-48 w-full rounded-2xl overflow-hidden group text-left">
                  <img src={img} alt={label} className="img-zoom w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-all duration-400" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-black text-base">{label}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Mobile Filter Drawer ─────────────────────────────────── */}
      <FilterDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        genderFilter={genderFilter} setGenderFilter={setGenderFilter}
        collectionFilter={collectionFilter} setCollectionFilter={setCollectionFilter}
        sortValue={sortValue} setSortValue={setSortValue}
      />
    </div>
  );
};

export default Shop;
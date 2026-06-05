import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp, FaArrowRight, FaShippingFast, FaLock,
  FaUndo, FaHeadset, FaTimes, FaStar, FaQuoteLeft,
  FaInstagram, FaPlay,
} from "react-icons/fa";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loaders";

// ─── useInView hook for scroll animations ─────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Animated section wrapper ──────────────────────────────────────
function Reveal({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(48px)", down: "translateY(-48px)", left: "translateX(60px)", right: "translateX(-60px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0,0)" : transforms[direction],
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Marquee ticker ────────────────────────────────────────────────
function Marquee({ items }) {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-black text-white py-3 select-none">
      <div className="inline-flex animate-[marquee_28s_linear_infinite]">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-xs font-bold tracking-[0.25em] uppercase">{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────
function SectionHeading({ eyebrow, title, light = false }) {
  return (
    <div className="mb-10">
      <p className={`uppercase tracking-[0.3em] text-xs font-bold mb-3 ${light ? "text-gray-400" : "text-gray-400"}`}>{eyebrow}</p>
      <h2 className={`text-3xl md:text-5xl font-black leading-tight tracking-tight ${light ? "text-white" : "text-gray-900"}`}>{title}</h2>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
const Home = () => {
  const { products, loading } = useProduct();
  const { user } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const banners = [
    {
      id: 1, title: "Streetwear\nRedefined",
      subtitle: "Premium oversized fits crafted for the everyday hustle.",
      image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      button: "Shop Oversized", link: "/shop?category=Oversized", tag: "SS '25 Collection",
    },
    {
      id: 2, title: "Minimal\nLuxury Drops",
      subtitle: "Clean silhouettes. Timeless essentials. Everyday luxury.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
      button: "Explore Collection", link: "/shop?featured=true", tag: "Editor's Pick",
    },
    {
      id: 3, title: "New Season\nArrivals",
      subtitle: "Discover the latest curated fashion pieces, dropped fresh.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      button: "Shop Now", link: "/shop?sort=newest", tag: "Just Landed",
    },
  ];

  useEffect(() => {
    const iv = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!user) { const t = setTimeout(() => setShowPopup(true), 14000); return () => clearTimeout(t); }
  }, [user]);

  const featuredProducts = useMemo(() => products?.filter(p => p.featured).slice(0, 8) || [], [products]);
  const newArrivals = useMemo(() => products?.filter(p => p.newArrival).slice(0, 8) || [], [products]);
  const bestSellers = useMemo(() => products?.filter(p => p.bestSeller).slice(0, 8) || [], [products]);

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  if (loading) return <Loader />;

  const marqueeTicker = [
    "Free Shipping on Prepaid", "New Drops Every Friday", "Premium Quality Fabrics",
    "7-Day Easy Returns", "Members Get 10% Off", "Sustainable Fashion",
  ];

  const testimonials = [
    { name: "Priya M.", city: "Mumbai", rating: 5, text: "Absolutely love the quality. My oversized tee has survived 30+ washes and still looks brand new. Sizing is perfect." },
    { name: "Arjun K.", city: "Bangalore", rating: 5, text: "Ordered twice already. Fast delivery, premium packaging, and the fits are genuinely top-tier. Will be a regular customer." },
    { name: "Sneha R.", city: "Delhi", rating: 5, text: "Finally a brand that gets streetwear right in India. The colourways are fire and the fabric is insane for this price point." },
  ];

  const lookbookItems = [
    { image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop", label: "Street Edit" },
    { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop", label: "Minimal Core" },
    { image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", label: "Night Out" },
    { image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop", label: "Weekend Fits" },
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <div className="bg-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* ── Keyframe styles injected ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popup { from { opacity:0; transform:scale(0.92) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5) } 50% { box-shadow: 0 0 0 10px rgba(37,211,102,0) } }
        .hero-title { font-family: 'Playfair Display', Georgia, serif; }
        .animate-popup { animation: popup 0.45s cubic-bezier(.22,.68,0,1.2) forwards; }
        .wa-btn { animation: pulse-ring 2s ease infinite; }
        .img-zoom { transition: transform 0.8s cubic-bezier(.22,.68,0,1.2); }
        .img-zoom:hover { transform: scale(1.06); }
      `}</style>

      {/* ── WhatsApp FAB ── */}
      <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"
        className="wa-btn fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
        <FaWhatsapp size={26} />
      </a>

      {/* ══════════════════════════════════════════ */}
      {/* HERO SLIDER                               */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative h-[92vh] md:h-screen overflow-hidden bg-black">
        {banners.map((banner, idx) => (
          <div key={banner.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentBanner === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <img src={banner.image} alt="" className="w-full h-full object-cover scale-105 transition-transform duration-[8000ms] ease-out"
              style={{ transform: currentBanner === idx ? "scale(1)" : "scale(1.06)" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-24">
              <div className="max-w-2xl text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
                  style={{ opacity: currentBanner === idx ? 1 : 0, transition: "opacity 0.6s 0.3s" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-semibold tracking-widest uppercase">{banner.tag}</span>
                </div>

                <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] whitespace-pre-line"
                  style={{ opacity: currentBanner === idx ? 1 : 0, transform: currentBanner === idx ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s 0.2s, transform 0.7s 0.2s" }}>
                  {banner.title}
                </h1>

                <p className="mt-6 text-base md:text-lg text-gray-300 max-w-md leading-relaxed"
                  style={{ opacity: currentBanner === idx ? 1 : 0, transition: "opacity 0.7s 0.4s" }}>
                  {banner.subtitle}
                </p>

                <div className="flex items-center gap-4 mt-10"
                  style={{ opacity: currentBanner === idx ? 1 : 0, transition: "opacity 0.7s 0.55s" }}>
                  <Link to={banner.link}
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-400 group">
                    {banner.button}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link to="/shop" className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 underline underline-offset-4">
                    Browse All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide counter & dots */}
        <div className="absolute bottom-8 left-6 md:left-16 flex items-center gap-5 z-20">
          <span className="text-white/40 text-xs font-mono">0{currentBanner + 1} / 0{banners.length}</span>
          <div className="flex gap-2">
            {banners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentBanner(idx)}
                className={`h-0.5 rounded-full transition-all duration-500 ${currentBanner === idx ? "w-10 bg-white" : "w-4 bg-white/30"}`} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/40">
          <div className="h-10 w-px bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-[fadeInUp_1.5s_ease_infinite]" />
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center mt-2">Scroll</span>
        </div>
      </section>

      {/* ── Marquee ticker ── */}
      <Marquee items={marqueeTicker} />

      {/* ══════════════════════════════════════════ */}
      {/* SERVICES BAR                             */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-16 border-b border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <FaShippingFast />, title: "Free Shipping", text: "On all prepaid orders above ₹499", color: "bg-blue-50 text-blue-500" },
            { icon: <FaUndo />, title: "Easy Returns", text: "Hassle-free 7-day return window", color: "bg-amber-50 text-amber-500" },
            { icon: <FaLock />, title: "Secure Payment", text: "Encrypted & 100% protected", color: "bg-green-50 text-green-500" },
            { icon: <FaHeadset />, title: "24/7 Support", text: "Real humans, always available", color: "bg-rose-50 text-rose-500" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-100 rounded-3xl p-6 transition-all duration-500 border border-transparent hover:border-gray-100">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mt-5 text-base">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* CATEGORY SPLIT — MEN / WOMEN             */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-16">
        <Reveal><SectionHeading eyebrow="Shop by Category" title="Curated for Every Style" /></Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: "Men", tag: "120+ Styles", link: "/shop?gender=Men", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop" },
            { label: "Women", tag: "180+ Styles", link: "/shop?gender=Women", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop" },
          ].map(({ label, tag, link, img }, i) => (
            <Reveal key={i} delay={i * 0.15} direction={i === 0 ? "left" : "right"}>
              <Link to={link} className="relative h-[520px] rounded-[32px] overflow-hidden block group">
                <img src={img} alt={label} className="img-zoom w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3 w-fit">
                    {tag}
                  </span>
                  <h2 className="hero-title text-5xl font-black text-white">{label}</h2>
                  <div className="flex items-center gap-2 mt-4 text-white font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    Shop Collection <FaArrowRight />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* FEATURED PRODUCTS                         */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-10 bg-[#fafafa]">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <SectionHeading eyebrow="Trending Now" title={<>Featured <span className="italic font-normal text-gray-400">Picks</span></>} />
            <Link to="/shop?featured=true" className="hidden md:flex items-center gap-2 text-sm font-bold hover:gap-4 transition-all duration-300 text-gray-900">
              View All <FaArrowRight />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, i) => (
            <Reveal key={product._id} delay={i * 0.07}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/shop?featured=true" className="flex items-center gap-2 border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-900 hover:text-white transition-all duration-300">
            View All Featured <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* LOOKBOOK GRID                             */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <SectionHeading eyebrow="The Lookbook" title={<>Style <span className="italic font-normal text-gray-400">Inspiration</span></>} />
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold hover:gap-4 transition-all duration-300">
              Full Lookbook <FaArrowRight />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lookbookItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/5" }}>
                <img src={item.image} alt={item.label} className="img-zoom w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-400" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                    {item.label}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* FULL-BLEED EDITORIAL BANNER               */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop" alt=""
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-20">
          <Reveal direction="right">
            <div className="text-white max-w-xl">
              <p className="uppercase tracking-[0.3em] text-xs font-bold text-gray-400 mb-4">Limited Edition</p>
              <h2 className="hero-title text-5xl md:text-7xl font-black leading-tight">
                Elevate<br />Your Everyday
              </h2>
              <p className="mt-6 text-gray-300 text-base leading-relaxed max-w-sm">
                Designed for modern fashion lovers who live at the intersection of comfort and aesthetics.
              </p>
              <div className="flex items-center gap-4 mt-10">
                <Link to="/shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-black hover:text-white border border-white transition-all duration-400 group">
                  Shop the Edit <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm">
                    <FaPlay className="text-xs ml-0.5" />
                  </div>
                  Watch Film
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* NEW ARRIVALS                              */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <SectionHeading eyebrow="Fresh Drop" title={<>New <span className="italic font-normal text-gray-400">Arrivals</span></>} />
            <Link to="/shop?sort=newest" className="hidden md:flex items-center gap-2 text-sm font-bold hover:gap-4 transition-all duration-300">
              See All New <FaArrowRight />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map((product, i) => (
            <Reveal key={product._id} delay={i * 0.07}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* BRAND PROMISE — 3 COLUMN                 */}
      {/* ══════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white py-20 px-4 md:px-10 lg:px-16">
        <Reveal><SectionHeading eyebrow="Our Promise" title={<>Why Thousands <span className="italic font-normal text-gray-500">Choose Us</span></>} light /></Reveal>
        <div className="grid md:grid-cols-3 gap-8 mt-4">
          {[
            { num: "01", title: "Fabric First", body: "Every piece starts with fabric selection. We source only premium GSM cottons, French terry blends, and sustainable fibres that feel great on day one and stay that way." },
            { num: "02", title: "Built to Last", body: "Reinforced stitching, pre-shrunk fabrics, and colour-lock technology. Our garments are designed for real life — not just the gram." },
            { num: "03", title: "Made Responsibly", body: "We partner with GOTS-certified manufacturers and use water-based dyes. Fashion that looks good and does good." },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="border-t border-gray-800 pt-8">
                <span className="text-gray-700 font-mono text-xs">{item.num}</span>
                <h3 className="text-xl font-bold mt-3 mb-4">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* BEST SELLERS                              */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-20 bg-[#fafafa]">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <SectionHeading eyebrow="Popular Picks" title={<>Best <span className="italic font-normal text-gray-400">Sellers</span></>} />
            <Link to="/shop?sort=popular" className="hidden md:flex items-center gap-2 text-sm font-bold hover:gap-4 transition-all duration-300">
              View All <FaArrowRight />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map((product, i) => (
            <Reveal key={product._id} delay={i * 0.07}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* TESTIMONIALS                              */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-20">
        <Reveal><SectionHeading eyebrow="Customer Love" title={<>Real Reviews,<br /><span className="italic font-normal text-gray-400">Real People</span></>} /></Reveal>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="bg-gray-50 rounded-3xl p-7 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 border border-transparent hover:border-gray-100">
                <FaQuoteLeft className="text-gray-200 text-3xl mb-4" />
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.city}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <FaStar key={s} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* INSTAGRAM GRID                            */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-10 border-t border-gray-100">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs font-bold text-gray-400 mb-2">Community</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                #WearTheVibe
              </h2>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              <FaInstagram /> Follow Us
            </a>
          </div>
        </Reveal>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {instagramPosts.map((img, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                <img src={img} alt="" className="img-zoom w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-400 flex items-center justify-center">
                  <FaInstagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* NEWSLETTER                                */}
      {/* ══════════════════════════════════════════ */}
      <section className="px-4 md:px-10 lg:px-16 py-20">
        <Reveal>
          <div className="bg-gray-950 rounded-[40px] overflow-hidden relative px-6 md:px-16 py-16 md:py-20">
            {/* Decorative orb */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div className="text-white">
                <p className="uppercase tracking-[0.3em] text-xs font-bold text-gray-500 mb-4">Join the Community</p>
                <h2 className="hero-title text-4xl md:text-5xl font-black leading-tight">
                  Stay First<br />to the Drop
                </h2>
                <p className="mt-5 text-gray-400 text-sm leading-relaxed max-w-xs">
                  Get early access to launches, exclusive member offers, and curated style edits — straight to your inbox.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  {["No spam", "Unsubscribe anytime", "Members-only deals"].map((t, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="w-1 h-1 rounded-full bg-gray-600" />{t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {subscribed ? (
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center text-white">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-bold text-lg">You're in!</p>
                    <p className="text-gray-400 text-sm mt-1">Check your inbox for a welcome gift.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input type="email" placeholder="Your email address" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                      className="w-full h-14 rounded-2xl px-5 bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-white/50 transition-colors" />
                    <button onClick={handleSubscribe}
                      className="w-full h-14 rounded-2xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-all duration-300 active:scale-[0.98]">
                      Subscribe & Get 10% Off →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* REGISTER POPUP                            */}
      {/* ══════════════════════════════════════════ */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          <div className="animate-popup bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
            <div className="relative h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-all">
                <FaTimes className="text-xs" />
              </button>
              <p className="absolute bottom-4 left-6 text-white font-black text-xl">Join the Club</p>
            </div>
            <div className="p-7">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Unlock your first<br />exclusive offer</h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                Create a free account to access your wishlist, faster checkout, order tracking, and members-only drops.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-7">
                <Link to="/auth" onClick={() => setShowPopup(false)}
                  className="flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all duration-300">
                  Create Account
                </Link>
                <button onClick={() => setShowPopup(false)}
                  className="py-3.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all duration-300">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
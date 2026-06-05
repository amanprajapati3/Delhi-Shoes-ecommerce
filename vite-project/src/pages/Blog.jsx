import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaClock, FaTag, FaFire } from "react-icons/fa";
import "./Blog.css"
const BlogStyles = () => (
  <style>{`
    
  `}</style>
);

const CATEGORIES = ["All", "Style Tips", "Trends", "Sustainability", "Shopping Guide", "Behind the Brand"];

const BLOGS = [
  {
    id: 1,
    title: "How to Build a Capsule Wardrobe That Works All Year",
    excerpt: "Fewer clothes, more outfits. We break down exactly which 12 pieces every wardrobe needs — and how to mix them endlessly without the morning panic.",
    category: "Style Tips",
    date: "Apr 28, 2025",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    featured: true,
    color: "#e0e7ff",
    textColor: "#4f46e5",
  },
  {
    id: 2,
    title: "Summer 2025: The Colours Everyone Is Wearing",
    excerpt: "From dusty terracotta to electric cobalt — this season's palette is bold, joyful, and surprisingly wearable.",
    category: "Trends",
    date: "Apr 20, 2025",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    color: "#fef3c7",
    textColor: "#d97706",
  },
  {
    id: 3,
    title: "Why Slow Fashion Actually Saves You Money",
    excerpt: "Fast fashion feels cheap until you do the math. Here's how investing in quality pieces cuts your spend in half over two years.",
    category: "Sustainability",
    date: "Apr 14, 2025",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    color: "#dcfce7",
    textColor: "#16a34a",
  },
  {
    id: 4,
    title: "Online Shopping Mistakes You're Probably Making",
    excerpt: "Wrong size guides, ignoring return policies, skipping reviews — we've all done it. Here's your no-regret checklist before hitting Buy Now.",
    category: "Shopping Guide",
    date: "Apr 8, 2025",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    color: "#fce7f3",
    textColor: "#db2777",
  },
  {
    id: 5,
    title: "Kids' Fashion: Comfort First, Style Always",
    excerpt: "Dressing kids shouldn't be a battle. We've rounded up the most durable, adorable picks that survive both playdates and wash cycles.",
    category: "Style Tips",
    date: "Apr 2, 2025",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80",
    color: "#ede9fe",
    textColor: "#7c3aed",
  },
  {
    id: 6,
    title: "Behind the Stitch: How Our Winter Collection is Made",
    excerpt: "From fabric sourcing in Portugal to quality checks in our warehouse — a transparent look at what goes into every piece we sell.",
    category: "Behind the Brand",
    date: "Mar 26, 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    color: "#f0fdf4",
    textColor: "#15803d",
  },
];

const TRENDING = BLOGS.slice(0, 4);

/* ─── Reveal Hook ─────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Small Components ────────────────────────────────────────────────────── */
function TagBadge({ category, color, textColor }) {
  return (
    <span className="tag-badge" style={{ background: color, color: textColor }}>
      <FaTag size={8} /> {category}
    </span>
  );
}

function BlogCard({ blog, delay = 0 }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal blog-card body-font"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="blog-card-img">
        <img src={blog.image} alt={blog.title} loading="lazy" />
        <div className="absolute top-3 left-3">
          <TagBadge category={blog.category} color={blog.color} textColor={blog.textColor} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{blog.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><FaClock size={10} />{blog.readTime} read</span>
        </div>
        <h3
          className="blog-title-font text-gray-800 leading-snug"
          style={{ fontSize: "1.05rem", fontWeight: 700 }}
        >
          {blog.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{blog.excerpt}</p>
        <button className="read-btn mt-1 self-start">
          Read Article <FaArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const featuredRef = useReveal();
  const nlRef = useReveal();

  const featured = BLOGS.find((b) => b.featured);
  const filtered = BLOGS.filter(
    (b) => !b.featured && (activeCategory === "All" || b.category === activeCategory)
  );

  return (
    <>
      <BlogStyles />

      <div className="blog-page body-font min-h-screen bg-slate-50">

        {/* ── HERO ── */}
        <section className="blog-hero px-4 md:px-10 lg:px-16 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
              Our Journal
            </p>
            <h1 className="hero-title mb-5">
              Stories, Style &{" "}
              <span className="hero-accent">Substance</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              Fashion insight, shopping wisdom, and honest tales from behind the brand.
              Written for people who actually care about what they wear.
            </p>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <div className="px-4 md:px-10 lg:px-16 py-12">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT — Main articles */}
            <div className="flex-1 min-w-0">

              {/* Featured */}
              {featured && (
                <div
                  ref={featuredRef}
                  className="reveal featured-card mb-12 body-font"
                >
                  <div className="featured-img">
                    <img src={featured.image} alt={featured.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="tag-badge" style={{ background: "#fff", color: "#4f46e5" }}>
                        <FaFire size={8} /> Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center gap-4">
                    <TagBadge
                      category={featured.category}
                      color={featured.color}
                      textColor={featured.textColor}
                    />
                    <h2
                      className="blog-title-font text-gray-900 leading-tight"
                      style={{ fontSize: "clamp(1.3rem, 3vw, 1.75rem)", fontWeight: 800 }}
                    >
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{featured.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <FaClock size={10} /> {featured.readTime} read
                        </span>
                      </div>
                      <button className="read-btn">
                        Read Now <FaArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cards grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  {filtered.map((blog, i) => (
                    <BlogCard key={blog.id} blog={blog} delay={i * 80} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">🔍</p>
                  <p>No articles in this category yet. Check back soon!</p>
                </div>
              )}

              {/* Newsletter strip */}
              <div ref={nlRef} className="reveal newsletter-strip mt-14 p-8 md:p-10">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Weekly Dispatch
                </p>
                <h3
                  className="blog-title-font text-white mb-2"
                  style={{ fontSize: "1.5rem", fontWeight: 700 }}
                >
                  Get the best articles in your inbox
                </h3>
                <p className="text-white/60 text-sm mb-5">
                  Style tips, trend reports &amp; exclusive drops. Every Thursday, no spam.
                </p>
                <div className="flex max-w-md">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="nl-input"
                  />
                  <button className="nl-btn">Subscribe</button>
                </div>
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">

              {/* Trending */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h4
                  className="blog-title-font text-gray-800 mb-4"
                  style={{ fontSize: "1.1rem", fontWeight: 700 }}
                >
                  Trending Now
                </h4>
                {TRENDING.map((blog) => (
                  <div key={blog.id} className="trending-item">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="trending-thumb"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <TagBadge
                        category={blog.category}
                        color={blog.color}
                        textColor={blog.textColor}
                      />
                      <p
                        className="text-gray-800 text-xs font-semibold mt-1 leading-snug line-clamp-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {blog.title}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <FaClock size={9} /> {blog.readTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Categories list */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4
                  className="blog-title-font text-gray-800 mb-4"
                  style={{ fontSize: "1.1rem", fontWeight: 700 }}
                >
                  Browse Topics
                </h4>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                    const count = BLOGS.filter((b) => b.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeCategory === cat
                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            activeCategory === cat
                              ? "bg-indigo-100 text-indigo-500"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
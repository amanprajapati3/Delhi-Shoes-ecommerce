// src/components/RelatedProduct.jsx

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

// ─────────────────────────────────────────────────────────────
// REVEAL ANIMATION
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(30px)",
        transition: `all 0.7s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RELATED PRODUCT COMPONENT
// ─────────────────────────────────────────────────────────────

const RelatedProduct = ({ productId, category, gender }) => {
  const { products } = useProduct();

  const relatedProducts = useMemo(() => {
    if (!products?.length) return [];

    let filtered = products.filter(
      (item) =>
        item._id !== productId &&
        (item.category === category ||
          item.gender === gender)
    );

    // Randomize a little
    filtered = filtered.sort(() => 0.5 - Math.random());

    return filtered.slice(0, 8);
  }, [products, productId, category, gender]);

  if (!relatedProducts?.length) return null;

  return (
    <section
      className="relative overflow-hidden mt-24 md:mt-32"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-white -z-10" />

      {/* TOP DECOR */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d8cbb8] to-transparent" />

      <div className="px-4 md:px-10 lg:px-20 py-16">
        {/* HEADER */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p
                className="uppercase tracking-[0.35em] text-[11px] font-bold mb-4"
                style={{
                  color: "#b79d75",
                }}
              >
                Discover More
              </p>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
                className="text-3xl md:text-5xl text-[#1a1a1a]"
              >
                Related Products
              </h2>

              <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl leading-7">
                Handpicked styles selected just for you based on your current
                choice.
              </p>
            </div>

            <Link
              to="/shop"
              className="group flex items-center gap-2 text-sm font-bold tracking-wide uppercase"
              style={{
                color: "#1a1a1a",
              }}
            >
              Explore All
              <FaArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                size={11}
              />
            </Link>
          </div>
        </Reveal>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product, index) => (
            <Reveal
              key={product._id}
              delay={Math.min(index * 0.06, 0.45)}
            >
              <div
                className="group relative"
                style={{
                  transition: "all 0.4s ease",
                }}
              >
                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at top, rgba(212,201,184,0.35), transparent 70%)",
                  }}
                />

                {/* Card */}
                <div
                  className="relative rounded-[28px] overflow-hidden"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.04)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.03)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* BOTTOM SECTION */}
        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <div
              className="inline-flex items-center gap-3 px-6 py-4 rounded-full"
              style={{
                background: "#faf7f2",
                border: "1px solid #ece3d5",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: "#b79d75",
                }}
              />

              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold text-[#1a1a1a]">
                  {relatedProducts.length}
                </span>{" "}
                recommended products
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default RelatedProduct;
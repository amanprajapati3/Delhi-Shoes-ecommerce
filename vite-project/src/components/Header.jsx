import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import "./Header.css";
import Announcement from "./Announcement";

const sweepClass =
  "sweep-item block px-4 py-2 text-sm font-medium rounded cursor-pointer";

const SweepStyles = () => (
  <style>{``}</style>
);

/* =========================================================
   IMPORTANT:
   collection values below MUST MATCH DATABASE VALUES
   EXACTLY SAME AS ADD PRODUCT PAGE + PRODUCT SCHEMA
========================================================= */

const COLLECTIONS = [
  "topwear",
  "bottomwear",
  "footwear",
  "summer",
  "winter",
];

const GENDERS = ["men", "women", "kids", "unisex"];

/* =========================================================
   SEARCH DATA
========================================================= */

const SEARCH_CATALOG = [
  // MEN
  {
    label: "Men's Top Wear",
    category: "Men",
    tags: ["men", "top", "shirt", "tshirt", "polo", "topwear"],
    url: "/shop?gender=men&collection=topwear",
  },
  {
    label: "Men's Bottom Wear",
    category: "Men",
    tags: ["men", "bottom", "pants", "jeans", "bottomwear"],
    url: "/shop?gender=men&collection=bottomwear",
  },
  {
    label: "Men's Footwear",
    category: "Men",
    tags: ["men", "shoes", "sneakers", "footwear"],
    url: "/shop?gender=men&collection=footwear",
  },
  {
    label: "Men's Summer",
    category: "Men",
    tags: ["men", "summer"],
    url: "/shop?gender=men&collection=summer",
  },
  {
    label: "Men's Winter",
    category: "Men",
    tags: ["men", "winter", "hoodie", "jacket"],
    url: "/shop?gender=men&collection=winter",
  },

  // WOMEN
  {
    label: "Women's Top Wear",
    category: "Women",
    tags: ["women", "top", "kurti", "topwear"],
    url: "/shop?gender=women&collection=topwear",
  },
  {
    label: "Women's Bottom Wear",
    category: "Women",
    tags: ["women", "bottom", "bottomwear"],
    url: "/shop?gender=women&collection=bottomwear",
  },
  {
    label: "Women's Footwear",
    category: "Women",
    tags: ["women", "heels", "footwear"],
    url: "/shop?gender=women&collection=footwear",
  },
  {
    label: "Women's Summer",
    category: "Women",
    tags: ["women", "summer"],
    url: "/shop?gender=women&collection=summer",
  },
  {
    label: "Women's Winter",
    category: "Women",
    tags: ["women", "winter"],
    url: "/shop?gender=women&collection=winter",
  },

  // KIDS
  {
    label: "Kids Top Wear",
    category: "Kids",
    tags: ["kids", "topwear"],
    url: "/shop?gender=kids&collection=topwear",
  },
  {
    label: "Kids Bottom Wear",
    category: "Kids",
    tags: ["kids", "bottomwear"],
    url: "/shop?gender=kids&collection=bottomwear",
  },
  {
    label: "Kids Footwear",
    category: "Kids",
    tags: ["kids", "footwear"],
    url: "/shop?gender=kids&collection=footwear",
  },

  // SPECIAL
  {
    label: "New Arrivals",
    category: "Trending",
    tags: ["new", "latest", "new arrival"],
    url: "/shop?sort=new",
  },

  {
    label: "All Men",
    category: "Browse",
    tags: ["men"],
    url: "/shop?gender=men",
  },

  {
    label: "All Women",
    category: "Browse",
    tags: ["women"],
    url: "/shop?gender=women",
  },

  {
    label: "All Kids",
    category: "Browse",
    tags: ["kids"],
    url: "/shop?gender=kids",
  },

  {
    label: "Unisex",
    category: "Browse",
    tags: ["unisex"],
    url: "/shop?gender=unisex",
  },
];

/* 
   SEARCH FUNCTIONS */

function getSearchResults(query) {
  if (!query || query.trim().length < 1) return [];

  const q = query.toLowerCase().trim();

  return SEARCH_CATALOG
    .map((item) => {
      const labelMatch = item.label.toLowerCase().includes(q) ? 3 : 0;

      const tagMatch = item.tags.some((t) =>
        t.toLowerCase().includes(q)
      )
        ? 2
        : 0;

      const categoryMatch = item.category
        .toLowerCase()
        .includes(q)
        ? 1
        : 0;

      return {
        ...item,
        score: labelMatch + tagMatch + categoryMatch,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

function HighlightText({ text, query }) {
  if (!query) return <span>{text}</span>;

  const index = text
    .toLowerCase()
    .indexOf(query.toLowerCase());

  if (index === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, index)}

      <span className="sugg-highlight">
        {text.slice(index, index + query.length)}
      </span>

      {text.slice(index + query.length)}
    </span>
  );
}

/*
   SEARCH BAR */

function SearchBar({ variant = "desktop" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const results = getSearchResults(query);

  const showSuggestions =
    focused && query.length > 0 && results.length > 0;

  const grouped = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];

    acc[item.category].push(item);

    return acc;
  }, {});

  useEffect(() => {
    const handler = (e) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target)
      ) {
        setFocused(false);

        if (variant === "desktop") {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, [variant]);

  const handleSelect = (url) => {
    navigate(url);

    setQuery("");
    setFocused(false);
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (results.length > 0) {
      handleSelect(results[0].url);
    }
  };

  /* DESKTOP */

  if (variant === "desktop") {
    return (
      <div className="search-wrapper relative" ref={wrapRef}>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            className={`search-input-desktop ${
              open ? "open" : ""
            }`}
          />

          <button
            type="button"
            title="Search"
            onClick={() => {
              setOpen((prev) => !prev);

              if (!open) {
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 250);
              } else {
                setQuery("");
                setFocused(false);
              }
            }}
            className={`transition-colors hover:text-indigo-300 ${
              open
                ? "search-icon-active text-indigo-300"
                : "text-white"
            }`}
          >
            <FaSearch size={15} />
          </button>
        </form>

        {showSuggestions && (
          <div
            className="suggestions-box"
            style={{
              minWidth: 260,
              right: 0,
              left: "auto",
            }}
          >
            {Object.entries(grouped).map(
              ([category, items]) => (
                <div key={category}>
                  <div className="sugg-section-title">
                    {category}
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.url}
                      className="sugg-item"
                      onMouseDown={() =>
                        handleSelect(item.url)
                      }
                    >
                      <FaSearch className="sugg-icon" />

                      <span className="sugg-label">
                        <HighlightText
                          text={item.label}
                          query={query}
                        />
                      </span>

                      <span className="sugg-meta">
                        →
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  /* MOBILE  */

  return (
    <div className="relative" ref={wrapRef}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3"
      >
        <FaSearch
          className="text-gray-400 flex-shrink-0"
          size={13}
        />

        <input
          ref={inputRef}
          autoFocus
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFocused(false);
            }}
            className="text-gray-500 hover:text-white"
          >
            <FaTimes size={12} />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div
          className="suggestions-box"
          style={{
            left: 12,
            right: 12,
            top: "100%",
          }}
        >
          {Object.entries(grouped).map(
            ([category, items]) => (
              <div key={category}>
                <div className="sugg-section-title">
                  {category}
                </div>

                {items.map((item) => (
                  <div
                    key={item.url}
                    className="sugg-item"
                    onMouseDown={() =>
                      handleSelect(item.url)
                    }
                  >
                    <FaSearch className="sugg-icon" />

                    <span className="sugg-label">
                      <HighlightText
                        text={item.label}
                        query={query}
                      />
                    </span>

                    <span className="sugg-meta">
                      →
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* MEGA MENU */
const megaMenuData = [
  {
    gender: "Men",
    href: "/shop?gender=men",

    links: [
      {
        label: "Top Wear",
        to: "/shop?gender=men&collection=topwear",
      },
      {
        label: "Bottom Wear",
        to: "/shop?gender=men&collection=bottomwear",
      },
      {
        label: "Footwear",
        to: "/shop?gender=men&collection=footwear",
      },
      {
        label: "Summer",
        to: "/shop?gender=men&collection=summer",
      },
      {
        label: "Winter",
        to: "/shop?gender=men&collection=winter",
      },
    ],
  },

  {
    gender: "Women",
    href: "/shop?gender=women",

    links: [
      {
        label: "Top Wear",
        to: "/shop?gender=women&collection=topwear",
      },
      {
        label: "Bottom Wear",
        to: "/shop?gender=women&collection=bottomwear",
      },
      {
        label: "Footwear",
        to: "/shop?gender=women&collection=footwear",
      },
      {
        label: "Summer",
        to: "/shop?gender=women&collection=summer",
      },
      {
        label: "Winter",
        to: "/shop?gender=women&collection=winter",
      },
    ],
  },

  {
    gender: "Kids",
    href: "/shop?gender=kids",

    links: [
      {
        label: "Top Wear",
        to: "/shop?gender=kids&collection=topwear",
      },
      {
        label: "Bottom Wear",
        to: "/shop?gender=kids&collection=bottomwear",
      },
      {
        label: "Footwear",
        to: "/shop?gender=kids&collection=footwear",
      },
    ],
  },
];

const collectionLinks = [
  {
    label: "Top Wear",
    to: "/shop?collection=topwear",
  },

  {
    label: "Bottom Wear",
    to: "/shop?collection=bottomwear",
  },

  {
    label: "Footwear",
    to: "/shop?collection=footwear",
  },

  {
    label: "Summer",
    to: "/shop?collection=summer",
  },

  {
    label: "Winter",
    to: "/shop?collection=winter",
  },
];

/* HEADER */
const Header = () => {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [shopOpen, setShopOpen] = useState(false);

  const [collectionOpen, setCollectionOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const profileRef = useRef(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  return (
    <>
    
       <Announcement/>
      <SweepStyles />
      <header className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
        {/* MAIN NAV */}
        <div className="flex justify-between items-center px-4 md:px-10 lg:px-16 h-16">
          {/* LOGO */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="logo"
              className="md:w-48 w-40"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-1 items-center text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `sweep-nav px-4 py-2 inline-block ${
                    isActive
                      ? "!bg-black text-white"
                      : "text-white"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* SHOP */}
            <li className="relative group">
              <button className="sweep-nav flex items-center gap-1.5 px-4 py-2 text-white">
                Shop

                <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />
              </button>

              <div
                className="
                absolute left-1/2 -translate-x-1/2 top-full
                w-[520px]
                bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100
                opacity-0 invisible translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-200 z-50
              "
              >
                <div className="grid grid-cols-3 p-6">
                  {megaMenuData.map((col) => (
                    <div key={col.gender}>
                      <Link
                        to={col.href}
                        className={`${sweepClass} text-xs font-bold uppercase text-gray-500`}
                      >
                        {col.gender}
                      </Link>

                      <ul className="mt-2 flex flex-col gap-1">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              to={link.to}
                              className={`${sweepClass} text-gray-600`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 px-6 py-3 flex gap-4">
                  <Link
                    to="/shop?sort=new"
                    className={`${sweepClass} text-indigo-600`}
                  >
                    🆕 New Arrivals
                  </Link>
                </div>
              </div>
            </li>

            {/* COLLECTION */}
            <li className="relative group">
              <button className="sweep-nav flex items-center gap-1.5 px-4 py-2 text-white">
                Collection

                <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />
              </button>

              <div
                className="
                absolute left-0 top-full
                w-44 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100
                opacity-0 invisible translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-200 z-50 py-2
              "
              >
                {collectionLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`${sweepClass} text-gray-700`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </li>

            {/* NEW ARRIVAL */}
            <li>
              <NavLink
                to="/shop?sort=new"
                className={({ isActive }) =>
                  `sweep-nav px-4 py-2 inline-block ${
                    isActive
                      ? "!bg-black text-white"
                      : "text-white"
                  }`
                }
              >
                New Arrivals
              </NavLink>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center md:text-xl gap-5">
            <div className="hidden md:block">
              <SearchBar variant="desktop" />
            </div>

            {/* MOBILE SEARCH */}
            <button
              className="md:hidden"
              onClick={() =>
                setMobileSearchOpen((prev) => !prev)
              }
            >
              {mobileSearchOpen ? (
                <FaTimes />
              ) : (
                <FaSearch />
              )}
            </button>

            <Link
              to="/wishlist"
              className="text-rose-400 hover:text-red-700"
            >
              <FaHeart />
            </Link>

            <Link
              to="/cart"
              className="text-indigo-300 hover:text-indigo-500"
            >
              <BsCart4 />
            </Link>

            {/* PROFILE */}
            <div
              className="relative mt-1 cursor-pointer"
              ref={profileRef}
            >
              <button
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className="hover:text-gray-300"
              >
                <FaUser />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  {user ? (
                    <>
                      <Link
                        to="/orders"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className={`${sweepClass} text-gray-700`}
                      >
                        Orders
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className={`${sweepClass} text-gray-700`}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-500"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className={`${sweepClass} text-gray-700`}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE MENU */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <FaBars size={20} />
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div
          className={`mobile-search-bar md:hidden border-t border-gray-700 bg-gray-800 ${
            mobileSearchOpen ? "open" : ""
          }`}
        >
          {mobileSearchOpen && (
            <SearchBar variant="mobile" />
          )}
        </div>

        {/* OVERLAY */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* MOBILE SIDEBAR */}
        <div
          className={`
            fixed top-0 right-0 h-full w-72 bg-gray-900 text-white z-50
            transform transition-transform duration-300 md:hidden
            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
            <span className="font-bold text-lg">
              Menu
            </span>

            <button
              onClick={() => setMobileOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-1 text-sm">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="sweep-mobile block px-3 py-2.5"
            >
              Home
            </Link>

            {/* SHOP */}
            <div>
              <button
                onClick={() =>
                  setShopOpen((prev) => !prev)
                }
                className="sweep-mobile flex items-center justify-between w-full px-3 py-2.5"
              >
                Shop

                <FaChevronDown
                  className={`text-[10px] transition-transform ${
                    shopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {shopOpen && (
                <div className="pl-4 mt-1 flex flex-col gap-1">
                  {megaMenuData.map((col) => (
                    <Link
                      key={col.gender}
                      to={col.href}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="sweep-mobile block px-3 py-2 text-gray-400"
                    >
                      {col.gender}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* COLLECTION */}
            <div>
              <button
                onClick={() =>
                  setCollectionOpen(
                    (prev) => !prev
                  )
                }
                className="sweep-mobile flex items-center justify-between w-full px-3 py-2.5"
              >
                Collection

                <FaChevronDown
                  className={`text-[10px] transition-transform ${
                    collectionOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {collectionOpen && (
                <div className="pl-4 mt-1 flex flex-col gap-1">
                  {collectionLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="sweep-mobile block px-3 py-2 text-gray-400"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop?sort=new"
              onClick={() => setMobileOpen(false)}
              className="sweep-mobile block px-3 py-2.5"
            >
              New Arrivals
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
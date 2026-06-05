import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaArrowRight,
} from "react-icons/fa";
import "./Footer.css"

const FooterStyles = () => (
  <style>{`
    
  `}</style>
);

const quickLinks = [
  { label: "Home",        to: "/"       },
  { label: "Shop",        to: "/shop"   },
  { label: "New Arrivals",to: "/shop?sort=new" },
  { label: "Sale",        to: "/shop?sort=sale"},
];

const companyLinks = [
  { label: "About Us",   to: "/about"   },
  { label: "Blog",       to: "/blog"    },
  { label: "Contact",    to: "/contact" },
  { label: "Orders",     to: "/orders"  },
];

const categoryLinks = [
  { label: "Men",        to: "/shop?gender=men"   },
  { label: "Women",      to: "/shop?gender=women" },
  { label: "Kids",       to: "/shop?gender=kids"  },
  { label: "Footwear",   to: "/shop?collection=footwear"    },
  { label: "Top Wear",   to: "/shop?collection=topwear"     },
  { label: "Bottom Wear",to: "/shop?collection=bottomwear"  },
];

const socials = [
  { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: FaTwitter,   href: "https://twitter.com",   label: "Twitter"   },
  { Icon: FaFacebookF, href: "https://facebook.com",  label: "Facebook"  },
  { Icon: FaYoutube,   href: "https://youtube.com",   label: "YouTube"   },
  { Icon: FaPinterestP,href: "https://pinterest.com", label: "Pinterest" },
];

const Footer = () => {
  return (
    <>
      <FooterStyles />

      <footer className="bg-gray-800 text-white">
        {/* animated gradient top bar */}
        <div className="footer-top-accent" />

        {/* ── MAIN FOOTER BODY ── */}
        <div className="px-4 md:px-10 lg:px-16 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* COL 1 — Brand */}
            <div className="lg:col-span-1">
              <Link to="/">
                <img src="/logo.png" alt="Logo" className="w-36 mb-5" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                We curate fashion that speaks — timeless pieces for men, women & kids.
                Quality fabrics, thoughtful cuts, and styles that outlast trends. Dress
                with intention, every single day.
              </p>

              {/* Social icons */}
              <div className="flex gap-2.5 flex-wrap">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-btn"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* COL 2 — Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3">
                {quickLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      <FaArrowRight size={9} className="text-indigo-400 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5 mt-8">
                Company
              </h4>
              <ul className="flex flex-col gap-3">
                {companyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      <FaArrowRight size={9} className="text-indigo-400 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COL 3 — Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                Shop By Category
              </h4>
              <ul className="flex flex-col gap-3">
                {categoryLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="footer-link">
                      <FaArrowRight size={9} className="text-indigo-400 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COL 4 — Newsletter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                Stay in the Loop
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                New drops, exclusive offers, and style edits — straight to your inbox.
                No spam, unsubscribe anytime.
              </p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  Subscribe
                  <FaArrowRight size={11} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mt-7">
                <span className="footer-badge">🔒 Secure Payments</span>
                <span className="footer-badge">🚚 Free Shipping</span>
                <span className="footer-badge">↩ Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="px-4 md:px-10 lg:px-16">
          <div className="footer-divider" />
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="px-4 md:px-10 lg:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Delhi Shoes. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy"  className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms"    className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/sitemap"  className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
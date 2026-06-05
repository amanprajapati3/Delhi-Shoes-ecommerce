import { Link } from "react-router-dom";

const SiteMap = () => {
  const sections = [
    {
      title: "Shop",
      icon: "🛍️",
      links: [
        { name: "Men Collection", path: "/shop?gender=men" },
        { name: "Women Collection", path: "/shop?gender=women" },
        { name: "Kids", path: "/shop?gender=kids" },
        { name: "New Arrivals", path: "/shop?sort=new" },
      ],
    },
    {
      title: "Customer",
      icon: "👤",
      links: [
        { name: "My Account", path: "/profile" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Cart", path: "/cart" },
        { name: "Orders", path: "/orders" },
      ],
    },
    {
      title: "Information",
      icon: "📄",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Blogs", path: "/blog" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
      ],
    },
    {
      title: "Support",
      icon: "🎧",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "FAQs", path: "/faq" },
        { name: "Help Center", path: "/help" },
        { name: "Size Guide", path: "/size-guide" },
        { name: "Support Ticket", path: "/support" },
      ],
    },
  ];

  return (
    <div className="bg-[#faf8f4] min-h-screen overflow-hidden text-[#1a1a1a]">
      {/* HERO */}
      <section className="relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5efe5] via-[#faf8f4] to-white" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <p className="uppercase tracking-[0.35em] text-[#a07840] text-sm font-medium mb-5">
              Website Navigation
            </p>

            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8">
              Explore Every
              <span className="block text-[#a07840] font-medium">
                Corner Of Our Store
              </span>
            </h1>

            <p className="text-[#6b6459] text-lg leading-8 max-w-2xl">
              Quickly navigate through our fashion collections, customer
              services, policies, and support pages. Designed to help you find
              everything you need with ease.
            </p>

            <div className="flex flex-wrap gap-5 mt-12">
              <div className="bg-white border border-[#ece2d4] rounded-2xl px-6 py-5 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">100+</h3>
                <p className="text-[#6b6459] text-sm mt-1">Fashion Products</p>
              </div>

              <div className="bg-white border border-[#ece2d4] rounded-2xl px-6 py-5 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">24/7</h3>
                <p className="text-[#6b6459] text-sm mt-1">Customer Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -top-10 right-0 w-64 h-64 bg-[#e6d0b1] rounded-full blur-3xl opacity-50" />

            <div className="relative bg-white border border-[#eee2d3] rounded-[2rem] p-7 shadow-2xl hover:scale-[1.01] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
                alt="Fashion Sitemap"
                className="rounded-[1.5rem] h-[520px] w-full object-cover"
              />

              <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#ece2d4] animate-pulse">
                <p className="text-sm text-[#6b6459]">Easy Navigation</p>
                <h3 className="text-xl font-semibold mt-1">
                  Find Everything Faster
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SITEMAP GRID */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-[#a07840] text-sm mb-4">
              Quick Access
            </p>

            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Browse Website Sections
            </h2>

            <p className="max-w-3xl mx-auto text-[#6b6459] leading-8 text-lg">
              Discover collections, customer tools, policies, and support pages
              organized for a seamless shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="group relative bg-white border border-[#eee2d3] rounded-[2rem] p-8 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f6efe4] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5efe6] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>

                  <h3 className="text-2xl font-semibold mb-6 group-hover:text-[#a07840] transition-colors duration-300">
                    {section.title}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {section.links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.path}
                        className="group/link flex items-center justify-between text-[#6b6459] hover:text-[#a07840] transition-all duration-300 border-b border-[#f3ede4] pb-3"
                      >
                        <span>{link.name}</span>

                        <span className="translate-x-0 group-hover/link:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#1a1a1a] py-24 px-6 md:px-12 lg:px-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#a07840] opacity-20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-[#d8b98f] text-sm mb-4">
            Fashion Experience
          </p>

          <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
            Everything You Need,
            <span className="block">All In One Place</span>
          </h2>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-8 mb-14">
            Our sitemap is designed to simplify your browsing experience and
            help you quickly discover collections, policies, account features,
            and customer support resources.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Navigation",
                desc: "Access every important section of the store with organized navigation.",
              },
              {
                title: "Quick Shopping",
                desc: "Discover trending collections, categories, and exclusive fashion drops instantly.",
              },
              {
                title: "Customer Friendly",
                desc: "Find support pages, FAQs, policies, and account tools without confusion.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500"
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-8 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SiteMap;

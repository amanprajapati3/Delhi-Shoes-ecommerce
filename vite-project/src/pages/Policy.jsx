export default function Policy() {
  const policies = [
    {
      title: "Shipping Policy",
      icon: "🚚",
      content:
        "We offer fast and reliable shipping across India. Orders are usually dispatched within 24-48 hours and delivered within 3-7 business days depending on your location.",
    },
    {
      title: "Return & Exchange",
      icon: "🔄",
      content:
        "Easy 7-day return and exchange available for eligible products. Items must be unused, unwashed, and returned with original tags and packaging.",
    },
    {
      title: "Payment Security",
      icon: "🔒",
      content:
        "All transactions are securely processed using trusted payment gateways. We support UPI, Cards, Net Banking, Wallets, and Cash on Delivery on selected orders.",
    },
    {
      title: "Privacy Policy",
      icon: "🛡️",
      content:
        "Your personal information is protected and never shared with third parties without consent. We only use customer data to improve shopping experience and order fulfillment.",
    },
    {
      title: "Product Quality",
      icon: "✨",
      content:
        "Every clothing item is carefully curated and quality checked before dispatch. We focus on premium fabrics, comfortable fits, and modern fashion trends.",
    },
    {
      title: "Customer Support",
      icon: "💬",
      content:
        "Need help? Our support team is available to assist you with orders, sizing, returns, and product queries through email and social channels.",
    },
  ];

  return (
    <div className="bg-[#faf7f2] min-h-screen text-[#1a1a1a] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative py-24 px-6 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5efe6] to-[#faf7f2]" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="uppercase tracking-[0.35em] text-sm text-[#a07840] mb-4 font-medium">
              Our Policies
            </p>

            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6">
              Fashion That
              <span className="block font-medium text-[#a07840]">
                Builds Trust
              </span>
            </h1>

            <p className="text-[#6b6459] leading-8 text-lg max-w-xl">
              We believe shopping should feel smooth, secure, and enjoyable.
              From premium clothing collections to reliable shipping and easy
              returns — our policies are designed to provide transparency and a
              hassle-free shopping experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-[#ece4d8] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">5000+</h3>
                <p className="text-sm text-[#6b6459] mt-1">
                  Happy Customers
                </p>
              </div>

              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-[#ece4d8] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">100%</h3>
                <p className="text-sm text-[#6b6459] mt-1">
                  Secure Payments
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#e7d5bd] rounded-full blur-3xl opacity-60" />

            <div className="relative bg-white rounded-[2rem] p-8 shadow-xl border border-[#eee2d3] backdrop-blur-sm hover:scale-[1.01] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop"
                alt="Fashion"
                className="rounded-3xl h-[500px] w-full object-cover"
              />

              <div className="absolute bottom-14 left-14 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#ece4d8] animate-pulse">
                <p className="text-sm text-[#6b6459]">Trusted Fashion Store</p>
                <h3 className="text-xl font-semibold mt-1">
                  Premium Clothing Collections
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POLICIES GRID */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-[#a07840] text-sm mb-3">
              Transparency & Care
            </p>
            <h2 className="text-4xl md:text-5xl font-light mb-5">
              Everything You Need to Know
            </h2>
            <p className="text-[#6b6459] max-w-2xl mx-auto leading-8">
              Our policies are created to make your shopping experience secure,
              comfortable, and worry-free while exploring our latest fashion
              collections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((item, index) => (
              <div
                key={index}
                className="group bg-white border border-[#eee2d3] rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f7efe4] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5efe6] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#a07840] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-[#6b6459] leading-8 text-[15px]">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#1a1a1a] text-white py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#a07840] opacity-20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-[#d8b98f] text-sm mb-4">
            Why Customers Love Us
          </p>

          <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            Style, Comfort & Reliability
          </h2>

          <p className="text-gray-300 max-w-3xl mx-auto leading-8 text-lg mb-14">
            We bring together trendy fashion, quality craftsmanship, and a
            seamless shopping experience so you can confidently explore outfits
            for every occasion.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                desc: "Carefully selected fabrics and detailed finishing for long-lasting comfort.",
              },
              {
                title: "Modern Collections",
                desc: "Discover stylish clothing across casual, ethnic, streetwear, and seasonal collections.",
              },
              {
                title: "Customer First",
                desc: "Dedicated support and smooth return policies designed around customer satisfaction.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500"
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
}

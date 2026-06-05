export default function TermOfService() {
  const terms = [
    {
      title: "Account Responsibility",
      icon: "👤",
      desc: "Customers are responsible for maintaining accurate account information and securing their login credentials while using our platform.",
    },
    {
      title: "Product Availability",
      icon: "🛍️",
      desc: "All products are subject to availability. We reserve the right to discontinue or update collections, pricing, and inventory without prior notice.",
    },
    {
      title: "Order Acceptance",
      icon: "📦",
      desc: "Orders placed on our website are confirmed only after successful payment verification and dispatch approval from our team.",
    },
    {
      title: "Pricing & Payments",
      icon: "💳",
      desc: "All prices displayed are in INR and inclusive of applicable taxes unless stated otherwise. Secure payment gateways are used for all transactions.",
    },
    {
      title: "Returns & Refunds",
      icon: "🔄",
      desc: "Returns and refunds are processed according to our return policy. Products must meet eligibility conditions before approval.",
    },
    {
      title: "User Conduct",
      icon: "⚖️",
      desc: "Users must not misuse the website, attempt unauthorized access, or engage in fraudulent activities while using our services.",
    },
  ];

  return (
    <div className="bg-[#faf8f4] min-h-screen text-[#1a1a1a] overflow-hidden">
      {/* HERO */}
      <section className="relative py-24 px-6 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5efe4] via-[#faf8f4] to-[#fff]" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <p className="uppercase tracking-[0.35em] text-[#a07840] text-sm font-medium mb-5">
              Terms of Service
            </p>

            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-8">
              Clear Terms.
              <span className="block text-[#a07840] font-medium">
                Trusted Shopping.
              </span>
            </h1>

            <p className="text-[#6b6459] text-lg leading-8 max-w-2xl">
              Our Terms of Service outline the rules, responsibilities, and
              conditions for using our fashion platform. We aim to provide a
              secure, transparent, and enjoyable shopping experience for every
              customer exploring our collections.
            </p>

            <div className="flex flex-wrap gap-5 mt-12">
              <div className="bg-white border border-[#ece2d4] rounded-2xl px-6 py-5 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">24/7</h3>
                <p className="text-[#6b6459] text-sm mt-1">
                  Customer Support
                </p>
              </div>

              <div className="bg-white border border-[#ece2d4] rounded-2xl px-6 py-5 shadow-sm hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-semibold">100%</h3>
                <p className="text-[#6b6459] text-sm mt-1">
                  Secure Checkout
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -top-8 right-0 w-56 h-56 bg-[#e6d0b1] rounded-full blur-3xl opacity-50" />

            <div className="relative bg-white border border-[#eee2d3] rounded-[2rem] p-7 shadow-2xl hover:scale-[1.01] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
                alt="Fashion Terms"
                className="rounded-[1.5rem] h-[520px] w-full object-cover"
              />

              <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-[#ece2d4] animate-pulse">
                <p className="text-sm text-[#6b6459]">Reliable Fashion Store</p>
                <h3 className="text-xl font-semibold mt-1">
                  Safe & Transparent Policies
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS GRID */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-[#a07840] text-sm mb-4">
              Important Information
            </p>

            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Understanding Our Terms
            </h2>

            <p className="max-w-3xl mx-auto text-[#6b6459] leading-8 text-lg">
              These terms are designed to create a safe shopping environment
              while ensuring clarity regarding orders, payments, customer
              responsibilities, and platform usage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {terms.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white border border-[#eee2d3] rounded-[2rem] p-8 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f6efe4] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5efe6] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#a07840] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-[#6b6459] leading-8 text-[15px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADDITIONAL SECTION */}
      <section className="bg-[#1a1a1a] py-24 px-6 md:px-12 lg:px-20 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#a07840] opacity-20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-[#d8b98f] text-sm mb-4">
            Customer Commitment
          </p>

          <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
            Fashion With Trust & Transparency
          </h2>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-8 mb-14">
            We are committed to maintaining a secure and transparent shopping
            environment where customers can confidently explore premium fashion
            collections with clear policies and reliable service.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Experience",
                desc: "Your data and transactions are protected through reliable and secure technologies.",
              },
              {
                title: "Fair Policies",
                desc: "Transparent terms ensure clarity in purchases, returns, and platform usage.",
              },
              {
                title: "Customer Focused",
                desc: "Every policy is designed to improve convenience and build long-term trust.",
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
}

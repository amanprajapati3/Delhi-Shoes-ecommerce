import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Heart, Star, Users, Award, Zap } from 'lucide-react';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] flex items-center justify-center bg-black text-white overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2070" 
          alt="Delhi Shoes Premium Collection" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Since 2024
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
          >
            DELHI SHOES
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed"
          >
            Crafting the perfect balance between urban street culture and timeless elegance.
          </motion.p>
        </div>
      </motion.section>

      {/* Extended Brand Story */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8 leading-tight">Beyond Footwear: <br /><span className="text-blue-600">A Movement in Style.</span></h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Delhi Shoes didn't just start as a store; it started as a vision to bridge the gap between premium global trends and local accessibility. Based in the vibrant heart of India's capital, we draw inspiration from the energy of the streets and the sophistication of modern fashion.
              </p>
              <p>
                Our journey began with a single shelf of curated sneakers. Today, we have expanded into a full-scale e-commerce destination featuring high-end apparel, activewear, and formal footwear. Every piece in our collection is chosen for its durability, design, and ability to tell a story.
              </p>
              <p className="font-semibold text-gray-900">
                "We don't just sell products; we provide the confidence to walk your own path."
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000" alt="Style 1" className="rounded-2xl shadow-lg mt-8" />
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000" alt="Style 2" className="rounded-2xl shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Extended Grid */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Delhi Shoes?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We’ve built our reputation on three core pillars: Quality, Authenticity, and Community.</p>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { icon: <ShieldCheck />, title: "Authentic Only", desc: "100% original products sourced directly from verified manufacturers." },
            { icon: <Zap />, title: "Trendsetters", desc: "Our catalog is updated weekly with the latest global fashion drops." },
            { icon: <Users />, title: "Customer First", desc: "Dedicated support team available 24/7 to assist with your journey." },
            { icon: <Award />, title: "Premium Quality", desc: "Hand-inspected materials ensuring long-lasting comfort and durability." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 text-center"
            >
              <div className="text-blue-600 flex justify-center mb-6 scale-125">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex justify-center text-red-500">
            <Heart size={48} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold">Our Philosophy</h2>
          <p className="text-2xl text-gray-600 font-light italic">
            "Style should never come at the cost of comfort, and quality should never be a luxury. At Delhi Shoes, we believe in inclusive fashion that empowers every individual to step out with pride."
          </p>
          <div className="pt-10 flex flex-wrap justify-center gap-12">
            <div>
              <p className="text-4xl font-black text-blue-600">50K+</p>
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600">200+</p>
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">Premium Brands</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600">15+</p>
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-2">Cities Covered</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Personal / Founder Message Section */}
      <section className="bg-gray-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 flex-shrink-0">
            {/* Placeholder for Personal Image */}
            <img src="https://via.placeholder.com/200" alt="Founder" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4">A Note From Our Founder</h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
              "Hi, I’m <strong>Suraj Kumar</strong>. I started Delhi Shoes because I was tired of seeing subpar quality at high prices. I wanted to create a platform where a college student and a corporate professional could both find their perfect fit without compromise. Thank you for being a part of our community."
            </p>
            <div className="mt-8">
              <p className="font-bold text-blue-400 uppercase tracking-widest">Suraj Kumar</p>
              <p className="text-sm text-gray-500">Founder & CEO, Delhi Shoes</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
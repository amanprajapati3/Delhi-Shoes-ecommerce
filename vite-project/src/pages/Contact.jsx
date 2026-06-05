import  { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, User, MessageSquare, Tag } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' or 'error'

  // --- EmailJS Configuration ---
  // Replace these with your actual details from EmailJS dashboard
  const SERVICE_ID = "YOUR_SERVICE_ID";
  const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

  const handleSendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
          e.target.reset(); // Clear the form
      }, (error) => {
          console.log(error.text);
          setStatus({ type: 'error', message: 'Something went wrong. Please try again later or email us directly.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // --- Animation Variants ---
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  // Reusable Input Component for Attractive UI
  const FloatingInput = ({ icon: Icon, label, name, type = "text", ...props }) => (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
        <Icon size={20} />
      </div>
      <input
        type={type}
        name={name}
        id={name}
        required
        placeholder=" " // Crucial for floating label
        className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 peer transition-all shadow-sm"
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      
      {/* Hero Section - Matching About Us */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] flex items-center justify-center bg-black text-white overflow-hidden"
      >
        {/* Same background image as used in About Page example */}
        <img 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2070" 
          alt="Delhi Shoes Contact Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold mb-3 tracking-tight"
          >
            Connect With Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-light text-gray-200"
          >
            Have questions about shoes, apparel, or your order? We are here to help.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form Section */}
          <motion.div 
            className="md:col-span-7 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-100/70"
            variants={slideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
            <p className="text-gray-500 mb-10">We typically respond within 24 business hours.</p>
            
            {status.message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 mb-6 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
              >
                {status.message}
              </motion.div>
            )}

            <form ref={formRef} onSubmit={handleSendEmail}>
              <FloatingInput icon={User} label="Full Name" name="user_name" type="text" />
              <FloatingInput icon={Mail} label="Email Address" name="user_email" type="email" />
              <FloatingInput icon={Tag} label="Subject" name="subject" type="text" />

              {/* Message Textarea */}
              <div className="relative mb-8">
                <div className="absolute top-4 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                  <MessageSquare size={20} />
                </div>
                <textarea 
                  name="message" 
                  id="message" 
                  required
                  rows="6"
                  placeholder=" "
                  className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 peer transition-all shadow-sm"
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10"
                >
                  Your Message (Size, Style Query, etc.)
                </label>
              </div>

              <motion.button 
                type="submit" 
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto flex items-center justify-center space-x-3 bg-gray-900 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Address & Map Section */}
          <motion.div 
            className="md:col-span-5 space-y-10"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Contact Details Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100/70 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Our Store Location</h3>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-blue-500 mt-1 flex-shrink-0" />
                  <p>123 Fashion Street, <br />Connaught Place, <br />New Delhi, India - 110001</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-blue-500 flex-shrink-0" />
                  <p>+91 98765 43210</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-500 flex-shrink-0" />
                  <p>support@delhishoes.com</p>
                </div>
              </div>
            </div>

            {/* Google Map Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="h-[350px] rounded-3xl shadow-xl shadow-gray-100/70 overflow-hidden border-4 border-white"
            >
              <iframe 
              title="Delhi Shoes Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112067.66311652613!2d77.12761358742881!3d28.611246914562085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71dbff4665!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
            </motion.div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
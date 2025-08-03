import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const quickLinks = [
    "About Us", "Contact", "FAQs", "Size Guide", 
    "Shipping Info", "Returns", "Privacy Policy", "Terms of Service"
  ];

  const categories = [
    "Pendants", "Earrings", "Jhumkas", "Bracelets", 
    "Hair Accessories", "Hampers", "Gift Cards"
  ];

  return (
    <footer className="relative bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-pink-100/60 border-t border-purple-200/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-48 h-48 rounded-full bg-purple-200/30 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Anokhi <span className="text-purple-600">अदा</span>
            </h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Elegant jewelry for every mood & moment. Handcrafted with love, 
              designed for your unique style.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.instagram.com/anokhiada.fashion/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-purple-100 rounded-full hover:bg-purple-200 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} className="text-purple-700" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <a
                    href="#"
                    className="text-gray-700 hover:text-purple-600 transition-colors flex items-start group"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-xl font-bold mb-6">Shop</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <motion.li 
                  key={category}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <a
                    href="#"
                    className="text-gray-700 hover:text-purple-600 transition-colors flex items-start group"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {category}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-xl font-bold mb-6">Contact Us</h4>
            <div className="space-y-5">
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <span className="text-gray-700">
                  anokhiada.fashion@gmail.com
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <Phone size={18} className="text-purple-600" />
                </div>
                <span className="text-gray-700">
                  +91 87897 45872
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <MapPin size={18} className="text-purple-600" />
                </div>
                <span className="text-gray-700">
                  Nayabazar Rajmahal, Sahibganj, Jharkhand<br />
                  Pin: 816108
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div 
          className="border-t border-purple-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4 md:mb-0">
            © 2025 Anokhi अदा. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
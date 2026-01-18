import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  return (
    <section className="relative min-h-[85vh] bg-beige-200 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gold-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center py-20 min-h-[85vh]">
          {/* Left Side - Text Content (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gold-300 shadow-sm"
            >
              <Sparkles className="text-gold-600" size={16} />
              <span className="text-sm font-semibold text-navy-900">New Season Collection</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-navy-950 leading-[1.05] mb-6">
                Carry<br />
                <span className="text-gold-600">Confidence.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-navy-700 font-light mb-4">
                Premium Bags for Every Journey.
              </p>
              <p className="text-base text-navy-500 flex items-center gap-2">
                ✨ Trusted by 5,000+ happy customers across India
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-navy-600 max-w-xl leading-relaxed"
            >
              Premium bags designed for travel, weddings, and daily elegance. 
              Crafted with attention to detail, made to last.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-navy-950 text-black rounded-full font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  Shop Collection
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              </Link>
              
              <Link to="/category/wedding-collection">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white text-navy-950 rounded-full font-semibold text-lg flex items-center justify-center gap-2 border-2 border-navy-950 hover:bg-navy-950 hover:text-gray-900 transition-all duration-300"
                >
                  Wedding Collection
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badges - NEW */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-8 max-w-xl"
            >
              <div className="flex flex-col items-center text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-navy-100">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">🚚</span>
                </div>
                <span className="text-sm font-semibold text-navy-900">Free Shipping</span>
                <span className="text-xs text-navy-500">On orders ₹999+</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-navy-100">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">↩️</span>
                </div>
                <span className="text-sm font-semibold text-navy-900">Easy Returns</span>
                <span className="text-xs text-navy-500">7-Day policy</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-navy-100">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <span className="text-sm font-semibold text-navy-900">Secure Payments</span>
                <span className="text-xs text-navy-500">100% Protected</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Showcase (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="lg:col-span-2 relative h-[600px] hidden lg:block"
          >
            {/* Main Featured Bag */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-80 h-80 rounded-3xl overflow-hidden shadow-2xl z-20 border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"
                alt="Premium Handbag"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Secondary Bag */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-20 right-20 w-64 h-64 rounded-3xl overflow-hidden shadow-xl z-10 border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80"
                alt="Wedding Collection"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Tertiary Bag */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-0 left-0 w-56 h-56 rounded-3xl overflow-hidden shadow-lg border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
                alt="Travel Bag"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Decorative element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-gold-300 rounded-full opacity-20"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSlider;

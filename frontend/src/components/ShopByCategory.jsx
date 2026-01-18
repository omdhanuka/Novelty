import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ShopByCategory = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-5xl md:text-6xl text-navy-950 mb-4">
            Shop by Collection
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Curated selections for every occasion and style
          </p>
        </motion.div>

        {/* Editorial Grid Layout */}
        <div className="grid grid-cols-12 gap-6 auto-rows-[300px]">
          {/* Large Card - Wedding Collection */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 md:col-span-8 row-span-2"
          >
            <Link
              to="/category/wedding-collection"
              className="group relative block h-full rounded-2xl overflow-hidden bg-navy-900"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=80"
                  alt="Wedding Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
              </div>
              
              <div className="relative h-full flex flex-col justify-end p-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <span className="inline-block text-gold-400 text-sm font-semibold mb-3 tracking-widest uppercase">
                    Special Occasion
                  </span>
                  <h3 className="font-heading text-5xl md:text-6xl text-white mb-4">
                    Wedding<br />Collection
                  </h3>
                  <p className="text-white/80 text-lg mb-6 max-w-md font-light">
                    Crafted for Special Moments
                  </p>
                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight size={20} />
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>

          {/* Medium Card - Ladies Handbags */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 md:col-span-4 row-span-2"
          >
            <Link
              to="/category/ladies-bags"
              className="group relative block h-full rounded-2xl overflow-hidden bg-beige-300"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"
                  alt="Ladies Handbags"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
              </div>
              
              <div className="relative h-full flex flex-col justify-end p-8">
                <span className="inline-block text-gold-400 text-xs font-semibold mb-2 tracking-widest uppercase">
                  Everyday
                </span>
                <h3 className="font-heading text-3xl text-white mb-2">
                  Ladies<br />Handbags
                </h3>
                <p className="text-white/70 text-sm mb-4 font-light">
                  Timeless Elegance
                </p>
                <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Shop Now</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Small Card - Travel Essentials */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-6 md:col-span-4"
          >
            <Link
              to="/category/travel-bags"
              className="group relative block h-full rounded-2xl overflow-hidden bg-navy-200"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
                  alt="Travel Bags"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
              </div>
              
              <div className="relative h-full flex flex-col justify-end p-6">
                <h3 className="font-heading text-2xl text-white mb-2">
                  Travel<br />Essentials
                </h3>
                <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Discover</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Small Card - Covers & Storage */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-6 md:col-span-4"
          >
            <Link
              to="/category/covers"
              className="group relative block h-full rounded-2xl overflow-hidden bg-gold-100"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1610979420678-5d1bd437a2c9?w=600&q=80"
                  alt="Covers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
              </div>
              
              <div className="relative h-full flex flex-col justify-end p-6">
                <h3 className="font-heading text-2xl text-white mb-2">
                  Covers &<br />Storage
                </h3>
                <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>View All</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Call to Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden"
          >
            <Link
              to="/products"
              className="group relative block h-full p-8 flex flex-col justify-center items-center text-center border-2 border-navy-200 hover:border-gold-400 transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #0a1628 0%, #1a2742 50%, #0a1628 100%)'
              }}
            >
              <div className="absolute inset-0 opacity-10" style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(217,158,70,0.3), transparent 70%)'
              }}></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ 
                  backgroundColor: 'rgba(217, 158, 70, 0.2)' 
                }}>
                  <ArrowRight style={{ color: '#d99e46' }} size={24} />
                </div>
                <h3 className="font-heading text-3xl mb-3" style={{ color: '#ffffff' }}>
                  View All Collections
                </h3>
                <p className="mb-6 font-light text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Explore our complete range of premium bags
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm group-hover:gap-3 transition-all duration-300" style={{ 
                  backgroundColor: 'rgba(217, 158, 70, 0.1)',
                  border: '1px solid rgba(217, 158, 70, 0.3)',
                  color: '#d99e46'
                }}>
                  <span>Browse All</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;

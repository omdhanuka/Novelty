import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const ShopByCategory = () => {
  const categories = [
    {
      id: 1,
      name: 'Travel Bags',
      slug: 'travel-bags',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      description: 'Adventure Ready',
      count: '120+ Products',
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      name: 'Ladies Handbags',
      slug: 'ladies-bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
      description: 'Everyday Elegance',
      count: '200+ Products',
      color: 'from-pink-600 to-rose-500',
      bgColor: 'bg-pink-50',
    },
    {
      id: 3,
      name: 'Wedding Collection',
      slug: 'wedding-collection',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
      description: 'Bridal Luxury',
      count: '80+ Products',
      color: 'from-purple-600 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      name: 'Premium Covers',
      slug: 'covers',
      image: 'https://images.unsplash.com/photo-1610979420678-5d1bd437a2c9?w=800',
      description: 'Perfect Protection',
      count: '150+ Products',
      color: 'from-emerald-600 to-teal-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4">
            <Sparkles className="text-amber-600" size={18} />
            <span className="text-amber-900 font-semibold text-sm">Shop by Category</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Find Your Perfect Bag
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our curated collections designed for every occasion and lifestyle
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className="group relative block h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-3">
                      {category.count}
                    </span>
                    <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-lg mb-4">{category.description}</p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span>Shop Now</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                    </div>
                  </motion.div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{
                  backgroundImage: `linear-gradient(135deg, ${category.color.split(' ')[1]}, ${category.color.split(' ')[3]})`
                }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
        <div className="text-center mb-12">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Shop by Category
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find the perfect bag or cover for every occasion
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/category/${category.slug}`}
                className="group block relative h-64 rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} group-hover:opacity-90 transition-opacity duration-300`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <motion.p
                    className="text-sm font-semibold mb-1 opacity-90"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 0.9, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    {category.description}
                  </motion.p>
                  
                  <motion.h3
                    className="text-2xl font-display font-bold mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    {category.name}
                  </motion.h3>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                    <span>Explore Collection</span>
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/categories" className="btn-primary inline-flex items-center gap-2">
            View All Categories
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByCategory;

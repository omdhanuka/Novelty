import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';

const SpecialCollections = () => {
  const collections = [
    {
      id: 1,
      title: 'Wedding Collection',
      subtitle: 'Bridal Elegance',
      description: 'Exquisite bridal purses, clutches & accessories for your special day',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      link: '/collection/wedding',
      gradient: 'from-rose-900 via-pink-800 to-purple-900',
      accent: 'from-pink-500 to-rose-500',
      badge: 'Trending',
      products: '80+',
    },
    {
      id: 2,
      title: 'Travel Essentials',
      subtitle: 'Adventure Awaits',
      description: 'Complete travel gear - trolleys, backpacks, duffels & pouches',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
      link: '/collection/travel',
      gradient: 'from-blue-900 via-cyan-800 to-teal-900',
      accent: 'from-cyan-500 to-blue-500',
      badge: 'Popular',
      products: '120+',
    },
    {
      id: 3,
      title: 'Budget Collection',
      subtitle: 'Under ₹999',
      description: 'Premium quality bags at unbeatable prices. Limited stock!',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200',
      link: '/collection/under-999',
      gradient: 'from-emerald-900 via-green-800 to-lime-900',
      accent: 'from-green-500 to-emerald-500',
      badge: 'Hot Deal',
      products: '50+',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <Tag className="text-purple-600" size={18} />
            <span className="text-purple-900 font-semibold text-sm">Exclusive Collections</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Curated For You
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Handpicked collections designed for special occasions and unique needs
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <Link
                to={collection.link}
                className="group block relative h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-85`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>

                {/* Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <motion.div
                    className={`px-4 py-2 bg-gradient-to-r ${collection.accent} text-white rounded-full font-bold text-sm shadow-lg backdrop-blur-sm flex items-center gap-2`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                  >
                    <Sparkles size={14} />
                    {collection.badge}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-4">
                      {collection.products} Products
                    </span>
                    
                    <p className="text-amber-400 text-sm font-bold mb-2 tracking-wider uppercase">
                      {collection.subtitle}
                    </p>
                    
                    <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
                      {collection.title}
                    </h3>
                    
                    <p className="text-white/90 text-lg mb-6 leading-relaxed">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-white font-bold text-lg">
                      <span>Explore Collection</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                    </div>
                  </motion.div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialCollections;

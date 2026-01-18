import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Plane, Heart, Gift, ShoppingBag } from 'lucide-react';

const UseCaseCategories = () => {
  const useCases = [
    {
      id: 1,
      name: 'For Travel',
      icon: Plane,
      description: 'Adventure-ready bags',
      slug: 'travel-bags',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      name: 'For Daily Use',
      icon: ShoppingBag,
      description: 'Everyday essentials',
      slug: 'ladies-bags',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
    },
    {
      id: 3,
      name: 'For Weddings',
      icon: Heart,
      description: 'Bridal elegance',
      slug: 'wedding-collection',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
    {
      id: 4,
      name: 'For Gifting',
      icon: Gift,
      description: 'Perfect presents',
      slug: 'products',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: 5,
      name: 'For Office',
      icon: Briefcase,
      description: 'Professional style',
      slug: 'ladies-bags',
      color: 'from-navy-500 to-indigo-500',
      bgColor: 'bg-navy-50',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-navy-950 mb-3">
            Shop by Occasion
          </h2>
          <p className="text-lg text-navy-600">
            Find the perfect bag for every moment
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${useCase.slug}`}
                  className={`group block ${useCase.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 text-center`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className="font-heading text-lg text-navy-950 mb-1">
                    {useCase.name}
                  </h3>
                  <p className="text-sm text-navy-600">
                    {useCase.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCaseCategories;

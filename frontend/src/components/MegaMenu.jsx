import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const MegaMenu = ({ category }) => {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-screen max-w-4xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white shadow-2xl rounded-b-2xl border border-secondary-200 p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Subcategories */}
          <div className="col-span-2">
            <h3 className="font-display font-bold text-lg text-secondary-900 mb-4">
              Shop by Type
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/category/${category.slug}/${sub.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition group"
                >
                  <span className="font-medium">{sub.name}</span>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
            <h4 className="font-display font-bold text-secondary-900 mb-2">
              ✨ Featured
            </h4>
            <p className="text-sm text-secondary-700 mb-4">
              Explore our bestselling {category.name.toLowerCase()}
            </p>
            <Link
              to={`/category/${category.slug}/featured`}
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
            >
              View Collection
              <ArrowRight size={16} />
            </Link>
            
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-xs text-secondary-600 mb-2">Price Ranges</p>
              <div className="space-y-1">
                <Link
                  to={`/category/${category.slug}?price=0-500`}
                  className="block text-sm text-secondary-700 hover:text-primary-600"
                >
                  Under ₹500
                </Link>
                <Link
                  to={`/category/${category.slug}?price=500-1000`}
                  className="block text-sm text-secondary-700 hover:text-primary-600"
                >
                  ₹500 - ₹1000
                </Link>
                <Link
                  to={`/category/${category.slug}?price=1000-2000`}
                  className="block text-sm text-secondary-700 hover:text-primary-600"
                >
                  ₹1000 - ₹2000
                </Link>
                <Link
                  to={`/category/${category.slug}?price=2000+`}
                  className="block text-sm text-secondary-700 hover:text-primary-600"
                >
                  Above ₹2000
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;

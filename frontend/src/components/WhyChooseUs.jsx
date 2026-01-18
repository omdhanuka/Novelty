import { motion } from 'framer-motion';
import {
  Shield,
  Truck,
  CreditCard,
  RefreshCw,
  MapPin,
  Award,
  Sparkles,
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: Shield,
      title: '98% Positive Reviews',
      description: 'Rated excellent by thousands of verified buyers',
      color: 'from-blue-600 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      icon: CreditCard,
      title: 'Safe & Secure Payments',
      description: '100% encrypted transactions with COD & EMI options',
      color: 'from-green-600 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      icon: Truck,
      title: 'PAN India Delivery',
      description: '3-5 days delivery to 20,000+ pin codes',
      color: 'from-orange-600 to-amber-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      id: 4,
      icon: RefreshCw,
      title: '7-Day Easy Returns',
      description: 'No questions asked. Hassle-free refunds & exchanges',
      color: 'from-purple-600 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 5,
      icon: Award,
      title: '5,000+ Orders Delivered',
      description: 'Trusted by brides, travelers & working professionals',
      color: 'from-amber-600 to-yellow-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      id: 6,
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Handpicked designs. Unmatched craftsmanship',
      color: 'from-pink-600 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4"
          >
            <Sparkles className="text-gold-600" size={18} />
            <span className="text-navy-900 font-semibold text-sm">Why Choose Bagvo</span>
          </motion.div>
          
          <motion.h2
            className="font-heading text-4xl md:text-5xl text-navy-950 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why 5,000+ Customers Trust Us
          </motion.h2>
          <motion.p
            className="text-lg text-navy-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your satisfaction is our priority. Here's what makes us special
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className={feature.iconColor} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

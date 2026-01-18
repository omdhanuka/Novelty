import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Malhotra',
      location: 'Rohini, Delhi',
      rating: 5,
      review: 'Absolutely loved my Heritage Leather Tote! I carry it to my office daily and it\'s both stylish and practical. The quality is exceptional - no wear even after 6 months of daily use.',
      product: 'Heritage Leather Tote',
      image: 'https://i.pravatar.cc/150?img=1',
      date: '2 weeks ago',
      verified: true,
    },
    {
      id: 2,
      name: 'Kavita Sharma',
      location: 'Raipur, Chhattisgarh',
      rating: 5,
      review: 'The Royal Bridal Potli I ordered for my wedding was a showstopper! Every guest asked where I got it from. The golden embroidery was breathtaking. Thank you Bagvo!',
      product: 'Royal Bridal Potli',
      image: 'https://i.pravatar.cc/150?img=5',
      date: '1 month ago',
      verified: true,
    },
    {
      id: 3,
      name: 'Raj Kumar',
      location: 'Andheri, Mumbai',
      rating: 5,
      review: 'Ordered the Executive Pro Backpack for my work-from-office days. Fits my laptop, water bottle, and files perfectly. The build quality is amazing for the price!',
      product: 'Executive Pro Backpack',
      image: 'https://i.pravatar.cc/150?img=12',
      date: '3 weeks ago',
      verified: true,
    },
    {
      id: 4,
      name: 'Sneha Iyer',
      location: 'Koramangala, Bangalore',
      rating: 5,
      review: 'My Radiance Sling Bag is now my everyday companion - shopping, outings, movie nights. The crossbody style is super comfortable and the color is gorgeous. Highly recommend!',
      product: 'Radiance Sling Bag',
      image: 'https://i.pravatar.cc/150?img=9',
      date: '1 week ago',
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100 to-teal-100 rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-4">
            <ThumbsUp className="text-gold-600" size={18} />
            <span className="text-navy-900 font-semibold text-sm">Verified Buyers</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-navy-950 mb-4">
            Real Stories, Real Moments
          </h2>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Over 5,000+ happy customers across India trust us with their special moments
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Quote size={80} className="text-amber-600" />
              </div>

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                  ))}
                  {review.verified && (
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  "{review.review}"
                </p>

                {/* Product Name */}
                <div className="inline-block px-4 py-2 bg-slate-100 rounded-lg mb-6">
                  <p className="text-slate-600 text-sm font-semibold">{review.product}</p>
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                    <p className="text-slate-500 text-sm">{review.location}</p>
                  </div>
                  <span className="text-slate-400 text-sm">{review.date}</span>
                </div>
              </div>

              {/* Hover Gradient Border */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-[2px]">
                <div className="bg-white rounded-3xl h-full w-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Happy Customers', value: '50K+', icon: '😊' },
            { label: 'Products Sold', value: '200K+', icon: '📦' },
            { label: '5-Star Reviews', value: '45K+', icon: '⭐' },
            { label: 'Repeat Customers', value: '85%', icon: '🔄' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-slate-600 text-sm font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;

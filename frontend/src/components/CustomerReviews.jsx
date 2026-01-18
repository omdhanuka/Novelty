import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      review: 'Amazing quality travel bags! I bought a trolley bag for my honeymoon and it was perfect. The durability and design exceeded my expectations. Highly recommended!',
      product: 'Premium Travel Trolley Bag',
      image: 'https://i.pravatar.cc/150?img=1',
      date: '2 weeks ago',
      verified: true,
    },
    {
      id: 2,
      name: 'Anjali Verma',
      location: 'Delhi',
      rating: 5,
      review: 'The bridal purse collection is stunning! Got my dulhan purse from here and received so many compliments at my wedding. Worth every penny!',
      product: 'Bridal Dulhan Purse',
      image: 'https://i.pravatar.cc/150?img=5',
      date: '1 month ago',
      verified: true,
    },
    {
      id: 3,
      name: 'Rahul Mehta',
      location: 'Bangalore, Karnataka',
      rating: 5,
      review: 'Great prices and lightning-fast delivery! The saree covers are exactly what I needed. The quality is top-notch. Will definitely order again!',
      product: 'Saree Cover Set',
      image: 'https://i.pravatar.cc/150?img=12',
      date: '3 weeks ago',
      verified: true,
    },
    {
      id: 4,
      name: 'Sneha Patel',
      location: 'Ahmedabad, Gujarat',
      rating: 5,
      review: 'Love my new handbag! Perfect size, excellent quality, and the customer service team was incredibly helpful throughout my purchase.',
      product: 'Ladies Designer Handbag',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
            <ThumbsUp className="text-orange-600" size={18} />
            <span className="text-orange-900 font-semibold text-sm">Verified Reviews</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Customer Love
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real experiences from our 50,000+ happy customers across India
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
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            See what our happy customers are saying about us
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="card p-6 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary-200">
                <Quote size={40} fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-secondary-700 mb-4 leading-relaxed">
                "{review.review}"
              </p>

              {/* Product */}
              <p className="text-sm text-primary-600 font-semibold mb-4">
                Purchased: {review.product}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-secondary-200">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-secondary-900">{review.name}</h4>
                  <p className="text-xs text-secondary-600">{review.location}</p>
                </div>
                <span className="text-xs text-secondary-500">{review.date}</span>
              </div>

              {/* Verified Badge */}
              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                <Star size={12} fill="currentColor" />
                <span className="font-semibold">Verified Purchase</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          className="mt-12 card p-8 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div>
              <div className="text-5xl font-bold text-primary-600 mb-2">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-secondary-600">Based on 10,847 reviews</p>
            </div>
            
            <div className="h-20 w-px bg-secondary-300" />
            
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-secondary-700 w-20">5 Stars</span>
                <div className="w-40 h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: '85%' }} />
                </div>
                <span className="text-sm text-secondary-600">85%</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-secondary-700 w-20">4 Stars</span>
                <div className="w-40 h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: '12%' }} />
                </div>
                <span className="text-sm text-secondary-600">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-700 w-20">3 Stars</span>
                <div className="w-40 h-2 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: '3%' }} />
                </div>
                <span className="text-sm text-secondary-600">3%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;

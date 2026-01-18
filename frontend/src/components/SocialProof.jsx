import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, Camera } from 'lucide-react';

const SocialProof = () => {
  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
      likes: 2453,
      comments: 184,
      username: '@priya_travels',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
      likes: 3891,
      comments: 245,
      username: '@fashionista_raj',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600',
      likes: 5124,
      comments: 421,
      username: '@wedding_diaries',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1610979420678-5d1bd437a2c9?w=600',
      likes: 1782,
      comments: 156,
      username: '@organize_queen',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1622260614927-9f9c0f5f2f75?w=600',
      likes: 4231,
      comments: 312,
      username: '@adventure_seeker',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
      likes: 3567,
      comments: 289,
      username: '@style_maven',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full mb-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Instagram size={24} />
            <span className="font-bold text-lg">@bagshop_official</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            #BagShopLove
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Join thousands of happy customers sharing their BagShop moments
          </p>
          
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera size={20} />
            Tag Us & Get Featured
          </motion.button>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Heart size={24} fill="white" />
                      <span className="font-bold text-lg">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={24} />
                      <span className="font-bold text-lg">{post.comments}</span>
                    </div>
                  </div>
                  
                  {/* Username */}
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
                    <span className="font-semibold">{post.username}</span>
                  </div>
                </div>
              </div>

              {/* Instagram Icon */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram size={20} className="text-pink-600" />
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 rounded-3xl p-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Share Your BagShop Story
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            Post your photos with <span className="font-bold text-pink-600">#BagShopLove</span> and tag us to win exciting rewards!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-white rounded-xl shadow-md">
              <p className="text-sm text-slate-600 font-semibold">Monthly Contest Winner</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">₹5,000 Voucher</p>
            </div>
            <div className="px-6 py-3 bg-white rounded-xl shadow-md">
              <p className="text-sm text-slate-600 font-semibold">Featured Posts</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">20% Off</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;

import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

const InstagramProof = () => {
  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
      likes: 2847,
      comments: 156,
      username: '@priya_weddings',
      caption: 'My perfect wedding clutch from @bagvo ✨💍'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      likes: 1923,
      comments: 89,
      username: '@kavita_travels',
      caption: 'Travel buddy for my Goa trip 🌴 @bagvo'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      likes: 3421,
      comments: 234,
      username: '@sneha.style',
      caption: 'Obsessed with this sling! 😍 @bagvo'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1564422167509-4f36b88f2f75?w=600&q=80',
      likes: 4156,
      comments: 312,
      username: '@mumbai_bride',
      caption: 'Dream potli bag for my sangeet 💛 @bagvo'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      likes: 1567,
      comments: 78,
      username: '@workwear_diaries',
      caption: 'My daily office companion 💼 @bagvo'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1564222195116-8df6e5a6f641?w=600&q=80',
      likes: 2934,
      comments: 187,
      username: '@diwali_gifting',
      caption: 'Perfect gift for my bestie! 🎁 @bagvo'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-beige-100 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <Instagram className="text-pink-600" size={20} />
            <span className="text-navy-900 font-semibold text-sm">Join 50k+ Followers</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-navy-950 mb-4">
            As Seen on Instagram
          </h2>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Real customers, real moments. Tag <span className="text-gold-600 font-semibold">@bagvo</span> to get featured
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              {/* Post Image */}
              <img
                src={post.image}
                alt={`Instagram post by ${post.username}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-white text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Heart size={16} fill="white" />
                    <span className="font-semibold">{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span className="font-semibold">{post.comments}</span>
                  </div>
                </div>
                
                {/* Username & Caption */}
                <p className="text-white text-xs font-medium mb-1">{post.username}</p>
                <p className="text-white/80 text-xs line-clamp-2">{post.caption}</p>
              </div>

              {/* Instagram Icon Indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram size={20} className="text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://instagram.com/bagvo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Instagram size={22} />
            <span>Follow @bagvo on Instagram</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramProof;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { contentAPI } from '../lib/api';

const PromotionalBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await contentAPI.getHomeContent();
        if (response.data.success && response.data.data.banners) {
          // Filter only active banners
          const activeBanners = response.data.data.banners.filter(banner => banner.isActive);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading || banners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-beige-100 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400"></div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {banner.subtitle && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span className="text-yellow-300 text-sm font-medium uppercase tracking-wider">
                        {banner.subtitle}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                    {banner.title}
                  </h3>
                  
                  {banner.description && (
                    <p className="text-white/90 text-sm mb-4 line-clamp-2">
                      {banner.description}
                    </p>
                  )}

                  {banner.buttonLink && (
                    <Link
                      to={banner.buttonLink}
                      className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group"
                    >
                      <span>{banner.buttonText || 'Shop Now'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;

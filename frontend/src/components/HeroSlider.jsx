import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Premium Leather Collection',
      subtitle: 'Handcrafted Excellence',
      description: 'Discover our exclusive range of handcrafted leather bags made with the finest Italian leather',
      cta: 'Explore Collection',
      link: '/collection/leather',
      gradient: 'from-slate-900 via-amber-900 to-orange-900',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200',
    },
    {
      id: 2,
      title: 'Wedding Season Special',
      subtitle: 'Elegant Bridal Bags',
      description: 'Complete your bridal look with our stunning collection of wedding bags and clutches',
      cta: 'Shop Wedding',
      link: '/collection/wedding',
      gradient: 'from-rose-900 via-pink-900 to-purple-900',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200',
    },
    {
      id: 3,
      title: 'Travel in Style',
      subtitle: 'Adventure Awaits',
      description: 'Premium travel bags designed for the modern explorer. Durable, spacious, and stylish',
      cta: 'View Travel Bags',
      link: '/collection/travel',
      gradient: 'from-blue-900 via-teal-900 to-emerald-900',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200',
    },
    {
      id: 4,
      title: 'Designer Ladies Bags',
      subtitle: 'Timeless Fashion',
      description: 'Elevate your everyday style with our curated collection of designer handbags',
      cta: 'Shop Now',
      link: '/collection/ladies',
      gradient: 'from-purple-900 via-fuchsia-900 to-pink-900',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex items-center">
            <motion.div
              className="max-w-2xl text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.span
                className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-300 font-semibold text-sm backdrop-blur-sm mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {slides[currentSlide].subtitle}
              </motion.span>
              
              <motion.h1
                className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p
                className="text-xl mb-10 max-w-lg text-slate-200 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4"
              >
                <Link
                  to={slides[currentSlide].link}
                  className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 flex items-center gap-2"
                >
                  {slides[currentSlide].cta}
                  <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Link>
                <Link
                  to="/all-products"
                  className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  View All
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30 group z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30 group z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 bg-amber-500'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

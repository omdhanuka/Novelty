import { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import PromotionalBanners from '../components/PromotionalBanners';
import UseCaseCategories from '../components/UseCaseCategories';
import ShopByCategory from '../components/ShopByCategory';
import BestSellers from '../components/BestSellers';
import BrandStory from '../components/BrandStory';
import SpecialCollections from '../components/SpecialCollections';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import InstagramProof from '../components/InstagramProof';
import Footer from '../components/Footer';
import { contentAPI } from '../lib/api';

const HomePage = () => {
  const [sectionVisibility, setSectionVisibility] = useState({
    heroSlider: true,
    promotionalBanners: true,
    shopByCategory: true,
    bestSellers: true,
    brandStory: true,
    specialCollections: true,
    whyChooseUs: true,
    customerReviews: true,
    instagramProof: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectionVisibility = async () => {
      try {
        const response = await contentAPI.getHomeContent();
        if (response.data.success && response.data.data.sectionVisibility) {
          setSectionVisibility({
            ...sectionVisibility,
            ...response.data.data.sectionVisibility,
          });
        }
      } catch (error) {
        console.error('Error fetching section visibility:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSectionVisibility();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-950"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100">
      <Header />
      <main>
        {sectionVisibility.heroSlider && <HeroSlider />}
        {sectionVisibility.promotionalBanners && <PromotionalBanners />}
        {sectionVisibility.shopByCategory && <ShopByCategory />}
        {sectionVisibility.bestSellers && <BestSellers />}
        {sectionVisibility.brandStory && <BrandStory />}
        {sectionVisibility.specialCollections && <SpecialCollections />}
        {sectionVisibility.whyChooseUs && <WhyChooseUs />}
        {sectionVisibility.customerReviews && <CustomerReviews />}
        {sectionVisibility.instagramProof && <InstagramProof />}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

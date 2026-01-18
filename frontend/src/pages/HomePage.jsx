import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../components/ShopByCategory';
import BestSellers from '../components/BestSellers';
import SpecialCollections from '../components/SpecialCollections';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import SocialProof from '../components/SocialProof';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <ShopByCategory />
        <BestSellers />
        <SpecialCollections />
        <WhyChooseUs />
        <CustomerReviews />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

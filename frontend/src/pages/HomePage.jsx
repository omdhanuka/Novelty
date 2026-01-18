import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import UseCaseCategories from '../components/UseCaseCategories';
import ShopByCategory from '../components/ShopByCategory';
import BestSellers from '../components/BestSellers';
import BrandStory from '../components/BrandStory';
import SpecialCollections from '../components/SpecialCollections';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import InstagramProof from '../components/InstagramProof';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-beige-100">
      <Header />
      <main>
        <HeroSlider />
        {/* <UseCaseCategories /> */}
        <ShopByCategory />
        <BestSellers />
        <BrandStory />
        <SpecialCollections />
        <WhyChooseUs />
        <CustomerReviews />
        {/* <InstagramProof /> */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image, Type, Layout, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Hero Slider Content
  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      title: 'Premium Leather Bags',
      subtitle: 'Elevate Your Style',
      description: 'Discover our exclusive collection of handcrafted leather bags',
      image: '/images/hero1.jpg',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      isActive: true,
      order: 1,
    },
    {
      id: 2,
      title: 'Summer Collection 2026',
      subtitle: 'Fresh & Trendy',
      description: 'Explore the latest trends in bags and accessories',
      image: '/images/hero2.jpg',
      buttonText: 'Explore',
      buttonLink: '/products?category=summer',
      isActive: true,
      order: 2,
    },
  ]);

  // Banner Content
  const [banners, setBanners] = useState([
    {
      id: 1,
      type: 'promotional',
      title: 'Free Shipping',
      description: 'On orders over ₹999',
      icon: 'truck',
      isActive: true,
    },
    {
      id: 2,
      type: 'promotional',
      title: '100% Genuine',
      description: 'Authentic products only',
      icon: 'shield',
      isActive: true,
    },
  ]);

  // Section Content
  const [sections, setSections] = useState([
    {
      id: 1,
      name: 'Best Sellers',
      component: 'BestSellers',
      isActive: true,
      order: 1,
    },
    {
      id: 2,
      name: 'Shop By Category',
      component: 'ShopByCategory',
      isActive: true,
      order: 2,
    },
    {
      id: 3,
      name: 'Special Collections',
      component: 'SpecialCollections',
      isActive: true,
      order: 3,
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
  });

  // Toggle visibility
  const toggleVisibility = (type, id) => {
    if (type === 'hero') {
      setHeroSlides(heroSlides.map(slide =>
        slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
      ));
    } else if (type === 'banner') {
      setBanners(banners.map(banner =>
        banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
      ));
    } else if (type === 'section') {
      setSections(sections.map(section =>
        section.id === id ? { ...section, isActive: !section.isActive } : section
      ));
    }
    alert('Visibility updated successfully!');
  };

  // Delete item
  const deleteItem = (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    if (type === 'hero') {
      setHeroSlides(heroSlides.filter(slide => slide.id !== id));
    } else if (type === 'banner') {
      setBanners(banners.filter(banner => banner.id !== id));
    }
    alert('Item deleted successfully!');
  };

  // Save changes
  const saveChanges = () => {
    alert('Changes saved successfully!');
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      isActive: true,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage homepage content, banners, and sections</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layout className="w-5 h-5" />
              Hero Slider
            </div>
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'banners'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Promotional Banners
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'sections'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Type className="w-5 h-5" />
              Page Sections
            </div>
          </button>
        </div>
      </div>

      {/* Hero Slider Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Hero Slider Management</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="w-16 h-16 text-white opacity-50" />
                  </div>
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{slide.title}</h3>
                    <p className="text-sm text-purple-600 font-medium mb-2">{slide.subtitle}</p>
                    <p className="text-gray-600 text-sm">{slide.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Order: {slide.order}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility('hero', slide.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        slide.isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {slide.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem('hero', slide.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promotional Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Promotional Banners</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{banner.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{banner.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility('banner', banner.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      banner.isActive
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem('banner', banner.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Homepage Sections Order</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {sections.map((section, index) => (
                <div key={section.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button className="text-gray-400 hover:text-gray-600">▲</button>
                      <button className="text-gray-400 hover:text-gray-600">▼</button>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                      {section.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{section.name}</h3>
                      <p className="text-sm text-gray-500">Component: {section.component}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      section.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {section.isActive ? 'Visible' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => toggleVisibility('section', section.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        section.isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {section.isActive ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Section Management</p>
                <p className="text-sm text-blue-700 mt-1">
                  Use the arrow buttons to reorder sections. Hidden sections won't appear on the homepage but can be re-enabled anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'hero' ? 'Slide' : 'Banner'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter title"
                />
              </div>

              {activeTab === 'hero' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter description"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Shop Now"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="/products"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="/images/hero.jpg"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-700">Active (visible on homepage)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveChanges}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;

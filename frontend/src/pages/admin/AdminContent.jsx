import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image, Type, Layout, Save, X, AlertCircle, CheckCircle, Loader, Star } from 'lucide-react';
import { adminAPI } from '../../lib/api';

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [content, setContent] = useState({
    heroSlides: [],
    banners: [],
    brandStory: {},
    testimonials: [],
    features: [],
    sectionVisibility: {},
  });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.content.get();
      if (response.data.success) {
        setContent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage({ type: 'error', text: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addHeroSlide = async (data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.addHeroSlide(data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Hero slide added successfully');
        return true;
      }
    } catch (error) {
      console.error('Error adding hero slide:', error);
      showMessage('error', 'Failed to add hero slide');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = async (id, data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.updateHeroSlide(id, data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Hero slide updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating hero slide:', error);
      showMessage('error', 'Failed to update hero slide');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteHeroSlide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero slide?')) {
      return;
    }
    try {
      setSaving(true);
      const response = await adminAPI.content.deleteHeroSlide(id);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Hero slide deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      showMessage('error', 'Failed to delete hero slide');
    } finally {
      setSaving(false);
    }
  };

  const addBanner = async (data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.addBanner(data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Banner added successfully');
        return true;
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      showMessage('error', 'Failed to add banner');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateBanner = async (id, data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.updateBanner(id, data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Banner updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      showMessage('error', 'Failed to update banner');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    try {
      setSaving(true);
      const response = await adminAPI.content.deleteBanner(id);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Banner deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      showMessage('error', 'Failed to delete banner');
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = async (data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.addTestimonial(data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Testimonial added successfully');
        return true;
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      showMessage('error', 'Failed to add testimonial');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = async (id, data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.updateTestimonial(id, data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Testimonial updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showMessage('error', 'Failed to update testimonial');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    try {
      setSaving(true);
      const response = await adminAPI.content.deleteTestimonial(id);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Testimonial deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showMessage('error', 'Failed to delete testimonial');
    } finally {
      setSaving(false);
    }
  };

  const updateBrandStory = async (data) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.updateBrandStory(data);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Brand story updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Error updating brand story:', error);
      showMessage('error', 'Failed to update brand story');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateSectionVisibility = async (sections) => {
    try {
      setSaving(true);
      const response = await adminAPI.content.updateSections(sections);
      if (response.data.success) {
        fetchContent();
        showMessage('success', 'Section visibility updated successfully');
      }
    } catch (error) {
      console.error('Error updating section visibility:', error);
      showMessage('error', 'Failed to update section visibility');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = (type) => {
    setActiveTab(type);
    setEditingItem(null);
    
    if (type === 'testimonial') {
      setFormData({
        customerName: '',
        customerImage: '',
        rating: 5,
        review: '',
        location: '',
        isActive: true,
        isFeatured: false,
      });
    } else if (type === 'brandStory') {
      setFormData(content.brandStory || {
        title: '',
        subtitle: '',
        description: '',
        image: '',
        isActive: true,
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
      });
    }
    
    setShowModal(true);
  };

  const openEditModal = (item, type) => {
    setEditingItem(item);
    setActiveTab(type);
    setFormData({ ...item });
    setShowModal(true);
  };

  const saveChanges = async () => {
    let success = false;
    
    if (activeTab === 'hero') {
      if (editingItem) {
        success = await updateHeroSlide(editingItem._id, formData);
      } else {
        success = await addHeroSlide(formData);
      }
    } else if (activeTab === 'banners') {
      if (editingItem) {
        success = await updateBanner(editingItem._id, formData);
      } else {
        success = await addBanner(formData);
      }
    } else if (activeTab === 'testimonial') {
      if (editingItem) {
        success = await updateTestimonial(editingItem._id, formData);
      } else {
        success = await addTestimonial(formData);
      }
    } else if (activeTab === 'brandStory') {
      success = await updateBrandStory(formData);
    }
    
    if (success) {
      setShowModal(false);
      setEditingItem(null);
    }
  };

  const toggleSectionVisibility = async (sectionName) => {
    const newVisibility = {
      ...content.sectionVisibility,
      [sectionName]: !content.sectionVisibility[sectionName],
    };
    await updateSectionVisibility(newVisibility);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Message Notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </span>
        </div>
      )}

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
            onClick={() => setActiveTab('testimonial')}
            className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'testimonial'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5" />
              Testimonials
            </div>
          </button>
          <button
            onClick={() => setActiveTab('brandStory')}
            className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'brandStory'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Type className="w-5 h-5" />
              Brand Story
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'sections'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layout className="w-5 h-5" />
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
            {content.heroSlides.map((slide) => (
              <div key={slide._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{slide.title}</h3>
                    {slide.subtitle && <p className="text-sm text-purple-600 font-medium mb-2">{slide.subtitle}</p>}
                    <p className="text-gray-600 text-sm">{slide.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateHeroSlide(slide._id, { ...slide, isActive: !slide.isActive })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        slide.isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      disabled={saving}
                    >
                      {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {slide.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => openEditModal(slide, 'hero')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHeroSlide(slide._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      disabled={saving}
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
            {content.banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    onClick={() => updateBanner(banner._id, { ...banner, isActive: !banner.isActive })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      banner.isActive
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={saving}
                  >
                    {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(banner, 'banners')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBanner(banner._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonial' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Customer Testimonials</h2>
            <button
              onClick={() => openAddModal('testimonial')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {testimonial.customerImage ? (
                      <img src={testimonial.customerImage} alt={testimonial.customerName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {testimonial.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">{testimonial.customerName}</h3>
                      {testimonial.location && <p className="text-xs text-gray-500">{testimonial.location}</p>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">{testimonial.review}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateTestimonial(testimonial._id, { ...testimonial, isActive: !testimonial.isActive })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      testimonial.isActive
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={saving}
                  >
                    {testimonial.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(testimonial, 'testimonial')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Story Tab */}
      {activeTab === 'brandStory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Brand Story Section</h2>
            <button
              onClick={() => openAddModal('brandStory')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Edit Brand Story
            </button>
          </div>

          {content.brandStory && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.brandStory.title}</h3>
              {content.brandStory.subtitle && <p className="text-purple-600 font-medium mb-4">{content.brandStory.subtitle}</p>}
              <p className="text-gray-600 mb-6">{content.brandStory.description}</p>
              {content.brandStory.image && (
                <img src={content.brandStory.image} alt="Brand Story" className="w-full h-64 object-cover rounded-lg" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Page Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Homepage Sections Visibility</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {Object.entries(content.sectionVisibility || {}).map(([key, value]) => (
                <div key={key} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <p className="text-sm text-gray-500">Component: {key}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {value ? 'Visible' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => toggleSectionVisibility(key)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        value
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      disabled={saving}
                    >
                      {value ? 'Hide' : 'Show'}
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
                  Hidden sections won't appear on the homepage but can be re-enabled anytime.
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
                {editingItem ? 'Edit' : 'Add'} {
                  activeTab === 'hero' ? 'Hero Slide' :
                  activeTab === 'banners' ? 'Banner' :
                  activeTab === 'testimonial' ? 'Testimonial' :
                  'Brand Story'
                }
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Testimonial Fields */}
              {activeTab === 'testimonial' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={formData.customerName || ''}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Image URL</label>
                    <input
                      type="text"
                      value={formData.customerImage || ''}
                      onChange={(e) => setFormData({ ...formData, customerImage: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={formData.rating || 5}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                    <textarea
                      value={formData.review || ''}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter customer review"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Featured testimonial</label>
                  </div>
                </>
              ) : (
                /* Hero, Banner, and Brand Story Fields */
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter description"
                    ></textarea>
                  </div>

                  {/* Button fields only for Hero slides */}
                  {activeTab === 'hero' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                        <input
                          type="text"
                          value={formData.buttonText || ''}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Shop Now"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                        <input
                          type="text"
                          value={formData.buttonLink || ''}
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
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="/images/hero.jpg"
                    />
                  </div>
                </>
              )}

              {/* Active checkbox for all types */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
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

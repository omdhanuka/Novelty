import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { 
  PhotoIcon, 
  XMarkIcon,
  PlusIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    tags: [],
    
    // Pricing & Stock
    sku: '',
    mrp: '',
    sellingPrice: '',
    stock: '',
    lowStockThreshold: 10,
    
    // Images
    mainImage: null,
    images: [],
    hoverImage: null,
    videoUrl: '',
    
    // Attributes
    colors: [],
    material: '',
    sizes: [],
    occasion: [],
    capacity: '',
    closureType: '',
    
    // Shipping
    weight: '',
    length: '',
    width: '',
    height: '',
    codAvailable: true,
    deliveryDays: '3-5 days',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    seoKeywords: [],
    
    // Status & Flags
    status: 'draft',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    showOnHomepage: false,
    
    // Additional
    careInstructions: '',
    features: [],
  });

  const [tempTag, setTempTag] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempSize, setTempSize] = useState('');
  const [tempOccasion, setTempOccasion] = useState('');
  const [tempFeature, setTempFeature] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get('/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  // Calculate discount percentage
  const discount = formData.mrp && formData.sellingPrice 
    ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
    : 0;

  // Auto-generate SKU when name changes
  useEffect(() => {
    if (formData.name && !formData.sku) {
      const sku = 'BAG-' + formData.name.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-6);
      setFormData(prev => ({ ...prev, sku }));
    }
  }, [formData.name, formData.sku]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please fill up the product name';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please fill up the description';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.mrp || formData.mrp <= 0) {
      newErrors.mrp = 'Please enter a valid MRP';
    }
    
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Please enter a valid selling price';
    }
    
    if (formData.sellingPrice > formData.mrp) {
      newErrors.sellingPrice = 'Selling price cannot be greater than MRP';
    }
    
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }
    
    if (!formData.mainImage) {
      newErrors.mainImage = 'Please upload a main image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const formDataToSend = new FormData();
      
      // Basic info
      formDataToSend.append('name', productData.name);
      formDataToSend.append('shortDescription', productData.shortDescription);
      formDataToSend.append('description', productData.description);
      formDataToSend.append('category', productData.category);
      formDataToSend.append('subcategory', productData.subcategory);
      formDataToSend.append('brand', productData.brand);
      formDataToSend.append('tags', JSON.stringify(productData.tags));
      
      // Pricing
      formDataToSend.append('sku', productData.sku);
      formDataToSend.append('price[mrp]', productData.mrp);
      formDataToSend.append('price[selling]', productData.sellingPrice);
      formDataToSend.append('stock', productData.stock);
      formDataToSend.append('lowStockThreshold', productData.lowStockThreshold);
      
      // Images
      if (productData.mainImage) {
        formDataToSend.append('mainImage', productData.mainImage);
      }
      productData.images.forEach(img => {
        formDataToSend.append('images', img);
      });
      if (productData.hoverImage) {
        formDataToSend.append('hoverImage', productData.hoverImage);
      }
      formDataToSend.append('videoUrl', productData.videoUrl);
      
      // Attributes
      formDataToSend.append('attributes[colors]', JSON.stringify(productData.colors));
      formDataToSend.append('attributes[material]', productData.material);
      formDataToSend.append('attributes[sizes]', JSON.stringify(productData.sizes));
      formDataToSend.append('attributes[occasion]', JSON.stringify(productData.occasion));
      formDataToSend.append('attributes[capacity]', productData.capacity);
      formDataToSend.append('attributes[closureType]', productData.closureType);
      
      // Shipping
      formDataToSend.append('shipping[weight]', productData.weight);
      formDataToSend.append('shipping[dimensions][length]', productData.length);
      formDataToSend.append('shipping[dimensions][width]', productData.width);
      formDataToSend.append('shipping[dimensions][height]', productData.height);
      formDataToSend.append('shipping[codAvailable]', productData.codAvailable);
      formDataToSend.append('shipping[deliveryDays]', productData.deliveryDays);
      
      // SEO
      formDataToSend.append('seo[metaTitle]', productData.metaTitle);
      formDataToSend.append('seo[metaDescription]', productData.metaDescription);
      formDataToSend.append('seo[keywords]', JSON.stringify(productData.seoKeywords));
      
      // Status
      formDataToSend.append('status', productData.status);
      formDataToSend.append('isFeatured', productData.isFeatured);
      formDataToSend.append('isNewArrival', productData.isNewArrival);
      formDataToSend.append('isBestSeller', productData.isBestSeller);
      formDataToSend.append('showOnHomepage', productData.showOnHomepage);
      
      // Additional
      formDataToSend.append('careInstructions', productData.careInstructions);
      formDataToSend.append('features', JSON.stringify(productData.features));

      const { data } = await api.post('/admin/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      navigate('/admin/products');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Failed to create product';
      alert(errorMsg);
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addArrayItem = (field, value, setTemp) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setTemp('');
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmitWithStatus = (status) => {
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    createProductMutation.mutate({ ...formData, status });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500">Create a new product for your store</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 70% */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECTION 1: Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Basic Product Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Bridal Dulhan Purse – Golden"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength="200"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief product description (max 200 chars)"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Detailed product description..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : ''
                      }`}
                      required
                    >
                      <option value="">Select Category</option>
                      {categoriesData?.data?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub-Category
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Backpack, Purse, Sling"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand (Optional)
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., BAGVO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags / Keywords
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempTag}
                      onChange={(e) => setTempTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tempTag, setTempTag))}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Add tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('tags', tempTag, setTempTag)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button onClick={() => removeArrayItem('tags', index)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Images & Media */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Images & Media
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image (Thumbnail) <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    errors.mainImage ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {mainImagePreview ? (
                      <div className="relative inline-block">
                        <img src={mainImagePreview} alt="Main" className="w-48 h-48 object-cover rounded" />
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, mainImage: null }));
                            setMainImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Click to upload main image</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WebP (max 500KB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.mainImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images (3-6 images)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="cursor-pointer block text-center">
                      <PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to add gallery images</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="YouTube or product video URL"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Product Attributes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                Product Attributes (Variants)
              </h2>

              <div className="space-y-4">
                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempColor}
                      onChange={(e) => setTempColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('colors', tempColor, setTempColor))}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="e.g., Red, Black, Beige"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('colors', tempColor, setTempColor)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                        {color}
                        <button onClick={() => removeArrayItem('colors', index)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., Leather, Rexine, Canvas"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempSize}
                      onChange={(e) => setTempSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('sizes', tempSize, setTempSize))}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="e.g., Small, Medium, Large"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('sizes', tempSize, setTempSize)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map((size, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                        {size}
                        <button onClick={() => removeArrayItem('sizes', index)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempOccasion}
                      onChange={(e) => setTempOccasion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('occasion', tempOccasion, setTempOccasion))}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="e.g., Travel, Wedding, Daily"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('occasion', tempOccasion, setTempOccasion)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.occasion.map((occ, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-2">
                        {occ}
                        <button onClick={() => removeArrayItem('occasion', index)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="text"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., 20L, 40L"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closure Type</label>
                    <select
                      name="closureType"
                      value={formData.closureType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Type</option>
                      <option value="Zip">Zip</option>
                      <option value="Magnetic">Magnetic</option>
                      <option value="Button">Button</option>
                      <option value="Drawstring">Drawstring</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Shipping & Delivery */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                Shipping & Delivery
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                    <input
                      type="text"
                      name="deliveryDays"
                      value={formData.deliveryDays}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="3-5 days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                      placeholder="Length"
                    />
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                      placeholder="Height"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="codAvailable"
                    name="codAvailable"
                    checked={formData.codAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="codAvailable" className="text-sm font-medium text-gray-700">
                    Cash on Delivery Available
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 6: SEO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">6</span>
                SEO Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Product name + category (max 60 chars)"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Brief description for search engines (max 160 chars)"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempKeyword}
                      onChange={(e) => setTempKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('seoKeywords', tempKeyword, setTempKeyword))}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Add keyword"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('seoKeywords', tempKeyword, setTempKeyword)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.seoKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2">
                        {keyword}
                        <button onClick={() => removeArrayItem('seoKeywords', index)}>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="How to clean and maintain the product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tempFeature}
                      onChange={(e) => setTempFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', tempFeature, setTempFeature))}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Add feature"
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem('features', tempFeature, setTempFeature)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {formData.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded">
                        <span className="text-sm">{feature}</span>
                        <button onClick={() => removeArrayItem('features', index)}>
                          <XMarkIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 30% */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* SECTION 2: Pricing & Stock */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  Pricing & Stock
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                      placeholder="Auto-generated"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (Original Price) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg ${
                          errors.mrp ? 'border-red-500' : ''
                        }`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.mrp && (
                      <p className="mt-1 text-sm text-red-600">{errors.mrp}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg ${
                          errors.sellingPrice ? 'border-red-500' : ''
                        }`}
                        placeholder="0"
                        required
                      />
                    </div>
                    {errors.sellingPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-700">
                        Discount: {discount}% OFF
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Save ₹{formData.mrp - formData.sellingPrice}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.stock ? 'border-red-500' : ''
                      }`}
                      placeholder="0"
                      required
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Alert Threshold
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={formData.lowStockThreshold}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 7: Status & Visibility */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">7</span>
                  Status & Visibility
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Featured Product</label>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">New Arrival</label>
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Best Seller</label>
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Show on Homepage</label>
                    <input
                      type="checkbox"
                      name="showOnHomepage"
                      checked={formData.showOnHomepage}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow p-6 space-y-3">
                <button
                  onClick={() => handleSubmitWithStatus('draft')}
                  disabled={createProductMutation.isPending}
                  className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  💾 Save as Draft
                </button>

                <button
                  onClick={() => handleSubmitWithStatus('active')}
                  disabled={createProductMutation.isPending}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  {createProductMutation.isPending ? 'Publishing...' : '🚀 Publish Product'}
                </button>

                {createProductMutation.isError && (
                  <p className="text-sm text-red-600 text-center">
                    Error: {createProductMutation.error.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;

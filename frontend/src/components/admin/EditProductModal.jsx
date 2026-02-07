import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { 
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const EditProductModal = ({ isOpen, onClose, productId }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    tags: [],
    sku: '',
    mrp: '',
    sellingPrice: '',
    stock: '',
    lowStockThreshold: 10,
    mainImage: null,
    images: [],
    videoUrl: '',
    colors: [],
    material: '',
    sizes: [],
    capacity: '',
    weight: '',
    status: 'draft',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    showOnHomepage: false,
  });

  const [tempTag, setTempTag] = useState('');
  const [tempColor, setTempColor] = useState('');
  const [tempSize, setTempSize] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    enabled: !!productId && isOpen,
  });

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
    enabled: isOpen,
  });

  // Load product data into form
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        shortDescription: productData.shortDescription || '',
        description: productData.description || '',
        category: productData.category?._id || productData.category || '',
        subcategory: productData.subcategory || '',
        brand: productData.brand || '',
        tags: productData.tags || [],
        sku: productData.sku || '',
        mrp: productData.price?.mrp || '',
        sellingPrice: productData.price?.selling || '',
        stock: productData.stock || '',
        lowStockThreshold: productData.lowStockThreshold || 10,
        mainImage: null,
        images: [],
        videoUrl: productData.videoUrl || '',
        colors: productData.attributes?.colors || [],
        material: productData.attributes?.material || '',
        sizes: productData.attributes?.sizes || [],
        capacity: productData.attributes?.capacity || '',
        weight: productData.shipping?.weight || '',
        status: productData.status || 'draft',
        isFeatured: productData.isFeatured || false,
        isNewArrival: productData.isNewArrival || false,
        isBestSeller: productData.isBestSeller || false,
        showOnHomepage: productData.showOnHomepage || false,
      });

      if (productData.mainImage) {
        setMainImagePreview(`http://localhost:5000${productData.mainImage}`);
      }
      if (productData.images && productData.images.length > 0) {
        setExistingImages(productData.images);
      }
    }
  }, [productData]);

  const discount = formData.mrp && formData.sellingPrice 
    ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)
    : 0;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.mrp || formData.mrp <= 0) newErrors.mrp = 'Valid MRP is required';
    if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = 'Valid selling price is required';
    if (formData.sellingPrice > formData.mrp) newErrors.sellingPrice = 'Selling price cannot exceed MRP';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProductMutation = useMutation({
    mutationFn: async (productData) => {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', productData.name);
      formDataToSend.append('shortDescription', productData.shortDescription);
      formDataToSend.append('description', productData.description);
      formDataToSend.append('category', productData.category);
      formDataToSend.append('subcategory', productData.subcategory);
      formDataToSend.append('brand', productData.brand);
      formDataToSend.append('tags', JSON.stringify(productData.tags));
      formDataToSend.append('sku', productData.sku);
      formDataToSend.append('price[mrp]', productData.mrp);
      formDataToSend.append('price[selling]', productData.sellingPrice);
      formDataToSend.append('stock', productData.stock);
      formDataToSend.append('lowStockThreshold', productData.lowStockThreshold);
      
      if (productData.mainImage) {
        formDataToSend.append('mainImage', productData.mainImage);
      }
      productData.images.forEach(img => {
        formDataToSend.append('images', img);
      });
      formDataToSend.append('videoUrl', productData.videoUrl);
      
      formDataToSend.append('attributes[colors]', JSON.stringify(productData.colors));
      formDataToSend.append('attributes[material]', productData.material);
      formDataToSend.append('attributes[sizes]', JSON.stringify(productData.sizes));
      formDataToSend.append('attributes[capacity]', productData.capacity);
      formDataToSend.append('shipping[weight]', productData.weight);
      
      formDataToSend.append('status', productData.status);
      formDataToSend.append('isFeatured', productData.isFeatured);
      formDataToSend.append('isNewArrival', productData.isNewArrival);
      formDataToSend.append('isBestSeller', productData.isBestSeller);
      formDataToSend.append('showOnHomepage', productData.showOnHomepage);

      const { data } = await api.put(`/admin/products/${productId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['product', productId]);
      onClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update product');
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

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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

  const handleSubmit = (status) => {
    setErrors({});
    if (!validateForm()) return;
    updateProductMutation.mutate({ ...formData, status });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {isLoadingProduct ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-8 p-6">
                {/* Left Column - Product Information (2/3 width) */}
                <div className="col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                    
                    {/* Product Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter product name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Product ID (Read-only) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product ID
                      </label>
                      <input
                        type="text"
                        value={`#${productData?._id?.slice(-8).toUpperCase() || ''}`}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>

                    {/* SKU and Price Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="SKU1234"
                        />
                        {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="sellingPrice"
                          value={formData.sellingPrice}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="1,299"
                          min="0"
                        />
                        {errors.sellingPrice && <p className="mt-1 text-sm text-red-500">{errors.sellingPrice}</p>}
                        {discount > 0 && <p className="mt-1 text-xs text-green-600">{discount}% off from MRP</p>}
                      </div>
                    </div>

                    {/* Stock and Status Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="120"
                          min="0"
                        />
                        {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    {/* MRP */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MRP (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.mrp ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="1,999"
                        min="0"
                      />
                      {errors.mrp && <p className="mt-1 text-sm text-red-500">{errors.mrp}</p>}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="High-quality wireless earbuds with Bluetooth 5.0, touch controls, and long battery life."
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Short Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Brief product summary"
                      />
                    </div>

                    {/* Category and Brand */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select Category</option>
                          {categoriesData?.data?.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Brand name"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tempTag}
                          onChange={(e) => setTempTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('tags', tempTag, setTempTag);
                            }
                          }}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Add tag and press Enter"
                        />
                        <button
                          type="button"
                          onClick={() => addArrayItem('tags', tempTag, setTempTag)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                            {tag}
                            <button type="button" onClick={() => removeArrayItem('tags', index)} className="hover:text-blue-900">
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Attributes Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pt-4 border-t">Product Attributes</h3>
                    
                    {/* Colors */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tempColor}
                          onChange={(e) => setTempColor(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('colors', tempColor, setTempColor))}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Add color"
                        />
                        <button
                          type="button"
                          onClick={() => addArrayItem('colors', tempColor, setTempColor)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {color}
                            <button type="button" onClick={() => removeArrayItem('colors', index)}>
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tempSize}
                          onChange={(e) => setTempSize(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('sizes', tempSize, setTempSize))}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Add size"
                        />
                        <button
                          type="button"
                          onClick={() => addArrayItem('sizes', tempSize, setTempSize)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {size}
                            <button type="button" onClick={() => removeArrayItem('sizes', index)}>
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Material and Capacity */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                        <input
                          type="text"
                          name="material"
                          value={formData.material}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., Leather, Cotton"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                        <input
                          type="text"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., 25L, 500ml"
                        />
                      </div>
                    </div>

                    {/* Weight and Low Stock Threshold */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., 500g"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
                        <input
                          type="number"
                          name="lowStockThreshold"
                          value={formData.lowStockThreshold}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="10"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status & Visibility Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pt-4 border-t">Status & Visibility</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Featured Product</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">New Arrival</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Best Seller</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" name="showOnHomepage" checked={formData.showOnHomepage} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Show on Homepage</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column - Product Image (1/3 width) */}
                <div className="col-span-1">
                  <div className="sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                    
                    {/* Main Image Display */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center" style={{ minHeight: '280px' }}>
                      {mainImagePreview ? (
                        <img
                          src={mainImagePreview}
                          alt="Product"
                          className="max-w-full max-h-64 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <PhotoIcon className="h-24 w-24 mx-auto mb-2" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="mb-4">
                      <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Supported JPG, GIF, PNG
                      </p>
                    </div>

                    {/* Gallery Images */}
                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Gallery Images</label>
                        
                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {existingImages.map((img, index) => (
                              <div key={`existing-${index}`} className="relative group aspect-square">
                                <img
                                  src={`http://localhost:5000${img}`}
                                  alt=""
                                  className="w-full h-full object-cover rounded border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* New Images */}
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={`new-${index}`} className="relative group aspect-square">
                                <img
                                  src={preview}
                                  alt=""
                                  className="w-full h-full object-cover rounded border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add More Gallery Images Button */}
                        <label className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors">
                          <PlusIcon className="h-5 w-5" />
                          Add More Images
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* Video URL */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('active')}
              disabled={updateProductMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {updateProductMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;

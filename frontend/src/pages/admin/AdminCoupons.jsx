import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Power, Tag, Calendar, TrendingUp, Users, Percent, DollarSign, X, Check } from 'lucide-react';
import { api } from '../../lib/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minCartValue: '',
    maxDiscount: '',
    description: '',
    usageLimit: '',
    validFrom: '',
    validTill: '',
    isActive: true,
    applicableCategories: [],
    firstOrderOnly: false,
    freeShipping: false,
  });

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/admin/coupons', { params });
      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchCoupons();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery, statusFilter]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code || !formData.value || !formData.validFrom || !formData.validTill) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.validFrom) >= new Date(formData.validTill)) {
      alert('Valid Till date must be after Valid From date');
      return;
    }

    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        value: Number(formData.value),
        minCartValue: formData.minCartValue ? Number(formData.minCartValue) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      };

      if (editingCoupon) {
        const response = await api.put(`/admin/coupons/${editingCoupon._id}`, payload);
        if (response.data.success) {
          alert('Coupon updated successfully');
        }
      } else {
        const response = await api.post('/admin/coupons', payload);
        if (response.data.success) {
          alert('Coupon created successfully');
        }
      }

      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  // Toggle coupon status
  const toggleStatus = async (couponId) => {
    try {
      const response = await api.patch(`/admin/coupons/${couponId}/toggle`);
      if (response.data.success) {
        alert(response.data.message);
        fetchCoupons();
      }
    } catch (error) {
      alert('Failed to update coupon status');
    }
  };

  // Delete coupon
  const deleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/coupons/${couponId}`);
      if (response.data.success) {
        alert('Coupon deleted successfully');
        fetchCoupons();
      }
    } catch (error) {
      alert('Failed to delete coupon');
    }
  };

  // Edit coupon
  const editCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minCartValue: coupon.minCartValue || '',
      maxDiscount: coupon.maxDiscount || '',
      description: coupon.description || '',
      usageLimit: coupon.usageLimit || '',
      validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
      validTill: new Date(coupon.validTill).toISOString().slice(0, 16),
      isActive: coupon.isActive,
      applicableCategories: coupon.applicableCategories?.map(cat => cat._id) || [],
      firstOrderOnly: coupon.firstOrderOnly,
      freeShipping: coupon.freeShipping,
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minCartValue: '',
      maxDiscount: '',
      description: '',
      usageLimit: '',
      validFrom: '',
      validTill: '',
      isActive: true,
      applicableCategories: [],
      firstOrderOnly: false,
      freeShipping: false,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if coupon is expired
  const isCouponExpired = (validTill) => {
    return new Date(validTill) < new Date();
  };

  // Calculate stats
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive && !isCouponExpired(c.validTill)).length,
    expired: coupons.filter(c => isCouponExpired(c.validTill)).length,
    totalUsage: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Tag className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Coupons</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Check className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Active Coupons</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Expired</p>
          <p className="text-3xl font-bold">{stats.expired}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Usage</p>
          <p className="text-3xl font-bold">{stats.totalUsage}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupon codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No coupons found</p>
            <p className="text-gray-400">Create your first coupon to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {coupons.map((coupon) => {
              const isExpired = isCouponExpired(coupon.validTill);
              const usagePercent = coupon.usageLimit ? (coupon.usedCount / coupon.usageLimit) * 100 : 0;

              return (
                <div
                  key={coupon._id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                          <span className="text-xl font-bold text-purple-700">{coupon.code}</span>
                        </div>
                        {isExpired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            Expired
                          </span>
                        )}
                        {!isExpired && coupon.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Active
                          </span>
                        )}
                        {!coupon.isActive && !isExpired && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      {coupon.description && (
                        <p className="text-sm text-gray-600">{coupon.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Discount Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {coupon.type === 'percentage' ? (
                        <Percent className="w-5 h-5 text-purple-600" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Discount</p>
                        <p className="font-bold text-gray-900">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Min. Cart</p>
                        <p className="font-bold text-gray-900">{formatCurrency(coupon.minCartValue)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valid Period:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(coupon.validFrom)} - {formatDate(coupon.validTill)}
                      </span>
                    </div>

                    {coupon.maxDiscount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Max Discount:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(coupon.maxDiscount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-medium text-gray-900">
                        {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                      </span>
                    </div>

                    {coupon.usageLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            usagePercent >= 100 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {coupon.freeShipping && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          Free Shipping
                        </span>
                      )}
                      {coupon.firstOrderOnly && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          First Order Only
                        </span>
                      )}
                      {coupon.applicableCategories?.length > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                          {coupon.applicableCategories.length} Categories
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => editCoupon(coupon)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(coupon._id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        coupon.isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCoupon(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER2024"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '10' : '100'}
                    min="0"
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Min Cart Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Cart Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({ ...formData, minCartValue: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Max Discount */}
                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="Optional"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Valid From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Valid Till */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Till <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validTill}
                    onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter coupon description..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                ></textarea>
              </div>

              {/* Categories */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Categories (Optional)
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center gap-2 py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(category._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              applicableCategories: [...formData.applicableCategories, category._id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              applicableCategories: formData.applicableCategories.filter(id => id !== category._id),
                            });
                          }
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="mt-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.firstOrderOnly}
                    onChange={(e) => setFormData({ ...formData, firstOrderOnly: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">First Order Only</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.freeShipping}
                    onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

import { useState, useEffect } from 'react';
import { Plus, MapPin, Edit2, Trash2, Home, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  /*const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      phone: '+91 98765 43210',
      addressLine: '123, MG Road, Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      phone: '+91 98765 43210',
      addressLine: '456, Indiranagar, 100 Feet Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: false,
    },
  ]);*/

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const handleAddNew = () => {
    setFormData({
      type: 'Home',
      name: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await api.delete(`/user/addresses/${id}`);
        if (response.data.success) {
          setAddresses(response.data.data);
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingId) {
        // Update existing
        response = await api.put(`/user/addresses/${editingId}`, formData);
      } else {
        // Add new
        response = await api.post('/user/addresses', formData);
      }
      
      if (response.data.success) {
        setAddresses(response.data.data);
        setShowForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await api.patch(`/user/addresses/${id}/default`);
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Home size={18} />;
      case 'Work':
        return <Briefcase size={18} />;
      default:
        return <MapPin size={18} />;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
          <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </motion.div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {addresses.map((address, index) => (
            <motion.div
              key={address._id || address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
                address.isDefault ? 'border-indigo-500' : 'border-gray-100'
              }`}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Default
                  </span>
                </div>
              )}

              {/* Address Type */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  {getIcon(address.type)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{address.type}</h3>
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4">
                <p className="font-medium text-gray-900">{address.name}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="text-sm text-gray-600">
                  {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id || address.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id || address.id)}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Address Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Type *
                      </label>
                      <div className="flex gap-3">
                        {['Home', 'Work', 'Other'].map((type) => (
                          <label
                            key={type}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${
                              formData.type === type
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type}
                              checked={formData.type === type}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                              className="sr-only"
                            />
                            {getIcon(type)}
                            <span className="font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Address Line */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.addressLine}
                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="House no., Building, Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Default Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="isDefault" className="text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {editingId ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddressManagement;

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Home,
  Briefcase,
  Save
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '';
      // Format as yyyy-MM-dd
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Male',
    dateOfBirth: formatDateForInput(user?.dateOfBirth),
  });

  const [addressData, setAddressData] = useState({
    type: 'home',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
        const defaultAddr = response.data.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setAddressData({
            type: (defaultAddr.type || 'home').toLowerCase(), // Normalize to lowercase
            addressLine: defaultAddr.addressLine,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            isDefault: defaultAddr.isDefault,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setMessage('');
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Update profile
      console.log('[Frontend] Sending profile update request:', {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      });
      
      const profileResponse = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      });

      console.log('[Frontend] Received profile response:', profileResponse.data);

      if (profileResponse.data.success) {
        setUser(profileResponse.data.data);
        let addressError = false;

        // Update or create address if all required fields are filled
        if (addressData.addressLine && addressData.city && addressData.state && addressData.pincode) {
          // Validate that city and state are not empty strings
          if (addressData.city === '' || addressData.state === '') {
            setError('Profile updated, but address not saved. Please select both City and State.');
            addressError = true;
          } else {
            try {
              console.log('[Frontend] Updating address:', addressData);
              if (selectedAddressId) {
                // Update existing address
                const addrResponse = await api.put(`/user/addresses/${selectedAddressId}`, {
                  ...addressData,
                  name: formData.name,
                  phone: formData.phone,
                });
                console.log('[Frontend] Address update response:', addrResponse.data);
              } else {
                // Create new address
                const addrResponse = await api.post('/user/addresses', {
                  ...addressData,
                  name: formData.name,
                  phone: formData.phone,
                });
                console.log('[Frontend] Address create response:', addrResponse.data);
              }
              console.log('[Frontend] Address updated successfully');
            } catch (addrErr) {
              console.error('[Frontend] Address update error:', addrErr);
              console.error('[Frontend] Error details:', addrErr.response?.data);
              addressError = true;
              setError('Profile updated, but failed to update address: ' + (addrErr.response?.data?.message || addrErr.message || 'Unknown error'));
            }
          }
        }

        if (!addressError) {
          setMessage('Profile updated successfully!');
        }
        
        setTimeout(() => {
          navigate('/account/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('[Frontend] Profile update error:', err);
      console.error('[Frontend] Error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cities = ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghapur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Keonjhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur','Sundargarh'];
  const states = ['Odisha'];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your profile information</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Messages */}
              {message && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {formData.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">Profile photo upload coming soon</p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">{formData.email}</p>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 7709008700"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Saved Address Selector */}
                {addresses.length > 0 && (
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Address Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAddressData({ ...addressData, type: 'home' });
                        if (selectedAddressId) setSelectedAddressId(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                        addressData.type?.toLowerCase() === 'home'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Home size={18} />
                      <span className="font-medium">Home</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressData({ ...addressData, type: 'work' });
                        if (selectedAddressId) setSelectedAddressId(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                        addressData.type?.toLowerCase() === 'work'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Briefcase size={18} />
                      <span className="font-medium">Office</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressData({ ...addressData, type: 'other' });
                        if (selectedAddressId) setSelectedAddressId(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                        addressData.type?.toLowerCase() === 'other'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <MapPin size={18} />
                      <span className="font-medium">Other</span>
                    </button>
                  </div>
                </div>
                )}

                {/* Address Type Selection for New/Editing Address */}
               

                {/* Gender and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

               

                {/* Address Line */}
                <div>
                  <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <input
                    type="text"
                    id="addressLine"
                    name="addressLine"
                    value={addressData.addressLine}
                    onChange={handleAddressChange}
                    placeholder="Murphy Para, Bagucha"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleAddressChange}
                    placeholder="760028"
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/account/profile')}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;

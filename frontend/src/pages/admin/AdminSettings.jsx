import { useState, useEffect } from 'react';
import { 
  Store, 
  Mail, 
  CreditCard, 
  Truck, 
  Globe, 
  FileText, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { api } from '../../lib/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [settings, setSettings] = useState({
    storeName: 'BAGVO',
    storeEmail: '',
    storePhone: '',
    storeAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    gst: {
      number: '',
      percentage: 18
    },
    businessHours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '10:00 AM - 4:00 PM'
    },
    shipping: {
      charges: 0,
      freeShippingThreshold: 1000,
      codCharges: 50,
      codAvailable: true
    },
    razorpay: {
      keyId: '',
      keySecret: ''
    },
    emailSettings: {
      host: '',
      port: 587,
      user: '',
      password: '',
      from: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogImage: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    invoiceSettings: {
      prefix: 'INV',
      startingNumber: 1000
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.adminSettings.get();
      if (response.data.success) {
        setSettings(response.data.data || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await api.adminSettings.update(settings);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNestedField = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'invoice', label: 'Invoice', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Store Info Tab */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="BAGVO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="contact@bagvo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={settings.gst.number}
                    onChange={(e) => updateNestedField('gst', 'number', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="27AABCU9603R1ZM"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.line1}
                      onChange={(e) => updateNestedField('storeAddress', 'line1', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Building/Street"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.line2}
                      onChange={(e) => updateNestedField('storeAddress', 'line2', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Area/Locality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.city}
                      onChange={(e) => updateNestedField('storeAddress', 'city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.state}
                      onChange={(e) => updateNestedField('storeAddress', 'state', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.pincode}
                      onChange={(e) => updateNestedField('storeAddress', 'pincode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="400001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={settings.storeAddress.country}
                      onChange={(e) => updateNestedField('storeAddress', 'country', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekdays (Mon-Fri)
                    </label>
                    <input
                      type="text"
                      value={settings.businessHours.weekdays}
                      onChange={(e) => updateNestedField('businessHours', 'weekdays', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="9:00 AM - 6:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekends (Sat-Sun)
                    </label>
                    <input
                      type="text"
                      value={settings.businessHours.weekends}
                      onChange={(e) => updateNestedField('businessHours', 'weekends', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="10:00 AM - 4:00 PM"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.facebook}
                      onChange={(e) => updateNestedField('socialMedia', 'facebook', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://facebook.com/bagvo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.instagram}
                      onChange={(e) => updateNestedField('socialMedia', 'instagram', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://instagram.com/bagvo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.twitter}
                      onChange={(e) => updateNestedField('socialMedia', 'twitter', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://twitter.com/bagvo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia.youtube}
                      onChange={(e) => updateNestedField('socialMedia', 'youtube', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://youtube.com/@bagvo"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Shipping Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shipping.charges}
                    onChange={(e) => updateNestedField('shipping', 'charges', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Set to 0 for free shipping on all orders</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => updateNestedField('shipping', 'freeShippingThreshold', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1000"
                  />
                  <p className="text-sm text-gray-500 mt-1">Free shipping for orders above this amount</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    COD Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shipping.codCharges}
                    onChange={(e) => updateNestedField('shipping', 'codCharges', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Additional charges for Cash on Delivery</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shipping.codAvailable}
                      onChange={(e) => updateNestedField('shipping', 'codAvailable', e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable Cash on Delivery (COD)
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 ml-7">Allow customers to pay on delivery</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Shipping Summary</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Standard shipping: ₹{settings.shipping.charges}</li>
                  <li>• Free shipping on orders above: ₹{settings.shipping.freeShippingThreshold}</li>
                  <li>• COD charges: ₹{settings.shipping.codCharges}</li>
                  <li>• COD status: {settings.shipping.codAvailable ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Razorpay Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      value={settings.razorpay.keyId}
                      onChange={(e) => updateNestedField('razorpay', 'keyId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="rzp_test_xxxxxxxxxxxxx"
                    />
                    <p className="text-sm text-gray-500 mt-1">Your Razorpay API Key ID</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razorpay Key Secret
                    </label>
                    <input
                      type="password"
                      value={settings.razorpay.keySecret}
                      onChange={(e) => updateNestedField('razorpay', 'keySecret', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••••••••••"
                    />
                    <p className="text-sm text-gray-500 mt-1">Your Razorpay API Key Secret (keep it secure)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Security Note
                </h4>
                <p className="text-sm text-yellow-800">
                  Never share your Razorpay Key Secret publicly. It should be kept secure and only stored in your server environment. 
                  For testing, use test keys. For production, use live keys.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Configuration</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={settings.gst.percentage}
                    onChange={(e) => updateNestedField('gst', 'percentage', Number(e.target.value))}
                    className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="18"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">GST rate to be applied on products</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.emailSettings.host}
                        onChange={(e) => updateNestedField('emailSettings', 'host', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={settings.emailSettings.port}
                        onChange={(e) => updateNestedField('emailSettings', 'port', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={settings.emailSettings.user}
                      onChange={(e) => updateNestedField('emailSettings', 'user', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your-email@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={settings.emailSettings.password}
                      onChange={(e) => updateNestedField('emailSettings', 'password', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.emailSettings.from}
                      onChange={(e) => updateNestedField('emailSettings', 'from', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="noreply@bagvo.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email address that will appear as sender</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Email Setup Guide</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• For Gmail: Use App Password instead of regular password</li>
                  <li>• Port 587 for TLS, Port 465 for SSL</li>
                  <li>• Enable "Less secure app access" if using regular Gmail</li>
                  <li>• Test your configuration after saving settings</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateNestedField('seo', 'metaTitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="BAGVO - Premium Bags & Accessories"
                  maxLength="60"
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.seo.metaDescription}
                  onChange={(e) => updateNestedField('seo', 'metaDescription', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Shop premium quality bags and accessories at BAGVO. Discover trendy backpacks, handbags, wallets and more."
                  rows="3"
                  maxLength="160"
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={settings.seo.metaKeywords}
                  onChange={(e) => updateNestedField('seo', 'metaKeywords', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="bags, backpacks, handbags, wallets, accessories"
                />
                <p className="text-sm text-gray-500 mt-1">Comma-separated keywords</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={settings.seo.ogImage}
                  onChange={(e) => updateNestedField('seo', 'ogImage', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://yourdomain.com/og-image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">Image shown when shared on social media (1200x630px recommended)</p>
              </div>
            </div>
          )}

          {/* Invoice Tab */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Prefix
                  </label>
                  <input
                    type="text"
                    value={settings.invoiceSettings.prefix}
                    onChange={(e) => updateNestedField('invoiceSettings', 'prefix', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="INV"
                    maxLength="5"
                  />
                  <p className="text-sm text-gray-500 mt-1">Prefix for invoice numbers (e.g., INV-1001)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Number
                  </label>
                  <input
                    type="number"
                    value={settings.invoiceSettings.startingNumber}
                    onChange={(e) => updateNestedField('invoiceSettings', 'startingNumber', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1000"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">First invoice number to start from</p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Invoice Preview</h4>
                <p className="text-sm text-purple-800">
                  Your invoices will be numbered as: <strong>{settings.invoiceSettings.prefix}-{settings.invoiceSettings.startingNumber}</strong>, 
                  {' '}<strong>{settings.invoiceSettings.prefix}-{settings.invoiceSettings.startingNumber + 1}</strong>, etc.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import HomePage from './pages/HomePage';

// User Auth imports
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';

// User Account imports
import UserProfilePage from './pages/user/UserProfilePage';
import AddressManagement from './pages/user/AddressManagement';
import MyOrders from './pages/user/MyOrders';
import OrderDetails from './pages/user/OrderDetails';
import Wishlist from './pages/user/Wishlist';
import ChangePassword from './pages/user/ChangePassword';

// Product pages
import ProductList from './pages/user/ProductList';
import ProductDetails from './pages/user/ProductDetails';

// Admin imports
import { AdminProvider } from './context/AdminContext';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminContent from './pages/admin/AdminContent';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />

              {/* Product routes */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:slug" element={<ProductDetails />} />

              {/* User Auth routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected User routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addresses"
                element={
                  <ProtectedRoute>
                    <AddressManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
          </AdminProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


# User Dashboard - Quick Reference

## 📍 Routes Overview
```
/account                    → Dashboard Home
/account/profile            → Profile Management
/account/addresses          → Address Management
/account/orders             → Orders List
/account/orders/:orderId    → Order Details
/account/wishlist           → Wishlist
/account/change-password    → Change Password
```

## 🎯 Component Summary

| Component              | Purpose                  | Key Features                          |
|------------------------|--------------------------|---------------------------------------|
| UserLayout             | Navigation wrapper       | Sidebar, mobile drawer, logout        |
| UserDashboard          | Dashboard home           | Stats, recent orders, quick actions   |
| UserProfilePage        | Profile editing          | Name, phone, avatar upload            |
| AddressManagement      | Address CRUD             | Add/edit/delete, set default          |
| MyOrders               | Orders listing           | Search, filter, status badges         |
| OrderDetails           | Single order view        | Tracking, items, invoice download     |
| Wishlist               | Saved products           | Add to cart, remove, search           |
| ChangePassword         | Password change          | Validation, requirements checklist    |

## 🎨 Color Codes
```
Primary:    indigo-600  (#4F46E5)
Sidebar:    slate-900   (#0F172A)
Success:    green-600   (#059669)
Warning:    yellow-600  (#CA8A04)
Error:      red-600     (#DC2626)
Info:       blue-600    (#2563EB)
```

## 📦 Order Status Badges
```jsx
delivered   → Green   → CheckCircle icon
in-transit  → Blue    → Package icon
processing  → Yellow  → Clock icon
cancelled   → Red     → XCircle icon
```

## 🔑 Form Validations

### Profile
- Name: Required
- Phone: Optional, tel format
- Email: Read-only

### Address
- All fields: Required
- Pincode: 6 digits
- Type: Home/Work/Other

### Password
- Current password: Required
- New password: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special
- Confirm: Must match new password

## 🎬 Animation Delays
```jsx
Header:    delay: 0
Card 1:    delay: 0.1
Card 2:    delay: 0.2
Card 3:    delay: 0.3
List items: index * 0.1
```

## 📱 Breakpoints
```
Mobile:   < 768px  (sm)
Tablet:   768px    (md)
Desktop:  1024px   (lg)
Wide:     1280px   (xl)
```

## 🔗 Navigation Icons
```
Dashboard        → LayoutDashboard
Orders           → Package
Addresses        → MapPin
Wishlist         → Heart
Profile          → User
Change Password  → Lock
Logout           → LogOut
```

## 🚀 Quick Start

### 1. Import Component
```jsx
import UserDashboard from './pages/user/UserDashboard';
```

### 2. Add Route
```jsx
<Route path="/account" element={
  <ProtectedRoute>
    <UserLayout />
  </ProtectedRoute>
}>
  <Route index element={<UserDashboard />} />
</Route>
```

### 3. Link to Dashboard
```jsx
<Link to="/account">My Account</Link>
```

## 💾 Mock Data Structure

### Address
```javascript
{
  id: 1,
  type: 'Home',
  name: 'John Doe',
  phone: '+91 98765 43210',
  addressLine: '123, MG Road',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
  isDefault: true
}
```

### Order
```javascript
{
  id: 'ORD001234',
  date: '2024-01-15',
  status: 'delivered',
  total: 4599,
  items: 2,
  products: [...]
}
```

### Wishlist Item
```javascript
{
  id: 1,
  name: 'Product Name',
  price: 2599,
  originalPrice: 3499,
  image: 'url',
  inStock: true,
  rating: 4.5,
  reviews: 128
}
```

## 🔌 API Endpoints (Ready to Connect)

### Profile
```
PUT  /auth/profile          // Update profile
GET  /auth/me               // Get user data
```

### Addresses
```
GET    /api/addresses       // Get all
POST   /api/addresses       // Add new
PUT    /api/addresses/:id   // Update
DELETE /api/addresses/:id   // Delete
PATCH  /api/addresses/:id/default  // Set default
```

### Orders
```
GET  /api/orders            // Get all orders
GET  /api/orders/:id        // Get single order
POST /api/orders/:id/cancel // Cancel order
```

### Wishlist
```
GET    /api/wishlist        // Get wishlist
POST   /api/wishlist        // Add item
DELETE /api/wishlist/:id    // Remove item
DELETE /api/wishlist        // Clear all
```

### Password
```
POST /auth/change-password  // Change password
```

## 🎯 Action Buttons by Status

### Delivered Orders
- View Details
- Write Review
- Buy Again
- Download Invoice

### In Transit Orders
- View Details
- Track Order
- Contact Support

### Processing Orders
- View Details
- Cancel Order
- Contact Support

### Cancelled Orders
- View Details only

## 📊 Dashboard Stats
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Orders│  In Transit │  Wishlist   │ Total Spent │
│     12      │      2      │      5      │  ₹18,450    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## 🔒 Security Features
- JWT authentication required
- Password validation (8+ chars)
- Protected routes
- Logout functionality
- Session management
- CSRF protection ready

## 🎓 Component Sizes
```
UserLayout:         ~200 lines
UserDashboard:      ~150 lines
UserProfilePage:    ~180 lines
AddressManagement:  ~350 lines (includes modal)
MyOrders:           ~250 lines
OrderDetails:       ~300 lines
Wishlist:           ~280 lines
ChangePassword:     ~250 lines
```

## 🐛 Quick Debug

### Routes not working?
✓ Check ProtectedRoute wrapper
✓ Verify AuthContext provider
✓ Check user authentication state

### Sidebar not visible on mobile?
✓ Check drawer state
✓ Verify z-index values
✓ Test overlay click handler

### Animations not smooth?
✓ Install framer-motion
✓ Check delay values
✓ Verify AnimatePresence wrapper

### Icons not showing?
✓ Install lucide-react
✓ Check import statements
✓ Verify icon names

## 📦 Required Packages
```bash
npm install react-router-dom framer-motion lucide-react
```

## 🎨 Tailwind Configuration
Ensure these are in your tailwind.config.js:
```javascript
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
```

## 🚀 Performance Tips
1. Lazy load order details
2. Paginate orders list
3. Optimize images
4. Use React.memo for list items
5. Implement virtual scrolling for long lists

---

**Version**: 1.0.0
**Last Updated**: January 2024
**All components**: Production ready with mock data

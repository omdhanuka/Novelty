# User Account Dashboard - Complete Guide

## 📋 Overview

The User Account Dashboard is a comprehensive user management system that provides authenticated users with complete control over their profile, orders, addresses, and wishlist. Built with React, React Router, Tailwind CSS, and Framer Motion for smooth animations.

---

## 🗂️ File Structure

```
frontend/src/
├── components/
│   └── user/
│       └── UserLayout.jsx          # Dashboard layout with sidebar navigation
├── pages/
│   └── user/
│       ├── UserDashboard.jsx       # Dashboard home with stats & overview
│       ├── UserProfilePage.jsx     # Profile management
│       ├── AddressManagement.jsx   # Address CRUD operations
│       ├── MyOrders.jsx            # Orders listing with filters
│       ├── OrderDetails.jsx        # Individual order details
│       ├── Wishlist.jsx            # Saved items management
│       └── ChangePassword.jsx      # Password change with validation
└── App.jsx                         # Routes configuration
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (indigo-600, indigo-700)
- **Sidebar**: Dark Slate (slate-900)
- **Success**: Green (green-500, green-600)
- **Warning**: Yellow (yellow-500, yellow-600)
- **Error**: Red (red-500, red-600)
- **Info**: Blue (blue-500, blue-600)

### Typography
- **Headings**: Font Bold, sizes from text-lg to text-3xl
- **Body**: Regular weight, text-sm to text-base
- **Labels**: Font Medium, text-sm

### Layout
- **Desktop**: Fixed sidebar (256px width) + main content area
- **Mobile**: Responsive drawer menu with overlay
- **Max Width**: 6xl (1152px) for content areas

---

## 📄 Page Components

### 1. UserLayout.jsx
**Purpose**: Wrapper layout for all user account pages

**Features**:
- Responsive sidebar navigation (desktop/mobile)
- Active route highlighting
- User welcome text
- Mobile menu drawer with overlay
- Logout functionality

**Menu Items**:
- Dashboard (LayoutDashboard icon)
- Orders (Package icon)
- Addresses (MapPin icon)
- Wishlist (Heart icon)
- Profile (User icon)
- Change Password (Lock icon)
- Logout (LogOut icon)

**Routes**: Wraps `/account/*` routes

---

### 2. UserDashboard.jsx
**Purpose**: Dashboard home page with overview stats

**Features**:
- Welcome card with gradient background
- Stats grid (4 cards):
  - Total Orders
  - In Transit orders
  - Wishlist items count
  - Total amount spent
- Recent orders table (shows last 5 orders)
- Quick action cards (Profile, Addresses, Wishlist)
- Empty state for new users
- Framer Motion animations

**Mock Data**: Currently uses static data, ready for API integration

---

### 3. UserProfilePage.jsx
**Purpose**: User profile information management

**Features**:
- Profile avatar with upload button (UI ready)
- Editable fields:
  - Full Name
  - Phone Number
  - Email (read-only with note)
- Profile stats card (Account Status, Member Since, Account Type, Email Verified)
- Form validation
- Success/error messages
- Save button with loading state

**API Integration Point**: Line 25 (PUT /auth/profile)

---

### 4. AddressManagement.jsx
**Purpose**: Complete address CRUD operations

**Features**:
- Grid display of saved addresses
- Address types: Home, Work, Other (with icons)
- Default address badge and functionality
- Add/Edit/Delete operations
- Modal form with smooth animations
- Form fields:
  - Address Type (radio selection)
  - Full Name
  - Phone Number
  - Address Line
  - City, State, Pincode
  - Set as Default checkbox
- Form validation (6-digit pincode, required fields)
- Confirmation dialogs for delete
- Empty state when no addresses

**State Management**: Local state (ready for API)

---

### 5. MyOrders.jsx
**Purpose**: Orders listing with search and filters

**Features**:
- Search by order ID
- Status filter dropdown (All, Processing, In Transit, Delivered, Cancelled)
- Order cards with:
  - Order ID and date
  - Status badges with icons
  - Product list with images
  - Total amount
  - Action buttons based on status
- Order statistics panel:
  - Total orders count
  - Delivered count
  - In transit count
  - Total spent amount
- Conditional actions:
  - **Delivered**: Write Review, Buy Again, View Details
  - **In Transit**: Track Order, View Details
  - **Processing**: Cancel Order, View Details
- Empty state for no orders
- Responsive grid layout

**Status Badges**:
- Delivered (green)
- In Transit (blue)
- Processing (yellow)
- Cancelled (red)

---

### 6. OrderDetails.jsx
**Purpose**: Detailed view of a single order

**Features**:
- Back to orders navigation
- Order header with ID, date, status
- Order tracking timeline with:
  - Visual progress indicators
  - Completed/pending states
  - Timestamps for each step
- Order items list with:
  - Product images
  - Names and SKUs
  - Quantities and prices
  - Review links (for delivered items)
- Sidebar with:
  - Order summary (subtotal, shipping, tax, discount, total)
  - Payment information
  - Shipping address with icons
- Action buttons:
  - Download Invoice
  - Contact Support
- Responsive 3-column layout (2 main + 1 sidebar)

**URL Parameter**: Uses `orderId` from route params

---

### 7. Wishlist.jsx
**Purpose**: Saved products management

**Features**:
- Search in wishlist
- Clear all button
- Product cards with:
  - Product image
  - Discount badge
  - Remove button (heart icon)
  - Product name
  - Star rating and review count
  - Price (current and original)
  - Add to Cart button
  - View product button (eye icon)
  - Out of stock overlay
- Wishlist statistics:
  - Total items
  - In stock count
  - Total value
  - Total savings
- Empty state with CTA
- Grid layout (3 columns on desktop)
- Smooth animations with AnimatePresence

**Interactions**:
- Remove from wishlist
- Add to cart (for in-stock items)
- View product details
- Search filtering

---

### 8. ChangePassword.jsx
**Purpose**: Secure password change functionality

**Features**:
- Security info banner
- Password fields:
  - Current Password
  - New Password
  - Confirm New Password
- Show/hide password toggles for all fields
- Real-time password requirements validation:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character
- Visual requirement checklist with checkmarks
- Password match validation
- Security tips panel
- Form validation before submission
- Success/error messages
- Loading state

**Security**: Client-side validation + backend API validation

---

## 🛣️ Routing Configuration

```jsx
// In App.jsx
<Route
  path="/account"
  element={
    <ProtectedRoute>
      <UserLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<UserDashboard />} />                    // /account
  <Route path="profile" element={<UserProfilePage />} />         // /account/profile
  <Route path="addresses" element={<AddressManagement />} />     // /account/addresses
  <Route path="orders" element={<MyOrders />} />                 // /account/orders
  <Route path="orders/:orderId" element={<OrderDetails />} />    // /account/orders/ORD001234
  <Route path="wishlist" element={<Wishlist />} />               // /account/wishlist
  <Route path="change-password" element={<ChangePassword />} />  // /account/change-password
</Route>
```

All routes are protected by `ProtectedRoute` wrapper which checks authentication.

---

## 🔗 Header Integration

The Header component now includes a "My Account" link in the user dropdown menu:

```jsx
// When user is authenticated
<Link to="/account">My Account</Link>  // Takes to dashboard
<Link to="/profile">My Profile</Link>  // Direct profile access
<button onClick={logout}>Logout</button>
```

---

## 🎬 Animations

All pages use Framer Motion for smooth entry animations:

```jsx
// Standard page animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

**Animation Types**:
- Fade in + slide up for page elements
- Scale animations for cards
- Staggered delays for lists
- AnimatePresence for mount/unmount

---

## 📱 Responsive Design

### Desktop (lg and above)
- Fixed sidebar (256px) + content area
- 3-column grids for products
- 2-column grids for addresses
- Horizontal action buttons

### Tablet (md)
- 2-column grids
- Stacked layouts where needed
- Full-width forms

### Mobile (sm and below)
- Drawer menu instead of sidebar
- Single column layouts
- Stacked action buttons
- Full-width components
- Touch-optimized spacing

---

## 🔌 API Integration Points

### Profile Management
```javascript
// Update profile
PUT /auth/profile
Body: { name, phone }

// Get user data
GET /auth/me
```

### Address Management
```javascript
// Get all addresses
GET /api/addresses

// Add address
POST /api/addresses
Body: { type, name, phone, addressLine, city, state, pincode, isDefault }

// Update address
PUT /api/addresses/:id
Body: { ...address data }

// Delete address
DELETE /api/addresses/:id

// Set default address
PATCH /api/addresses/:id/default
```

### Orders
```javascript
// Get all orders
GET /api/orders

// Get order by ID
GET /api/orders/:orderId

// Cancel order
POST /api/orders/:orderId/cancel
```

### Wishlist
```javascript
// Get wishlist
GET /api/wishlist

// Add to wishlist
POST /api/wishlist
Body: { productId }

// Remove from wishlist
DELETE /api/wishlist/:productId

// Clear wishlist
DELETE /api/wishlist
```

### Password Change
```javascript
// Change password
POST /auth/change-password
Body: { currentPassword, newPassword }
```

---

## 🎯 Current Status

### ✅ Completed
1. **UserLayout** - Sidebar navigation with responsive design
2. **UserDashboard** - Home page with stats and recent orders
3. **UserProfilePage** - Profile editing with validation
4. **AddressManagement** - Full CRUD with modal forms
5. **MyOrders** - Orders list with search and filters
6. **OrderDetails** - Detailed order view with tracking
7. **Wishlist** - Product management with stats
8. **ChangePassword** - Secure password change with validation
9. **Routing** - All routes configured in App.jsx
10. **Header** - My Account link added to user menu

### 📝 Using Mock Data
- All components currently use static mock data
- API integration ready (marked with comments)
- Replace mock data with API calls when backend is ready

### 🚀 Next Steps
1. Connect to real backend APIs
2. Add loading states during API calls
3. Implement error handling
4. Add toast notifications for actions
5. Create backend endpoints for addresses
6. Implement order tracking backend
7. Add wishlist backend functionality
8. Create invoice generation endpoint

---

## 🧪 Testing the Dashboard

### Access the Dashboard
1. Login at `/login`
2. Click "My Account" in the header user menu
3. Or navigate directly to `/account`

### Test Each Section
1. **Dashboard**: View stats and recent orders
2. **Profile**: Update name and phone
3. **Addresses**: Add/edit/delete addresses, set default
4. **Orders**: Search orders, filter by status, view details
5. **Order Details**: View tracking, download invoice (UI ready)
6. **Wishlist**: Add/remove items, search, view stats
7. **Change Password**: Update password with validation

### Mobile Testing
1. Resize browser to mobile width
2. Click hamburger menu in sidebar
3. Test drawer navigation
4. Verify all layouts are responsive

---

## 🎨 Customization

### Colors
Modify Tailwind classes in components:
```jsx
// Primary color (indigo)
bg-indigo-600 → bg-blue-600  // Change to blue
text-indigo-600 → text-blue-600

// Sidebar background
bg-slate-900 → bg-gray-900  // Darker gray
```

### Icons
All icons from Lucide React, easily replaceable:
```jsx
import { Package } from 'lucide-react';
// Replace with any Lucide icon
```

### Layout
Sidebar width in UserLayout.jsx:
```jsx
// Change sidebar width
className="w-64..."  // 256px (default)
className="w-72..."  // 288px (wider)
```

---

## 🐛 Common Issues

### Issue: Routes not working
**Solution**: Ensure ProtectedRoute is properly configured and AuthContext is wrapping the app.

### Issue: Sidebar not showing on mobile
**Solution**: Check z-index values and ensure overlay is clickable to close drawer.

### Issue: Animations not smooth
**Solution**: Ensure Framer Motion is installed: `npm install framer-motion`

### Issue: Icons not rendering
**Solution**: Install Lucide React: `npm install lucide-react`

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x"
}
```

---

## 🎓 Best Practices

1. **State Management**: Use React Context or Redux for global state
2. **API Calls**: Use React Query for caching and loading states
3. **Form Validation**: Implement both client and server-side validation
4. **Error Handling**: Show user-friendly error messages
5. **Loading States**: Display spinners during async operations
6. **Responsive Design**: Test on multiple screen sizes
7. **Accessibility**: Add ARIA labels and keyboard navigation
8. **Security**: Never store passwords in local storage
9. **Performance**: Lazy load images, paginate large lists
10. **Code Quality**: Keep components under 300 lines, extract reusable logic

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review component comments
3. Test with mock data first
4. Verify API endpoints are correct
5. Check browser console for errors

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready (with mock data)

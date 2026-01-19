# BAGVO Admin Panel - Complete Setup Guide

## 📋 Overview

The BAGVO Admin Panel is a comprehensive management system for the e-commerce platform, built with React, Node.js, Express, and MongoDB.

## 🚀 Features Implemented

### ✅ 1. Authentication & Roles
- JWT-based authentication
- Role-based access control (Admin, Staff, Support)
- Protected routes
- Session management
- Audit logging

### ✅ 2. Dashboard
- Real-time KPIs (Revenue, Orders, Customers, Conversion Rate)
- Low stock alerts
- Recent orders overview
- Top-selling products
- Inventory summary
- Sales reports with date filtering

### ✅ 3. Product Management
- Full CRUD operations
- Advanced filtering (status, stock, category)
- Bulk upload support
- Bulk price updates
- Stock management with inventory logs
- SKU tracking
- Product status management (Active, Draft, Out of Stock)
- Low stock threshold alerts

### ✅ 4. Order Management
- Order listing with filters
- Order status tracking (Placed → Confirmed → Packed → Shipped → Delivered)
- Payment status tracking
- Add tracking IDs
- Internal notes system
- Refund management
- Order cancellation
- Stock restoration on refund/cancellation

### ✅ 5. Category Management
- Create, edit, delete categories
- Parent-child category relationships
- Drag & reorder categories
- SEO settings per category
- Homepage visibility control

### ✅ 6. Coupon Management
- Create discount coupons (flat/percentage)
- Usage limits & tracking
- Validity date management
- Min cart value requirements
- Category-specific coupons
- First-order only coupons
- Free shipping options
- Toggle active/inactive status

### ✅ 7. Customer Management
- Customer listing with search
- Order history per customer
- Total spend tracking
- Block/unblock customers
- Customer segmentation (high-value, new, etc.)

### ✅ 8. Settings Management
- Store information
- GST settings
- Shipping configuration
- Razorpay integration
- Email settings
- SEO settings
- Social media links
- Hero banner management
- Homepage section visibility

### ✅ 9. User Management (Admin/Staff)
- Create admin/staff users
- Role assignment
- Activate/deactivate users
- Password management

### ✅ 10. Audit & Security
- Comprehensive audit logging
- Role-based access control
- Password hashing with bcrypt
- JWT token expiration
- Input validation

## 🗄️ Database Models

### Models Created:
1. **User** - Enhanced with admin roles (admin, staff, support)
2. **Product** - Complete with SKU, status, inventory tracking
3. **Category** - With SEO and ordering
4. **Order** - Full order lifecycle management
5. **Payment** - Razorpay integration with refund support
6. **Coupon** - Comprehensive coupon system
7. **InventoryLog** - Stock change tracking
8. **AuditLog** - User activity tracking
9. **Settings** - Store-wide configuration

## 🛠️ Installation

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bagvo
JWT_SECRET=your-super-secret-jwt-key-change-this
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

3. **Start backend server:**
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install @heroicons/react
```

2. **Start development server:**
```bash
npm run dev
```

## 🔐 API Routes

### Public Routes
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Admin Dashboard
- `GET /api/admin/dashboard/metrics` - Dashboard KPIs
- `GET /api/admin/dashboard/sales-report` - Sales analytics
- `GET /api/admin/dashboard/inventory-report` - Inventory stats

### Admin Product Management
- `GET /api/admin/products` - List all products
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `PATCH /api/admin/products/:id/stock` - Update stock
- `POST /api/admin/products/bulk-upload` - Bulk upload
- `PATCH /api/admin/products/bulk-price-update` - Bulk price update

### Admin Order Management
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order details
- `PATCH /api/admin/orders/:id/status` - Update status
- `PATCH /api/admin/orders/:id/tracking` - Add tracking
- `POST /api/admin/orders/:id/notes` - Add note
- `POST /api/admin/orders/:id/refund` - Process refund
- `PATCH /api/admin/orders/:id/cancel` - Cancel order

### Admin Category Management
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `PATCH /api/admin/categories/reorder` - Reorder categories

### Admin Coupon Management
- `GET /api/admin/coupons` - List coupons
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon
- `PATCH /api/admin/coupons/:id/toggle` - Toggle status

### Admin Customer Management
- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/:id` - Get customer details
- `PATCH /api/admin/customers/:id/block` - Block/unblock
- `GET /api/admin/customers/segments/stats` - Customer segments

### Admin Settings
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings
- `PATCH /api/admin/settings/:section` - Update section

### Admin User Management
- `GET /api/admin/users` - List admin users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/toggle-active` - Toggle status

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   └── admin/
│       ├── AdminLayout.jsx          # Sidebar + main layout
│       └── AdminProtectedRoute.jsx  # Route protection
├── context/
│   └── AdminContext.jsx             # Auth context
├── pages/
│   └── admin/
│       ├── AdminLogin.jsx           # Login page
│       ├── AdminDashboard.jsx       # Dashboard
│       ├── AdminProducts.jsx        # Product management
│       └── AdminOrders.jsx          # Order management
└── App.jsx                          # Main app with routes
```

## 🔒 Role-Based Access

### Admin (Full Access)
- All dashboard metrics
- Product, category, order management
- Customer management
- Coupon management
- Payment management
- Reports
- Content & settings
- User management

### Staff (Limited Access)
- Product management
- Category management
- Order management
- Coupon management

### Support (Customer Focus)
- Order management
- Customer management

## 📝 Usage Guide

### 1. First-Time Setup

1. Create an admin user manually in MongoDB or via API:
```javascript
{
  "name": "Admin",
  "email": "admin@bagvo.com",
  "password": "admin123", // Will be hashed
  "role": "admin"
}
```

2. Login at `/admin/login`

### 2. Managing Products

- Navigate to Products section
- Click "Add Product" to create new products
- Use filters to search and filter products
- Edit products inline
- Update stock with automatic inventory logging

### 3. Managing Orders

- View all orders in Orders section
- Filter by status, payment method, dates
- Click on order to view details
- Update order status through workflow
- Add tracking information
- Process refunds when needed

### 4. Managing Coupons

- Create discount coupons
- Set validity dates and usage limits
- Toggle active/inactive status
- Track usage statistics

### 5. Settings Configuration

- Configure store details
- Set up Razorpay integration
- Configure shipping rules
- Manage GST settings
- Update SEO settings

## 🔄 Data Flow

1. **Authentication Flow:**
   - User logs in → JWT token generated
   - Token stored in localStorage
   - Token sent with each API request
   - Middleware validates token and role

2. **Order Status Flow:**
   ```
   Placed → Confirmed → Packed → Shipped → Delivered
   ```

3. **Stock Management:**
   - Order placed → Stock reduced
   - Order cancelled/refunded → Stock restored
   - Manual adjustments logged in InventoryLog

## 🎯 Next Steps

### Additional Pages to Build:
1. Categories page (full UI)
2. Coupons page (full UI)
3. Customers page (full UI)
4. Payments page
5. Reports page with charts
6. Content management page
7. Settings page (full UI)

### Additional Features:
1. Product image upload (Cloudinary)
2. Bulk CSV upload UI
3. Invoice PDF generation
4. Email notifications
5. Real-time notifications
6. Advanced analytics charts
7. Export reports (Excel/CSV/PDF)

## 🐛 Troubleshooting

### Common Issues:

1. **"Not authorized" error:**
   - Check if token is in localStorage
   - Verify user role is admin/staff/support

2. **CORS errors:**
   - Ensure backend CORS is configured for frontend URL

3. **MongoDB connection issues:**
   - Verify MONGODB_URI in .env
   - Check if MongoDB is running

## 📦 Dependencies

### Backend:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- multer
- razorpay

### Frontend:
- react
- react-router-dom
- @tanstack/react-query
- axios
- @heroicons/react
- tailwindcss

## 🔐 Security Best Practices

1. **Never commit .env file**
2. Use strong JWT secret
3. Implement rate limiting
4. Validate all inputs
5. Use HTTPS in production
6. Regular security audits
7. Keep dependencies updated

## 📞 Support

For issues or questions, refer to the codebase documentation or create an issue in the repository.

---

Built with ❤️ for BAGVO

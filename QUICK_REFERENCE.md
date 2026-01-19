# 🚀 BAGVO Admin Panel - Quick Reference

## 🔑 Access Admin Panel

**URL**: `http://localhost:5173/admin/login`

**Default Credentials:**
```
Email: admin@bagvo.com
Password: admin123
```

⚠️ **IMPORTANT**: Change password after first login!

## ⚡ Quick Commands

### Setup Admin User
```bash
cd backend
npm run setup-admin
```

### Start Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 📋 API Quick Reference

### Authentication
```
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

### Dashboard
```
GET /api/admin/dashboard/metrics
GET /api/admin/dashboard/sales-report?period=7days
GET /api/admin/dashboard/inventory-report
```

### Products
```
GET    /api/admin/products?page=1&limit=20&search=bag&status=active
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/stock
```

### Orders
```
GET    /api/admin/orders?status=placed
PATCH  /api/admin/orders/:id/status
PATCH  /api/admin/orders/:id/tracking
POST   /api/admin/orders/:id/refund
```

### All requests require header:
```
Authorization: Bearer <token>
```

## 🎯 Role Permissions

| Feature | Admin | Staff | Support |
|---------|-------|-------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ✅ |
| Customers | ✅ | ❌ | ✅ |
| Coupons | ✅ | ✅ | ❌ |
| Payments | ✅ | ❌ | ❌ |
| Reports | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |
| Users | ✅ | ❌ | ❌ |

## 📊 Order Status Flow

```
Placed → Confirmed → Packed → Shipped → Delivered
```

Alternative flows:
- Any status → `Cancelled`
- Delivered → `Refunded`

## 🔐 Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bagvo
JWT_SECRET=your-super-secret-key-min-32-chars
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## 📁 Key Files

### Backend
- `backend/models/` - Database schemas
- `backend/routes/admin*.js` - Admin API routes
- `backend/middleware/auth.js` - Authentication
- `backend/server.js` - Main server file

### Frontend
- `frontend/src/pages/admin/` - Admin pages
- `frontend/src/components/admin/` - Admin components
- `frontend/src/context/AdminContext.jsx` - Auth state
- `frontend/src/App.jsx` - Routes

## 🎨 Color Scheme

**BAGVO Brand Colors:**
- Primary: Charcoal/Gray-900 (`#111827`)
- Accent: Soft Gold
- Background: Gray-50 (`#F9FAFB`)
- Text: Gray-900 (`#111827`)

**Status Colors:**
- Success: Green-600
- Warning: Amber-600
- Error: Red-600
- Info: Blue-600

## 🛠️ Common Tasks

### Create New Admin User
```javascript
// Via MongoDB or API
{
  "name": "Staff Name",
  "email": "staff@bagvo.com",
  "password": "securepass123",
  "role": "staff" // or "admin", "support"
}
```

### Update Product Stock
```javascript
PATCH /api/admin/products/:id/stock
{
  "action": "add", // or "reduce", "set"
  "quantity": 50,
  "reason": "New stock arrival"
}
```

### Process Refund
```javascript
POST /api/admin/orders/:id/refund
{
  "amount": 1500,
  "reason": "Customer request",
  "refundType": "full" // or "partial"
}
```

### Create Coupon
```javascript
POST /api/admin/coupons
{
  "code": "WELCOME20",
  "type": "percentage",
  "value": 20,
  "minCartValue": 1000,
  "validFrom": "2024-01-01",
  "validTill": "2024-12-31",
  "usageLimit": 100
}
```

## 🐛 Troubleshooting

### "Not authorized" error
```bash
# Check if token exists
localStorage.getItem('adminToken')

# Check user role
localStorage.getItem('adminToken') && jwt.decode(token)
```

### CORS error
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### MongoDB connection failed
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

## 📚 Documentation

- **Full Guide**: `ADMIN_PANEL_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **This File**: Quick reference

## 🔗 Useful Links

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Admin Login: http://localhost:5173/admin/login

## 💡 Pro Tips

1. **Use React Query DevTools** for debugging API calls
2. **Check Network tab** in browser DevTools for API errors
3. **Use MongoDB Compass** to view/edit data directly
4. **Keep terminal open** to see backend logs
5. **Use Postman** to test API endpoints

## 📞 Need Help?

1. Check browser console for errors
2. Check backend terminal for server logs
3. Review ADMIN_PANEL_GUIDE.md
4. Check MongoDB data with Compass
5. Test API with Postman

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready

# Wishlist Stock Status Troubleshooting Guide

## Issue: Products Showing "Out of Stock" When They're Actually In Stock

### Quick Fix (Recommended)

1. **Stop the backend server** (if running)
   ```bash
   # Find and kill process on port 5000
   netstat -ano | findstr :5000
   # Then kill the process ID shown
   ```

2. **Run the stock status fix script**
   ```bash
   cd backend
   node scripts/fixStockStatus.js
   ```

3. **Restart the backend server**
   ```bash
   cd backend
   node server.js
   ```

4. **Refresh the wishlist page** in your browser

### What the Fix Does

The script:
- ✅ Connects to your MongoDB database
- ✅ Scans all products
- ✅ Recalculates stock status based on actual stock count:
  - `stock === 0` → `out_of_stock`
  - `stock <= lowStockThreshold` → `low_stock`
  - `stock > lowStockThreshold` → `in_stock`
- ✅ Updates only products with incorrect status
- ✅ Shows a summary of changes made

### Debugging (Check Console Logs)

#### Backend (Terminal)
When you access the wishlist, you'll see:
```
=== WISHLIST DEBUG ===
User: [user_id]
Wishlist items count: X
Product: [product_name]
  - Stock: X
  - Stock Status: in_stock/out_of_stock/low_stock
  - Price: {...}
======================
```

If you see:
```
⚠️ Stock status mismatch for [product_name]:
  stock: 10
  dbStatus: 'out_of_stock'
  correctStatus: 'in_stock'
```
This means the backend is auto-correcting the status.

#### Frontend (Browser Console - F12)
```
=== FRONTEND WISHLIST DEBUG ===
Raw response: {...}
Total items: X

Item 1: [product_name]
  Raw data: {
    stock: 10,
    stockStatus: 'in_stock',
    ...
  }
  Calculated availability: ✅ IN STOCK
================================
```

### Understanding Stock Status Logic

```javascript
// Backend auto-calculation (Product model pre-save hook)
if (stock === 0) {
  stockStatus = 'out_of_stock';
} else if (stock <= lowStockThreshold) {  // default: 10
  stockStatus = 'low_stock';
} else {
  stockStatus = 'in_stock';
}

// Frontend check (Wishlist component)
isInStock = stock > 0 && stockStatus !== 'out_of_stock';
```

### Common Causes

1. **Old data in database** - Products saved before stock status logic was implemented
2. **Manual database edits** - Stock status set manually and not updated when stock changed
3. **Import/seed scripts** - Products imported with incorrect stock status values
4. **Race conditions** - Stock updated but status not recalculated

### Manual Database Check (MongoDB)

```javascript
// Check a specific product
db.products.findOne({ name: "product_name" }, { stock: 1, stockStatus: 1, lowStockThreshold: 1 })

// Find all products with mismatched status
db.products.find({
  $expr: {
    $and: [
      { $gt: ["$stock", 0] },
      { $eq: ["$stockStatus", "out_of_stock"] }
    ]
  }
})
```

### Prevention

The backend now includes:
1. ✅ Pre-save hook to auto-calculate stock status
2. ✅ Runtime correction in wishlist API (temporary patch)
3. ✅ Comprehensive logging
4. ✅ Fix script for database cleanup

### Need More Help?

Check these files:
- Backend route: `backend/routes/userWishlistRoutes.js` (lines 11-54)
- Product model: `backend/models/Product.js` (lines 218-226)
- Frontend component: `frontend/src/pages/user/Wishlist.jsx` (lines 79-96)
- Fix script: `backend/scripts/fixStockStatus.js`

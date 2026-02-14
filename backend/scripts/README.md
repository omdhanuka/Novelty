# Setup Scripts

⚠️ **SECURITY NOTICE**: These scripts are for initial setup only and are blocked in production environments.

## Available Scripts

### setupAdmin.js
Creates the initial admin user account.
- **Usage**: `node scripts/setupAdmin.js`
- **When**: Run once during initial project setup
- **Security**: Blocked in production environment

### seedCategories.js
Seeds the database with initial product categories.
- **Usage**: `node scripts/seedCategories.js`
- **When**: Run once during initial project setup
- **Security**: Blocked in production environment

### fixStockStatus.js
Fixes stock status for all products based on their actual stock count.
- **Usage**: `node scripts/fixStockStatus.js`
- **When**: Run when products show incorrect stock status (e.g., showing "Out of Stock" when stock > 0)
- **What it does**: 
  - Scans all products in the database
  - Recalculates correct stock status based on stock count
  - Updates products with incorrect status
  - Shows summary of fixed products
- **Security**: Can be run in any environment but requires database access

### normalizeAddressTypes.js
Normalizes address types to use consistent enum values.
- **Usage**: `node scripts/normalizeAddressTypes.js`
- **When**: Run if address types need standardization
- **Security**: Blocked in production environment

## Production Deployment

⚠️ **IMPORTANT**: 
1. These scripts will NOT run in production (NODE_ENV=production)
2. For production data management, use the admin dashboard only
3. Never expose database connection strings in production
4. Always use environment variables for sensitive data
5. Ensure admin routes have proper authentication middleware

## Best Practices

1. **Run scripts only during development/setup**
2. **Delete or disable scripts after initial setup**
3. **Use admin dashboard for all data management in production**
4. **Keep database credentials secure**
5. **Use strong passwords for admin accounts**

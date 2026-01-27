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

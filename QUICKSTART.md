# 🚀 Quick Start Guide

## Step 1: Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

### Frontend
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Backend
Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bagshop
JWT_SECRET=supersecretkey123456789
JWT_EXPIRE=7d

# Optional - Add when ready
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_URL=http://localhost:5173
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

## Step 5: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🎉 You're All Set!

The home page will display with:
- ✅ Auto-sliding hero banners
- ✅ Category navigation with mega menu
- ✅ Product grids with best sellers
- ✅ Special collections
- ✅ Customer reviews
- ✅ Social proof gallery
- ✅ Complete footer with contact info

## 📝 Next Steps

1. **Add Products**: Use MongoDB Compass or create an admin panel to add products
2. **Configure Cloudinary**: For image uploads (optional for development)
3. **Configure Razorpay**: For payment processing (optional for development)
4. **Test Features**: Try adding products to cart, wishlist, search, etc.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is installed and running
- Check if the connection string in `.env` is correct

### Port Already in Use
- Change the PORT in backend `.env` file
- Update `VITE_API_URL` in frontend `.env` accordingly

### Module Not Found
- Run `npm install` again in the respective directory
- Delete `node_modules` and `package-lock.json`, then reinstall

## 💡 Tips

- Use **MongoDB Compass** for easy database management
- Install **React Developer Tools** browser extension
- Use **Postman** or **Thunder Client** for API testing
- Check browser console for frontend errors
- Check terminal for backend errors

## 📞 Need Help?

Refer to the main [README.md](README.md) for detailed documentation.

# 🎯 Complete Setup Commands

Run these commands in PowerShell to get your BagShop platform running:

## 1. Backend Setup

```powershell
# Navigate to backend directory
cd e:\Desktop\Novelty\backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file (use notepad or your preferred editor)
notepad .env
```

Add these values to `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bagshop
JWT_SECRET=bagshop_secret_key_2026_change_me
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 2. Frontend Setup

```powershell
# Navigate to frontend directory (open new terminal)
cd e:\Desktop\Novelty\frontend

# Install dependencies (if not already done)
npm install

# Create .env file
Copy-Item .env.example .env

# No need to edit - default values work for local development
```

## 3. Start MongoDB

Ensure MongoDB is installed and running. In a new PowerShell window:

```powershell
# Start MongoDB service (if not running)
net start MongoDB

# Or if you have MongoDB installed locally
mongod
```

## 4. Start Backend Server

In the backend terminal:

```powershell
cd e:\Desktop\Novelty\backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

## 5. Start Frontend Server

In the frontend terminal:

```powershell
cd e:\Desktop\Novelty\frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 6. Open in Browser

Navigate to: **http://localhost:5173**

## 🎉 Success!

You should now see the complete BagShop home page with:
- ✅ Sticky header with search and cart
- ✅ Mega navigation menu
- ✅ Auto-rotating hero slider
- ✅ Category cards
- ✅ Best sellers product grid
- ✅ Special collections
- ✅ Why choose us section
- ✅ Customer reviews
- ✅ Instagram gallery
- ✅ Complete footer

## 🔧 Quick Commands Reference

### Stop Servers
Press `Ctrl + C` in each terminal

### Restart Backend
```powershell
cd e:\Desktop\Novelty\backend
npm run dev
```

### Restart Frontend
```powershell
cd e:\Desktop\Novelty\frontend
npm run dev
```

### Check if ports are in use
```powershell
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 5173 (frontend)
netstat -ano | findstr :5173
```

### Kill process on port (if needed)
```powershell
# Replace PID with the actual process ID from netstat
taskkill /PID <PID> /F
```

## 📁 Project Structure Overview

```
Novelty/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── lib/           # API & utilities
│   │   └── App.jsx        # Main app
│   └── package.json
│
├── backend/               # Express.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── package.json
│
├── README.md             # Full documentation
├── QUICKSTART.md         # Quick start guide
└── SETUP.md              # This file
```

## 🚀 Next Steps

1. ✅ **Application is running** - Test the UI
2. 📦 **Add sample data** - Create products via API or database
3. 🎨 **Customize** - Update colors, images, and content
4. 🔐 **Setup Cloudinary** - For image uploads
5. 💳 **Setup Razorpay** - For payment processing
6. 🚀 **Deploy** - To Vercel (frontend) and Render (backend)

## 💡 Development Tips

- **Hot Reload**: Both frontend and backend have hot reload enabled
- **API Testing**: Use Postman or Thunder Client VS Code extension
- **Database GUI**: Install MongoDB Compass for easy data management
- **React DevTools**: Install React Developer Tools browser extension
- **Console**: Keep browser console open to catch errors

## 🐛 Common Issues

### "Cannot find module"
```powershell
# Delete node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### "Port already in use"
Change the PORT in backend/.env or kill the process

### "MongoDB connection failed"
- Ensure MongoDB is installed and running
- Check connection string in .env

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env

## 📞 Support

For issues, refer to:
- [README.md](README.md) - Complete documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick reference guide

---

**Happy Coding! 🎉**

<<<<<<< HEAD
# 🛍️ BagShop - Complete E-Commerce Platform

A full-stack, production-ready online shopping platform for bags, purses, and covers. Built with modern technologies for scalability, performance, and excellent user experience.

## ✨ Features

### Frontend
- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion
- **Responsive Design**: Mobile-first, works seamlessly on all devices
- **Hero Slider**: Auto-sliding promotional banners
- **Mega Navigation**: Category dropdown with subcategories
- **Product Catalog**: Grid/list views with filters and sorting
- **Search**: Real-time product search
- **Shopping Cart**: Add to cart with quantity management
- **Wishlist**: Save products for later
- **User Authentication**: Register, login, profile management
- **Order Tracking**: View order history and status
- **Customer Reviews**: Ratings and reviews with images
- **Payment Integration**: Razorpay (UPI, Cards, NetBanking, COD)

### Backend
- **RESTful API**: Built with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **File Upload**: Cloudinary integration for images
- **Payment Gateway**: Razorpay integration
- **Order Management**: Complete order lifecycle
- **Review System**: Product reviews and ratings
- **Security**: bcrypt password hashing, input validation

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **State Management**: Zustand
- **API Calls**: React Query + Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Validation**: express-validator

## 📦 Installation

### Prerequisites
- Node.js (v20+)
- MongoDB (local or Atlas)
- Cloudinary account (for images)
- Razorpay account (for payments)

### Frontend Setup

```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and add your API URL

# Start development server
npm run dev
```

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your credentials:
# - MongoDB URI
# - JWT Secret
# - Cloudinary credentials
# - Razorpay credentials

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bagshop
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173
```

## 📱 Project Structure

```
bagshop/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   ├── lib/            # Utilities (API, React Query)
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
│
└── backend/
    ├── models/             # Mongoose models
    ├── routes/             # Express routes
    ├── middleware/         # Custom middleware
    ├── server.js           # Server entry point
    └── package.json
```

## 🎨 Key Components

### Frontend Components
- **Header**: Sticky header with search, cart, wishlist
- **MegaMenu**: Category navigation with subcategories
- **HeroSlider**: Auto-rotating promotional banners
- **ShopByCategory**: Category grid with hover effects
- **BestSellers**: Product grid with quick actions
- **SpecialCollections**: Featured collections
- **WhyChooseUs**: Trust badges and features
- **CustomerReviews**: Customer testimonials
- **SocialProof**: Instagram-style gallery
- **Footer**: Complete footer with links and contact info

### Backend API Endpoints

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/featured` - Get featured products

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

#### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PATCH /api/orders/:id/status` - Update order status (admin)

#### Payments
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

#### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

### Backend (Render/AWS)
```bash
cd backend
# Push to GitHub
# Connect to Render/AWS and deploy
# Set environment variables in hosting platform
```

## 📄 License

This project is created for BagShop. All rights reserved.

## 🤝 Support

For support, email support@bagshop.com or call +91 98765 43210

## 🎯 Features Coming Soon

- [ ] Product comparison
- [ ] Advanced filters
- [ ] Bulk order discount
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Dark mode

---

**Made with ❤️ in India**
=======
# Novelty
>>>>>>> 5713469535e538e08c53dc1d78f1a90fb095fcb9

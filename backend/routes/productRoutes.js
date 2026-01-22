import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      search,
      colors,
      material,
      stockStatus,
      discount,
      isBestSeller,
      isNewArrival,
      isFeatured,
    } = req.query;

    const query = { status: 'active' }; // Only show active products

    // Category filter
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    // Price filter
    if (minPrice || maxPrice) {
      query['price.selling'] = {};
      if (minPrice) query['price.selling'].$gte = Number(minPrice);
      if (maxPrice) query['price.selling'].$lte = Number(maxPrice);
    }

    // Color filter
    if (colors) {
      const colorArray = colors.split(',');
      query['attributes.colors'] = { $in: colorArray };
    }

    // Material filter
    if (material) {
      query['attributes.material'] = material;
    }

    // Stock status filter
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }

    // Discount filter (e.g., discount=20 means 20% or more)
    if (discount) {
      query['price.discount'] = { $gte: Number(discount) };
    }

    // Flags filter
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isFeatured === 'true') query.isFeatured = true;

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Sort options mapping
    let sortOption = '-createdAt';
    if (sort === 'price_asc') sortOption = 'price.selling';
    else if (sort === 'price_desc') sortOption = '-price.selling';
    else if (sort === 'newest') sortOption = '-createdAt';
    else if (sort === 'bestseller') sortOption = '-sold';
    else if (sort === 'rating') sortOption = '-rating';

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    // Get filter options
    const categories = await Product.distinct('category', { status: 'active' });
    const availableColors = await Product.distinct('attributes.colors', { status: 'active' });
    const availableMaterials = await Product.distinct('attributes.material', { status: 'active' });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        categories,
        colors: availableColors.filter(Boolean),
        materials: availableMaterials.filter(Boolean),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    let product;
    
    // Check if it's an ObjectId or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      product = await Product.findById(req.params.id).populate('category', 'name slug');
    } else {
      // It's a slug
      product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
    }
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name slug')
      .sort(sort)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments({ category: req.params.categoryId });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const products = await Product.find({ $text: { $search: q } })
      .populate('category', 'name slug')
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments({ $text: { $search: q } });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get best sellers
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-sold');

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

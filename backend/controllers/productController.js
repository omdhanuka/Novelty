import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
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

    const query = { status: 'active' };

    // Category filter
    if (category) {
      const categoryArray = category.split(',').map(c => c.trim());
      query.category = categoryArray.length === 1 ? categoryArray[0] : { $in: categoryArray };
    }
    if (subcategory) query.subcategory = subcategory;

    // Price filter
    if (minPrice || maxPrice) {
      query['price.selling'] = {};
      if (minPrice) query['price.selling'].$gte = Number(minPrice);
      if (maxPrice) query['price.selling'].$lte = Number(maxPrice);
    }

    // Color filter
    if (colors) {
      const colorArray = colors.split(',').map(c => c.trim());
      query['attributes.colors'] = { 
        $in: colorArray.map(color => new RegExp(`^${color}$`, 'i'))
      };
    }

    // Material filter
    if (material) query['attributes.material'] = material;

    // Stock status filter
    if (stockStatus) query.stockStatus = stockStatus;

    // Discount filter
    if (discount) query['price.discount'] = { $gte: Number(discount) };

    // Flags filter
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isFeatured === 'true') query.isFeatured = true;

    // Search
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    // Sort options
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

    // Get filter options - show all active categories (even if no products yet)
    const categories = await Category.find({ 
      status: 'ACTIVE' 
    }).sort({ name: 1 });

    const availableColors = await Product.distinct('attributes.colors', { status: 'active' });
    const availableMaterials = await Product.distinct('attributes.material', { status: 'active' });

    // Price range
    const priceRange = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: {
        _id: null,
        min: { $min: '$price.selling' },
        max: { $max: '$price.selling' }
      }}
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
      filters: {
        categories,
        colors: availableColors.filter(Boolean),
        materials: availableMaterials.filter(Boolean),
        priceRange: priceRange[0] || { min: 0, max: 0 },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count (non-persistent if not in schema)
    try {
      product.views = (product.views || 0) + 1;
      await product.save();
    } catch (e) {
      // Log but don't fail the request if views can't be saved
      console.warn('Could not increment product views:', e.message);
    }

    // Load reviews separately to avoid relying on a virtual populate
    const reviews = await Review.find({ product: product._id }).populate('user', 'name');

    const productObj = product.toObject({ virtuals: true });
    productObj.reviews = reviews;

    res.json({ success: true, data: productObj });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'active',
    })
      .limit(8)
      .select('name images mainImage price rating reviewCount');

    res.json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message,
    });
  }
};

import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      stockFilter,
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Category filter
    if (category) query.category = category;

    // Status filter
    if (status) query.status = status;

    // Stock filter
    if (stockFilter === 'low') {
      query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
      query.stock = { $gt: 0 };
    } else if (stockFilter === 'out') {
      query.stock = 0;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Product.countDocuments(query);

    // Get statistics
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          lowStock: {
            $sum: { $cond: [{ $lte: ['$stock', '$lowStockThreshold'] }, 1, 0] },
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      stats: stats[0] || {},
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

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    console.log('📦 Creating product...');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    // Normalize and coerce incoming form-data values
    const productDataRaw = req.body || {};

    const tryParseJSON = (val) => {
      if (val == null) return val;
      if (typeof val === 'object') return val;
      const s = String(val).trim();
      if (!s) return undefined;
      if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
        try { return JSON.parse(s); } catch (e) { return val; }
      }
      return val;
    };

    const toNumber = (v, fallback = 0) => {
      const n = Number(v);
      return Number.isNaN(n) ? fallback : n;
    };

    const toBool = (v) => {
      if (typeof v === 'boolean') return v;
      const s = String(v).toLowerCase();
      return s === 'true' || s === '1' || s === 'yes';
    };

    const productData = {
      ...productDataRaw,
    };

    // Coerce nested fields
    if (productData.price) {
      productData.price = tryParseJSON(productData.price) || productData.price;
      productData.price.mrp = toNumber(productData.price.mrp);
      productData.price.selling = toNumber(productData.price.selling);
    }

    productData.stock = toNumber(productData.stock, 0);
    productData.lowStockThreshold = toNumber(productData.lowStockThreshold, 10);

    // Attributes and arrays may come as JSON strings
    if (productData.attributes) {
      productData.attributes = tryParseJSON(productData.attributes) || productData.attributes;
      if (productData.attributes.colors) productData.attributes.colors = tryParseJSON(productData.attributes.colors) || productData.attributes.colors;
      if (productData.attributes.sizes) productData.attributes.sizes = tryParseJSON(productData.attributes.sizes) || productData.attributes.sizes;
      if (productData.attributes.occasion) productData.attributes.occasion = tryParseJSON(productData.attributes.occasion) || productData.attributes.occasion;
    }

    if (productData.shipping) {
      productData.shipping = tryParseJSON(productData.shipping) || productData.shipping;
      if (productData.shipping.weight) productData.shipping.weight = toNumber(productData.shipping.weight);
      if (productData.shipping.dimensions) {
        productData.shipping.dimensions = tryParseJSON(productData.shipping.dimensions) || productData.shipping.dimensions;
        productData.shipping.dimensions.length = toNumber(productData.shipping.dimensions.length);
        productData.shipping.dimensions.width = toNumber(productData.shipping.dimensions.width);
        productData.shipping.dimensions.height = toNumber(productData.shipping.dimensions.height);
      }
      if (productData.shipping.codAvailable != null) productData.shipping.codAvailable = toBool(productData.shipping.codAvailable);
    }

    if (productData.seo) {
      productData.seo = tryParseJSON(productData.seo) || productData.seo;
      if (productData.seo.keywords) productData.seo.keywords = tryParseJSON(productData.seo.keywords) || productData.seo.keywords;
    }

    if (productData.tags) productData.tags = tryParseJSON(productData.tags) || productData.tags;
    if (productData.features) productData.features = tryParseJSON(productData.features) || productData.features;

    // Normalize boolean flags
    productData.isFeatured = toBool(productData.isFeatured);
    productData.isNewArrival = toBool(productData.isNewArrival);
    productData.isBestSeller = toBool(productData.isBestSeller);
    productData.showOnHomepage = toBool(productData.showOnHomepage);

    // If images were sent as JSON array of strings, convert to objects expected by schema
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map((img) => (typeof img === 'string' ? { url: img } : img));
    }

    // Handle image uploads
    if (req.files) {
      if (req.files.mainImage) {
        productData.mainImage = `/uploads/products/${req.files.mainImage[0].filename}`;
      }
      if (req.files.hoverImage) {
        productData.hoverImage = `/uploads/products/${req.files.hoverImage[0].filename}`;
      }
      if (req.files.images) {
        productData.images = req.files.images.map((file) => ({ url: `/uploads/products/${file.filename}` }));
      }
    }

    console.log('Product data before create:', productData);

    // Check for existing SKU to return a friendly error
    if (productData.sku) {
      const existing = await Product.findOne({ sku: productData.sku });
      if (existing) {
        return res.status(409).json({ success: false, message: 'SKU already exists', keyValue: { sku: productData.sku } });
      }
    }

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);

    // Log inventory
    await InventoryLog.create({
      product: product._id,
      action: 'add',
      quantity: product.stock || 0,
      previousStock: 0,
      newStock: product.stock || 0,
      reason: 'Initial stock',
      performedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', Object.keys(error.errors));
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const oldStock = product.stock;
    const updateData = req.body;

    // Handle image uploads
    if (req.files) {
      if (req.files.mainImage) {
        updateData.mainImage = `/uploads/products/${req.files.mainImage[0].filename}`;
      }
      if (req.files.hoverImage) {
        updateData.hoverImage = `/uploads/products/${req.files.hoverImage[0].filename}`;
      }
      if (req.files.images) {
        updateData.images = req.files.images.map((file) => ({ url: `/uploads/products/${file.filename}` }));
      }
    }

    // If incoming images array contains strings, convert to objects
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = updateData.images.map((img) => (typeof img === 'string' ? { url: img } : img));
    }

    Object.assign(product, updateData);
    await product.save();

    // Log stock changes
    if (oldStock !== product.stock) {
      await InventoryLog.create({
        product: product._id,
        action: product.stock > oldStock ? 'add' : 'reduce',
        quantity: Math.abs(product.stock - oldStock),
        previousStock: oldStock,
        newStock: product.stock,
        reason: req.body.stockReason || 'Stock adjustment',
        performedBy: req.user._id,
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

// @desc    Update product stock
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { quantity, type, reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const oldStock = product.stock;

    if (type === 'add') {
      product.stock += quantity;
    } else if (type === 'remove') {
      product.stock = Math.max(0, product.stock - quantity);
    } else if (type === 'set') {
      product.stock = quantity;
    }

    await product.save();

    // Log inventory change
    await InventoryLog.create({
      product: product._id,
      action: type,
      quantity,
      previousStock: oldStock,
      newStock: product.stock,
      reason,
      performedBy: req.user._id,
    });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};

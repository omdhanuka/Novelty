import mongoose from 'mongoose';
import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    console.log('📦 Create order request body:', req.body);
    const { address, paymentMethod, items, coupon, paymentDetails } = req.body || {};

    // Detailed validation with informative messages
    if (!address) {
      return res.status(400).json({ success: false, message: 'Missing address' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing paymentMethod' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to order' });
    }

    // Get the full address details
    const User = mongoose.model('User');
    const user = await User.findById(req.user._id);
    const shippingAddress = user.addresses?.id(address);

    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Map address (support different frontend/back-end field names)
    const mappedAddress = {
      fullName: shippingAddress.fullName || shippingAddress.name || '',
      phone: shippingAddress.phone || shippingAddress.mobile || '',
      addressLine1: shippingAddress.addressLine || shippingAddress.addressLine1 || shippingAddress.street || '',
      addressLine2: shippingAddress.addressLine2 || shippingAddress.secondary || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      pincode: shippingAddress.pincode || shippingAddress.zip || '',
      landmark: shippingAddress.landmark || '',
    };

    // Validate required fields
    if (!mappedAddress.fullName || !mappedAddress.phone || !mappedAddress.addressLine1 || 
        !mappedAddress.city || !mappedAddress.state || !mappedAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete address information',
      });
    }

    // Normalize payment method
    const normalizePaymentMethod = (pm) => {
      const key = pm.toString().toLowerCase();
      if (key === 'cod' || key === 'cashondelivery') return 'COD';
      if (key === 'card' || key === 'credit' || key === 'debit') return 'Card';
      if (key === 'upi') return 'UPI';
      if (key === 'netbanking' || key === 'net_banking') return 'NetBanking';
      if (key === 'wallet') return 'Wallet';
      return pm;
    };

    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    // Calculate totals
    let itemsPrice = 0;
    const orderItems = [];

    // Validate stock and build order items (fill missing snapshot data from DB)
    const Product = mongoose.model('Product');
    for (const item of items) {
      const productId = item.product?._id || item.product;
      const quantity = item.quantity || 1;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productSnapshot?.name || productId} not found`,
        });
      }

      // Validate selected color and size against product attributes
      const selectedColor = (item.selectedColor || '').toString().trim();
      const selectedSize = (item.selectedSize || '').toString().trim();

      if (selectedColor) {
        const availableColors = (product.attributes && product.attributes.colors) || [];
        // Normalize colors (handle JSON strings and arrays)
        const normalizedColors = availableColors.flatMap(c => {
          if (typeof c === 'string' && c.trim().startsWith('[')) {
            try {
              const parsed = JSON.parse(c);
              return Array.isArray(parsed) ? parsed : [c];
            } catch (e) {
              return [c];
            }
          }
          return [c];
        }).map(c => String(c).toLowerCase().trim());
        
        const foundColor = normalizedColors.includes(selectedColor.toLowerCase());
        if (!foundColor) {
          console.warn(`Color '${selectedColor}' not in [${normalizedColors.join(', ')}] for ${product.name} - allowing order`);
          // Don't block order - just log warning
        }
      }

      if (selectedSize) {
        const availableSizes = (product.attributes && product.attributes.sizes) || [];
        const foundSize = availableSizes.some(s => String(s).toLowerCase() === selectedSize.toLowerCase());
        if (!foundSize) {
          console.warn(`Selected size '${selectedSize}' not available for product ${product._id} — continuing as size is optional`);
          // sizes are optional — do not block order
        }
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Determine prices (use snapshot if present, else product current price)
      const sellingPrice = item.productSnapshot?.price ?? product.price?.selling ?? 0;
      const originalPrice = item.productSnapshot?.originalPrice ?? product.price?.mrp ?? sellingPrice;

      // Build order item
      orderItems.push({
        product: product._id,
        name: item.productSnapshot?.name || product.name,
        image: item.productSnapshot?.image || product.mainImage || (product.images && product.images[0]) || '',
        price: sellingPrice,
        quantity,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || '',
      });

      itemsPrice += sellingPrice * quantity;

      // Update stock
      product.stock -= quantity;
      product.sold = (product.sold || 0) + quantity;
      await product.save();
    }

    const shippingPrice = itemsPrice >= 500 ? 0 : 50;
    const taxPrice = itemsPrice * 0.18;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const orderData = {
      user: req.user._id,
      items: orderItems,
      shippingAddress: mappedAddress,
      paymentMethod: normalizedPaymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    // Add coupon if provided
    if (coupon) {
      const couponCode = typeof coupon === 'string' ? coupon : coupon?.code;
      const couponDiscountAmt = typeof coupon === 'object' ? coupon?.discount : 0;
      if (couponCode) {
        orderData.couponApplied = {
          code: couponCode,
          discount: couponDiscountAmt || 0,
        };
      }
    }

    // Add payment details if provided (for online payments)
    if (paymentDetails) {
      orderData.paymentInfo = {
        razorpayPaymentId: paymentDetails.transactionId,
        razorpayOrderId: paymentDetails.razorpayOrderId,
      };
      orderData.paymentStatus = 'paid';
      orderData.isPaid = true;
      orderData.paidAt = new Date();
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

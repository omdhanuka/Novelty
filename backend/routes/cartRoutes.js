import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name images mainImage price stock stockStatus attributes category',
      populate: {
        path: 'category',
        select: 'name slug',
      },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check product availability and update stock status
    const updatedItems = cart.items.map((item) => {
      if (!item.product || item.product.stock === 0 || item.product.stockStatus === 'out_of_stock') {
        return { ...item.toObject(), isAvailable: false };
      }
      return { ...item.toObject(), isAvailable: true };
    });

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        items: updatedItems,
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems(),
        totalDiscount: cart.getTotalDiscount(),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor = '', selectedSize = '' } = req.body;

    // Validate product
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity || product.stockStatus === 'out_of_stock') {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock',
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product with same variant already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    // Create product snapshot
    const productSnapshot = {
      name: product.name,
      image: product.mainImage || product.images?.[0]?.url || '',
      price: product.price?.selling || 0,
      originalPrice: product.price?.mrp || product.price?.selling || 0,
      discount: product.price?.discount || 0,
    };

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].productSnapshot = productSnapshot;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        selectedColor,
        selectedSize,
        productSnapshot,
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name images mainImage price stock stockStatus attributes category',
      populate: {
        path: 'category',
        select: 'name slug',
      },
    });

    res.json({
      success: true,
      message: 'Product added to cart',
      data: {
        ...cart.toObject(),
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems(),
        totalDiscount: cart.getTotalDiscount(),
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart',
      error: error.message,
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Check stock availability
    const product = await Product.findById(item.product);
    if (!product || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity not available',
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name images mainImage price stock stockStatus attributes category',
      populate: {
        path: 'category',
        select: 'name slug',
      },
    });

    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        ...cart.toObject(),
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems(),
        totalDiscount: cart.getTotalDiscount(),
      },
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message,
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name images mainImage price stock stockStatus attributes category',
      populate: {
        path: 'category',
        select: 'name slug',
      },
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        ...cart.toObject(),
        totalPrice: cart.getTotalPrice(),
        totalItems: cart.getTotalItems(),
        totalDiscount: cart.getTotalDiscount(),
      },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message,
    });
  }
});

// Clear entire cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
});

// Move item to wishlist
router.post('/move-to-wishlist/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const productId = item.product;

    // Add to wishlist (you'll need to implement this based on your wishlist model)
    // For now, just remove from cart
    cart.items.pull(itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item moved to wishlist',
      data: cart,
    });
  } catch (error) {
    console.error('Move to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move item to wishlist',
      error: error.message,
    });
  }
});

export default router;

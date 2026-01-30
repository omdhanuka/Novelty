import { createContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useCartStore } from '../store';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    if (cart?.items) {
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [cart, forceUpdate]);

  const syncCartState = (cartData) => {
    console.log('🔄 Syncing cart state:', cartData);
    setCart(cartData);
    const count = cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    console.log('📊 Cart count updated to:', count);
    setCartCount(count);
    setForceUpdate(prev => prev + 1);
    
    // Sync zustand store
    try {
      const mapped = (cartData?.items || []).map((it) => ({
        id: it.product?._id || it.product,
        quantity: it.quantity,
        price: it.price || it.product?.price?.selling || (it.productSnapshot?.price ?? 0),
        product: it.product,
        snapshot: it.productSnapshot,
        _id: it._id,
      }));
      console.log('🎯 Zustand store updated with items:', mapped.length);
      useCartStore.setState({ items: mapped });
    } catch (e) {
      console.error('Failed to sync zustand store:', e);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      if (response.data.success) {
        syncCartState(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      if (error.response?.status === 401) {
        syncCartState(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedColor = '', selectedSize = '') => {
    try {
      console.log('➕ Adding to cart:', { productId, quantity, selectedColor, selectedSize });
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        selectedColor,
        selectedSize,
      });
      
      if (response.data.success) {
        console.log('✅ Add to cart successful:', response.data.data);
        syncCartState(response.data.data);
        return { success: true, message: 'Product added to cart!' };
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      if (response.data.success) {
        syncCartState(response.data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      if (response.data.success) {
        syncCartState(response.data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item',
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/cart/clear');
      if (response.data.success) {
        syncCartState(response.data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false };
    }
  };

  const moveToWishlist = async (itemId) => {
    try {
      const response = await api.post(`/cart/move-to-wishlist/${itemId}`);
      if (response.data.success) {
        syncCartState(response.data.data);
        return { success: true, message: 'Item moved to wishlist' };
      }
    } catch (error) {
      console.error('Move to wishlist error:', error);
      return { success: false };
    }
  };

  const value = {
    cart,
    loading,
    cartCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    moveToWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

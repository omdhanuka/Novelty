import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // If unauthorized, clear cart
      if (error.response?.status === 401) {
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedColor = '', selectedSize = '') => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        selectedColor,
        selectedSize,
      });
      
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: 'Product added to cart!' };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Update cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data);
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
        setCart(response.data.data);
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
        setCart(response.data.data);
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

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.data);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(data);
        return { success: true, data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(data);
        return { success: true, data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: response.data.success,
        message: response.data.message,
        resetToken: response.data.resetToken, // Remove in production
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Request failed',
      };
    }
  };

  const resetPassword = async (token, passwords) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, passwords);
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Reset failed',
      };
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await api.put('/auth/change-password', passwords, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password change failed',
      };
    }
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

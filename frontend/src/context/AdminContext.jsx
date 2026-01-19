import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && ['admin', 'staff', 'support'].includes(data.data.role)) {
        setUser(data.data);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    if (data.success && ['admin', 'staff', 'support'].includes(data.data.role)) {
      localStorage.setItem('adminToken', data.token);
      setUser(data.data);
      return data;
    } else {
      throw new Error('Not authorized to access admin panel');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AdminContext.Provider>
  );
};

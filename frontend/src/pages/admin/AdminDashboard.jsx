import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import {
  BanknotesIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('7days');

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get('/admin/dashboard/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
  });

  const { data: salesReport } = useQuery({
    queryKey: ['sales-report', period],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get(`/admin/dashboard/sales-report?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
  });

  const { data: inventoryReport } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const { data } = await api.get('/admin/dashboard/inventory-report', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
  });

  const stats = [
    {
      name: 'Total Revenue',
      value: `₹${metrics?.totalRevenue?.toLocaleString() || 0}`,
      icon: BanknotesIcon,
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Orders Today',
      value: metrics?.ordersToday || 0,
      icon: ShoppingCartIcon,
      change: '+4',
      changeType: 'positive',
    },
    {
      name: 'Total Customers',
      value: metrics?.totalCustomers || 0,
      icon: UsersIcon,
      change: '+23',
      changeType: 'positive',
    },
    {
      name: 'Conversion Rate',
      value: `${metrics?.conversionRate || 0}%`,
      icon: ChartBarIcon,
      change: '+2.1%',
      changeType: 'positive',
    },
  ];

  if (metricsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your store performance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low stock alerts */}
        {metrics?.lowStockProducts?.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Low Stock Alerts</h2>
            </div>
            <div className="space-y-3">
              {metrics.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {metrics?.recentOrders?.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{order.totalPrice?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {metrics?.topProducts?.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.price}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{product.sold} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory summary */}
        {inventoryReport && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="text-sm font-medium text-gray-900">
                  {inventoryReport.totalProducts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Products</span>
                <span className="text-sm font-medium text-green-600">
                  {inventoryReport.activeProducts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="text-sm font-medium text-amber-600">
                  {inventoryReport.lowStock}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="text-sm font-medium text-red-600">
                  {inventoryReport.outOfStock}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Stock Value</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{inventoryReport.totalStockValue?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

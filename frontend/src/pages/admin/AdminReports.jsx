import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, BarChart3, PieChart, Download, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7days');
  const [salesReport, setSalesReport] = useState({
    salesData: [],
    paymentMethodSplit: [],
    categorySales: [],
  });
  const [inventoryReport, setInventoryReport] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    draftProducts: 0,
    totalStockValue: 0,
  });
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    ordersToday: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
  });

  // Fetch all reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const [salesRes, inventoryRes, metricsRes] = await Promise.all([
        api.get('/admin/dashboard/sales-report', { params: { period } }),
        api.get('/admin/dashboard/inventory-report'),
        api.get('/admin/dashboard/metrics'),
      ]);

      if (salesRes.data.success) {
        setSalesReport(salesRes.data.data);
      }

      if (inventoryRes.data.success) {
        setInventoryReport(inventoryRes.data.data);
      }

      if (metricsRes.data.success) {
        setMetrics(metricsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Export data to CSV
  const exportToCSV = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const periodLabel = period === '7days' ? '7_Days' : period === '30days' ? '30_Days' : '12_Months';
      
      // Create CSV content
      let csvContent = 'BAGVO - Sales & Analytics Report\n';
      csvContent += `Generated: ${new Date().toLocaleString()}\n`;
      csvContent += `Period: ${periodLabel.replace('_', ' ')}\n\n`;

      // Key Metrics
      csvContent += '=== KEY METRICS ===\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,${metrics.totalRevenue}\n`;
      csvContent += `Total Orders,${metrics.totalOrders}\n`;
      csvContent += `Orders Today,${metrics.ordersToday}\n`;
      csvContent += `Total Customers,${metrics.totalCustomers}\n`;
      csvContent += `Conversion Rate,${metrics.conversionRate}%\n`;
      csvContent += `Average Order Value,${averageOrderValue.toFixed(2)}\n\n`;

      // Sales Trend
      csvContent += '=== SALES TREND ===\n';
      csvContent += 'Date,Revenue,Orders\n';
      salesReport.salesData.forEach(item => {
        csvContent += `${item._id},${item.revenue},${item.orders}\n`;
      });
      csvContent += '\n';

      // Payment Methods
      csvContent += '=== PAYMENT METHODS ===\n';
      csvContent += 'Method,Transactions,Revenue\n';
      salesReport.paymentMethodSplit.forEach(method => {
        csvContent += `${method._id || 'Unknown'},${method.count},${method.revenue}\n`;
      });
      csvContent += '\n';

      // Category Performance
      csvContent += '=== TOP CATEGORIES ===\n';
      csvContent += 'Category,Items Sold,Revenue\n';
      salesReport.categorySales.forEach(category => {
        csvContent += `${category._id},${category.quantity},${category.revenue}\n`;
      });
      csvContent += '\n';

      // Inventory Status
      csvContent += '=== INVENTORY STATUS ===\n';
      csvContent += 'Metric,Count\n';
      csvContent += `Total Products,${inventoryReport.totalProducts}\n`;
      csvContent += `Active Products,${inventoryReport.activeProducts}\n`;
      csvContent += `Draft Products,${inventoryReport.draftProducts}\n`;
      csvContent += `Low Stock Products,${inventoryReport.lowStock}\n`;
      csvContent += `Out of Stock Products,${inventoryReport.outOfStock}\n`;
      csvContent += `Total Stock Value,${inventoryReport.totalStockValue}\n`;

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `BAGVO_Report_${periodLabel}_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report');
    }
  };

  // Calculate totals
  const totalSalesRevenue = salesReport.salesData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalSalesOrders = salesReport.salesData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const averageOrderValue = totalSalesOrders > 0 ? totalSalesRevenue / totalSalesOrders : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{metrics.totalOrders}</p>
              <p className="text-xs opacity-75 mt-2">{metrics.ordersToday} today</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Customers</p>
              <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
              <p className="text-xs opacity-75 mt-2">{metrics.conversionRate}% conversion</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium opacity-90 mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold">{formatCurrency(averageOrderValue)}</p>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sales Trend</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              {salesReport.salesData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No sales data available for this period
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalSalesRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-purple-600">{totalSalesOrders}</p>
                    </div>
                  </div>

                  {/* Simple Bar Chart */}
                  <div className="space-y-3">
                    {salesReport.salesData.slice(-10).map((item, index) => {
                      const maxRevenue = Math.max(...salesReport.salesData.map(d => d.revenue));
                      const percentage = (item.revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item._id}</span>
                            <span className="text-gray-600">{formatCurrency(item.revenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>

              {salesReport.paymentMethodSplit.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No payment data available
                </div>
              ) : (
                <div className="space-y-4">
                  {salesReport.paymentMethodSplit.map((method, index) => {
                    const totalCount = salesReport.paymentMethodSplit.reduce((sum, m) => sum + m.count, 0);
                    const percentage = ((method.count / totalCount) * 100).toFixed(1);
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                    const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100'];
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg ${bgColors[index % bgColors.length]}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 capitalize">
                            {method._id || 'Unknown'}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>{method.count} transactions</span>
                          <span className="font-bold">{formatCurrency(method.revenue)}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-2">
                          <div
                            className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category Performance & Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Sales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>

              {salesReport.categorySales.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No category data available
                </div>
              ) : (
                <div className="space-y-4">
                  {salesReport.categorySales.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-400' :
                          'bg-purple-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{category._id}</p>
                          <p className="text-sm text-gray-500">{category.quantity} items sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(category.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Inventory Overview</h2>
                <Package className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Total Products</p>
                      <p className="text-3xl font-bold text-blue-900">{inventoryReport.totalProducts}</p>
                    </div>
                    <Package className="w-12 h-12 text-blue-600 opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-medium mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-900">{inventoryReport.activeProducts}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-700 font-medium mb-1">Draft</p>
                    <p className="text-2xl font-bold text-gray-900">{inventoryReport.draftProducts}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-medium mb-1">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-900">{inventoryReport.lowStock}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-red-700 font-medium mb-1">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-900">{inventoryReport.outOfStock}</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium mb-1">Total Stock Value</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(inventoryReport.totalStockValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Export Reports</h3>
                <p className="text-purple-100">Download detailed reports for further analysis</p>
              </div>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Export Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;

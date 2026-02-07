import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import EditProductModal from '../../components/admin/EditProductModal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const queryClient = useQueryClient();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, debouncedSearch, sortBy, sortOrder],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });
      
      const { data } = await api.get(`/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
    },
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStockBadge = (product) => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', bgClass: 'bg-red-100', textClass: 'text-red-800', count: 0 };
    } else if (product.stock <= (product.lowStockThreshold || 10)) {
      return { label: 'Low Stock', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800', count: product.stock };
    } else {
      return { label: 'In Stock', bgClass: 'bg-green-100', textClass: 'text-green-800', count: product.stock };
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? { label: 'Active', bgClass: 'bg-green-100', textClass: 'text-green-800' }
      : status === 'draft'
      ? { label: 'Draft', bgClass: 'bg-gray-100', textClass: 'text-gray-800' }
      : { label: 'Out of Stock', bgClass: 'bg-red-100', textClass: 'text-red-800' };
  };

  const renderPagination = () => {
    if (!data?.pagination) return null;

    const { page: currentPage, pages: totalPages } = data.pagination;
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show current page and surrounding pages
    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-2 py-4 bg-white border-t">
        <button
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {pageNumbers.map((num, idx) => (
          num === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === num
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {num}
            </button>
          )
        ))}

        <button
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Bar */}
      <div className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold">Products</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Top Bar - Total Count, Search, Add Button */}
        <div className="bg-white rounded-t-lg shadow-sm p-4 border-b">
          <div className="flex items-center justify-between">
            {/* Left - Total Products */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              {data?.pagination && (
                <p className="text-sm text-gray-500 mt-1">
                  Total Products: <span className="font-semibold text-gray-700">{data.pagination.total.toLocaleString()}</span>
                </p>
              )}
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Product Name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right - Add Button */}
            <button
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
              <button
                onClick={() => navigate('/admin/products/add')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-12">
                      Image
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('sku')}
                    >
                      <div className="flex items-center gap-2">
                        SKU
                        {sortBy === 'sku' && (
                          sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center gap-2">
                        Stock
                        {sortBy === 'stock' && (
                          sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-2">
                        Price
                        {sortBy === 'price' && (
                          sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.data?.map((product) => {
                    const stockBadge = getStockBadge(product);
                    const statusBadge = getStatusBadge(product.status);

                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.mainImage ? `http://localhost:5000${product.mainImage}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f3f4f6" width="60" height="60"/%3E%3Ctext fill="%239ca3af" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                              alt={product.name}
                              className="h-14 w-14 rounded border border-gray-200 object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23f3f4f6" width="60" height="60"/%3E%3Ctext fill="%239ca3af" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => setEditProductId(product._id)}>
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              #{product._id?.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900 font-medium">{product.sku || 'N/A'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.sku || 'N/A'}</p>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <div>
                            <span className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${stockBadge.bgClass} ${stockBadge.textClass}`}>
                              {stockBadge.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{stockBadge.count}</p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-semibold">
                            ₹{product.price?.selling?.toLocaleString() || '0'}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${statusBadge.bgClass} ${statusBadge.textClass}`}>
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              onClick={() => setOpenDropdown(openDropdown === product._id ? null : product._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                            >
                              Edit
                              <ChevronDownIcon className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === product._id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenDropdown(null)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                  <button
                                    onClick={() => {
                                      setEditProductId(product._id);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit Product
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDelete(product._id, product.name);
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    Delete Product
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={!!editProductId}
        onClose={() => setEditProductId(null)}
        productId={editProductId}
      />
    </div>
  );
};

export default AdminProducts;

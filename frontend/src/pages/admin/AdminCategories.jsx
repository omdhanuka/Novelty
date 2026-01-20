import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../lib/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminCategories = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    type: 'PRODUCT',
    status: 'ACTIVE',
    image: '',
    bannerImage: '',
    showOnHomepage: true,
    showInNavbar: true,
    showInFooter: false,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories', search, statusFilter, typeFilter],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      
      const { data } = await adminAPI.categories.getAll(params);
      return data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => adminAPI.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      setShowModal(false);
      resetForm();
      alert('Category created successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to create category');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      setShowModal(false);
      resetForm();
      alert('Category updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update category');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete category');
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id) => adminAPI.categories.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      parentCategory: category.parentCategory?._id || '',
      type: category.type || 'PRODUCT',
      status: category.status || 'ACTIVE',
      image: category.image || '',
      bannerImage: category.bannerImage || '',
      showOnHomepage: category.showOnHomepage !== undefined ? category.showOnHomepage : true,
      showInNavbar: category.showInNavbar !== undefined ? category.showInNavbar : true,
      showInFooter: category.showInFooter !== undefined ? category.showInFooter : false,
      sortOrder: category.sortOrder || 0,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || '',
      seoKeywords: category.seoKeywords || '',
    });
    setShowModal(true);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(category._id);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentCategory: '',
      type: 'PRODUCT',
      status: 'ACTIVE',
      image: '',
      bannerImage: '',
      showOnHomepage: true,
      showInNavbar: true,
      showInFooter: false,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    });
  };

  const getTypeBadge = (type) => {
    const badges = {
      PRODUCT: 'bg-blue-100 text-blue-800',
      COLLECTION: 'bg-purple-100 text-purple-800',
      OCCASION: 'bg-pink-100 text-pink-800',
    };
    return badges[type] || badges.PRODUCT;
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // Get parent categories for dropdown
  const parentCategories = data?.data?.filter(cat => !cat.parentCategory) || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product categories and collections
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
          >
            <option value="">All Types</option>
            <option value="PRODUCT">Product Category</option>
            <option value="COLLECTION">Collection</option>
            <option value="OCCASION">Occasion</option>
          </select>
        </div>
      </div>

      {/* Categories Table - Part 1 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                            <FolderIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.parentCategory?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(category.type)}`}>
                        {category.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.productCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatusMutation.mutate(category._id)}
                          className="text-gray-600 hover:text-gray-900"
                          title={category.status === 'ACTIVE' ? 'Hide' : 'Show'}
                        >
                          {category.status === 'ACTIVE' ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data?.length === 0 && (
              <div className="text-center py-12">
                <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal - continues in next part */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.name} onChange={handleNameChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="e.g., Ladies Bags" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="ladies-bags" />
                    <p className="mt-1 text-xs text-gray-500">URL-friendly name (auto-generated from name)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                    <select value={formData.parentCategory} onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
                      <option value="">None (Main Category)</option>
                      {parentCategories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Type <span className="text-red-500">*</span></label>
                    <select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
                      <option value="PRODUCT">Product Category</option>
                      <option value="COLLECTION">Collection Category</option>
                      <option value="OCCASION">Occasion Category</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="Brief description of this category"></textarea>
                  </div>
                </div>
              </div>
              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Images</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image (500x500)</label>
                    <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="https://example.com/image.jpg" />
                    {formData.image && (<img src={formData.image} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover" />)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (1200x400)</label>
                    <input type="text" value={formData.bannerImage} onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="https://example.com/banner.jpg" />
                    {formData.bannerImage && (<img src={formData.bannerImage} alt="Banner Preview" className="mt-2 h-16 w-full rounded object-cover" />)}
                  </div>
                </div>
              </div>
              {/* Display Controls */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Display Controls</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500">
                      <option value="ACTIVE">Active</option>
                      <option value="HIDDEN">Hidden</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="0" />
                    <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="showOnHomepage" checked={formData.showOnHomepage} onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })} className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                      <label htmlFor="showOnHomepage" className="ml-2 block text-sm text-gray-700">Show on Homepage</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="showInNavbar" checked={formData.showInNavbar} onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })} className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                      <label htmlFor="showInNavbar" className="ml-2 block text-sm text-gray-700">Show in Navigation Menu</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="showInFooter" checked={formData.showInFooter} onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })} className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                      <label htmlFor="showInFooter" className="ml-2 block text-sm text-gray-700">Show in Footer</label>
                    </div>
                  </div>
                </div>
              </div>
              {/* SEO Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="Best Ladies Bags Collection | BagShop" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="Discover our premium collection of ladies bags..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                    <input type="text" value={formData.seoKeywords} onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500" placeholder="ladies bags, handbags, purses" />
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

import { useState, useEffect, useRef } from 'react';
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const apiGatewayURL = 'http://localhost:3000/api';

const Filters = () => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);
  const [categories] = useState([
    'property-type',
    'amenities',
    'features',
    'location',
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'property-type',
    description: '',
    isActive: true,
    order: 0,
  });

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Scroll to form
  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const fetchFilters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiGatewayURL}/filters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFilters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'order'
            ? parseInt(value)
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const response = await fetch(`${apiGatewayURL}/filters/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          showToast('Filter updated successfully!', 'success');
          fetchFilters();
        } else {
          showToast('Failed to update filter', 'error');
        }
      } else {
        const response = await fetch(`${apiGatewayURL}/filters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          showToast('Filter created successfully!', 'success');
          fetchFilters();
        } else {
          showToast('Failed to create filter', 'error');
        }
      }

      setFormData({
        name: '',
        category: 'property-type',
        description: '',
        isActive: true,
        order: 0,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving filter:', error);
      showToast('Error saving filter', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (filter) => {
    setFormData({
      name: filter.name,
      category: filter.category,
      description: filter.description || '',
      isActive: filter.isActive,
      order: filter.order || 0,
    });
    setEditingId(filter._id);
    setShowForm(true);
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      setLoading(true);
      try {
        const response = await fetch(`${apiGatewayURL}/filters/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          showToast('Filter deleted successfully!', 'success');
          fetchFilters();
        } else {
          showToast('Failed to delete filter', 'error');
        }
      } catch (error) {
        console.error('Error deleting filter:', error);
        showToast('Error deleting filter', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'property-type',
      description: '',
      isActive: true,
      order: 0,
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-sm transition-all duration-300 transform ${
            toast.type === 'success'
              ? 'bg-green-900/95 border-green-600 text-green-100'
              : 'bg-red-900/95 border-red-600 text-red-100'
          }`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
          <div
            className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
          >
            {toast.type === 'success' ? (
              <CheckIcon className="w-5 h-5 text-green-400" />
            ) : (
              <XMarkIcon className="w-5 h-5 text-red-400" />
            )}
          </div>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div
        ref={formRef}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Filters Management
        </h1>
        <button
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <PlusIcon className="w-5 h-5" />
          Add Filter
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">
            {editingId ? 'Edit Filter' : 'Add New Filter'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter filter name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Active Checkbox */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Status
                </label>
                <label className="flex items-center gap-3 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
              </div>

              {/* Description Field */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description (optional)"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/25"
                disabled={loading}
              >
                <CheckIcon className="w-5 h-5" />
                {editingId ? 'Update Filter' : 'Create Filter'}
              </button>
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Table */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        {loading && !showForm ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filters.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-500 mb-2">
              <PlusIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-gray-400 text-lg">No filters found</p>
            <p className="text-gray-500 text-sm mt-1">
              Create one to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80 border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Description
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filters.map((filter) => (
                  <tr
                    key={filter._id}
                    className="hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">
                        {filter.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/50">
                        {filter.category
                          .split('-')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-gray-400 text-sm max-w-xs truncate block">
                        {filter.description || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-300">{filter.order}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {filter.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-300 border border-green-800/50">
                          <CheckIcon className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
                          onClick={() => handleEdit(filter)}
                          disabled={loading || showForm}
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-all"
                          onClick={() => handleDelete(filter._id)}
                          disabled={loading}
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

const apiGatewayURL = 'http://localhost:3000/api';

const Filters = () => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      toast.error('Failed to fetch filters');
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
          toast.success('Filter updated successfully');
          fetchFilters();
        } else {
          toast.error('Failed to update filter');
        }
      } else {
        const response = await fetch(`${apiGatewayURL}/filters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success('Filter created successfully');
          fetchFilters();
        } else {
          toast.error('Failed to create filter');
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving filter:', error);
      toast.error('Error saving filter');
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
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      category: 'property-type',
      description: '',
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'property-type',
      description: '',
      isActive: true,
      order: 0,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      setLoading(true);
      try {
        const response = await fetch(`${apiGatewayURL}/filters/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Filter deleted successfully');
          fetchFilters();
        } else {
          toast.error('Failed to delete filter');
        }
      } catch (error) {
        console.error('Error deleting filter:', error);
        toast.error('Error deleting filter');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Filters Management</h1>
          <button
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            onClick={handleAddNew}
          >
            <PlusIcon className="w-5 h-5" />
            Add Filter
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Edit Filter' : 'Add New Filter'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter filter name"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat
                            .split('-')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description (optional)"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    disabled={loading}
                  >
                    {editingId ? 'Save Changes' : 'Create Filter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters Table */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          {loading && !showModal ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filters.length === 0 ? (
            <div className="p-12 text-center">
              <PlusIcon className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
              <p className="text-gray-400 text-lg">No filters found</p>
              <p className="text-gray-500 text-sm mt-1">Create one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filters.map((filter) => (
                    <tr key={filter._id} className="hover:bg-[#2a2a2a]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-white">{filter.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
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
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="text-gray-300">{filter.order}</span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {filter.isActive ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(filter)}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                          title="Edit Filter"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(filter._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Filter"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;

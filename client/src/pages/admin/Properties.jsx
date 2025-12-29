import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllProperties, deleteProperty, updateProperty } from '../../services/adminService';
import { FaEdit, FaTrash, FaHome, FaBed, FaBath, FaCar, FaSwimmingPool, FaWifi, FaSnowflake, FaShieldAlt } from 'react-icons/fa';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: '',
    propertyType: '',
    subType: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    },
    area: {
      sqft: '',
      sqm: ''
    },
    price: '',
    buildDate: '',
    status: '',
    features: {
    bedrooms: '',
    bathrooms: '',
      garage: '',
      pool: false,
      yard: false,
      pets: false,
      furnished: '',
      airConditioning: false,
      internet: false,
      electricity: false,
      water: false,
      gas: false,
      wifi: false,
      security: false
    }
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response.data.properties);
    } catch {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      listingType: property.listingType,
      propertyType: property.propertyType,
      subType: property.subType,
      address: property.address,
      area: property.area,
      price: property.price,
      buildDate: new Date(property.buildDate).toISOString().split('T')[0],
      status: property.status,
      features: property.features
    });
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await deleteProperty(propertyId);
        if (response.status === 'success') {
        setProperties(properties.filter(property => property._id !== propertyId));
          toast.success('Property deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete property');
        }
      } catch (err) {
        console.error('Delete property error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete property');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProperty(editingProperty._id, formData);
      setProperties(properties.map(property => 
        property._id === editingProperty._id ? response.data.property : property
      ));
      setEditingProperty(null);
      toast.success('Property updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Property Management</h1>

        {editingProperty && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Edit Property</h2>
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">
                <div className="space-y-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      rows="2"
                      required
                    />
                  </div>

                  {/* Type & Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Listing Type</label>
                      <select
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      >
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Property Type</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">State</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Country</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Area & Date */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Area (sqft)</label>
                      <input
                        type="number"
                        name="area.sqft"
                        value={formData.area.sqft}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Area (sqm)</label>
                      <input
                        type="number"
                        name="area.sqm"
                        value={formData.area.sqm}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Build Date</label>
                      <input
                        type="date"
                        name="buildDate"
                        value={formData.buildDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Bedrooms</label>
                      <input
                        type="number"
                        name="features.bedrooms"
                        value={formData.features.bedrooms}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Bathrooms</label>
                      <input
                        type="number"
                        name="features.bathrooms"
                        value={formData.features.bathrooms}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Garage</label>
                      <input
                        type="number"
                        name="features.garage"
                        value={formData.features.garage}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1.5">Furnishing</label>
                      <select
                        name="features.furnished"
                        value={formData.features.furnished}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        required
                      >
                        <option value="fully">Fully</option>
                        <option value="partly">Partly</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Amenities</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'features.pool', label: 'Pool' },
                        { name: 'features.yard', label: 'Yard' },
                        { name: 'features.pets', label: 'Pets' },
                        { name: 'features.airConditioning', label: 'A/C' },
                        { name: 'features.internet', label: 'Internet' },
                        { name: 'features.electricity', label: 'Electricity' },
                        { name: 'features.water', label: 'Water' },
                        { name: 'features.gas', label: 'Gas' },
                      ].map((item) => (
                        <label key={item.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#252525] border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={formData.features[item.name.split('.')[1]]}
                            onChange={handleChange}
                            className="rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-300 text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex justify-end gap-3 p-5 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <FaHome className="text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-300">
                            {property.address.city}, {property.address.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div className="flex items-center">
                          <FaBed className="mr-2 text-gray-400" />
                          {property.features.bedrooms} beds
                        </div>
                        <div className="flex items-center">
                          <FaBath className="mr-2 text-gray-400" />
                          {property.features.bathrooms} baths
                        </div>
                        <div className="flex items-center">
                          <FaCar className="mr-2 text-gray-400" />
                          {property.features.garage} garage
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {property.listingType === 'rent' ? '/month' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {property.propertyType}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.listingType}
                      </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Edit Property"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Property"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Properties; 
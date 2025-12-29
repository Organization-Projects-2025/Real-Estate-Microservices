import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, deactivateUser, updateUser, reactivateUser } from '../../services/adminService';
import { FaEdit, FaUserSlash, FaUser, FaPhone, FaWhatsapp, FaEnvelope, FaCalendarAlt, FaUserCheck } from 'react-icons/fa';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phoneNumber: '',
    whatsapp: '',
    contactEmail: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log('Users response:', response); // Debug log
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        console.error('Unexpected response structure:', response);
        toast.error('Invalid response format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      whatsapp: user.whatsapp || '',
      contactEmail: user.contactEmail || '',
    });
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deactivateUser(userId);
        setUsers(users.map(user => 
          user._id === userId ? { ...user, active: false } : user
        ));
        toast.success('User deactivated successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to deactivate user');
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleReactivate = async (userId) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        const response = await reactivateUser(userId);
        console.log('Reactivate response:', response); // Debug log
        if (response && response.data && response.data.user) {
          setUsers(users.map(user => 
            user._id === userId ? response.data.user : user
          ));
          toast.success('User reactivated successfully');
        } else {
          console.error('Unexpected reactivation response:', response);
          toast.error('Failed to reactivate user: Invalid response format');
        }
      } catch (error) {
        console.error('Error reactivating user:', error);
        toast.error(error.response?.data?.message || 'Failed to reactivate user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(editingUser._id, formData);
      setUsers(users.map(user => 
        user._id === editingUser._id ? response.data.user : user
      ));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>

        {editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#1a1a1a] p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#252525]'
            }`}
          >
            Active ({users.filter(u => u.active).length})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inactive'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#252525]'
            }`}
          >
            Inactive ({users.filter(u => !u.active).length})
          </button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users
                  .filter(user => activeTab === 'active' ? user.active : !user.active)
                  .map((user) => (
                  <tr key={user._id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            user.active ? 'bg-purple-600' : 'bg-gray-600'
                          }`}>
                            <FaUser className="text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 space-y-1">
                        {user.phoneNumber && (
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            {user.phoneNumber}
                          </div>
                        )}
                        {user.whatsapp && (
                          <div className="flex items-center">
                            <FaWhatsapp className="mr-2 text-gray-400" />
                            {user.whatsapp}
                          </div>
                        )}
                        {user.contactEmail && (
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            {user.contactEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'agent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      {user.active ? (
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deactivate User"
                        >
                          <FaUserSlash />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivate User"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.filter(user => activeTab === 'active' ? user.active : !user.active).length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No {activeTab} users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users; 
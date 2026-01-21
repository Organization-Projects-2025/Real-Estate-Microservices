import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAuth();
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    whatsapp: '',
    contactEmail: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user's properties
        const propertiesResponse = await api.get('/properties');

        if (propertiesResponse.data.status === 'success') {
          const userProps = propertiesResponse.data.data.properties.filter(
            (prop) => prop.user === user._id
          );
          setUserProperties(userProps);
        }

        // Set form data from user context
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          whatsapp: user.whatsapp || '',
          contactEmail: user.contactEmail || '',
        });
      } catch (err) {
        console.error('Error:', err);
        // Don't block the page, just log the error
        setError('Some data may not be available');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isAuthenticated, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.put('/auth/me', formData);

      if (response.data.status === 'success') {
        const updatedUser = response.data.data.user;
        
        // Update the AuthContext with the new user data
        setUser(updatedUser);
        
        // Update the form data with the new user data
        setFormData({
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          email: updatedUser.email || '',
          phoneNumber: updatedUser.phoneNumber || '',
          whatsapp: updatedUser.whatsapp || '',
          contactEmail: updatedUser.contactEmail || '',
        });
        setEditMode(false);
        setSuccessMessage('Profile updated successfully!');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (propertyId, updatedData) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.patch(
        `/properties/${propertyId}`,
        updatedData
      );

      if (response.data.status === 'success') {
        setUserProperties((prevProps) =>
          prevProps.map((prop) =>
            prop._id === propertyId ? response.data.data.property : prop
          )
        );
        alert('Property updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update property');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to update property. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#121212] text-[#fff] min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-700 rounded mb-8"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] via-purple-500 to-[#fff] inline-block">
            Profile Settings
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#703BF7] to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* User Information Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-8 shadow-lg border border-[#252525] hover:shadow-2xl transition-shadow duration-300 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Personal Information
            </h2>
            <button
              onClick={() => {
                if (editMode) {
                  // Reset form data to original user values when canceling
                  setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    whatsapp: user.whatsapp || '',
                    contactEmail: user.contactEmail || '',
                  });
                }
                setEditMode(!editMode);
              }}
              className="bg-gradient-to-r from-[#703BF7] to-purple-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateUser} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium">{successMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage('')}
                    className="text-green-400 hover:text-green-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#252525] border border-gray-700 focus:border-[#703BF7] focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gradient-to-r from-[#703BF7] to-purple-500 text-white px-8 py-3 rounded-full hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    First Name
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.firstName}
                  </p>
                </div>
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    Last Name
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.lastName}
                  </p>
                </div>
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    Email
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    Phone Number
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.phoneNumber || 'Not provided'}
                  </p>
                </div>
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    WhatsApp
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.whatsapp || 'Not provided'}
                  </p>
                </div>
                <div className="bg-[#252525] p-4 rounded-xl">
                  <span className="text-gray-400 block text-sm mb-1">
                    Contact Email
                  </span>
                  <p className="text-lg text-white font-medium">
                    {user?.contactEmail || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User's Properties Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-lg border border-[#252525] hover:shadow-2xl transition-shadow duration-300 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
            My Listed Properties
          </h2>
          {userProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                You haven't listed any properties yet.
              </p>
              <button
                onClick={() => navigate('/sell')}
                className="mt-4 bg-gradient-to-r from-[#703BF7] to-purple-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                List a Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onUpdate={handleUpdateProperty}
                  isEditable={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

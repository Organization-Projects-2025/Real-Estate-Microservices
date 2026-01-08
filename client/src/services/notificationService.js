import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const createNotification = async (title, message, type = 'info') => {
  const response = await api.post('/notifications', { title, message, type });
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

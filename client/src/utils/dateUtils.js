/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Format a date to a user-friendly string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format a date to show only the year (useful for build dates)
 * @param {string|Date} date - The date to format
 * @returns {string} Year as string
 */
export const formatYear = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'N/A';
  
  return dateObj.getFullYear().toString();
};

/**
 * Format a date to a short format (DD/MM/YYYY)
 * @param {string|Date} date - The date to format
 * @returns {string} Short formatted date in DD/MM/YYYY format
 */
export const formatShortDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format a date to DD/MM/YYYY format specifically
 * @param {string|Date} date - The date to format
 * @returns {string} Date in DD/MM/YYYY format
 */
export const formatDMY = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format a date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const diff = now - dateObj;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2629746000);
  const years = Math.floor(diff / 31556952000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

/**
 * Format a date with time (for detailed timestamps)
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
/**
 * Utility Formatters for Enterprise Data
 */

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getInitials = (nameOrFirst, last) => {
  if (last) {
    return `${nameOrFirst?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  }
  if (!nameOrFirst) return 'U';
  const parts = nameOrFirst.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nameOrFirst.slice(0, 2).toUpperCase();
};

/**
 * Formatting utilities for Currency, Dates, and MongoDB ObjectIDs
 */

export function formatCurrency(amount, currency = 'INR') {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function formatAccountId(id) {
  if (!id) return '';
  if (id.length <= 10) return id;
  return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Core API Configuration & Request Client
 * Directly targets the Express backend endpoints (/api)
 */

export const USE_MOCK_FALLBACK = false; 

// Dynamic API Base URL: Uses VITE_API_URL environment variable if deployed, otherwise defaults to local proxy '/api'
const envUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = envUrl 
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`) 
  : '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ledger_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-only cookies
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Call Error to ${endpoint}]:`, error.message);
    throw error;
  }
}

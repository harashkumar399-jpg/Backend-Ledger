import { request } from './apiConfig';
import { MOCK_USER } from './mockData';

export const authApi = {
  /**
   * POST /api/auth/register
   * Payload: { email, password, name }
   */
  async register(email, password, name) {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        console.warn('Backend server offline. Returning mock registration.');
        return {
          message: 'User registered successfully (Mock Mode)',
          user: { ...MOCK_USER, email, name },
          token: 'mock_jwt_token_123456',
        };
      }
      throw err;
    }
  },

  /**
   * POST /api/auth/login
   * Payload: { email, password }
   */
  async login(email, password) {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        console.warn('Backend server offline. Returning mock login.');
        return {
          message: 'User login successfully (Mock Mode)',
          user: { ...MOCK_USER, email },
          token: 'mock_jwt_token_123456',
        };
      }
      throw err;
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout() {
    try {
      return await request('/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Logout fallback:', err.message);
      return { message: 'User logged out successfully' };
    }
  },
};

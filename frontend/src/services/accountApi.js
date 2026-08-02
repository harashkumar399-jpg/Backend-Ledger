import { request } from './apiConfig';
import { MOCK_ACCOUNTS } from './mockData';

export const accountApi = {
  /**
   * POST /api/accounts/
   * Creates a new account for the logged-in user
   */
  async createAccount() {
    try {
      return await request('/accounts', {
        method: 'POST',
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        const newAccount = {
          _id: `acc_${Date.now().toString(16)}`,
          user: 'usr_mock',
          status: 'ACTIVE',
          currency: 'INR',
          createdAt: new Date().toISOString(),
          balance: 0.0,
        };
        MOCK_ACCOUNTS.push(newAccount);
        return {
          message: 'Account created successfully (Mock Mode)',
          account: newAccount,
        };
      }
      throw err;
    }
  },

  /**
   * GET /api/accounts
   * Fetches all accounts owned by the logged-in user
   */
  async getUserAccounts() {
    try {
      return await request('/accounts', {
        method: 'GET',
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        return {
          message: 'Accounts retrieved successfully (Mock Mode)',
          accounts: MOCK_ACCOUNTS,
        };
      }
      throw err;
    }
  },

  /**
   * GET /api/accounts/balance/:accountId
   * Fetches real-time balance calculated from ledger double-entry
   */
  async getAccountBalance(accountId) {
    try {
      return await request(`/accounts/balance/${accountId}`, {
        method: 'GET',
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        const acc = MOCK_ACCOUNTS.find((a) => a._id === accountId);
        return {
          message: 'Account balance retrieved successfully (Mock Mode)',
          accountId: accountId,
          balance: acc ? acc.balance : 25000.0,
          userId: 'usr_mock',
        };
      }
      throw err;
    }
  },
};

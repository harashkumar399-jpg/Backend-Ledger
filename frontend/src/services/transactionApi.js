import { request } from './apiConfig';
import { MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from './mockData';

export const transactionApi = {
  /**
   * POST /api/transactions/
   * Transfer funds from fromAccount to toAccount with idempotencyKey
   */
  async createTransaction(fromAccount, toAccount, amount, idempotencyKey) {
    try {
      return await request('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          fromAccount,
          toAccount,
          amount: Number(amount),
          idempotencyKey,
        }),
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        // Update mock balances
        const sender = MOCK_ACCOUNTS.find((a) => a._id === fromAccount);
        const receiver = MOCK_ACCOUNTS.find((a) => a._id === toAccount);

        if (sender && sender.balance < amount) {
          throw new Error(`Insufficient balance. Available: ₹${sender.balance}, Requested: ₹${amount}`);
        }

        if (sender) sender.balance -= Number(amount);
        if (receiver) receiver.balance += Number(amount);

        const newTx = {
          _id: `tx_${Date.now().toString(16)}`,
          fromAccount,
          toAccount,
          amount: Number(amount),
          idempotencyKey,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
        };
        MOCK_TRANSACTIONS.unshift(newTx);

        return {
          message: 'Transaction completed successfully (Mock Mode)',
          transaction: newTx,
        };
      }
      throw err;
    }
  },

  /**
   * POST /api/transactions/system/initial-funds
   * System user deposits initial funds into an account
   */
  async createInitialFunds(toAccount, amount, idempotencyKey) {
    try {
      return await request('/transactions/system/initial-funds', {
        method: 'POST',
        body: JSON.stringify({
          toAccount,
          amount: Number(amount),
          idempotencyKey,
        }),
      });
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
        const receiver = MOCK_ACCOUNTS.find((a) => a._id === toAccount);
        if (receiver) receiver.balance += Number(amount);

        const newTx = {
          _id: `tx_sys_${Date.now().toString(16)}`,
          fromAccount: 'SYSTEM_BANK_RESERVE',
          toAccount,
          amount: Number(amount),
          idempotencyKey,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
        };
        MOCK_TRANSACTIONS.unshift(newTx);

        return {
          message: 'Initial funds transaction completed successfully (Mock Mode)',
          transaction: newTx,
        };
      }
      throw err;
    }
  },
};

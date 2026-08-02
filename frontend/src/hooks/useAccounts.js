import { useState, useEffect, useCallback } from 'react';
import { accountApi } from '../services/accountApi';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountApi.getUserAccounts();
      const rawAccounts = data.accounts || [];

      // Fetch balance for each account to display real-time values
      const accountsWithBalance = await Promise.all(
        rawAccounts.map(async (acc) => {
          try {
            const balRes = await accountApi.getAccountBalance(acc._id);
            return { ...acc, balance: balRes.balance };
          } catch {
            return { ...acc, balance: acc.balance || 0 };
          }
        })
      );

      setAccounts(accountsWithBalance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = async () => {
    setCreating(true);
    try {
      const res = await accountApi.createAccount();
      await fetchAccounts();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const getBalance = async (accountId) => {
    try {
      const res = await accountApi.getAccountBalance(accountId);
      setAccounts((prev) =>
        prev.map((acc) => (acc._id === accountId ? { ...acc, balance: res.balance } : acc))
      );
      return res.balance;
    } catch (err) {
      console.error(`Failed to get balance for ${accountId}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return {
    accounts,
    totalBalance,
    loading,
    error,
    creating,
    refetch: fetchAccounts,
    createAccount,
    getBalance,
  };
}

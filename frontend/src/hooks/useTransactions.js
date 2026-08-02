import { useState } from 'react';
import { transactionApi } from '../services/transactionApi';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ledger_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [submitting, setSubmitting] = useState(false);
  const [txError, setTxError] = useState(null);

  const transferFunds = async (fromAccount, toAccount, amount, idempotencyKey) => {
    setSubmitting(true);
    setTxError(null);
    try {
      const res = await transactionApi.createTransaction(fromAccount, toAccount, amount, idempotencyKey);
      if (res.transaction) {
        setTransactions((prev) => {
          const updated = [res.transaction, ...prev];
          localStorage.setItem('ledger_transactions', JSON.stringify(updated));
          return updated;
        });
      }
      return res;
    } catch (err) {
      setTxError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const depositInitialFunds = async (toAccount, amount, idempotencyKey) => {
    setSubmitting(true);
    setTxError(null);
    try {
      const res = await transactionApi.createInitialFunds(toAccount, amount, idempotencyKey);
      if (res.transaction) {
        setTransactions((prev) => {
          const updated = [res.transaction, ...prev];
          localStorage.setItem('ledger_transactions', JSON.stringify(updated));
          return updated;
        });
      }
      return res;
    } catch (err) {
      setTxError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('ledger_transactions');
    setTransactions([]);
  };

  return {
    transactions,
    submitting,
    txError,
    transferFunds,
    depositInitialFunds,
    clearHistory,
  };
}

import React, { useState } from 'react';
import TransactionTable from '../components/ledger/TransactionTable';
import { useTransactions } from '../hooks/useTransactions';
import { History, ArrowLeftRight, Trash2, Search, RefreshCw } from 'lucide-react';

export default function TransactionHistoryPage({ onNavigate }) {
  const { transactions, clearHistory } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (tx._id && tx._id.toLowerCase().includes(q)) ||
      (tx.fromAccount && tx.fromAccount.toLowerCase().includes(q)) ||
      (tx.toAccount && tx.toAccount.toLowerCase().includes(q)) ||
      (tx.idempotencyKey && tx.idempotencyKey.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History color="var(--primary)" /> Transaction Logs & History
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Complete ledger log of double-entry transfers and idempotency keys executed during your session.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {transactions.length > 0 && (
            <button onClick={clearHistory} className="btn btn-secondary" style={{ color: '#f87171' }} title="Clear local logs">
              <Trash2 size={16} /> Clear Logs
            </button>
          )}
          <button onClick={() => onNavigate('transfer')} className="btn btn-primary">
            <ArrowLeftRight size={16} /> New Transfer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Filter by Account ID or Idempotency Key..."
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.92rem' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
}

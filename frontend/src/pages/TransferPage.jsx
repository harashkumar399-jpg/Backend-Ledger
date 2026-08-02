import React, { useState, useEffect } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { generateIdempotencyKey } from '../utils/idempotency';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeftRight, Key, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TransferPage({ initialFromAccount, onNavigate }) {
  const { accounts, refetch } = useAccounts();
  const { transferFunds, submitting, txError } = useTransactions();

  const [fromAccount, setFromAccount] = useState(initialFromAccount || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (accounts.length > 0 && !fromAccount) {
      setFromAccount(accounts[0]._id);
    }
  }, [accounts, fromAccount]);

  const handleRefreshKey = () => {
    setIdempotencyKey(generateIdempotencyKey());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (!fromAccount || !toAccount || !amount) {
      alert('Please fill out all transaction fields.');
      return;
    }

    if (fromAccount === toAccount) {
      alert('Sender and recipient accounts cannot be identical.');
      return;
    }

    try {
      const res = await transferFunds(fromAccount, toAccount, amount, idempotencyKey);
      setSuccessMsg(`Transfer of ${formatCurrency(amount)} succeeded! Status: COMPLETED`);
      
      // Auto-generate new idempotency key for next transaction
      setIdempotencyKey(generateIdempotencyKey());
      setAmount('');

      // Refresh balances
      refetch();
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const selectedSender = accounts.find((a) => a._id === fromAccount);

  return (
    <div style={{ padding: '28px', maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ArrowLeftRight color="var(--primary)" /> Send & Transfer Funds
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Executes atomic debit & credit entries via `POST /api/transactions` with idempotency protection.
        </p>
      </div>

      {successMsg && (
        <div className="glass-card animate-fade-in" style={{ padding: '16px 20px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Transaction Processed</p>
            <p style={{ fontSize: '0.82rem' }}>{successMsg}</p>
          </div>
        </div>
      )}

      {txError && (
        <div className="glass-card animate-fade-in" style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={24} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Transaction Failed</p>
            <p style={{ fontSize: '0.82rem' }}>{txError}</p>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* From Account Dropdown */}
          <div className="input-group">
            <label className="input-label">Source Ledger Account (fromAccount)</label>
            <select
              className="input-field"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              required
            >
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc._id} — Balance: {formatCurrency(acc.balance, acc.currency)} ({acc.status})
                </option>
              ))}
            </select>
            {selectedSender && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Available Balance: <strong>{formatCurrency(selectedSender.balance, selectedSender.currency)}</strong>
              </span>
            )}
          </div>

          {/* To Account Text Input */}
          <div className="input-group">
            <label className="input-label">Destination Account ID (toAccount)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 679f2b199b109e201f4c1102"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="input-group">
            <label className="input-label">Transfer Amount (INR)</label>
            <input
              type="number"
              min="1"
              step="any"
              className="input-field"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Idempotency Key Control */}
          <div className="input-group" style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="input-label" style={{ margin: 0, color: 'var(--accent-purple)' }}>
                <Key size={14} /> Idempotency Key (idempotencyKey)
              </label>
              <button
                type="button"
                onClick={handleRefreshKey}
                className="btn btn-secondary btn-sm"
                title="Generate new UUID key"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>
            <input
              type="text"
              readOnly
              className="input-field"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a78bfa', background: 'var(--bg-secondary)' }}
              value={idempotencyKey}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Required by Express backend. Prevents duplicate payments if network requests are retried.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={submitting}>
            {submitting ? 'Executing Double-Entry Transfer...' : 'Confirm & Execute Transfer'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--secondary)" />
          <span>Backend verifies sender balance from ledger aggregation before executing transaction.</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { generateIdempotencyKey } from '../utils/idempotency';
import { formatCurrency } from '../utils/formatters';
import { PiggyBank, Key, RefreshCw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SystemDepositPage({ onNavigate }) {
  const { accounts, refetch } = useAccounts();
  const { depositInitialFunds, submitting, txError } = useTransactions();

  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('50000');
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);

    const targetAccount = toAccount || (accounts[0] ? accounts[0]._id : '');
    if (!targetAccount || !amount) {
      alert('Please specify a target account and amount.');
      return;
    }

    try {
      await depositInitialFunds(targetAccount, amount, idempotencyKey);
      setSuccessMsg(`Successfully credited ${formatCurrency(amount)} into account ${targetAccount}!`);
      setIdempotencyKey(generateIdempotencyKey());
      refetch();
    } catch (err) {
      console.error('System deposit error:', err);
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PiggyBank color="var(--secondary)" /> System Initial Funds Sandbox
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Calls `POST /api/transactions/system/initial-funds` to inject test capital into any account.
        </p>
      </div>

      {successMsg && (
        <div className="glass-card animate-fade-in" style={{ padding: '16px 20px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Initial Funds Credited</p>
            <p style={{ fontSize: '0.82rem' }}>{successMsg}</p>
          </div>
        </div>
      )}

      {txError && (
        <div className="glass-card animate-fade-in" style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={24} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Deposit Failed</p>
            <p style={{ fontSize: '0.82rem' }}>{txError}</p>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Target Account */}
          <div className="input-group">
            <label className="input-label">Destination Account (toAccount)</label>
            {accounts.length > 0 ? (
              <select
                className="input-field"
                value={toAccount || (accounts[0] ? accounts[0]._id : '')}
                onChange={(e) => setToAccount(e.target.value)}
              >
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc._id} (Balance: {formatCurrency(acc.balance)})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="input-field"
                placeholder="Enter Target Account MongoDB ObjectId"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              />
            )}
          </div>

          {/* Amount */}
          <div className="input-group">
            <label className="input-label">Deposit Amount (INR)</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Idempotency Key */}
          <div className="input-group" style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="input-label" style={{ margin: 0, color: 'var(--accent-purple)' }}>
                <Key size={14} /> Idempotency Key (idempotencyKey)
              </label>
              <button
                type="button"
                onClick={() => setIdempotencyKey(generateIdempotencyKey())}
                className="btn btn-secondary btn-sm"
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
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={submitting}>
            {submitting ? 'Injecting System Funds...' : 'Deposit System Test Capital'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--secondary)" />
          <span>Requires System User Middleware on express backend (`authSystemUserMiddleware`).</span>
        </div>
      </div>
    </div>
  );
}

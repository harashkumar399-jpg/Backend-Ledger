import React, { useState } from 'react';
import Badge from '../common/Badge';
import { formatCurrency, formatAccountId } from '../../utils/formatters';
import { CreditCard, Copy, Check, RefreshCw, ArrowUpRight } from 'lucide-react';

export default function AccountCard({ account, onRefreshBalance, onQuickTransfer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <CreditCard size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ledger Account</span>
          </div>
          <Badge status={account.status} />
        </div>

        {/* Account ID with copy button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', padding: '6px 10px', borderRadius: '8px', marginBottom: '16px', border: '1px dashed var(--border-color)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)', flexGrow: 1 }}>
            {account._id}
          </span>
          <button
            onClick={handleCopy}
            style={{ background: 'none', border: 'none', color: copied ? 'var(--secondary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Copy full Account ID"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* Balance Display */}
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Available Balance
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(account.balance, account.currency)}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {account.currency || 'INR'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => onRefreshBalance(account._id)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          title="Recalculate balance from ledger"
        >
          <RefreshCw size={13} />
          Sync Ledger
        </button>

        <button
          onClick={() => onQuickTransfer(account._id)}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          Transfer <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

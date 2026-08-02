import React from 'react';
import Badge from '../common/Badge';
import IdempotencyBadge from './IdempotencyBadge';
import { formatCurrency, formatAccountId, formatDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, Activity } from 'lucide-react';

export default function TransactionTable({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Transactions Executed Yet</p>
        <p style={{ fontSize: '0.8rem' }}>Perform a transfer or add initial funds to view double-entry logs.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 18px' }}>Transaction ID</th>
              <th style={{ padding: '14px 18px' }}>From Account</th>
              <th style={{ padding: '14px 18px' }}>To Account</th>
              <th style={{ padding: '14px 18px' }}>Amount</th>
              <th style={{ padding: '14px 18px' }}>Idempotency Key</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx._id || tx.idempotencyKey}
                style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-glass)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {formatAccountId(tx._id)}
                </td>
                <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
                    <ArrowUpRight size={13} />
                    {formatAccountId(tx.fromAccount)}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
                    <ArrowDownLeft size={13} />
                    {formatAccountId(tx.toAccount)}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(tx.amount)}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <IdempotencyBadge idempotencyKey={tx.idempotencyKey} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <Badge status={tx.status} />
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

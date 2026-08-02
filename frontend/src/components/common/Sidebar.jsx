import React from 'react';
import { LayoutDashboard, ArrowLeftRight, History, PiggyBank, Terminal, ShieldCheck } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'transfer', label: 'Send & Transfer', icon: ArrowLeftRight },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'deposit', label: 'System Initial Funds', icon: PiggyBank },
    { id: 'integration', label: 'Backend Guide', icon: Terminal },
  ];

  return (
    <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '12px', marginBottom: '8px' }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, var(--primary-light), transparent)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--status-active-text)' }}>
          <ShieldCheck size={16} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Double-Entry Ledger</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Transactions debit sender & credit recipient atomically in MongoDB sessions with idempotency key verification.
        </p>
      </div>
    </aside>
  );
}

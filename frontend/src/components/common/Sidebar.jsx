import React from 'react';
import { LayoutDashboard, ArrowLeftRight, History, PiggyBank, Terminal, ShieldCheck, X } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'transfer', label: 'Send & Transfer', icon: ArrowLeftRight },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'deposit', label: 'System Initial Funds', icon: PiggyBank },
    { id: 'integration', label: 'Backend Guide', icon: Terminal },
  ];

  const handleSelect = (id) => {
    setCurrentPage(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false); // Auto close menu on mobile selection
    }
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          padding: '24px 16px',
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Responsive drawer positioning:
          position: window.innerWidth <= 768 || isMobileOpen ? 'fixed' : 'relative',
          top: window.innerWidth <= 768 || isMobileOpen ? 0 : 'auto',
          bottom: window.innerWidth <= 768 || isMobileOpen ? 0 : 'auto',
          left: 0,
          height: window.innerWidth <= 768 || isMobileOpen ? '100vh' : 'auto',
          transform: (window.innerWidth <= 768 && !isMobileOpen) ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: isMobileOpen ? '4px 0 24px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Drawer Header for Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingLeft: '12px', paddingRight: '4px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Navigation
            </p>
            <button
              onClick={() => setIsMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: window.innerWidth <= 768 ? 'block' : 'none' }}
            >
              <X size={18} />
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, var(--primary-light), transparent)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
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

        <div className="glass-card" style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-glass)', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--status-active-text)' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Double-Entry Ledger</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Transactions debit sender & credit recipient atomically in MongoDB sessions with idempotency key verification.
          </p>
        </div>
      </aside>
    </>
  );
}

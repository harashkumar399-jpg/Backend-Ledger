import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, User, Zap, Menu, X } from 'lucide-react';

export default function Navbar({ onNavigate, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn btn-secondary btn-sm"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '8px', display: 'inline-flex' }}
          title="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)' }}>
            <Zap size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
              LEDGER<span style={{ color: 'var(--text-primary)' }}>PAY</span>
            </h2>
            <p className="hide-on-mobile" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>Double-Entry Banking Core</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', padding: '5px 10px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={14} />
            </div>
            <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px', color: '#f87171' }}
              title="Logout session"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

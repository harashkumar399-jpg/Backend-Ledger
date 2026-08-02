import React from 'react';
import { Plus, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function CreateAccountModal({ isOpen, onClose, onCreate, creating }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '28px', borderRadius: '18px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Plus size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Open New Ledger Account</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Generate a double-entry INR account</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '6px' }}><strong>Default Settings:</strong></p>
          <ul style={{ paddingLeft: '18px', lineHeight: 1.6 }}>
            <li>Currency: <strong>INR (₹)</strong></li>
            <li>Initial Status: <strong>ACTIVE</strong></li>
            <li>Linked User: <strong>Your Logged-In User ID</strong></li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary" disabled={creating}>
            Cancel
          </button>
          <button onClick={onCreate} className="btn btn-primary" disabled={creating}>
            {creating ? 'Creating Account...' : 'Confirm & Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Terminal, Check, Copy, ShieldCheck, Code, Layers, Server } from 'lucide-react';

export default function BackendGuidePage() {
  const [copiedCode, setCopiedCode] = useState(null);

  const copySnippet = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const corsCode = `// backend/src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for Vite frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));`;

  return (
    <div style={{ padding: '28px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal color="var(--primary)" /> Frontend & Express Backend Integration Guide
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Step-by-step instructions for wiring this React UI directly to your Node/Express Ledger API.
        </p>
      </div>

      {/* Step 1 */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px', fontWeight: 700 }}>
            Step 1
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Configure CORS in Express (`backend/src/app.js`)</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Your Express backend runs on port <code>3000</code> and Vite frontend runs on <code>http://localhost:5173</code>. Enable CORS so cookies and JWT headers pass cleanly:
        </p>
        
        <div style={{ position: 'relative', background: '#090d16', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => copySnippet(corsCode, 'cors')}
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {copiedCode === 'cors' ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
            {copiedCode === 'cors' ? 'Copied' : 'Copy'}
          </button>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#38bdf8', overflowX: 'auto' }}>
            {corsCode}
          </pre>
        </div>
      </div>

      {/* Step 2 */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', padding: '8px', borderRadius: '10px', fontWeight: 700 }}>
            Step 2
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Express API Route Mapping Matrix</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>HTTP Method & Endpoint</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Frontend Service Function</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Auth Required</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/auth/register</td>
              <td style={{ padding: '10px 14px' }}><code>authApi.register(email, password, name)</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>No</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/auth/login</td>
              <td style={{ padding: '10px 14px' }}><code>authApi.login(email, password)</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>No</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/accounts</td>
              <td style={{ padding: '10px 14px' }}><code>accountApi.createAccount()</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>Bearer Token / Cookie</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>GET /api/accounts</td>
              <td style={{ padding: '10px 14px' }}><code>accountApi.getUserAccounts()</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>Bearer Token / Cookie</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>GET /api/accounts/balance/:id</td>
              <td style={{ padding: '10px 14px' }}><code>accountApi.getAccountBalance(id)</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>Bearer Token / Cookie</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/transactions</td>
              <td style={{ padding: '10px 14px' }}><code>transactionApi.createTransaction(...)</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>Bearer Token / Cookie</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>POST /api/transactions/system/initial-funds</td>
              <td style={{ padding: '10px 14px' }}><code>transactionApi.createInitialFunds(...)</code></td>
              <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>System User Middleware</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Step 3 */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', padding: '8px', borderRadius: '10px', fontWeight: 700 }}>
            Step 3
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Running Frontend & Backend Concurrently</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}><Server size={14} /> Terminal 1 (Backend)</p>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#a78bfa' }}>cd backend && npm run dev</code>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}><Code size={14} /> Terminal 2 (Frontend)</p>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8' }}>cd frontend && npm run dev</code>
          </div>
        </div>
      </div>

    </div>
  );
}

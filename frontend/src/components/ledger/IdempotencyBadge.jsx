import React, { useState } from 'react';
import { Key, Copy, Check } from 'lucide-react';

export default function IdempotencyBadge({ idempotencyKey }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!idempotencyKey) return;
    navigator.clipboard.writeText(idempotencyKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#a78bfa',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title="Click to copy Idempotency Key"
    >
      <Key size={11} />
      <span>{idempotencyKey ? `${idempotencyKey.substring(0, 14)}...` : 'N/A'}</span>
      {copied ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
    </div>
  );
}

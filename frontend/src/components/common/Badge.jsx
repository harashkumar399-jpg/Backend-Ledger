import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function Badge({ status }) {
  const normalized = (status || '').toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'COMPLETED':
        return {
          bg: 'var(--status-active-bg)',
          color: 'var(--status-active-text)',
          border: 'var(--status-active-border)',
          icon: CheckCircle2,
        };
      case 'PENDING':
        return {
          bg: 'var(--status-pending-bg)',
          color: 'var(--status-pending-text)',
          border: 'var(--status-pending-border)',
          icon: Clock,
        };
      case 'FAILED':
      case 'FROZEN':
      case 'REVERSED':
      case 'CLOSED':
        return {
          bg: 'var(--status-failed-bg)',
          color: 'var(--status-failed-text)',
          border: 'var(--status-failed-border)',
          icon: XCircle,
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          color: 'var(--text-secondary)',
          border: 'var(--border-color)',
          icon: AlertCircle,
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: '0.03em',
      }}
    >
      <Icon size={12} />
      {normalized}
    </span>
  );
}

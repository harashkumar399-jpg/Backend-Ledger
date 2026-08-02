import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6366f1' }) {
  return (
    <div className="glass-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          zIndex: 1,
        }}
      >
        <Icon size={26} />
      </div>

      {/* Decorative Glow Blob */}
      <div
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: color,
          opacity: 0.1,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

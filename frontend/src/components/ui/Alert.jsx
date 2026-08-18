import React, { useEffect, useState } from 'react';

/**
 * Alert / toast notification popup
 * type: 'success' | 'danger' | 'warning' | 'info'
 */
const Alert = ({ type = 'info', message, duration = 3500 }) => {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), duration);

    return () => window.clearTimeout(timer);
  }, [message, duration]);

  if (!message || !visible) return null;

  const colorMap = {
    success: 'var(--success)',
    danger: 'var(--danger)',
    warning: 'var(--warning)',
    info: '#38bdf8',
  };
  const color = colorMap[type] || colorMap.info;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '360px',
        padding: '1rem 1.1rem',
        background: 'rgba(9, 9, 11, 0.96)',
        border: `1px solid ${color}`,
        borderLeft: `4px solid ${color}`,
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
    >
      <div style={{ flex: 1, fontSize: '0.92rem', lineHeight: 1.5 }}>
        <div style={{ fontWeight: 700, color }}>
          {type === 'success' ? 'Success' : type === 'danger' ? 'Error' : type === 'warning' ? 'Warning' : 'Notice'}
        </div>
        <div style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>{message}</div>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss alert"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;

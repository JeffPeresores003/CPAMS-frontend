import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * 2026 Sleek Floating Alert / Toast Component
 * @param {'success' | 'danger' | 'error' | 'warning' | 'info'} type
 * @param {string} message
 * @param {number} duration - ms before auto-dismiss
 * @param {function} onClose - optional callback
 */
const Alert = ({ type = 'info', message, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message || !visible) return null;

  const normalizedType = type === 'danger' || type === 'error' ? 'error' : type;

  const configMap = {
    success: {
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      title: 'Success',
    },
    error: {
      icon: AlertCircle,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.12)',
      borderColor: 'rgba(244, 63, 94, 0.4)',
      title: 'Error',
    },
    warning: {
      icon: AlertTriangle,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      title: 'Warning',
    },
    info: {
      icon: Info,
      color: '#0ea5e9',
      bgGlow: 'rgba(14, 165, 233, 0.12)',
      borderColor: 'rgba(14, 165, 233, 0.4)',
      title: 'Notice',
    },
  };

  const current = configMap[normalizedType] || configMap.info;
  const IconComponent = current.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '420px',
        padding: '1rem 1.25rem',
        background: 'rgba(13, 17, 23, 0.92)',
        border: `1px solid ${current.borderColor}`,
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px ${current.bgGlow}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: current.bgGlow,
          border: `1px solid ${current.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '0.1rem',
        }}
      >
        <IconComponent size={18} style={{ color: current.color }} />
      </div>

      <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5 }}>
        <div style={{ fontWeight: 700, color: current.color, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {current.title}
        </div>
        <div style={{ marginTop: '0.2rem', color: 'var(--text-main)', fontWeight: 400 }}>
          {message}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Dismiss alert"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.2rem',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition-fast)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;

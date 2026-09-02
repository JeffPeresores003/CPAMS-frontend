import React from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'info', maxWidth = '520px', scrollable = false }) => {
  if (!isOpen) return null;

  const iconMap = {
    danger: <AlertCircle size={20} style={{ color: 'var(--danger)' }} />,
    error: <AlertCircle size={20} style={{ color: 'var(--danger)' }} />,
    warning: <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />,
    success: <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />,
    info: <Info size={20} style={{ color: 'var(--info)' }} />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        background: 'rgba(7, 9, 14, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth,
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7)',
          border: '1px solid var(--border-light)',
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 17, 23, 0.4)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {iconMap[type]}
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '1.5rem',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          ...(scrollable ? { maxHeight: '65vh', overflowY: 'auto' } : {}),
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-light)',
              background: 'rgba(7, 9, 14, 0.5)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

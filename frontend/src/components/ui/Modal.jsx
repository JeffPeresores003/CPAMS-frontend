import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(4px)',
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: `1px solid var(--border-light)`,
        animation: 'modalSlideUp 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {type === 'danger' && <span style={{ color: 'var(--danger)' }}>⚠️</span>}
            {title}
          </h3>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: '0.25rem', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)',
            background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'
          }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Modal;

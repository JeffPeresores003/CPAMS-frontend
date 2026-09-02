import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * 2026 Feedback / Status Modal for Success, Error, Warning, and Info states
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {'success' | 'error' | 'warning' | 'info'} type
 * @param {string} title
 * @param {string | React.ReactNode} message
 * @param {string} confirmText
 * @param {function} onConfirm
 * @param {string} cancelText
 */
const FeedbackModal = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  onConfirm,
  cancelText,
}) => {
  if (!isOpen) return null;

  const configMap = {
    success: {
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      btnClass: 'btn-primary',
      defaultTitle: 'Operation Successful',
    },
    error: {
      icon: AlertCircle,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      borderColor: 'rgba(244, 63, 94, 0.35)',
      btnClass: 'btn-danger',
      defaultTitle: 'Something Went Wrong',
    },
    warning: {
      icon: AlertTriangle,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      btnClass: 'btn-secondary',
      defaultTitle: 'Attention Required',
    },
    info: {
      icon: Info,
      color: '#0ea5e9',
      bgGlow: 'rgba(14, 165, 233, 0.15)',
      borderColor: 'rgba(14, 165, 233, 0.35)',
      btnClass: 'btn-secondary',
      defaultTitle: 'Information',
    },
  };

  const current = configMap[type] || configMap.info;
  const IconComponent = current.icon;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
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
        backgroundColor: 'rgba(7, 9, 14, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid ${current.borderColor}`,
          boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px ${current.bgGlow}`,
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>

        {/* Icon Ring */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: current.bgGlow,
            border: `1px solid ${current.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: `0 0 20px ${current.bgGlow}`,
          }}
        >
          <IconComponent size={32} style={{ color: current.color }} />
        </div>

        {/* Title */}
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>
          {title || current.defaultTitle}
        </h3>

        {/* Description */}
        <div style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {message}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {cancelText && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`btn ${current.btnClass}`}
            style={{ flex: 1 }}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

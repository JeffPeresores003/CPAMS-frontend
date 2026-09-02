import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Modern 2026 Loading Spinner
 * @param {string} size - 'sm' (16px) | 'md' (24px) | 'lg' (36px) | 'xl' (48px)
 * @param {string} color - CSS color string or 'primary' | 'white'
 * @param {string} className - Additional CSS class
 */
const LoadingSpinner = ({ size = 'md', color = 'var(--primary)', className = '', label = '' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
    xl: 48,
  };

  const pixelSize = sizeMap[size] || 24;

  return (
    <div
      className={`loading-spinner-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
      }}
    >
      <Loader2
        size={pixelSize}
        style={{
          color: color === 'primary' ? 'var(--primary)' : color,
          animation: 'spinSmooth 0.8s linear infinite',
          filter: color === 'primary' || color === 'var(--primary)' ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none',
        }}
      />
      {label && (
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;

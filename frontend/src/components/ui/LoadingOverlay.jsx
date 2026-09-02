import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * 2026 Reusable Loading Overlay for async operations (login, reservation submissions, profiling)
 * @param {boolean} active - whether the overlay is visible
 * @param {string} message - description of ongoing process
 * @param {boolean} fullScreen - whether to fix across entire viewport or parent container
 */
const LoadingOverlay = ({ active = false, message = 'Processing request...', fullScreen = false }) => {
  if (!active) return null;

  return (
    <div
      style={{
        position: fullScreen ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: 9990,
        backgroundColor: 'rgba(7, 9, 14, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        animation: 'fadeIn 0.2s ease-out',
        borderRadius: fullScreen ? 0 : 'inherit',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
          maxWidth: '360px',
          textAlign: 'center',
        }}
      >
        <LoadingSpinner size="xl" />
        <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em' }}>
          {message}
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          Please hold on while we securely process your request.
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

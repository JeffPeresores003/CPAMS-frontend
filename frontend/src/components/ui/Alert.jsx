import React from 'react';

/**
 * Alert / inline notification banner
 * type: 'success' | 'danger' | 'warning' | 'info'
 */
const Alert = ({ type = 'info', message }) => {
  if (!message) return null;
  const colorMap = {
    success: 'var(--success)',
    danger: 'var(--danger)',
    warning: 'var(--warning)',
    info: '#38bdf8',
  };
  const color = colorMap[type] || colorMap.info;
  return (
    <div style={{
      padding: '0.875rem 1rem',
      background: `${color}22`,
      border: `1px solid ${color}`,
      color,
      borderRadius: 'var(--radius-md)',
      marginBottom: '1rem',
      fontSize: '0.9rem',
    }}>
      {message}
    </div>
  );
};

export default Alert;

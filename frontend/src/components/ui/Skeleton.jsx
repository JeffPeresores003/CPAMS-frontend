import React from 'react';

// Skeleton for a single table row
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>
        <div className="skeleton" style={{ height: '1rem', borderRadius: '0.25rem', width: i === 0 ? '70%' : '50%' }} />
      </td>
    ))}
  </tr>
);

// Skeleton for a stat card
export const StatCardSkeleton = () => (
  <div className="card flex items-center gap-4">
    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ height: '1.5rem', width: '60%', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '0.875rem', width: '40%', borderRadius: '0.25rem' }} />
    </div>
  </div>
);

// Skeleton for a form card
export const FormSkeleton = ({ rows = 4 }) => (
  <div className="card">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="form-group">
        <div className="skeleton" style={{ height: '0.75rem', width: '30%', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '2.75rem', width: '100%', borderRadius: '0.5rem' }} />
      </div>
    ))}
  </div>
);

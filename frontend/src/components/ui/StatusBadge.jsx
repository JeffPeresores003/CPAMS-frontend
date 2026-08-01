import React from 'react';

const STATUS_MAP = {
  Available:        { className: 'badge-available' },
  Reserved:         { className: 'badge-reserved' },
  Occupied:         { className: 'badge-occupied' },
  Approved:         { className: 'badge-success' },
  Pending:          { className: 'badge-warning' },
  Disabled:         { className: 'badge-danger' },
  Rejected:         { className: 'badge-danger' },
  Sent:             { className: 'badge-success' },
  Failed:           { className: 'badge-danger' },
  'Pending Balance':{ className: 'badge-warning' },
  'Fully Paid':     { className: 'badge-success' },
  'Down Payment':   { className: 'badge-info' },
  Installment:      { className: 'badge-info' },
  'Full Payment':   { className: 'badge-success' },
  Admin:            { className: 'badge-danger' },
  Staff:            { className: 'badge-info' },
  Customer:         { className: 'badge-success' },
};

const StatusBadge = ({ value }) => {
  const config = STATUS_MAP[value] || { className: 'badge-info' };
  return <span className={`badge ${config.className}`}>{value}</span>;
};

export default StatusBadge;

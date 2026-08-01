import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = 'No records found', icon: Icon = Inbox }) => (
  <div className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
    <Icon size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
    <p>{message}</p>
  </div>
);

export default EmptyState;

import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserCheck, XCircle } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const PendingCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/pending-customers');
      setCustomers(res.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load pending customers — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this customer account?`)) return;
    try {
      if (action === 'approve') {
        await api.post(`/users/customers/${id}/approve`);
        setAlert({ type: 'success', message: 'Customer approved. An email has been sent with their credentials.' });
      } else {
        await api.post(`/users/customers/${id}/reject`);
        setAlert({ type: 'warning', message: 'Customer account rejected.' });
      }
      fetchPending();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || `Failed to ${action} customer.` });
    }
  };

  return (
    <div>
      <h1 className="mb-4">Pending Customer Approvals</h1>
      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : customers.length === 0
                ? <tr><td colSpan="6"><EmptyState message="No pending customers" icon={UserCheck} /></td></tr>
                : customers.map(c => (
                  <tr key={c.user_id}>
                    <td>{c.first_name} {c.last_name}</td>
                    <td>{c.username}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => handleAction(c.user_id, 'approve')}
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => handleAction(c.user_id, 'reject')}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingCustomers;

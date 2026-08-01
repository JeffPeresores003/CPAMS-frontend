import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserCheck, XCircle } from 'lucide-react';

const PendingCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/pending-customers');
      setCustomers(res.data);
    } catch (err) {
      setError('Failed to fetch pending customers (Database might be down)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this account?`)) return;
    try {
      if (action === 'approve') {
        await api.post(`/users/customers/${id}/approve`);
        alert('Customer approved! Email sent.');
      } else {
        await api.post(`/users/customers/${id}/reject`);
        alert('Customer rejected.');
      }
      fetchPending();
    } catch (err) {
      alert(`Failed to ${action} customer (Database might be down)`);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Pending Customer Approvals</h1>
      {error && <div className="mb-4 text-danger">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="text-center" style={{ padding: '2rem' }}>Loading...</div>
        ) : (
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
              {customers.map(c => (
                <tr key={c.user_id}>
                  <td>{c.first_name} {c.last_name}</td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleAction(c.user_id, 'approve')}
                      >
                        <UserCheck size={14} /> Approve
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleAction(c.user_id, 'reject')}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '2rem' }}>No pending customers</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingCustomers;

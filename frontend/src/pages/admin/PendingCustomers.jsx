import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserCheck, XCircle, Eye, CheckCircle } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const getAccountCode = (u) => {
  if (!u) return '—';
  if (u.account_code) return u.account_code;
  const prefix = u.role === 'Admin' ? 'ADM' : u.role === 'Staff' ? 'STF' : 'CUS';
  const year = u.created_at ? new Date(u.created_at).getFullYear() : new Date().getFullYear();
  const idStr = String(u.user_id || u.account_id || 0).padStart(4, '0');
  return `${prefix}-${year}-${idStr}`;
};

const PendingCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [approvedAccountModal, setApprovedAccountModal] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/pending');
      setCustomers(res.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load pending customers — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action, targetCustomer) => {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this customer account?`)) return;
    try {
      if (action === 'approve') {
        const res = await api.patch(`/users/${id}/approve`);
        setAlert({ type: 'success', message: 'Customer account approved successfully.' });
        
        const approvedUser = res.data?.user || targetCustomer;
        const autoPass = approvedUser.first_name ? `${approvedUser.first_name.trim().toLowerCase()}123` : 'user123';

        setApprovedAccountModal({
          ...approvedUser,
          default_password: autoPass,
          created_by_staff: !!approvedUser.created_by,
        });
      } else {
        await api.patch(`/users/${id}/reject`);
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
              <th>Account Code</th>
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
              ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
              : customers.length === 0
                ? <tr><td colSpan="7"><EmptyState message="No pending customers" icon={UserCheck} /></td></tr>
                : customers.map(c => (
                  <tr key={c.user_id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                        {getAccountCode(c)}
                      </span>
                    </td>
                    <td>{c.first_name} {c.last_name}</td>
                    <td>{c.username}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          onClick={() => setSelectedUserForProfile(c)}
                        >
                          <Eye size={14} /> Profile
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => handleAction(c.user_id, 'approve', c)}
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => handleAction(c.user_id, 'reject', c)}
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

      {/* Pending Customer Profile Details Modal */}
      {selectedUserForProfile && (
        <Modal title="Pending Customer Profile" onClose={() => setSelectedUserForProfile(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Code</label>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {getAccountCode(selectedUserForProfile)}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</label>
                <div><StatusBadge value={selectedUserForProfile.role || 'Customer'} /></div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.first_name} {selectedUserForProfile.last_name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Status</label>
                <div><StatusBadge value={selectedUserForProfile.account_status || 'Pending'} /></div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Username</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.username}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.phone || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied Date</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{new Date(selectedUserForProfile.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const target = selectedUserForProfile;
                  setSelectedUserForProfile(null);
                  handleAction(target.user_id, 'approve', target);
                }}
              >
                <UserCheck size={16} /> Approve Account
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedUserForProfile(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Account Approved Modal showing Username & Password */}
      {approvedAccountModal && (
        <Modal title="Account Approved — Account Credentials" onClose={() => setApprovedAccountModal(null)}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <CheckCircle size={52} style={{ color: 'var(--success)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ margin: '0 0 0.25rem' }}>Account Approved Successfully!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              The account is now active. Below are the login credentials for this account.
            </p>
          </div>

          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Code</span>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', margin: '0.25rem 0 0', color: 'var(--primary)' }}>
                  {getAccountCode(approvedAccountModal)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</span>
                <p style={{ fontWeight: 600, margin: '0.25rem 0 0' }}>
                  {approvedAccountModal.first_name} {approvedAccountModal.last_name}
                </p>
              </div>

              {/* Username Box */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Username
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#fff', fontFamily: 'monospace' }}>
                  {approvedAccountModal.username}
                </strong>
              </div>

              {/* Password Box */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Password
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'monospace' }}>
                  {approvedAccountModal.default_password}
                </strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                <p style={{ fontWeight: 600, margin: '0.25rem 0 0' }}>{approvedAccountModal.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button className="btn btn-primary" onClick={() => setApprovedAccountModal(null)}>
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PendingCustomers;

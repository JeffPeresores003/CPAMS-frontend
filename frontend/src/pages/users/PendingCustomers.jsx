import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserCheck, XCircle, Eye, CheckCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';

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
  const [error, setError] = useState('');
  
  // Modals state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', action: '', userId: null, title: '', message: '', targetUser: null });
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [approvedAccountModal, setApprovedAccountModal] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/pending');
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

  const openConfirmModal = (customer, action) => {
    setModalConfig({
      isOpen: true,
      action,
      userId: customer.user_id,
      targetUser: customer,
      type: action === 'reject' ? 'danger' : 'info',
      title: action === 'approve' ? 'Approve Customer?' : 'Reject Customer?',
      message: action === 'approve' 
        ? 'Are you sure you want to approve this customer account?'
        : 'Are you sure you want to reject this registration? This action cannot be undone.'
    });
  };

  const handleAction = async () => {
    const { action, userId, targetUser } = modalConfig;
    setModalConfig({ ...modalConfig, isOpen: false });

    try {
      if (action === 'approve') {
        const res = await api.patch(`/users/${userId}/approve`);
        const approvedUser = res.data?.user || targetUser;
        const autoPass = approvedUser.first_name ? `${approvedUser.first_name.trim().toLowerCase()}123` : 'user123';

        // Show approved account details modal
        setApprovedAccountModal({
          ...approvedUser,
          default_password: autoPass,
          created_by_staff: !!approvedUser.created_by,
        });
      } else {
        await api.patch(`/users/${userId}/reject`);
      }
      fetchPending();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Action failed');
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
              {customers.map(c => (
                <tr key={c.user_id}>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'monospace', letterSpacing: '0.05em', fontWeight: 600 }}>
                      {getAccountCode(c)}
                    </span>
                  </td>
                  <td>{c.first_name} {c.last_name}</td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        onClick={() => setSelectedUserForProfile(c)}
                      >
                        <Eye size={14} /> Profile
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => openConfirmModal(c, 'approve')}
                      >
                        <UserCheck size={14} /> Approve
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => openConfirmModal(c, 'reject')}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '2rem' }}>No pending customers</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}>Cancel</button>
            <button 
              className={`btn ${modalConfig.type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
              onClick={handleAction}
            >
              Confirm {modalConfig.action}
            </button>
          </>
        }
      >
        <p style={{ margin: 0 }}>{modalConfig.message}</p>
      </Modal>

      {/* View Pending Customer Profile Modal */}
      {selectedUserForProfile && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedUserForProfile(null)}
          title="Pending Customer Profile"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Code</label>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {getAccountCode(selectedUserForProfile)}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</label>
                <div>
                  <span className="badge badge-success">Customer</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.first_name} {selectedUserForProfile.last_name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Status</label>
                <div>
                  <span className="badge badge-warning">Pending</span>
                </div>
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
                  openConfirmModal(target, 'approve');
                }}
              >
                Approve Account
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedUserForProfile(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Account Approved Modal showing Username & Password */}
      {approvedAccountModal && (
        <Modal 
          isOpen={true} 
          onClose={() => setApprovedAccountModal(null)}
          title="Account Approved — Account Credentials"
        >
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <CheckCircle size={52} style={{ color: 'var(--success)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ margin: '0 0 0.25rem' }}>Account Approved Successfully!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              The account is now active. Below are the login credentials for this account.
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Code</span>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', margin: '0.25rem 0 0', color: 'var(--primary)', fontSize: '1rem' }}>
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

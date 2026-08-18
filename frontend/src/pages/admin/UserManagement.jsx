import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Eye } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [staffForm, setStaffForm] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: '', password: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { role: roleFilter, status: statusFilter } });
      setUsers(res.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load users — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    if (!confirm(`Change user status to ${newStatus}?`)) return;
    try {
      await api.patch(`/users/${id}/status`, { status: newStatus });
      fetchUsers();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to update status.' });
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/staff', staffForm);
      setAlert({ type: 'success', message: 'Staff account created successfully!' });
      setShowModal(false);
      setStaffForm({ username: '', email: '', first_name: '', last_name: '', phone: '', password: '' });
      fetchUsers();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create staff.' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>User Management</h1>
        <div className="flex gap-4 items-center">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={18} /> New Staff
          </button>
          <select className="form-control" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: '140px' }}>
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '140px' }}>
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Disabled">Disabled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Account Code</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
              : users.length === 0
                ? <tr><td colSpan="8"><EmptyState message="No users found" /></td></tr>
                : users.map(u => (
                  <tr key={u.user_id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                        {u.account_code || '—'}
                      </span>
                    </td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><StatusBadge value={u.role} /></td>
                    <td><StatusBadge value={u.account_status} /></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', itemsCenter: 'center', gap: '0.35rem' }}
                          onClick={() => setSelectedUserForProfile(u)}
                        >
                          <Eye size={14} /> Profile
                        </button>

                        {u.user_id !== user.user_id && u.role !== 'Admin' && u.account_status !== 'Pending' && (
                          <button
                            className={`btn ${u.account_status === 'Approved' ? 'btn-danger' : 'btn-primary'}`}
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                            onClick={() => toggleStatus(u.user_id, u.account_status)}
                          >
                            {u.account_status === 'Approved' ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Staff Creation Modal */}
      {showModal && (
        <Modal title="Create Staff Account" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreateStaff} className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" required value={staffForm.first_name} onChange={e => setStaffForm({ ...staffForm, first_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" required value={staffForm.last_name} onChange={e => setStaffForm({ ...staffForm, last_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" required value={staffForm.username} onChange={e => setStaffForm({ ...staffForm, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required minLength={8} value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (Optional)</label>
              <input type="text" className="form-control" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2' }} className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary">Create Staff</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* View User Profile Modal */}
      {selectedUserForProfile && (
        <Modal title="User Profile Details" onClose={() => setSelectedUserForProfile(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Code</label>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {selectedUserForProfile.account_code || '—'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role</label>
                <div><StatusBadge value={selectedUserForProfile.role} /></div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.first_name} {selectedUserForProfile.last_name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Status</label>
                <div><StatusBadge value={selectedUserForProfile.account_status} /></div>
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date Joined</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{new Date(selectedUserForProfile.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="btn btn-secondary" onClick={() => setSelectedUserForProfile(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;

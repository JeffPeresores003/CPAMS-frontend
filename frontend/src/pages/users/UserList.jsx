import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Eye, Search } from 'lucide-react';
import Modal from '../../components/ui/Modal';

const getAccountCode = (u) => {
  if (!u) return '—';
  if (u.account_code) return u.account_code;
  const prefix = u.role === 'Admin' ? 'ADM' : u.role === 'Staff' ? 'STF' : 'CUS';
  const year = u.created_at ? new Date(u.created_at).getFullYear() : new Date().getFullYear();
  const idStr = String(u.user_id || u.account_id || 0).padStart(4, '0');
  return `${prefix}-${year}-${idStr}`;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);
  const { user } = useAuth();
  
  const [staffForm, setStaffForm] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: '', password: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { role: roleFilter, status: statusFilter }
      });
      
      // Do not show pending users in the main User Management tab
      const filteredUsers = res.data.filter(u => u.account_status !== 'Pending');
      setUsers(filteredUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
    if (confirm(`Change user status to ${newStatus}?`)) {
      try {
        await api.patch(`/users/${id}/status`, { status: newStatus });
        fetchUsers();
      } catch (e) {
        alert('Failed to update status');
      }
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/staff', staffForm);
      alert('Staff account created successfully!');
      setShowStaffForm(false);
      setStaffForm({ username: '', email: '', first_name: '', last_name: '', phone: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create staff');
    }
  };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const code = getAccountCode(u).toLowerCase();
    return (
      (u.first_name && u.first_name.toLowerCase().includes(q)) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      code.includes(q)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h1>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Manage staff and registered customer accounts across the cemetery system.
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {user.role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => setShowStaffForm(!showStaffForm)}>
              <UserPlus size={18} /> New Staff
            </button>
          )}
          <select 
            className="form-control" 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ width: '140px' }}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
          <select 
            className="form-control" 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: '140px' }}
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Disabled">Disabled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, username, email, account code (e.g. CUS-2026-0001)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {showStaffForm && (
        <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 className="mb-4">Create Staff Account</h3>
          <form onSubmit={handleCreateStaff} className="grid grid-cols-2">
            <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-control" required value={staffForm.first_name} onChange={e => setStaffForm({...staffForm, first_name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-control" required value={staffForm.last_name} onChange={e => setStaffForm({...staffForm, last_name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Username</label><input type="text" className="form-control" required value={staffForm.username} onChange={e => setStaffForm({...staffForm, username: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" required value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-control" required value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input type="text" className="form-control" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} /></div>
            <div style={{ gridColumn: 'span 2' }} className="flex gap-2">
              <button type="submit" className="btn btn-primary">Create Staff</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowStaffForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.user_id}>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--primary)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'monospace', letterSpacing: '0.05em', fontWeight: 600 }}>
                      {getAccountCode(u)}
                    </span>
                  </td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Staff' ? 'badge-info' : 'badge-success'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${u.account_status.toLowerCase()}`}>
                      {u.account_status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        onClick={() => setSelectedUserForProfile(u)}
                      >
                        <Eye size={14} /> Profile
                      </button>

                      {u.user_id !== user.user_id && u.role !== 'Admin' && (
                        <button 
                          className={`btn ${u.account_status === 'Approved' ? 'btn-danger' : 'btn-primary'}`}
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => toggleStatus(u.user_id, u.account_status)}
                          disabled={u.account_status === 'Pending' || u.account_status === 'Rejected'}
                        >
                          {u.account_status === 'Approved' ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '2rem' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View User Profile Modal */}
      {selectedUserForProfile && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedUserForProfile(null)}
          title="Full Account Profile"
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
                  <span className={`badge ${selectedUserForProfile.role === 'Admin' ? 'badge-danger' : selectedUserForProfile.role === 'Staff' ? 'badge-info' : 'badge-success'}`}>
                    {selectedUserForProfile.role}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</label>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedUserForProfile.first_name} {selectedUserForProfile.last_name}</p>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Status</label>
                <div>
                  <span className={`badge badge-${selectedUserForProfile.account_status.toLowerCase()}`}>
                    {selectedUserForProfile.account_status}
                  </span>
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

export default UserList;

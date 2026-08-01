import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStaffForm, setShowStaffForm] = useState(false);
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
      setUsers(res.data);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>User Management</h1>
        <div className="flex gap-4 items-center">
          {user.role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => setShowStaffForm(!showStaffForm)}>
              <UserPlus size={18} /> New Staff
            </button>
          )}
          <select 
            className="form-control" 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ width: '150px' }}
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
            style={{ width: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Disabled">Disabled</option>
            <option value="Rejected">Rejected</option>
          </select>
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
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.username}</td>
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
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;

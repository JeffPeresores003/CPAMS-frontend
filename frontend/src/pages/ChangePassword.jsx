import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        old_password: user.is_first_login ? undefined : oldPassword,
        new_password: newPassword
      });
      
      setSuccess('Password changed successfully! Redirecting...');
      
      // Need to fetch fresh token / user details to clear is_first_login
      // For now, logout and force re-login is safest. Or we can just navigate to dashboard and let context handle it.
      setTimeout(() => {
        // Quick hack: just let the user log back in to get a fresh token. 
        // This is safer than modifying the token payload manually.
        window.location.href = '/dashboard';
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Set New Password</h2>
        
        {user?.is_first_login && (
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid var(--warning)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Welcome! You must change your default password before accessing the system.
          </div>
        )}

        {error && <div className="mb-4" style={{ color: 'var(--danger)' }}>{error}</div>}
        {success && <div className="mb-4" style={{ color: 'var(--success)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {!user?.is_first_login && (
            <div className="form-group">
              <label className="form-label">Old Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              minLength={8}
            />
            <small className="text-muted mt-1 block">Minimum 8 characters</small>
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

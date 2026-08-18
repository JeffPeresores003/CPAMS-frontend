import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, login } = useAuth();

  const passwordRules = [
    {
      label: 'At least 8 characters',
      valid: newPassword.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      valid: /[A-Z]/.test(newPassword),
    },
    {
      label: 'At least one number',
      valid: /[0-9]/.test(newPassword),
    },
    {
      label: 'At least one special character',
      valid: /[^A-Za-z0-9]/.test(newPassword),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (isMounted) {
          const userData = response.data;
          setProfile({
            username: userData.username || '',
            email: userData.email || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            phone: userData.phone || '',
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to load profile');
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []); // Run ONLY once on mount so input field typing/deleting works freely

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProfileSaving(true);

    try {
      const response = await api.patch('/auth/me', profile);
      const token = sessionStorage.getItem('token');
      if (token && response.data?.user) {
        login(token, response.data.user);
      }
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!isPasswordValid) {
      setError('Please meet all password requirements before continuing');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        old_password: oldPassword || undefined,
        new_password: newPassword
      });

      const refreshed = await api.get('/auth/me');
      const token = sessionStorage.getItem('token');
      if (token) {
        login(token, refreshed.data);
      }
      
      setSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  return (
    <div style={{ width: '100%', display: 'grid', gap: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '860px', display: 'grid', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="mb-4">Profile &amp; Settings</h2>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            Update your personal information and change your password.
          </p>

          {error && <div className="mb-4" style={{ color: 'var(--danger)' }}>{error}</div>}
          {success && <div className="mb-4" style={{ color: 'var(--success)' }}>{success}</div>}

          <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.username}
                  onChange={(e) => setProfile((current) => ({ ...current, username: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  onChange={(e) => setProfile((current) => ({ ...current, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.first_name}
                  onChange={(e) => setProfile((current) => ({ ...current, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.last_name}
                  onChange={(e) => setProfile((current) => ({ ...current, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: '320px' }}>
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                value={profile.phone}
                onChange={(e) => setProfile((current) => ({ ...current, phone: e.target.value }))}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                {profileSaving ? 'Saving profile…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Change Password</h3>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            Keep your account secure with a strong password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Old Password (Optional if initial login)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{ paddingRight: '5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((current) => !current)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showOldPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ paddingRight: '5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: rule.valid ? 'var(--success)' : 'var(--text-muted)',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        background: rule.valid ? 'rgba(16, 185, 129, 0.18)' : 'rgba(161, 161, 170, 0.15)',
                        color: rule.valid ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {rule.valid ? '✓' : '•'}
                    </span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={!isPasswordValid}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

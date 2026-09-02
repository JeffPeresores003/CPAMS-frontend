import React, { useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import { UserPlus, CheckCircle, AlertTriangle, Info, Mail, User, Phone, AtSign } from 'lucide-react';

const WalkInProfiling = () => {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // holds { message, name, username, email, password }

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-suggest username from name if username is still untouched / empty
      if ((name === 'first_name' || name === 'last_name') && !prev._usernameTouched) {
        const f = (name === 'first_name' ? value : prev.first_name).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const l = (name === 'last_name'  ? value : prev.last_name ).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        updated.username = f + l || '';
      }
      return updated;
    });
  };

  const handleUsernameChange = (e) => {
    setFormData(prev => ({ ...prev, username: e.target.value, _usernameTouched: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    if (!formData.email || !formData.email.includes('@')) {
      setAlert({ type: 'danger', message: 'A valid email address is required.' });
      setLoading(false);
      return;
    }

    const autoPassword = `${formData.first_name.trim().toLowerCase()}123`;

    try {
      const payload = {
        first_name: formData.first_name,
        last_name:  formData.last_name,
        username:   formData.username || undefined,
        email:      formData.email,
        phone:      formData.phone || undefined,
      };
      const res = await api.post('/users/customer', payload);
      setSuccess({
        name:     `${formData.first_name} ${formData.last_name}`,
        username: res.data.username,
        email:    res.data.email,
        password: autoPassword,
        message:  res.data.message,
      });
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(null);
    setFormData({ first_name: '', last_name: '', username: '', email: '', phone: '', _usernameTouched: false });
    setAlert({ type: '', message: '' });
  };

  // ── Success Screen ──────────────────────────────────────────────
  if (success) {
    return (
      <div>
        <h1 className="mb-4">Walk-In Profiling</h1>
        <div className="card" style={{ maxWidth: '620px', textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle size={56} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Account Profiled!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The customer profile is pending Admin approval.
          </p>

          {/* Credentials Summary */}
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem',
            textAlign: 'left',
          }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Profile Summary
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Full Name</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.name}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Username</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.username}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Email</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Default Password</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{success.password}</p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem',
          }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span>Give the customer their credentials. They will be able to log in once Admin approves their account.</span>
          </div>
          <button className="btn btn-primary" onClick={resetForm} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} /> Profile Another Customer
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Walk-In Profiling</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Register a new walk-in customer. Fill in their details and provide a valid email address.
        </p>
      </div>

      <Alert type={alert.type} message={alert.message} />

      <div className="card" style={{ maxWidth: '620px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ padding: '0.625rem', background: 'var(--primary-glow)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <UserPlus size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>New Customer Profiling</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Account defaults to Pending until Admin approves</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={13} /> First Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                name="first_name" type="text" className="form-control" required
                value={formData.first_name} onChange={handleChange} placeholder="Juan"
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={13} /> Last Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                name="last_name" type="text" className="form-control" required
                value={formData.last_name} onChange={handleChange} placeholder="dela Cruz"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={13} /> Email Address <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              name="email" type="email" className="form-control" required
              value={formData.email} onChange={handleChange}
              placeholder="customer@example.com"
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AtSign size={13} /> Username{' '}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(auto-suggested)</span>
            </label>
            <input
              name="username" type="text" className="form-control"
              value={formData.username} onChange={handleUsernameChange}
              placeholder="juandelacruz"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem', marginBottom: 0 }}>
              Leave as-is or override. Must be unique.
            </p>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={13} /> Phone Number{' '}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              name="phone" type="tel" className="form-control"
              value={formData.phone} onChange={handleChange} placeholder="09123456789"
            />
          </div>

          {/* Password info banner */}
          <div style={{
            padding: '1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)',
            marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--info)', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Info size={16} /> Default Password
            </div>
            The account's initial password will be:{' '}
            <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
              {formData.first_name ? `${formData.first_name.trim().toLowerCase()}123` : 'firstname123'}
            </strong>
            <br />Hand this to the customer after Admin approves their account.
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating Account Profile…' : 'Create Customer Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalkInProfiling;

import React, { useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import { UserPlus, CheckCircle } from 'lucide-react';

const WalkInProfiling = () => {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // holds { message, name, username, email, password }

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const res = await api.post('/users/customer', formData);
      const autoPassword = `${formData.first_name.trim().toLowerCase()}123`;
      setSuccess({
        name: `${formData.first_name} ${formData.last_name}`,
        username: res.data.username,
        email: res.data.email,
        password: autoPassword,
        message: res.data.message,
      });
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(null);
    setFormData({ first_name: '', last_name: '', phone: '' });
    setAlert({ type: '', message: '' });
  };

  if (success) {
    return (
      <div>
        <h1 className="mb-4">Profiling</h1>
        <div className="card" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 2rem' }}>
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
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Auto-Generated Profile Summary
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Name</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.name}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Auto Username</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.username}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Auto Email</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{success.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>Default Password</p>
                <p style={{ fontWeight: 700, margin: 0, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{success.password}</p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            ⚠️ Once Admin approves this profiling, full profile details will be confirmed.
          </p>
          <button className="btn btn-primary" onClick={resetForm}>
            <UserPlus size={18} /> Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Profiling</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Create a new customer profile. Username and email will be auto-generated base on the customer's name.
        </p>
      </div>

      <Alert type={alert.type} message={alert.message} />

      <div className="card" style={{ maxWidth: '600px' }}>
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
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input name="first_name" type="text" className="form-control" required value={formData.first_name} onChange={handleChange} placeholder="Juan" />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input name="last_name" type="text" className="form-control" required value={formData.last_name} onChange={handleChange} placeholder="dela Cruz" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <input name="phone" type="tel" className="form-control" value={formData.phone} onChange={handleChange} placeholder="09123456789" />
          </div>

          <div style={{
            padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)',
            marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)',
          }}>
            ℹ️ <strong>Auto-Generated Account Details:</strong><br />
            • Username &amp; Email will be auto-generated based on the customer's name.<br />
            • Default password will be: <strong style={{ color: 'var(--primary)' }}>
              {formData.first_name ? `${formData.first_name.trim().toLowerCase()}123` : 'firstname123'}
            </strong>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? 'Creating Account Profile…' : 'Create Customer Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalkInProfiling;

import React, { useState } from 'react';
import api from '../../api/axios';

const CreateCustomer = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    
    try {
      await api.post('/users/customers', formData);
      setStatus({ type: 'success', msg: 'Customer account created successfully! It is now pending Admin approval.' });
      setFormData({ username: '', email: '', first_name: '', last_name: '', phone: '' });
    } catch (err) {
      setStatus({ type: 'danger', msg: err.response?.data?.error || 'Failed to create customer (Database might be down)' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Register New Customer</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        {status.msg && (
          <div className="mb-4" style={{ padding: '1rem', background: `rgba(var(--${status.type === 'success' ? 'success' : 'danger'}), 0.1)`, color: `var(--${status.type})`, borderRadius: 'var(--radius-md)', border: `1px solid var(--${status.type})` }}>
            {status.msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Phone Number (Optional)</label>
            <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register Customer'}
            </button>
            <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>Note: A default password will be assigned automatically and emailed upon Admin approval.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;

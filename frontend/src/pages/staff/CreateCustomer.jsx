import React, { useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';

const CreateCustomer = () => {
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', phone: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      await api.post('/users/customers', form);
      setAlert({
        type: 'success',
        message: `Customer account for "${form.first_name} ${form.last_name}" created successfully! It is now pending Admin approval. An email with login credentials will be sent once approved.`
      });
      setForm({ username: '', email: '', first_name: '', last_name: '', phone: '' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create customer. Database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Register New Customer</h1>
      <Alert type={alert.type} message={alert.message} />
      
      <div className="card" style={{ maxWidth: '640px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Fill in the customer's details below. A default password will be auto-generated and emailed to them once an Admin approves their account.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Phone Number (Optional)</label>
            <input type="text" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;

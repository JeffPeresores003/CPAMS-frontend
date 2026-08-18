import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Map, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      setSuccess(response.data.message);
      setFormData({ username: '', email: '', first_name: '', last_name: '', phone: '' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#09090b' }}>
      {/* ── Left: Hero Image Panel ──────────────────────────── */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        minHeight: '100vh',
      }}>
        <img
          src="public/img/cross.png"
          alt="Peaceful cemetery landscape"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.45) saturate(0.8)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.3) 50%, rgba(9,9,11,0.1) 100%)',
        }} />

        {/* Branding */}
        <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
          <div style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#10b981' }}>
            <Map size={24} />
          </div>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', textDecoration: 'none' }}>CPAMS</Link>
        </div>

        {/* Quote */}
        <div style={{ position: 'relative', zIndex: 1, padding: '3rem 3rem 4rem' }}>
          <p style={{
            fontSize: '1.75rem', fontWeight: 300, color: '#fff',
            lineHeight: 1.4, maxWidth: '420px',
            fontStyle: 'italic', letterSpacing: '-0.01em',
            marginBottom: '1.25rem',
          }}>
            "Begin your journey with us — secure a resting place for your loved ones."
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Cemetery Plot Availability &amp; Mapping System
          </p>
        </div>
      </div>

      {/* ── Right: Register Form Panel ─────────────────────── */}
      <div style={{
        width: '520px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        backgroundColor: 'rgba(9,9,11,0.97)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Subtle green glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.875rem', fontWeight: 700, color: '#fafafa' }}>Create an account</h2>
            <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.95rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.875rem 1rem',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.875rem 1rem',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.25rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  name="first_name" type="text" required
                  className="form-control"
                  value={formData.first_name} onChange={handleChange}
                  placeholder="John"
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  name="last_name" type="text" required
                  className="form-control"
                  value={formData.last_name} onChange={handleChange}
                  placeholder="Doe"
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                name="username" type="text" required
                className="form-control"
                value={formData.username} onChange={handleChange}
                placeholder="johndoe123"
                style={{ fontSize: '0.95rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email" type="email" required
                className="form-control"
                value={formData.email} onChange={handleChange}
                placeholder="john@example.com"
                style={{ fontSize: '0.95rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone" type="tel"
                className="form-control"
                value={formData.phone} onChange={handleChange}
                placeholder="09123456789"
                style={{ fontSize: '0.95rem' }}
              />
            </div>



            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', letterSpacing: '0.02em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(161,161,170,0.5)', textAlign: 'center' }}>
            Your account will require admin approval before activation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

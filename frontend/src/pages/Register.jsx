import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Compass, ArrowRight, AlertCircle, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
      setSuccess(response.data.message || 'Registration submitted successfully! Please wait for administrator approval.');
      setFormData({ username: '', email: '', first_name: '', last_name: '', phone: '' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)' }}>
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
            filter: 'brightness(0.35) saturate(0.7)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.4) 50%, rgba(7,9,14,0.15) 100%)',
        }} />

        {/* Branding */}
        <Link to="/" style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.85rem', zIndex: 2, textDecoration: 'none' }}>
          <img
            src="/img/CPAMS%20logo.png"
            alt="CPAMS Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.35)',
            }}
          />
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>CPAMS</span>
        </Link>

        {/* Quote */}
        <div style={{ position: 'relative', zIndex: 1, padding: '3.5rem 3.5rem 4.5rem' }}>
          <p style={{
            fontSize: '1.85rem', fontWeight: 300, color: '#fff',
            lineHeight: 1.4, maxWidth: '460px',
            fontStyle: 'italic', letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}>
            "Begin your journey with us — secure a resting place for your loved ones."
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Cemetery Plot Allocation &amp; Management System
          </p>
        </div>
      </div>

      {/* ── Right: Register Form Panel ─────────────────────── */}
      <div style={{
        width: '530px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        backgroundColor: 'rgba(13, 17, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid var(--border-light)',
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.85rem', fontWeight: 800 }}>Create Account</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.9rem 1rem',
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.3)',
              color: '#fda4af',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}>
              <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.9rem 1rem',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}>
              <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.25rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    name="first_name" type="text" required
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    value={formData.first_name} onChange={handleChange}
                    placeholder="First Name"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    name="last_name" type="text" required
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    value={formData.last_name} onChange={handleChange}
                    placeholder="Last Name"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  name="username" type="text" required
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.username} onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  name="email" type="email" required
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.email} onChange={handleChange}
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  name="phone" type="tel"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.phone} onChange={handleChange}
                  placeholder="09123456789"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: '0.75rem', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="#022c22" label="Submitting Registration..." />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: '1.75rem', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
            New customer accounts require administrative approval before reservation access is granted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Eye, EyeOff, Compass, AlertCircle, Lock, User, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
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
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.4) 50%, rgba(7,9,14,0.15) 100%)',
        }} />

        {/* Branding top-left */}
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

        {/* Tagline */}
        <div style={{ position: 'relative', zIndex: 1, padding: '3.5rem 3.5rem 4.5rem' }}>
          <p style={{
            fontSize: '1.85rem', fontWeight: 300, color: '#fff',
            lineHeight: 1.4, maxWidth: '460px',
            fontStyle: 'italic', letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}>
            "Honoring those who have passed with dignity, care, and permanence."
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Cemetery Plot Allocation &amp; Management System
          </p>
        </div>
      </div>

      {/* ── Right: Login Form Panel ─────────────────────────── */}
      <div style={{
        width: '490px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        backgroundColor: 'rgba(13, 17, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid var(--border-light)',
        position: 'relative',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '320px', height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.85rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sign in to manage cemetery reservations and records
            </p>
          </div>

          {/* Error Alert */}
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '4.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.4rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-light)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: '0.75rem', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="#022c22" label="Signing In..." />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

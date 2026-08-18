import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Eye, EyeOff, Map } from 'lucide-react';
import heroImage from '../assets/hero.png';

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
      setError(err.response?.data?.error || 'Failed to login');
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
        {/* Cemetery landscape — serene, respectful */}
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
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.3) 50%, rgba(9,9,11,0.1) 100%)',
        }} />

        {/* Branding top-left */}
        <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
          <div style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#10b981' }}>
            <Map size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>CPAMS</span>
        </div>

        {/* Quote / tagline at bottom */}
        <div style={{ position: 'relative', zIndex: 1, padding: '3rem 3rem 4rem' }}>
          <p style={{
            fontSize: '1.75rem', fontWeight: 300, color: '#fff',
            lineHeight: 1.4, maxWidth: '420px',
            fontStyle: 'italic', letterSpacing: '-0.01em',
            marginBottom: '1.25rem',
          }}>
            "Honoring those who have passed with dignity and care."
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Cemetery Plot Availability &amp; Mapping System
          </p>
        </div>
      </div>

      {/* ── Right: Login Form Panel ─────────────────────────── */}
      <div style={{
        width: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        backgroundColor: 'rgba(9,9,11,0.97)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        {/* Subtle green glow top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.875rem', fontWeight: 700 }}>Welcome back</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to your CPAMS account</p>
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{ fontSize: '0.95rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ fontSize: '0.95rem', paddingRight: '5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', letterSpacing: '0.02em' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(161,161,170,0.5)', textAlign: 'center' }}>
            Authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

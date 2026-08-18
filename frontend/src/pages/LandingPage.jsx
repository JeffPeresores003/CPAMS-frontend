import React from 'react';
import { Link } from 'react-router-dom';
import { Map, CalendarCheck, ShieldCheck, Heart, ArrowRight, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Navigation ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', width: '100%', zIndex: 50,
        backgroundColor: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#10b981' }}>
                <Map size={24} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>CPAMS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a href="#services" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#a1a1aa', textDecoration: 'none' }}>Services</a>
              <a href="#about" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#a1a1aa', textDecoration: 'none' }}>About</a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e4e4e7', textDecoration: 'none' }}>Sign in</Link>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.625rem 1.5rem', fontSize: '0.875rem', fontWeight: 600,
                  backgroundColor: '#10b981', color: '#022c22', borderRadius: '0.5rem',
                  textDecoration: 'none', border: 'none',
                  boxShadow: '0 0 20px rgba(16,185,129,0.25)',
                }}>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section style={{
        position: 'relative', paddingTop: '160px', paddingBottom: '120px',
        minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Background Image */}
        <img
          src="public/img/cross.png"
          alt="Cemetery landscape"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.3) saturate(0.7)',
          }}
        />
        {/* Gradient Overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.6) 50%, rgba(9,9,11,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, transparent 40%)',
        }} />
        {/* Emerald Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '9999px',
              backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              marginBottom: '2rem',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cemetery Plot Allocation & Management
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#fff',
              letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 1.5rem',
            }}>
              Honoring{' '}
              <span style={{ color: '#10b981' }}>Legacies</span>
              <br />with Dignity.
            </h1>

            <p style={{
              fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.7,
              margin: '0 0 2.5rem', maxWidth: '500px', fontWeight: 300,
            }}>
              A deeply respectful and seamless digital experience for securing, managing, and locating resting places for your loved ones.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', fontSize: '1rem', fontWeight: 700,
                backgroundColor: '#10b981', color: '#fff', borderRadius: '0.5rem',
                textDecoration: 'none', border: 'none',
                boxShadow: '0 0 30px rgba(16,185,129,0.3)',
              }}>
                Reserve a Plot <ArrowRight size={18} />
              </Link>
              <a href="#services" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff',
                borderRadius: '0.5rem', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '-3rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 20 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'rgba(24,24,27,0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem',
          overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
        }}>
          {[
            { value: '24/7', label: 'Digital Access' },
            { value: '100%', label: 'Secure Payments' },
            { value: 'Seamless', label: 'Record Keeping' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '2rem', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Section ────────────────────────────────── */}
      <section id="services" style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
        <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1rem' }}>
            Comprehensive Care
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#71717a', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            We handle the administrative complexities so you can focus on what truly matters—remembering and honoring your loved ones.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            {
              icon: CalendarCheck,
              title: 'Plot Reservation',
              desc: 'Browse real-time availability, select the perfect serene location, and secure your reservation entirely online.',
              color: '#10b981',
            },
            {
              icon: ShieldCheck,
              title: 'Secure Billing',
              desc: 'Transparent tracking of down payments and installments with automated records to give you complete peace of mind.',
              color: '#14b8a6',
            },
            {
              icon: Heart,
              title: 'Deceased Profiling',
              desc: 'Maintain dignified, accurate historical records for your loved ones, preserving your family\'s history for generations.',
              color: '#10b981',
            },
          ].map((service, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem',
              padding: '2.5rem', transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${service.color}40`;
              e.currentTarget.style.boxShadow = `0 0 30px ${service.color}10`;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '0.75rem',
                backgroundColor: `${service.color}15`, border: `1px solid ${service.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <service.icon size={24} style={{ color: service.color }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#71717a', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                {service.desc}
              </p>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                fontSize: '0.875rem', fontWeight: 600, color: service.color, textDecoration: 'none',
              }}>
                Learn more <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── About / Legacy Section ──────────────────────────── */}
      <section id="about" style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 8rem',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center',
          backgroundColor: 'rgba(24,24,27,0.4)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1.5rem', padding: '4rem', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1.25rem' }}>
              A Place of Peace
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#71717a', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
              CPAMS was created with the belief that the process of securing a resting place for a loved one should be handled with the utmost respect, transparency, and ease.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#71717a', lineHeight: 1.8, margin: 0 }}>
              Our system streamlines plot allocation, payment tracking, and record-keeping—so families can focus on remembrance, not paperwork.
            </p>
          </div>
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="public/img/cross.png"
              alt="Peaceful cemetery"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'brightness(0.5) saturate(0.8)',
                borderRadius: '1rem',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }} />
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(to bottom, rgba(9,9,11,1) 0%, rgba(5,46,22,0.15) 100%)',
        padding: '6rem 2rem',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: '1rem',
            display: 'inline-flex', marginBottom: '2rem',
          }}>
            <Map size={28} style={{ color: '#10b981' }} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1rem' }}>
            Begin the Process Today
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#71717a', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
            Create an account to view cemetery map availability, compare plots, and secure a reservation for your family.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 700,
            backgroundColor: '#10b981', color: '#fff', borderRadius: '0.5rem',
            textDecoration: 'none', border: 'none',
            boxShadow: '0 0 30px rgba(16,185,129,0.3)',
          }}>
            Create an Account
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: 'rgba(5,5,5,1)', padding: '2rem', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{ fontSize: '0.8rem', color: '#3f3f46', margin: 0 }}>
          © {new Date().getFullYear()} CPAMS. All rights reserved. Honoring legacies with dignity.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

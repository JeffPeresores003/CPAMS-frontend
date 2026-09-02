import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  CalendarCheck, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  ChevronRight, 
  Mail, 
  Phone, 
  Clock, 
  UserCheck, 
  Compass, 
  Sparkles,
  CheckCircle2,
  Building2,
  Send
} from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal';

const LandingPage = () => {
  const [inquiryModal, setInquiryModal] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquiryModal(false);
    setInquirySent(true);
    setInquiryForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', overflowX: 'hidden' }}>
      
      {/* ── Navigation ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        backgroundColor: 'rgba(7, 9, 14, 0.85)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '84px' }}>
            
            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
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
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', display: 'block', lineHeight: 1.1 }}>
                  CPAMS
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Cemetery Management
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <a href="#services" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Services</a>
              <a href="#about" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>About</a>
              <a href="#contact-administrator" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Contact Administrator</a>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '2rem', borderLeft: '1px solid var(--border-light)' }}>
                <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section style={{
        position: 'relative', paddingTop: '170px', paddingBottom: '130px',
        minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Background Image */}
        <img
          src="public/img/cross.png"
          alt="Cemetery landscape"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.3) saturate(0.65)',
          }}
        />
        {/* Modern 2026 Gradient Mesh */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(7,9,14,0.98) 0%, rgba(7,9,14,0.85) 45%, rgba(7,9,14,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(7,9,14,1) 0%, transparent 50%)',
        }} />
        {/* Radial Glows */}
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: '550px', height: '550px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '10%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            
            {/* Badge pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.45rem 1.1rem', borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              marginBottom: '2rem', boxShadow: '0 0 20px rgba(16,185,129,0.15)',
            }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cemetery Plot Allocation &amp; Management System
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)', fontWeight: 800, color: '#fff',
              letterSpacing: '-0.045em', lineHeight: 1.1, margin: '0 0 1.5rem',
            }}>
              Honoring Legacies <br />
              <span style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                With Absolute Dignity.
              </span>
            </h1>

            <p style={{
              fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7,
              margin: '0 0 2.75rem', maxWidth: '540px', fontWeight: 400,
            }}>
              A state-of-the-art digital platform for reserving plots, recording loved ones' history, managing cemetery billing, and honoring memorial legacies.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" className="btn btn-primary" style={{
                padding: '0.95rem 2.25rem', fontSize: '1rem',
                boxShadow: '0 0 35px rgba(16,185,129,0.35)',
              }}>
                Reserve a Plot <ArrowRight size={18} />
              </Link>
              <a href="#contact-administrator" className="btn btn-secondary" style={{ padding: '0.95rem 1.85rem', fontSize: '1rem' }}>
                <UserCheck size={18} style={{ color: 'var(--primary)' }} /> Contact Administrator
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '-3.5rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 20 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)',
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}>
          {[
            { value: '24/7 Digital Access', label: 'Online Reservation & Availability Mapping' },
            { value: '100% Transparent', label: 'Down Payment & Installment Tracking' },
            { value: 'Enduring Legacy', label: 'Deceased Profiles & Burial Records' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '2.25rem 2rem', textAlign: 'center',
              borderRight: i < 2 ? '1px solid var(--border-light)' : 'none',
            }}>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.4rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Section ────────────────────────────────── */}
      <section id="services" style={{ maxWidth: '1280px', margin: '0 auto', padding: '8rem 2rem 5rem' }}>
        <div style={{ marginBottom: '4rem', maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} /> Comprehensive Cemetery Services
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1rem' }}>
            Thoughtful Administrative Care
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            We handle the organizational requirements and record-keeping so your family can focus on what truly matters.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
          {[
            {
              icon: CalendarCheck,
              title: 'Plot Allocation & Reservation',
              desc: 'Select available sections and blocks in real-time, register complete deceased loved one details, and submit reservation requests online.',
              color: '#10b981',
            },
            {
              icon: ShieldCheck,
              title: 'Transparent Billing & Payments',
              desc: 'Track down payments, installments, and official receipts with automated balance calculations and full audit tracking.',
              color: '#06b6d4',
            },
            {
              icon: HeartHandshake,
              title: 'Loved One Records & Legacy',
              desc: 'Preserve complete biographical records, dates of birth, death, and interment for permanent historical and family reference.',
              color: '#10b981',
            },
          ].map((service, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
                  backgroundColor: `${service.color}15`, border: `1px solid ${service.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.75rem',
                  boxShadow: `0 0 20px ${service.color}15`,
                }}>
                  <service.icon size={26} style={{ color: service.color }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.85rem' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                  {service.desc}
                </p>
              </div>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.875rem', fontWeight: 700, color: service.color, textDecoration: 'none',
              }}>
                Get Started <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Administrator: Jeffrey Peresores ────────── */}
      <section id="contact-administrator" style={{
        maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 7rem',
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem',
          boxShadow: 'var(--shadow-lg), 0 0 40px rgba(16, 185, 129, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left: Info */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                color: 'var(--primary-light)', fontSize: '0.78rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem',
              }}>
                <UserCheck size={14} /> Direct Administrator Contact
              </div>

              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>
                Jeffrey Peresores
              </h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
                Cemetery Administrator &amp; Systems Director
              </div>

              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
                For personalized plot reservations, estate planning inquiries, interment scheduling, or institutional assistance, you may reach out directly to Administrator Jeffrey Peresores.
              </p>

              {/* Direct Info List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                  href="mailto:jeffrey.peresores@bisu.edu.ph"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-light)',
                    color: 'var(--text-main)', textDecoration: 'none', transition: 'var(--transition)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Official Email</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>jeffrey.peresores@bisu.edu.ph</div>
                  </div>
                </a>

                <a
                  href="tel:09292275743"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-light)',
                    color: 'var(--text-main)', textDecoration: 'none', transition: 'var(--transition)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Direct Phone / Mobile</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>09292275743</div>
                  </div>
                </a>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-light)',
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Office Hours</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Monday – Saturday: 8:00 AM – 5:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Card */}
            <div style={{
              backgroundColor: 'rgba(7, 9, 14, 0.85)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', color: 'var(--primary)',
              }}>
                <Building2 size={32} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                Need Assistance?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Send a direct inquiry regarding plot locations, payment arrangements, or documentation.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
                onClick={() => setInquiryModal(true)}
              >
                <Send size={16} /> Send Direct Message to Jeffrey
              </button>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                <MapPin size={14} /> Main Cemetery Administration Building
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: '#040609', padding: '3rem 2rem', textAlign: 'center',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            <img
              src="/img/CPAMS%20logo.png"
              alt="CPAMS Logo"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid rgba(16,185,129,0.4)',
              }}
            />
            <span>&copy; {new Date().getFullYear()} CPAMS. Managed by Jeffrey Peresores. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
            <a href="#services" style={{ color: 'var(--text-dim)' }}>Services</a>
            <a href="#about" style={{ color: 'var(--text-dim)' }}>About</a>
            <a href="#contact-administrator" style={{ color: 'var(--text-dim)' }}>Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Inquiry Modal ───────────────────────────────────── */}
      {inquiryModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.25rem', backgroundColor: 'rgba(7, 9, 14, 0.85)',
            backdropFilter: 'blur(12px)', animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setInquiryModal(false)}
        >
          <div
            className="card"
            style={{
              width: '100%', maxWidth: '480px', padding: '2rem',
              borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.25s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: 'var(--primary)' }} /> Contact Jeffrey Peresores
              </h3>
              <button
                onClick={() => setInquiryModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleInquirySubmit}>
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Enter your name"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Email or Phone</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="name@example.com or 09xxxxxxxxx"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message / Inquiry Details</label>
                <textarea
                  required
                  rows={3}
                  className="form-control"
                  placeholder="Specify plot inquiries, schedule questions, etc."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setInquiryModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Feedback Modal ──────────────────────────── */}
      <FeedbackModal
        isOpen={inquirySent}
        onClose={() => setInquirySent(false)}
        type="success"
        title="Message Sent"
        message="Thank you! Administrator Jeffrey Peresores has received your inquiry and will get back to you shortly."
        confirmText="Done"
      />
    </div>
  );
};

export default LandingPage;

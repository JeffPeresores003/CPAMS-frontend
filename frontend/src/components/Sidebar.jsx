import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  CalendarClock, 
  CreditCard, 
  UserMinus, 
  UserPlus,
  LogOut, 
  FileText, 
  Settings,
  Heart,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#022c22' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    boxShadow: isActive ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
  });

  return (
    <aside style={{
      width: '270px',
      height: '100vh',
      backgroundColor: 'rgba(7, 9, 14, 0.9)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand & User Info */}
      <div style={{
        padding: '1.75rem 1.5rem',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <img
            src="/img/CPAMS%20logo.png"
            alt="CPAMS Logo"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)',
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1 }}>
              CPAMS
            </h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Cemetery System
            </span>
          </div>
        </div>

        {/* User Pill */}
        <div style={{
          padding: '0.75rem 0.9rem',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
              {user?.username}
            </div>
          </div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: user?.role === 'Admin' ? 'rgba(244,63,94,0.15)' : user?.role === 'Staff' ? 'rgba(6,182,212,0.15)' : 'rgba(16,185,129,0.15)',
            color: user?.role === 'Admin' ? '#fda4af' : user?.role === 'Staff' ? 'var(--accent-cyan)' : 'var(--primary-light)',
            border: `1px solid ${user?.role === 'Admin' ? 'rgba(244,63,94,0.3)' : user?.role === 'Staff' ? 'rgba(6,182,212,0.3)' : 'rgba(16,185,129,0.3)'}`,
          }}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <NavLink to="/dashboard" style={({ isActive }) => navItemStyle(isActive)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </div>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
        </NavLink>

        {user?.role === 'Admin' && (
          <>
            <div style={{ marginTop: '1.25rem', marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.75rem', letterSpacing: '0.08em' }}>
              Administration
            </div>
            <NavLink to="/users" end style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} /> <span>User Management</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/users/pending" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldAlert size={18} /> <span>Pending Approvals</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/cemetery" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Settings size={18} /> <span>Cemetery Setup</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/reports" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={18} /> <span>Reports &amp; Analytics</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
          </>
        )}

        {user?.role === 'Staff' && (
          <>
            <div style={{ marginTop: '1.25rem', marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.75rem', letterSpacing: '0.08em' }}>
              Operations
            </div>
            <NavLink to="/customers/new" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserPlus size={18} /> <span>Walk-In Profiling</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/billing" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={18} /> <span>Billing System</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/reservations" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarClock size={18} /> <span>Reservations</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/payments" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CreditCard size={18} /> <span>Payments</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/deceased" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart size={18} /> <span>Deceased Records</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
          </>
        )}

        {user?.role === 'Customer' && (
          <>
            <div style={{ marginTop: '1.25rem', marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.75rem', letterSpacing: '0.08em' }}>
              My Account
            </div>
            <NavLink to="/my/reservations" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarClock size={18} /> <span>My Reservations</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/my/payments" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CreditCard size={18} /> <span>My Payments</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
            <NavLink to="/my/deceased" style={({ isActive }) => navItemStyle(isActive)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart size={18} /> <span>My Loved Ones</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
          </>
        )}

        <div style={{ marginTop: '1.25rem', marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.75rem', letterSpacing: '0.08em' }}>
          Preferences
        </div>
        <NavLink to="/settings" style={({ isActive }) => navItemStyle(isActive)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Settings size={18} /> <span>Profile &amp; Settings</span>
          </div>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
        </NavLink>
      </nav>

      {/* Logout button */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(244,63,94,0.06)',
            color: '#fda4af',
            border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'var(--danger)';
            e.currentTarget.style.borderColor = 'var(--danger)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#fda4af';
            e.currentTarget.style.background = 'rgba(244,63,94,0.06)';
            e.currentTarget.style.borderColor = 'rgba(244,63,94,0.2)';
          }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

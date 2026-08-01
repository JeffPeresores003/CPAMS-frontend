import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Map as MapIcon, 
  CalendarClock, CreditCard, UserMinus, UserPlus,
  LogOut, FileText, Settings 
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
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? '#fff' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
  });

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'rgba(9, 9, 11, 0.8)', /* Zinc 950 with transparency for glass */
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.05em' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary-glow)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <MapIcon size={24} />
          </div>
          CPAMS
        </h2>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {user?.first_name} {user?.last_name}
          <br/>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', fontWeight: 600 }}>{user?.role}</span>
        </p>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" style={({ isActive }) => navItemStyle(isActive)}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        {user?.role === 'Admin' && (
          <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '1rem' }}>Admin</div>
            <NavLink to="/users" style={({ isActive }) => navItemStyle(isActive)}>
              <Users size={20} /> User Management
            </NavLink>
            <NavLink to="/users/pending" style={({ isActive }) => navItemStyle(isActive)}>
              <UserMinus size={20} /> Pending Customers
            </NavLink>
            <NavLink to="/reports" style={({ isActive }) => navItemStyle(isActive)}>
              <FileText size={20} /> Reports
            </NavLink>
          </>
        )}

        {(user?.role === 'Admin' || user?.role === 'Staff') && (
          <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '1rem' }}>Operations</div>
            <NavLink to="/customers/new" style={({ isActive }) => navItemStyle(isActive)}>
              <UserPlus size={20} /> Walk-in / Profiling
            </NavLink>
            <NavLink to="/reservations" style={({ isActive }) => navItemStyle(isActive)}>
              <CalendarClock size={20} /> Reservations
            </NavLink>
            <NavLink to="/payments" style={({ isActive }) => navItemStyle(isActive)}>
              <CreditCard size={20} /> Payments
            </NavLink>
            <NavLink to="/deceased" style={({ isActive }) => navItemStyle(isActive)}>
              <UserMinus size={20} /> Deceased Records
            </NavLink>
            <NavLink to="/cemetery" style={({ isActive }) => navItemStyle(isActive)}>
              <Settings size={20} /> Cemetery Setup
            </NavLink>
          </>
        )}

        {user?.role === 'Customer' && (
          <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '1rem' }}>My Account</div>
            <NavLink to="/my/reservations" style={({ isActive }) => navItemStyle(isActive)}>
              <CalendarClock size={20} /> My Reservations
            </NavLink>
            <NavLink to="/my/payments" style={({ isActive }) => navItemStyle(isActive)}>
              <CreditCard size={20} /> My Payments
            </NavLink>
            <NavLink to="/my/deceased" style={({ isActive }) => navItemStyle(isActive)}>
              <UserMinus size={20} /> My Loved Ones
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

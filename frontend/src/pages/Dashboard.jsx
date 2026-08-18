import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { NavLink } from 'react-router-dom';
import { Users, CheckCircle, Clock, MapPin, CalendarClock, CreditCard, Heart, AlertTriangle, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ 
      width: '48px', height: '48px', borderRadius: '50%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(${color}, 0.2)`, color: `rgb(${color})`
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{value}</h3>
      <div className="form-label" style={{ margin: 0 }}>{title}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ available: 0, reserved: 0, occupied: 0, total: 0 });
  const [revenue, setRevenue] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  // Customer-specific state
  const [myReservations, setMyReservations] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [myDeceased, setMyDeceased] = useState([]);
  const [custLoading, setCustLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin' || user?.role === 'Staff') {
      const fetchStats = async () => {
        try {
          const [occRes, revRes] = await Promise.all([
            api.get('/reports/occupancy'),
            api.get('/reports/revenue/monthly')
          ]);
          const byStatus = occRes.data.by_status || [];
          let av = 0, resv = 0, occ = 0;
          byStatus.forEach(s => {
            if (s.status === 'Available') av = s.count;
            if (s.status === 'Reserved') resv = s.count;
            if (s.status === 'Occupied') occ = s.count;
          });
          setStats({ available: av, reserved: resv, occupied: occ, total: av + resv + occ });
          setOccupancyData(byStatus);
          setRevenue(revRes.data || []);
        } catch (e) {
          console.error("Failed to load stats", e);
        }
      };
      fetchStats();
    }

    if (user?.role === 'Customer') {
      setCustLoading(true);
      Promise.all([
        api.get('/reservations/my', { params: { customer_id: user.user_id } }),
        api.get('/payments/my'),
        api.get('/deceased/my'),
      ]).then(([resRes, payRes, decRes]) => {
        setMyReservations(resRes.data || []);
        setMyPayments(payRes.data || []);
        setMyDeceased(decRes.data || []);
      }).catch(console.error).finally(() => setCustLoading(false));
    }
  }, [user]);

  return (
    <div>
      {/* ── Dashboard Hero Banner ── */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Background Image */}
        <img 
          src="public/img/cross.png" 
          alt="Peaceful nature landscape"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5) saturate(0.9)',
          }}
        />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.4) 50%, transparent 100%)',
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.first_name}!
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.5 }}>
            {user?.role === 'Customer' 
              ? 'Manage your plot reservations, view payment history, and keep track of records for your loved ones.' 
              : 'Here is what is happening at the cemetery today. View recent activities, occupancy stats, and revenue.'}
          </p>
        </div>
      </div>

      {(user?.role === 'Admin' || user?.role === 'Staff') ? (
        <>
          <div className="grid grid-cols-4 mb-4">
            <StatCard title="Total Plots" value={stats.total} icon={<MapPin size={24} />} color="56, 189, 248" />
            <StatCard title="Available Plots" value={stats.available} icon={<CheckCircle size={24} />} color="34, 197, 94" />
            <StatCard title="Total Reservations" value={stats.reserved + stats.occupied} icon={<Clock size={24} />} color="234, 179, 8" />
            <StatCard title="Fully Paid (Occupied)" value={stats.occupied} icon={<Users size={24} />} color="239, 68, 68" />
          </div>

          <div className="grid grid-cols-2 mb-4">
            <div className="card">
              <h3 className="mb-4">Plot Occupancy</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={occupancyData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                    {occupancyData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => `₱${Number(v).toLocaleString()}`} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                  <Bar dataKey="total_revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        /* CUSTOMER DASHBOARD */
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-3 mb-4">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.15)', color: 'var(--primary)' }}>
                <CalendarClock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{myReservations.length}</h3>
                <div className="form-label" style={{ margin: 0 }}>My Reservations</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                <CreditCard size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{myPayments.length}</h3>
                <div className="form-label" style={{ margin: 0 }}>Total Payments</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                <Heart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{myDeceased.length}</h3>
                <div className="form-label" style={{ margin: 0 }}>Loved Ones</div>
              </div>
            </div>
          </div>

          {/* Pending balance alert */}
          {myReservations.some(r => r.balance_status !== 'Fully Paid') && (
            <div className="card mb-4" style={{ border: '1px solid rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertTriangle size={24} style={{ color: '#eab308', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#eab308' }}>You have a pending balance.</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Please visit the cemetery office to settle your remaining balance. You cannot avail another plot until fully paid.
                  </p>
                </div>
                <NavLink to="/my/reservations" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }} className="btn btn-secondary">
                  View Details <ChevronRight size={16} />
                </NavLink>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 mb-4">
            {/* Recent Reservations */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>My Reservations</h3>
                <NavLink to="/my/reservations" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View all <ChevronRight size={14} />
                </NavLink>
              </div>
              {custLoading ? (
                <p className="text-muted">Loading...</p>
              ) : myReservations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <CalendarClock size={32} style={{ marginBottom: '0.5rem' }} />
                  <p>No reservations yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myReservations.slice(0, 3).map(r => (
                    <div key={r.reservation_id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.plot_number || `Plot #${r.plot_id}`}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Reserved {new Date(r.reservation_date).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                        background: r.balance_status === 'Fully Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                        color: r.balance_status === 'Fully Paid' ? '#22c55e' : '#eab308'
                      }}>
                        {r.balance_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Payments */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Recent Payments</h3>
                <NavLink to="/my/payments" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View all <ChevronRight size={14} />
                </NavLink>
              </div>
              {custLoading ? (
                <p className="text-muted">Loading...</p>
              ) : myPayments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <CreditCard size={32} style={{ marginBottom: '0.5rem' }} />
                  <p>No payment records yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myPayments.slice(0, 3).map(p => (
                    <div key={p.payment_id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--background-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.payment_type}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.or_number} · {new Date(p.payment_date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ₱{parseFloat(p.amount_paid).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loved ones */}
          {myDeceased.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>My Loved Ones</h3>
                <NavLink to="/my/deceased" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View all <ChevronRight size={14} />
                </NavLink>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {myDeceased.slice(0, 4).map(d => (
                  <div key={d.deceased_id} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--background-alt)', borderLeft: '3px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Heart size={14} style={{ color: '#ef4444' }} />
                      <strong style={{ fontSize: '0.9rem' }}>{d.deceased_name}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plot: {d.plot_number || '—'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {d.date_of_death ? `Passed: ${new Date(d.date_of_death).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

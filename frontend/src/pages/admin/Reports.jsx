import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart2, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import Alert from '../../components/ui/Alert';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const Reports = () => {
  const [occupancy, setOccupancy] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [occRes, revRes] = await Promise.all([
          api.get('/reports/occupancy'),
          api.get('/reports/revenue/monthly'),
        ]);
        setOccupancy(occRes.data.by_status || []);
        setRevenue(revRes.data || []);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load reports — database may be offline.' });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const total = occupancy.reduce((s, r) => s + Number(r.count || 0), 0);

  return (
    <div>
      <h1 className="mb-4">Reports & Analytics</h1>
      <Alert type={alert.type} message={alert.message} />

      <div className="grid grid-cols-3 mb-4">
        {loading
          ? [1, 2, 3].map(i => <StatCardSkeleton key={i} />)
          : occupancy.map((s, i) => (
            <div key={s.status} className="card flex items-center gap-4">
              <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${COLORS[i]}33`, color: COLORS[i] }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{Number(s.count).toLocaleString()}</h3>
                <div className="form-label" style={{ margin: 0 }}>{s.status}</div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="card mb-4">
        <h3 className="mb-4">Plot Occupancy Breakdown</h3>
        {loading ? (
          <div className="skeleton" style={{ height: '200px', borderRadius: '0.5rem' }} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={occupancy} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f8fafc' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {occupancy.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3 className="mb-4">Monthly Revenue</h3>
        {loading ? (
          <div className="skeleton" style={{ height: '220px', borderRadius: '0.5rem' }} />
        ) : revenue.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No revenue data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `₱${Number(v).toLocaleString()}`} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f8fafc' }} />
              <Bar dataKey="total_revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Reports;

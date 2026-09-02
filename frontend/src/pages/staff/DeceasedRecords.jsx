import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Heart, Search, MapPin, User, Calendar } from 'lucide-react';

const DeceasedRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const decRes = await api.get('/deceased');
      setRecords(decRes.data || []);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load deceased records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRecords = records.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.deceased_name && r.deceased_name.toLowerCase().includes(q)) ||
      (r.full_name && r.full_name.toLowerCase().includes(q)) ||
      (r.plot_number && r.plot_number.toLowerCase().includes(q)) ||
      (r.customer_name && r.customer_name.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Deceased Records</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Registry of all deceased loved ones interred or reserved across cemetery plots.
          </p>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by deceased name, plot #, family/customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <LoadingSpinner size="lg" label="Loading deceased records..." />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center' }}>
            <EmptyState message={search ? "No records match your search" : "No deceased records registered yet"} icon={Heart} />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Deceased Name</th>
                <th>Plot Location</th>
                <th>Family / Registered By</th>
                <th>Date of Birth</th>
                <th>Date of Death</th>
                <th>Date of Burial</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => (
                <tr key={r.deceased_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <Heart size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
                      <span>{r.deceased_name || r.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>Plot {r.plot_number || r.plot_id}</div>
                    {r.location && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.location}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.customer_name || `Customer #${r.customer_id}`}</div>
                  </td>
                  <td>{r.date_of_birth ? new Date(r.date_of_birth).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                  <td>{r.date_of_death ? new Date(r.date_of_death).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                  <td>{r.date_of_burial ? new Date(r.date_of_burial).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeceasedRecords;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { CalendarClock, MapPin, CreditCard, AlertTriangle, Plus, Heart, Calendar } from 'lucide-react';

const MyReservations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [alert, setAlert]               = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/reservations/my', { params: { customer_id: user?.user_id } });
        setReservations(res.data);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load your reservations.' });
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>My Reservations</h1>
        <button
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => navigate('/my/reservations/add')}
        >
          <Plus size={18} /> Add Reservation
        </button>
      </div>
      <Alert type={alert.type} message={alert.message} />

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-3 mb-4">
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.15)', color: 'var(--primary)' }}>
              <CalendarClock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{reservations.length}</h3>
              <div className="form-label" style={{ margin: 0 }}>Total Reservations</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Paid &amp; Pending</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
                {reservations.filter(r => r.balance_status === 'Fully Paid').length}
              </h3>
              <div className="form-label" style={{ margin: 0 }}>Fully Paid</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
                {reservations.filter(r => r.balance_status !== 'Fully Paid').length}
              </h3>
              <div className="form-label" style={{ margin: 0 }}>With Balance</div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Cards */}
      {loading ? (
        <div className="table-container">
          <table><tbody>{Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}</tbody></table>
        </div>
      ) : reservations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CalendarClock size={56} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Reservations Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Ready to reserve a plot? Click the button below to get started.
          </p>
          <button
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => navigate('/my/reservations/add')}
          >
            <Plus size={16} /> Add Reservation
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservations.map(r => {
            const isPaid = r.balance_status === 'Fully Paid';
            return (
              <div key={r.reservation_id} className="card" style={{
                border: `1px solid ${isPaid ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
                background: isPaid ? 'rgba(34,197,94,0.05)' : 'rgba(234,179,8,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>

                  {/* ── Left: Reservation Info ── */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0 }}>Reservation #{r.reservation_id}</h3>
                      <StatusBadge value={r.reservation_status} />
                      <StatusBadge value={r.balance_status} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem 2rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plot</span>
                        <p style={{ margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} /> {r.plot_number || `Plot #${r.plot_id}`}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reserved On</span>
                        <p style={{ margin: 0 }}>{fmtDate(r.reservation_date)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intended Interment</span>
                        <p style={{ margin: 0 }}>{fmtDate(r.intended_use_date)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Price</span>
                        <p style={{ margin: 0, fontWeight: 600 }}>₱{parseFloat(r.total_price).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* ── Deceased Info Strip ── */}
                    {r.deceased_name && (
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                        padding: '0.65rem 0.9rem',
                        background: 'rgba(244,63,94,0.07)',
                        border: '1px solid rgba(244,63,94,0.18)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <Heart size={15} style={{ color: '#f43f5e', marginTop: '0.1rem', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
                            Deceased Loved One
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {r.deceased_name}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', marginTop: '0.25rem' }}>
                            {r.deceased_date_of_death && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} /> Died: {fmtDate(r.deceased_date_of_death)}
                              </span>
                            )}
                            {r.deceased_date_of_birth && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} /> Born: {fmtDate(r.deceased_date_of_birth)}
                              </span>
                            )}
                            {r.deceased_date_of_burial && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} /> Burial: {fmtDate(r.deceased_date_of_burial)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Balance Box ── */}
                  <div style={{
                    padding: '1.25rem 1.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: 160,
                    background: isPaid ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                    border: `1px solid ${isPaid ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`,
                    alignSelf: 'flex-start',
                  }}>
                    <CreditCard size={20} style={{ color: isPaid ? '#22c55e' : '#eab308', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {isPaid ? 'Fully Settled' : 'Pending Balance'}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isPaid ? 'var(--primary)' : '#eab308' }}>
                      {isPaid ? 'Paid in Full' : `₱${parseFloat(r.total_price).toLocaleString()}`}
                    </div>
                    {!isPaid && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Please visit the office to settle.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations;

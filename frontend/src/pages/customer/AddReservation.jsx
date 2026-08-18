import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { MapPin, ArrowLeft, CheckCircle, Search, Filter } from 'lucide-react';

const AddReservation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plots, setPlots] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // Selected plot & form state
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [intendedUseDate, setIntendedUseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setLoading(true);
        const res = await api.get('/plots', { params: { status: 'Available' } });
        const availablePlots = (res.data || []).filter(p => p.status === 'Available');
        setPlots(availablePlots);
        setFiltered(availablePlots);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load available plots.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPlots();
  }, []);

  useEffect(() => {
    let result = plots;
    if (typeFilter !== 'All') result = result.filter(p => p.plot_type === typeFilter);
    if (search.trim()) result = result.filter(p => p.plot_number.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, typeFilter, plots]);

  const handleSubmit = async () => {
    setConfirmModal(false);
    setSubmitting(true);
    try {
      await api.post('/reservations', {
        plot_id: selectedPlot.plot_id,
        intended_use_date: intendedUseDate || undefined,
        notes: notes || undefined,
      });
      setAlert({ type: 'success', message: `Reservation for Plot ${selectedPlot.plot_number} submitted! A staff member will review and issue billing shortly.` });
      setTimeout(() => navigate('/my/reservations'), 2500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to submit reservation.' });
      setSubmitting(false);
    }
  };

  const plotTypeColor = (type) => type === 'Private' ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.2)';
  const plotTypeBorder = (type) => type === 'Private' ? 'rgba(139,92,246,0.5)' : 'rgba(59,130,246,0.5)';
  const plotTypeText = (type) => type === 'Private' ? '#a78bfa' : '#60a5fa';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.5rem', lineHeight: 1 }}
          onClick={() => navigate('/my/reservations')}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Add Reservation</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Select an available plot to submit a reservation request.
          </p>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Two-panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Plot List */}
        <div>
          {/* Filters */}
          <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search plot number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              {['All', 'Private', 'Public'].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                    border: `1px solid ${typeFilter === t ? 'var(--primary)' : 'var(--border-light)'}`,
                    background: typeFilter === t ? 'var(--primary)' : 'transparent',
                    color: typeFilter === t ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Plot Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading available plots...</div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <MapPin size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3>No Available Plots</h3>
              <p style={{ color: 'var(--text-muted)' }}>No plots match your search. Try adjusting the filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {filtered.map(p => {
                const isSelected = selectedPlot?.plot_id === p.plot_id;
                return (
                  <button
                    key={p.plot_id}
                    onClick={() => setSelectedPlot(isSelected ? null : p)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : plotTypeBorder(p.plot_type)}`,
                      background: isSelected ? 'rgba(59,130,246,0.15)' : plotTypeColor(p.plot_type),
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <CheckCircle
                        size={18}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--primary)' }}
                      />
                    )}
                    <div style={{ fontSize: '0.7rem', color: plotTypeText(p.plot_type), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      {p.plot_type}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {p.plot_number}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600 }}>
                      ₱{parseFloat(p.price).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Reservation Form */}
        <div className="card" style={{ position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} style={{ color: 'var(--primary)' }} />
            Reservation Details
          </h3>

          {selectedPlot ? (
            <>
              {/* Selected Plot Info */}
              <div style={{
                padding: '1rem', borderRadius: 'var(--radius-md)',
                background: plotTypeColor(selectedPlot.plot_type),
                border: `1px solid ${plotTypeBorder(selectedPlot.plot_type)}`,
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.75rem', color: plotTypeText(selectedPlot.plot_type), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedPlot.plot_type} Plot
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  {selectedPlot.plot_number}
                </div>
                <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '1rem' }}>
                  ₱{parseFloat(selectedPlot.price).toLocaleString()}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Intended Interment Date <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={intendedUseDate}
                  onChange={e => setIntendedUseDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes / Remarks <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Any special instructions or details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#eab308', lineHeight: '1.5' }}>
                ⚠️ Submitting a reservation does not guarantee immediate approval. A staff member will review and issue billing for your reservation.
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setConfirmModal(true)}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Reservation Request'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <MapPin size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Select a plot from the list to begin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Reservation Request"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setConfirmModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Yes, Submit</button>
          </>
        }
      >
        <p>You are about to request a reservation for:</p>
        {selectedPlot && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.1)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
            <strong>{selectedPlot.plot_number}</strong> — {selectedPlot.plot_type} Plot<br />
            <span style={{ color: '#22c55e', fontWeight: 600 }}>₱{parseFloat(selectedPlot?.price || 0).toLocaleString()}</span>
          </div>
        )}
        <p style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          The reservation will be marked as <strong>Pending</strong> until a staff member reviews and issues billing.
        </p>
      </Modal>
    </div>
  );
};

export default AddReservation;

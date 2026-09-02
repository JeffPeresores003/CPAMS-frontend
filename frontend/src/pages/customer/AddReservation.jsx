import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import {
  MapPin, ArrowLeft, CheckCircle, Search, Filter,
  Heart, User, Calendar, AlertTriangle,
  XCircle, CreditCard, ClipboardList, ChevronRight,
} from 'lucide-react';

const AddReservation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ── Plots ─────────────────────────────────────────── */
  const [plots, setPlots]           = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [alert, setAlert]           = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [unpaidBlock, setUnpaidBlock] = useState(null);

  /* ── Selection ──────────────────────────────────────── */
  const [selectedPlot, setSelectedPlot] = useState(null);

  /* ── Deceased Modal ─────────────────────────────────── */
  const [deceasedModal, setDeceasedModal] = useState(false);
  const [deceasedFullName, setDeceasedFullName]         = useState('');
  const [deceasedDateOfBirth, setDeceasedDateOfBirth]   = useState('');
  const [deceasedDateOfDeath, setDeceasedDateOfDeath]   = useState('');
  const [deceasedDateOfBurial, setDeceasedDateOfBurial] = useState('');
  const [deceasedNotes, setDeceasedNotes]               = useState('');

  /* ── Reservation Details + Confirm Modal ─────────────── */
  const [intendedUseDate, setIntendedUseDate] = useState('');
  const [notes, setNotes]                     = useState('');
  const [confirmModal, setConfirmModal]       = useState(false);

  /* ── Track whether deceased info was filled ─────────── */
  const deceasedFilled = deceasedFullName.trim() && deceasedDateOfDeath;

  /* ── Load plots + check unpaid balance ───────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const myRes = await api.get('/reservations/my');
        const accepted = (myRes.data || []).filter(
          r => r.reservation_status === 'Accepted' && r.balance_status === 'Pending Balance'
        );
        if (accepted.length > 0) {
          setUnpaidBlock({ reservation_id: accepted[0].reservation_id, plot_number: accepted[0].plot_number });
          return;
        }
        const res = await api.get('/plots', { params: { status: 'Available' } });
        const availablePlots = (res.data || []).filter(p => p.status === 'Available');
        setPlots(availablePlots);
        setFiltered(availablePlots);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ── Filter plots ────────────────────────────────────── */
  useEffect(() => {
    let result = plots;
    if (typeFilter !== 'All') result = result.filter(p => p.plot_type === typeFilter);
    if (search.trim()) result = result.filter(p =>
      p.plot_number.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, typeFilter, plots]);

  /* ── Select / deselect plot ─────────────────────────── */
  const handleSelectPlot = (plot) => {
    const isSame = selectedPlot?.plot_id === plot.plot_id;
    setSelectedPlot(isSame ? null : plot);
    if (isSame) {
      // reset all fields when deselecting
      setDeceasedFullName(''); setDeceasedDateOfBirth('');
      setDeceasedDateOfDeath(''); setDeceasedDateOfBurial('');
      setDeceasedNotes(''); setIntendedUseDate(''); setNotes('');
    }
  };

  /* ── Open deceased modal (when plot selected) ────────── */
  const openDeceasedModal = () => setDeceasedModal(true);

  /* ── Save deceased info from modal ───────────────────── */
  const handleDeceasedSave = (e) => {
    e.preventDefault();
    if (!deceasedFullName.trim()) return;
    if (!deceasedDateOfDeath) return;
    setDeceasedModal(false);
  };

  /* ── Submit reservation ──────────────────────────────── */
  const handleSubmit = async () => {
    setConfirmModal(false);
    setSubmitting(true);
    try {
      await api.post('/reservations', {
        plot_id:                 selectedPlot.plot_id,
        intended_use_date:       intendedUseDate      || undefined,
        notes:                   notes                || undefined,
        deceased_full_name:      deceasedFullName.trim(),
        deceased_date_of_birth:  deceasedDateOfBirth  || undefined,
        deceased_date_of_death:  deceasedDateOfDeath,
        deceased_date_of_burial: deceasedDateOfBurial || undefined,
        deceased_notes:          deceasedNotes        || undefined,
      });
      setAlert({
        type: 'success',
        message: `Reservation for Plot ${selectedPlot.plot_number} submitted! A staff member will review and issue billing shortly.`,
      });
      setTimeout(() => navigate('/my/reservations'), 2500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to submit reservation.' });
      setSubmitting(false);
    }
  };

  /* ── Helpers ──────────────────────────────────────────── */
  const plotTypeColor  = t => t === 'Private' ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.2)';
  const plotTypeBorder = t => t === 'Private' ? 'rgba(139,92,246,0.5)' : 'rgba(59,130,246,0.5)';
  const plotTypeText   = t => t === 'Private' ? '#a78bfa'              : '#60a5fa';

  const fmtDate = d => d
    ? new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  /* ── Unpaid balance block ─────────────────────────────── */
  if (unpaidBlock) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary" style={{ padding: '0.5rem', lineHeight: 1 }} onClick={() => navigate('/my/reservations')}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ margin: 0 }}>Add Reservation</h1>
        </div>

        <div className="card" style={{ maxWidth: '620px', textAlign: 'center', padding: '3rem 2rem' }}>
          <XCircle size={56} style={{ color: 'var(--danger)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--danger)' }}>Reservation Blocked</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 2rem' }}>
            You currently have an outstanding balance on an accepted reservation. Please settle your existing balance before making a new one.
          </p>
          <div style={{
            padding: '1.25rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
            marginBottom: '2rem', textAlign: 'left',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Blocking Reservation
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
              <strong>Plot {unpaidBlock.plot_number}</strong>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>— Reservation #{unpaidBlock.reservation_id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: '#f43f5e', fontWeight: 600 }}>
              <CreditCard size={15} style={{ flexShrink: 0 }} />
              <span>Balance payment is pending</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/my/payments')}>
            Go to My Payments
          </button>
        </div>
      </div>
    );
  }

  /* ── Main layout ──────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" style={{ padding: '0.5rem', lineHeight: 1 }} onClick={() => navigate('/my/reservations')}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Add Reservation</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Select an available plot, then fill in your loved one's information.
          </p>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Two-panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left: Plot Grid ──────────────────────────────── */}
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
                <button key={t} onClick={() => setTypeFilter(t)} style={{
                  padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                  border: `1px solid ${typeFilter === t ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: typeFilter === t ? 'var(--primary)' : 'transparent',
                  color: typeFilter === t ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Plot cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading available plots...</div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
              <MapPin size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3>No Available Plots</h3>
              <p style={{ color: 'var(--text-muted)' }}>No plots match your search. Try adjusting the filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '0.75rem' }}>
              {filtered.map(p => {
                const isSel = selectedPlot?.plot_id === p.plot_id;
                return (
                  <button key={p.plot_id} onClick={() => handleSelectPlot(p)} style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSel ? 'var(--primary)' : plotTypeBorder(p.plot_type)}`,
                    background: isSel ? 'rgba(59,130,246,0.15)' : plotTypeColor(p.plot_type),
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s', position: 'relative',
                  }}>
                    {isSel && <CheckCircle size={18} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--primary)' }} />}
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

        {/* ── Right: Summary panel ─────────────────────────── */}
        <div className="card" style={{ position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={20} style={{ color: 'var(--primary)' }} />
            Reservation Summary
          </h3>

          {selectedPlot ? (
            <>
              {/* Selected plot info */}
              <div style={{
                padding: '1rem', borderRadius: 'var(--radius-md)',
                background: plotTypeColor(selectedPlot.plot_type),
                border: `1px solid ${plotTypeBorder(selectedPlot.plot_type)}`,
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.7rem', color: plotTypeText(selectedPlot.plot_type), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedPlot.plot_type} Plot
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  {selectedPlot.plot_number}
                </div>
                <div style={{ color: '#22c55e', fontWeight: 600 }}>
                  ₱{parseFloat(selectedPlot.price).toLocaleString()}
                </div>
              </div>

              {/* Deceased info status */}
              <div style={{
                padding: '1rem', borderRadius: 'var(--radius-md)',
                background: deceasedFilled ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${deceasedFilled ? 'rgba(244,63,94,0.3)' : 'var(--border-light)'}`,
                marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: deceasedFilled ? '0.75rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: deceasedFilled ? '#f43f5e' : 'var(--text-muted)' }}>
                    <Heart size={15} />
                    Deceased Loved One
                    {!deceasedFilled && <span style={{ color: 'var(--danger)', fontWeight: 400 }}> *</span>}
                  </div>
                  <button
                    type="button"
                    onClick={openDeceasedModal}
                    style={{
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      color: 'var(--primary)', background: 'transparent',
                      border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    {deceasedFilled ? 'Edit' : 'Fill In'}
                    <ChevronRight size={13} />
                  </button>
                </div>
                {deceasedFilled && (
                  <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{deceasedFullName}</div>
                    {deceasedDateOfDeath && <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Died: {fmtDate(deceasedDateOfDeath)}</div>}
                  </div>
                )}
              </div>

              {/* Reservation extras */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} /> Intended Interment Date
                    <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    type="date" className="form-control"
                    value={intendedUseDate}
                    onChange={e => setIntendedUseDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notes / Remarks <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
                  <textarea
                    className="form-control" rows={2}
                    placeholder="Any special instructions..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Notice */}
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                marginBottom: '1.25rem', fontSize: '0.8rem', color: '#fbbf24', lineHeight: '1.5',
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              }}>
                <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>Submission is pending staff review before billing is issued.</span>
              </div>

              {!deceasedFilled && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
                  Click <strong>"Fill In"</strong> above to enter deceased loved one's information before submitting.
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={() => setConfirmModal(true)}
                disabled={submitting || !deceasedFilled}
              >
                {submitting ? 'Submitting...' : 'Submit Reservation Request'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <MapPin size={40} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Select a plot from the list to begin.</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ Deceased Loved One Modal (scrollable) ══════════════════ */}
      <Modal
        isOpen={deceasedModal}
        onClose={() => setDeceasedModal(false)}
        title="Deceased Loved One Information"
        type="info"
        maxWidth="560px"
        scrollable
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeceasedModal(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleDeceasedSave}
              disabled={!deceasedFullName.trim() || !deceasedDateOfDeath}
            >
              Save Information
            </button>
          </>
        }
      >
        <form onSubmit={handleDeceasedSave}>
          {/* Banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)',
            marginBottom: '1.5rem',
          }}>
            <Heart size={20} style={{ color: '#f43f5e', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.9rem' }}>For: Plot {selectedPlot?.plot_number}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>Fields marked with <span style={{ color: 'var(--danger)' }}>*</span> are required.</div>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text" className="form-control" required
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. Juan Dela Cruz"
                value={deceasedFullName}
                onChange={e => setDeceasedFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Date of Birth & Date of Death */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} /> Date of Birth
              </label>
              <input
                type="date" className="form-control"
                value={deceasedDateOfBirth}
                onChange={e => setDeceasedDateOfBirth(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} /> Date of Death <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="date" className="form-control" required
                value={deceasedDateOfDeath}
                onChange={e => setDeceasedDateOfDeath(e.target.value)}
              />
            </div>
          </div>

          {/* Date of Burial */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} /> Date of Burial
              <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              type="date" className="form-control"
              value={deceasedDateOfBurial}
              onChange={e => setDeceasedDateOfBurial(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              Additional Notes <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <textarea
              className="form-control" rows={3}
              placeholder="Any additional information about the deceased (cause of death, surviving relatives, etc.)..."
              value={deceasedNotes}
              onChange={e => setDeceasedNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>

      {/* ══ Confirm Reservation Modal ══════════════════════════════ */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Reservation Request"
        type="success"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setConfirmModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Yes, Submit'}
            </button>
          </>
        }
      >
        <p style={{ marginTop: 0 }}>You are about to submit the following reservation:</p>

        {/* Plot */}
        {selectedPlot && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(59,130,246,0.1)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} style={{ color: 'var(--primary)' }} />
              <strong>{selectedPlot.plot_number}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {selectedPlot.plot_type} Plot</span>
            </div>
            <div style={{ color: '#22c55e', fontWeight: 700, marginTop: '0.35rem', paddingLeft: '1.5rem' }}>
              ₱{parseFloat(selectedPlot.price).toLocaleString()}
            </div>
          </div>
        )}

        {/* Deceased */}
        {deceasedFullName && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(244,63,94,0.07)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244,63,94,0.2)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Deceased Loved One
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{deceasedFullName}</div>
            {deceasedDateOfBirth && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Born: {fmtDate(deceasedDateOfBirth)}</div>}
            {deceasedDateOfDeath && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Died: {fmtDate(deceasedDateOfDeath)}</div>}
            {deceasedDateOfBurial && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Burial: {fmtDate(deceasedDateOfBurial)}</div>}
          </div>
        )}

        <p style={{ marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          The reservation will be marked as <strong>Pending</strong> until a staff member reviews and issues billing.
        </p>
      </Modal>
    </div>
  );
};

export default AddReservation;

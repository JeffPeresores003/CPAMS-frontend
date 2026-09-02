import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { 
  FileText, 
  CheckCircle2, 
  User, 
  MapPin, 
  DollarSign, 
  Calendar, 
  XCircle, 
  Heart,
  AlertTriangle,
  Search 
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Billing = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');
  
  // Modals
  const [billModal, setBillModal] = useState({ isOpen: false, reservation: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, reservation: null });
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPendingReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/billing');
      setReservations(response.data);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load pending reservations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReservations();
  }, []);

  const openBillModal = (reservation) => {
    setBillModal({ isOpen: true, reservation });
  };

  const openRejectModal = (reservation) => {
    setRejectReason('');
    setRejectModal({ isOpen: true, reservation });
  };

  const handleBillReservation = async () => {
    const { reservation } = billModal;
    setSubmitting(true);
    setBillModal({ isOpen: false, reservation: null });
    try {
      await api.post(`/billing/${reservation.reservation_id}/bill`);
      setAlert({ 
        type: 'success', 
        message: `Reservation #${reservation.reservation_id} for ${reservation.first_name} ${reservation.last_name} has been accepted and billed.` 
      });
      fetchPendingReservations();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to bill reservation.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectReservation = async (e) => {
    e.preventDefault();
    const { reservation } = rejectModal;
    setSubmitting(true);
    setRejectModal({ isOpen: false, reservation: null });
    try {
      await api.post(`/billing/${reservation.reservation_id}/reject`, { reason: rejectReason });
      setAlert({ 
        type: 'success', 
        message: `Reservation #${reservation.reservation_id} rejected. Plot ${reservation.plot_number} has been released back to Available.` 
      });
      fetchPendingReservations();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to reject reservation.' });
    } finally {
      setSubmitting(false);
    }
  };

  const resBill = billModal.reservation;
  const resReject = rejectModal.reservation;

  const filteredReservations = reservations.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.first_name && r.first_name.toLowerCase().includes(q)) ||
      (r.last_name && r.last_name.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.account_code && r.account_code.toLowerCase().includes(q)) ||
      (r.plot_number && r.plot_number.toLowerCase().includes(q)) ||
      (r.deceased_name && r.deceased_name.toLowerCase().includes(q)) ||
      (r.reservation_id && String(r.reservation_id).includes(q))
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Billing System</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Review pending plot reservations, accept for billing, or reject and release plots.
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          color: 'var(--primary-light)', fontSize: '0.875rem', fontWeight: 700,
        }}>
          <FileText size={18} />
          <span>{reservations.length} Pending Approval</span>
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
            placeholder="Search by customer name, account ID, plot #, deceased name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <LoadingSpinner size="lg" label="Loading pending reservations..." />
          </div>
        ) : filteredReservations.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 1rem', color: 'var(--success)', opacity: 0.6 }} />
            <h3>{search ? 'No Matching Pending Reservations' : 'All Caught Up'}</h3>
            <p style={{ color: 'var(--text-dim)', margin: 0 }}>
              {search ? 'Try adjusting your search query.' : 'No pending reservations awaiting billing or review.'}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Deceased Loved One</th>
                <th>Plot Details</th>
                <th>Total Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r) => (
                <tr key={r.reservation_id}>
                  <td>{new Date(r.reservation_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.first_name} {r.last_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.account_code || r.email}</div>
                  </td>
                  <td>
                    {r.deceased_name ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Heart size={14} style={{ color: '#f43f5e', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{r.deceased_name}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-dim)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.plot_number}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.plot_type} Plot</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#22c55e' }}>₱{parseFloat(r.total_price).toLocaleString()}</td>
                  <td><span className="badge badge-warning">{r.reservation_status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
                        onClick={() => openBillModal(r)}
                        disabled={submitting}
                      >
                        Accept &amp; Bill
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
                        onClick={() => openRejectModal(r)}
                        disabled={submitting}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Accept & Bill Modal ─────────────────────────────── */}
      <Modal
        isOpen={billModal.isOpen}
        onClose={() => setBillModal({ isOpen: false, reservation: null })}
        title="Accept & Issue Billing"
        type="success"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setBillModal({ isOpen: false, reservation: null })}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleBillReservation} disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm & Bill'}
            </button>
          </>
        }
      >
        {resBill && (
          <div>
            <p style={{ marginTop: 0 }}>You are about to accept the following reservation and generate billing:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span><strong>{resBill.first_name} {resBill.last_name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({resBill.account_code || 'No Account ID'})</span></span>
              </div>
              {resBill.deceased_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
                  <span>Deceased: <strong>{resBill.deceased_name}</strong></span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>Plot <strong>{resBill.plot_number}</strong> — {resBill.plot_type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={15} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ color: '#22c55e', fontWeight: 700 }}>₱{parseFloat(resBill.total_price).toLocaleString()}</span>
              </div>
              {resBill.intended_use_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Intended: {new Date(resBill.intended_use_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
            <p style={{ marginBottom: 0, marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Status will be updated to <strong style={{ color: '#22c55e' }}>Accepted</strong> and moved to the Reservations list for payment collection.
            </p>
          </div>
        )}
      </Modal>

      {/* ── Reject Modal ────────────────────────────────────── */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, reservation: null })}
        title="Reject Reservation"
        type="danger"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, reservation: null })}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleRejectReservation} disabled={submitting}>
              {submitting ? 'Rejecting...' : 'Yes, Reject & Release Plot'}
            </button>
          </>
        }
      >
        {resReject && (
          <form onSubmit={handleRejectReservation}>
            <p style={{ marginTop: 0 }}>
              Are you sure you want to reject the reservation for Plot <strong>{resReject.plot_number}</strong> requested by <strong>{resReject.first_name} {resReject.last_name}</strong>?
            </p>

            <div style={{
              padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
              color: '#fda4af', fontSize: '0.85rem', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.65rem'
            }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.1rem' }} />
              <span>Rejecting this reservation will immediately release Plot <strong>{resReject.plot_number}</strong> back to <strong>Available</strong> status for other customers.</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Rejection Reason / Remarks <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Specify reason for rejection (e.g., duplicate request, customer request, invalid documentation)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Billing;

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { FileText, CheckCircle, User, MapPin, DollarSign, Calendar } from 'lucide-react';

const Billing = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [billModal, setBillModal] = useState({ isOpen: false, reservation: null });
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

  const handleBillReservation = async () => {
    const { reservation } = billModal;
    setSubmitting(true);
    setBillModal({ isOpen: false, reservation: null });
    try {
      await api.post(`/billing/${reservation.reservation_id}/bill`);
      setAlert({ type: 'success', message: `Reservation #${reservation.reservation_id} for ${reservation.first_name} ${reservation.last_name} has been accepted and billed.` });
      fetchPendingReservations();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to bill reservation.' });
    } finally {
      setSubmitting(false);
    }
  };

  const res = billModal.reservation;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Billing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>Manage pending reservations and issue billing.</p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: '0.5rem',
          backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          color: '#10b981', fontSize: '0.875rem', fontWeight: 600,
        }}>
          <FileText size={18} />
          <span>{reservations.length} Pending</span>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pending reservations...</div>
        ) : reservations.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--success)', opacity: 0.5 }} />
            <p>No pending reservations to bill.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Account ID</th>
                <th>Plot</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.reservation_id}>
                  <td>{new Date(r.reservation_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td>
                    <div>{r.first_name} {r.last_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.email}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {r.account_code || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div>{r.plot_number}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.plot_type}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>₱{parseFloat(r.total_price).toLocaleString()}</td>
                  <td><span className="badge badge-warning">{r.reservation_status}</span></td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => openBillModal(r)}
                      disabled={submitting}
                    >
                      Bill / Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bill Confirmation Modal */}
      <Modal
        isOpen={billModal.isOpen}
        onClose={() => setBillModal({ isOpen: false, reservation: null })}
        title="Accept & Issue Billing"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setBillModal({ isOpen: false, reservation: null })}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBillReservation}>Confirm & Bill</button>
          </>
        }
      >
        {res && (
          <div>
            <p style={{ marginTop: 0 }}>You are about to accept the following reservation and mark it as <strong>Accepted</strong>:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span><strong>{res.first_name} {res.last_name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({res.account_code || 'No Account ID'})</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>Plot <strong>{res.plot_number}</strong> — {res.plot_type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={15} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ color: '#22c55e', fontWeight: 700 }}>₱{parseFloat(res.total_price).toLocaleString()}</span>
              </div>
              {res.intended_use_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Intended: {new Date(res.intended_use_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
            <p style={{ marginBottom: 0, marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              This will update the reservation status to <strong style={{ color: '#22c55e' }}>Accepted</strong> and it will appear in the Reservations tab.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Billing;

import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Receipt } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const [balance, setBalance] = useState(null);
  const [form, setForm] = useState({ reservation_id: '', amount_paid: '', payment_type: 'Installment' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, resRes] = await Promise.all([
        api.get('/payments'),
        api.get('/reservations', { params: { balance_status: 'Pending Balance' } }),
      ]);
      setPayments(payRes.data);
      setReservations(resRes.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load data — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleResChange = async (reservation_id) => {
    setForm({ ...form, reservation_id });
    setSelectedRes(null);
    setBalance(null);
    if (!reservation_id) return;
    const res = reservations.find(r => r.reservation_id === parseInt(reservation_id));
    setSelectedRes(res);
    try {
      const r = await api.get(`/reservations/${reservation_id}/balance`);
      setBalance(r.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/payments', {
        plot_id: selectedRes.plot_id,
        customer_id: selectedRes.customer_id,
        processed_by: user.user_id,
        amount_paid: parseFloat(form.amount_paid),
        payment_type: form.payment_type,
      });
      const msg = res.data.remaining_balance === 0
        ? `Payment recorded! Plot is now FULLY PAID. OR #: ${res.data.or_number}`
        : `Payment recorded! Remaining balance: ₱${parseFloat(res.data.remaining_balance).toLocaleString()}. OR #: ${res.data.or_number}`;
      setAlert({ type: 'success', message: msg });
      setShowModal(false);
      setForm({ reservation_id: '', amount_paid: '', payment_type: 'Installment' });
      setSelectedRes(null);
      setBalance(null);
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to record payment.' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Payments</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Record Payment
        </button>
      </div>
      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>OR #</th>
              <th>Customer</th>
              <th>Plot</th>
              <th>Payment Type</th>
              <th>Amount Paid</th>
              <th>Date</th>
              <th>Processed By</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
              : payments.length === 0
                ? <tr><td colSpan="7"><EmptyState message="No payments recorded yet" icon={Receipt} /></td></tr>
                : payments.map(p => (
                  <tr key={p.payment_id}>
                    <td style={{ fontFamily: 'monospace' }}>{p.or_number}</td>
                    <td>{p.customer_name || p.customer_id}</td>
                    <td>{p.plot_number || p.plot_id}</td>
                    <td><StatusBadge value={p.payment_type} /></td>
                    <td>₱{parseFloat(p.amount_paid).toLocaleString()}</td>
                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td>{p.staff_name || p.processed_by}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Record Installment Payment" onClose={() => setShowModal(false)} maxWidth="520px">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Reservation (Pending Balance)</label>
              <select className="form-control" required value={form.reservation_id} onChange={e => handleResChange(e.target.value)}>
                <option value="">Select reservation...</option>
                {reservations.map(r => (
                  <option key={r.reservation_id} value={r.reservation_id}>
                    #{r.reservation_id} — {r.customer_name || r.customer_id} — Plot {r.plot_number || r.plot_id}
                  </option>
                ))}
              </select>
            </div>

            {balance && (
              <div className="card mb-4" style={{ padding: '1rem', background: 'rgba(234,179,8,0.1)', border: '1px solid var(--warning)' }}>
                <div className="grid grid-cols-2">
                  <div><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Price</p><p style={{ margin: 0, fontWeight: 600 }}>₱{parseFloat(balance.total_price || 0).toLocaleString()}</p></div>
                  <div><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Remaining Balance</p><p style={{ margin: 0, fontWeight: 600, color: 'var(--warning)' }}>₱{parseFloat(balance.remaining_balance || 0).toLocaleString()}</p></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <select className="form-control" value={form.payment_type} onChange={e => setForm({ ...form, payment_type: e.target.value })}>
                  <option>Installment</option>
                  <option>Full Payment</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Paid (₱)</label>
                <input type="number" step="0.01" className="form-control" required value={form.amount_paid} onChange={e => setForm({ ...form, amount_paid: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary" disabled={!selectedRes}>Record Payment</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Payments;

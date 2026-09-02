import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Receipt, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  User, 
  MapPin, 
  Heart,
  ArrowRight,
  FileText
} from 'lucide-react';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  // Search & Active Tab
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'

  // Record Payment Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [form, setForm] = useState({
    reservation_id: '',
    payment_type: 'Installment',
    amount_paid: '',
    cash_tendered: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, pendRes] = await Promise.all([
        api.get('/payments'),
        api.get('/payments/pending-balances'),
      ]);
      setPayments(payRes.data || []);
      setPendingReservations(pendRes.data || []);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load payment data — server may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPaymentModalForReservation = (res) => {
    setSelectedRes(res);
    const bal = parseFloat(res.remaining_balance !== undefined ? res.remaining_balance : res.total_price);
    setForm({
      reservation_id: String(res.reservation_id),
      payment_type: 'Installment',
      amount_paid: '',
      cash_tendered: '',
    });
    setShowModal(true);
  };

  const handleResSelect = (resId) => {
    if (!resId) {
      setSelectedRes(null);
      setForm({ ...form, reservation_id: '', amount_paid: '' });
      return;
    }
    const found = pendingReservations.find(r => r.reservation_id === parseInt(resId));
    setSelectedRes(found);
    setForm({
      ...form,
      reservation_id: resId,
      amount_paid: form.payment_type === 'Full Payment' && found ? String(found.remaining_balance) : form.amount_paid,
    });
  };

  const handlePaymentTypeChange = (type) => {
    let amt = form.amount_paid;
    if (type === 'Full Payment' && selectedRes) {
      amt = String(selectedRes.remaining_balance);
    }
    setForm({ ...form, payment_type: type, amount_paid: amt });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRes) {
      setAlert({ type: 'danger', message: 'Please select a reservation to record payment.' });
      return;
    }

    const amt = parseFloat(form.amount_paid);
    if (!amt || amt <= 0) {
      setAlert({ type: 'danger', message: 'Please enter a valid payment amount.' });
      return;
    }

    const bal = parseFloat(selectedRes.remaining_balance);
    if (amt > bal) {
      setAlert({ type: 'danger', message: `Payment of ₱${amt.toLocaleString()} exceeds the remaining balance of ₱${bal.toLocaleString()}. Overpayment is not allowed.` });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/payments', {
        reservation_id: selectedRes.reservation_id,
        plot_id: selectedRes.plot_id,
        customer_id: selectedRes.customer_id,
        payment_type: form.payment_type,
        amount_paid: amt,
        cash_tendered: form.cash_tendered ? parseFloat(form.cash_tendered) : null,
      });

      const changeAmount = form.cash_tendered && parseFloat(form.cash_tendered) > amt
        ? (parseFloat(form.cash_tendered) - amt).toFixed(2)
        : null;

      const changeMsg = changeAmount ? ` (Change: ₱${parseFloat(changeAmount).toLocaleString()})` : '';

      setAlert({ 
        type: 'success', 
        message: `OR #${res.data.or_number} recorded! Amount Paid: ₱${amt.toLocaleString()}${changeMsg}. Remaining Balance: ₱${parseFloat(res.data.remaining_balance).toLocaleString()}` 
      });

      setShowModal(false);
      setSelectedRes(null);
      setForm({ reservation_id: '', payment_type: 'Installment', amount_paid: '', cash_tendered: '' });
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to record payment.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered lists
  const filteredPending = pendingReservations.filter(r => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
      (r.customer_email && r.customer_email.toLowerCase().includes(q)) ||
      (r.plot_number && r.plot_number.toLowerCase().includes(q)) ||
      (r.deceased_name && r.deceased_name.toLowerCase().includes(q)) ||
      (r.reservation_id && String(r.reservation_id).includes(q))
    );
  });

  const filteredPayments = payments.filter(p => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.or_number && p.or_number.toLowerCase().includes(q)) ||
      (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
      (p.plot_number && p.plot_number.toLowerCase().includes(q)) ||
      (p.staff_name && p.staff_name.toLowerCase().includes(q)) ||
      (p.payment_type && p.payment_type.toLowerCase().includes(q))
    );
  });

  const changeDue = form.cash_tendered && form.amount_paid && parseFloat(form.cash_tendered) >= parseFloat(form.amount_paid)
    ? (parseFloat(form.cash_tendered) - parseFloat(form.amount_paid)).toFixed(2)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Payment System</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Process walk-in payments (full or installment) for billed plot reservations and review receipts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelectedRes(null); setShowModal(true); }}>
          <Plus size={18} /> Record New Payment
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Tabs and Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'pending' ? 'var(--primary)' : 'var(--border-light)'}`,
              background: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'pending' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <Clock size={16} />
            <span>Billed Awaiting Payment ({pendingReservations.filter(r => parseFloat(r.remaining_balance) > 0).length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              border: `1px solid ${activeTab === 'history' ? 'var(--primary)' : 'var(--border-light)'}`,
              background: activeTab === 'history' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'history' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <Receipt size={16} />
            <span>Payment Receipts ({payments.length})</span>
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={activeTab === 'pending' ? "Search billed reservations..." : "Search OR #, customer, plot..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tab 1: Billed Reservations Awaiting Payment */}
      {activeTab === 'pending' && (
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <LoadingSpinner size="lg" label="Loading billed reservations..." />
            </div>
          ) : filteredPending.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem', opacity: 0.6 }} />
              <h3>No Outstanding Balances</h3>
              <p style={{ color: 'var(--text-muted)' }}>All accepted reservations are fully paid or none match your search.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Res #</th>
                  <th>Customer</th>
                  <th>Deceased</th>
                  <th>Plot</th>
                  <th>Total Price</th>
                  <th>Paid So Far</th>
                  <th>Remaining Balance</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.map(r => {
                  const rem = parseFloat(r.remaining_balance !== undefined ? r.remaining_balance : r.total_price);
                  const isFullyPaid = rem === 0;

                  return (
                    <tr key={r.reservation_id}>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#e4e4e7' }}>
                          #{r.reservation_id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.customer_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.customer_email}</div>
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
                      <td style={{ fontWeight: 600 }}>₱{parseFloat(r.total_price).toLocaleString()}</td>
                      <td style={{ color: 'var(--primary-light)' }}>₱{parseFloat(r.amount_paid_so_far || 0).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: isFullyPaid ? '#22c55e' : '#f59e0b' }}>
                        ₱{rem.toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge value={isFullyPaid ? 'Fully Paid' : 'Pending Balance'} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {isFullyPaid ? (
                            <span className="badge badge-success">Completed</span>
                          ) : (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
                              onClick={() => openPaymentModalForReservation(r)}
                            >
                              <CreditCard size={14} style={{ marginRight: '0.3rem' }} /> Record Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 2: Payment Receipts History */}
      {activeTab === 'history' && (
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <LoadingSpinner size="lg" label="Loading payments..." />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center' }}>
              <EmptyState message={search ? "No payments match your search" : "No payments recorded yet"} icon={Receipt} />
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Official Receipt (OR #)</th>
                  <th>Customer</th>
                  <th>Plot</th>
                  <th>Payment Type</th>
                  <th>Amount Paid</th>
                  <th>Cash Tendered</th>
                  <th>Date Recorded</th>
                  <th>Processed By</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.payment_id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {p.or_number}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.customer_name || `Customer #${p.customer_id}`}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.plot_number || `Plot #${p.plot_id}`}</div>
                    </td>
                    <td>
                      <StatusBadge value={p.payment_type} />
                    </td>
                    <td style={{ fontWeight: 700, color: '#22c55e' }}>₱{parseFloat(p.amount_paid).toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {p.cash_tendered ? `₱${parseFloat(p.cash_tendered).toLocaleString()}` : '—'}
                    </td>
                    <td>{new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {p.staff_name || `Staff #${p.processed_by}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Record Walk-In Payment" 
        maxWidth="560px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !selectedRes}>
              {submitting ? 'Recording Payment...' : 'Confirm & Print OR'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {/* Reservation Select */}
          <div className="form-group">
            <label className="form-label">Select Billed Reservation</label>
            <select 
              className="form-control" 
              required 
              value={form.reservation_id} 
              onChange={e => handleResSelect(e.target.value)}
            >
              <option value="">-- Choose Billed Reservation --</option>
              {pendingReservations
                .filter(r => parseFloat(r.remaining_balance) > 0)
                .map(r => (
                  <option key={r.reservation_id} value={r.reservation_id}>
                    #{r.reservation_id} — {r.customer_name} (Plot {r.plot_number}) — Bal: ₱{parseFloat(r.remaining_balance).toLocaleString()}
                  </option>
                ))
              }
            </select>
          </div>

          {/* Balance Breakdown Card */}
          {selectedRes && (
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(15, 23, 42, 0.6)', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.25rem' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Plot Price</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>₱{parseFloat(selectedRes.total_price).toLocaleString()}</div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>Paid So Far</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-light)' }}>₱{parseFloat(selectedRes.amount_paid_so_far || 0).toLocaleString()}</div>
                </div>
                <div style={{ padding: '0.5rem', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Remaining Balance</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fbbf24' }}>₱{parseFloat(selectedRes.remaining_balance).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Type Selection */}
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Payment Mode / Type</label>
              <select 
                className="form-control" 
                value={form.payment_type} 
                onChange={e => handlePaymentTypeChange(e.target.value)}
              >
                <option value="Installment">Installment / Partial</option>
                <option value="Full Payment">Full Payment (Clear Balance)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount Paid (₱) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                required 
                placeholder="0.00"
                value={form.amount_paid} 
                onChange={e => setForm({ ...form, amount_paid: e.target.value })} 
              />
            </div>
          </div>

          {/* Cash Tendered & Change */}
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Cash Tendered <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                placeholder="Amount given by customer"
                value={form.cash_tendered} 
                onChange={e => setForm({ ...form, cash_tendered: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calculated Change</label>
              <div className="form-control" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#22c55e', fontWeight: 700 }}>
                ₱{parseFloat(changeDue).toLocaleString()}
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;

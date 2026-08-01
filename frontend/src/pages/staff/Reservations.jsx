import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [plots, setPlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    plot_id: '', customer_id: '', intended_use_date: '', down_payment: '', payment_type: 'Down Payment',
    deceased_name: '', date_of_birth: '', date_of_death: '', cause_of_death: ''
  });
  const [customerSearch, setCustomerSearch] = useState('');
  const [plotSearch, setPlotSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, plotRes, custRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/plots', { params: { status: 'Available' } }),
        api.get('/users', { params: { role: 'Customer', status: 'Approved' } }),
      ]);
      setReservations(resRes.data);
      setPlots(plotRes.data);
      setCustomers(custRes.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load data — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const selectedPlot = plots.find(p => p.plot_id === parseInt(form.plot_id));

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!form.down_payment || parseFloat(form.down_payment) <= 0) {
      setAlert({ type: 'danger', message: 'A down payment amount is required to complete a reservation.' });
      return;
    }
    // Check if customer has any pending balance
    const customerReservations = reservations.filter(r => r.customer_id === parseInt(form.customer_id));
    const hasBalance = customerReservations.some(r => r.balance_status !== 'Fully Paid');
    
    if (hasBalance) {
      setAlert({ type: 'danger', message: 'Customer has an outstanding balance and cannot avail another plot until fully paid.' });
      return;
    }

    try {
      await api.post('/walk-in', {
        staff_id: user.user_id,
        is_new_customer: false,
        customer_id: parseInt(form.customer_id),
        plot_id: parseInt(form.plot_id),
        intended_use_date: form.intended_use_date,
        payment_type: form.payment_type,
        amount_paid: parseFloat(form.down_payment),
        deceased_data: {
          deceased_name: form.deceased_name,
          date_of_birth: form.date_of_birth,
          date_of_death: form.date_of_death,
          cause_of_death: form.cause_of_death
        }
      });
      setAlert({ type: 'success', message: 'New plot reserved successfully! Record and payment processed.' });
      setShowModal(false);
      setForm({ plot_id: '', customer_id: '', intended_use_date: '', down_payment: '', payment_type: 'Down Payment', deceased_name: '', date_of_birth: '', date_of_death: '', cause_of_death: '' });
      setCustomerSearch('');
      setPlotSearch('');
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create reservation.' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Reservations</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Reservation
        </button>
      </div>
      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reservation #</th>
              <th>Customer</th>
              <th>Plot</th>
              <th>Total Price</th>
              <th>Intended Use Date</th>
              <th>Balance Status</th>
              <th>Reserved On</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
              : reservations.length === 0
                ? <tr><td colSpan="7"><EmptyState message="No reservations yet" /></td></tr>
                : reservations.map(r => (
                  <tr key={r.reservation_id}>
                    <td>#{r.reservation_id}</td>
                    <td>{r.customer_name || r.customer_id}</td>
                    <td>{r.plot_number || r.plot_id}</td>
                    <td>₱{parseFloat(r.total_price).toLocaleString()}</td>
                    <td>{r.intended_use_date ? new Date(r.intended_use_date).toLocaleDateString() : '—'}</td>
                    <td><StatusBadge value={r.balance_status} /></td>
                    <td>{new Date(r.reservation_date).toLocaleDateString()}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New Reservation (Existing Customer)" onClose={() => setShowModal(false)} maxWidth="700px">
          <form onSubmit={handleReserve}>
            <div className="grid grid-cols-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Search & Select Customer</label>
                <input type="text" className="form-control mb-2" placeholder="Type to search customers..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} />
                <select className="form-control" required size="4" value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })}>
                  {customers
                    .filter(c => `${c.first_name} ${c.last_name} ${c.username}`.toLowerCase().includes(customerSearch.toLowerCase()))
                    .map(c => <option key={c.user_id} value={c.user_id}>{c.first_name} {c.last_name} ({c.username})</option>)
                  }
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Search & Select Available Plot</label>
                <input type="text" className="form-control mb-2" placeholder="Type to search plots (e.g., A-01)..." value={plotSearch} onChange={e => setPlotSearch(e.target.value)} />
                <select className="form-control" required size="4" value={form.plot_id} onChange={e => setForm({ ...form, plot_id: e.target.value })}>
                  {plots
                    .filter(p => `${p.plot_number} ${p.plot_type}`.toLowerCase().includes(plotSearch.toLowerCase()))
                    .map(p => <option key={p.plot_id} value={p.plot_id}>{p.plot_number} — {p.plot_type} — ₱{parseFloat(p.price).toLocaleString()}</option>)
                  }
                </select>
              </div>
            </div>

            {selectedPlot && (
              <div className="card mb-4" style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--primary)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  Selected Plot Price: <strong>₱{parseFloat(selectedPlot.price).toLocaleString()}</strong>
                </p>
              </div>
            )}

            <h4 className="mt-4 mb-2">Deceased Information</h4>
            <div className="grid grid-cols-2">
              <div className="form-group"><label className="form-label">Deceased Name</label><input type="text" className="form-control" required value={form.deceased_name} onChange={e => setForm({ ...form, deceased_name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Cause of Death</label><input type="text" className="form-control" value={form.cause_of_death} onChange={e => setForm({ ...form, cause_of_death: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-control" required value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Date of Death</label><input type="date" className="form-control" required value={form.date_of_death} onChange={e => setForm({ ...form, date_of_death: e.target.value })} /></div>
            </div>

            <h4 className="mt-4 mb-2">Schedule & Payment</h4>
            <div className="form-group">
              <label className="form-label">Intended Interment Date (Optional)</label>
              <input type="date" className="form-control" value={form.intended_use_date} onChange={e => setForm({ ...form, intended_use_date: e.target.value })} />
            </div>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <select className="form-control" value={form.payment_type} onChange={e => {
                    const type = e.target.value;
                    const amount = (type === 'Full Payment' && selectedPlot) ? selectedPlot.price : form.down_payment;
                    setForm({ ...form, payment_type: type, down_payment: amount });
                  }}>
                  <option>Down Payment</option>
                  <option>Full Payment</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Paid (₱)</label>
                <input type="number" step="0.01" className="form-control" required 
                  value={form.down_payment} 
                  onChange={e => setForm({ ...form, down_payment: e.target.value })}
                  readOnly={form.payment_type === 'Full Payment'} 
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary">Reserve & Record Payment</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Reservations;

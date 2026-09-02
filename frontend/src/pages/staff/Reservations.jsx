import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Heart, 
  User, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText
} from 'lucide-react';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  // Filtering & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal for Staff to Reserve on Behalf of Customer
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [plots, setPlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [plotSearch, setPlotSearch] = useState('');
  
  const [form, setForm] = useState({
    customer_id: '',
    plot_id: '',
    intended_use_date: '',
    notes: '',
    deceased_full_name: '',
    deceased_date_of_birth: '',
    deceased_date_of_death: '',
    deceased_date_of_burial: '',
    deceased_notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      const [resRes, plotRes, custRes] = await Promise.allSettled([
        api.get('/reservations'),
        api.get('/plots', { params: { status: 'Available' } }),
        api.get('/users', { params: { role: 'Customer', status: 'Approved' } }),
      ]);

      if (resRes.status === 'fulfilled') {
        setReservations(resRes.value.data || []);
      } else {
        console.error('Error fetching reservations:', resRes.reason);
        setAlert({ type: 'danger', message: resRes.reason?.response?.data?.error || 'Could not load reservations.' });
      }

      if (plotRes.status === 'fulfilled') {
        setPlots(plotRes.value.data || []);
      }

      if (custRes.status === 'fulfilled') {
        setCustomers(custRes.value.data || []);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', message: 'Could not load data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedPlot = plots.find(p => p.plot_id === parseInt(form.plot_id));

  // Filter reservations based on search and status
  const filteredReservations = reservations.filter(r => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      (r.reservation_id && String(r.reservation_id).includes(q)) ||
      (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
      (r.customer_email && r.customer_email.toLowerCase().includes(q)) ||
      (r.plot_number && r.plot_number.toLowerCase().includes(q)) ||
      (r.deceased_name && r.deceased_name.toLowerCase().includes(q)) ||
      (r.account_code && r.account_code.toLowerCase().includes(q))
    );

    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return r.reservation_status === 'Pending';
    if (statusFilter === 'Accepted') return r.reservation_status === 'Accepted';
    if (statusFilter === 'Rejected') return r.reservation_status === 'Rejected';
    if (statusFilter === 'Pending Balance') return r.balance_status === 'Pending Balance' && r.reservation_status === 'Accepted';
    if (statusFilter === 'Fully Paid') return r.balance_status === 'Fully Paid';

    return true;
  });

  const handleStaffReserve = async (e) => {
    e.preventDefault();
    if (!form.customer_id) {
      setAlert({ type: 'danger', message: 'Please select a customer.' });
      return;
    }
    if (!form.plot_id) {
      setAlert({ type: 'danger', message: 'Please select an available plot.' });
      return;
    }
    if (!form.deceased_full_name.trim() || !form.deceased_date_of_death) {
      setAlert({ type: 'danger', message: 'Deceased full name and date of death are required.' });
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reservations', {
        customer_id: parseInt(form.customer_id),
        plot_id: parseInt(form.plot_id),
        intended_use_date: form.intended_use_date || undefined,
        notes: form.notes || undefined,
        deceased_full_name: form.deceased_full_name.trim(),
        deceased_date_of_birth: form.deceased_date_of_birth || undefined,
        deceased_date_of_death: form.deceased_date_of_death,
        deceased_date_of_burial: form.deceased_date_of_burial || undefined,
        deceased_notes: form.deceased_notes || undefined,
      });

      setAlert({ 
        type: 'success', 
        message: `Plot ${selectedPlot?.plot_number} reserved successfully on behalf of customer! Review in Billing or Payments.` 
      });
      setShowModal(false);
      setForm({
        customer_id: '',
        plot_id: '',
        intended_use_date: '',
        notes: '',
        deceased_full_name: '',
        deceased_date_of_birth: '',
        deceased_date_of_death: '',
        deceased_date_of_burial: '',
        deceased_notes: '',
      });
      setCustomerSearch('');
      setPlotSearch('');
      fetchData();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create reservation.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>Reservations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Overview of all customer plot reservations, balances, and deceased assignments.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Reserve for Customer
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Controls Bar: Search & Status Filters */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by customer, plot #, deceased name, reservation ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />
          {['All', 'Pending', 'Accepted', 'Pending Balance', 'Fully Paid', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '2rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border-light)'}`,
                background: statusFilter === s ? 'var(--primary)' : 'transparent',
                color: statusFilter === s ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <LoadingSpinner size="lg" label="Loading reservations..." />
          </div>
        ) : filteredReservations.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center' }}>
            <EmptyState message={search ? "No reservations matching your search" : "No reservations recorded yet"} icon={FileText} />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Deceased Loved One</th>
                <th>Plot</th>
                <th>Total Price</th>
                <th>Remaining Balance</th>
                <th>Reservation Status</th>
                <th>Balance Status</th>
                <th>Date Reserved</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(r => {
                const isAccepted = r.reservation_status === 'Accepted';
                const isRejected = r.reservation_status === 'Rejected';
                const isPending = r.reservation_status === 'Pending';

                return (
                  <tr key={r.reservation_id}>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.1)' }}>
                        #{r.reservation_id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.customer_name || `Customer #${r.customer_id}`}</div>
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
                      <div style={{ fontWeight: 600 }}>{r.plot_number || `Plot #${r.plot_id}`}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.plot_type} Plot</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₱{parseFloat(r.total_price).toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: parseFloat(r.remaining_balance || 0) === 0 ? '#22c55e' : '#f59e0b' }}>
                      ₱{parseFloat(r.remaining_balance !== undefined ? r.remaining_balance : r.total_price).toLocaleString()}
                    </td>
                    <td>
                      {isAccepted && <span className="badge badge-success"><CheckCircle2 size={12} style={{ marginRight: '0.25rem' }} />Accepted</span>}
                      {isPending && <span className="badge badge-warning"><Clock size={12} style={{ marginRight: '0.25rem' }} />Pending</span>}
                      {isRejected && <span className="badge badge-danger"><XCircle size={12} style={{ marginRight: '0.25rem' }} />Rejected</span>}
                    </td>
                    <td>
                      <StatusBadge value={r.balance_status} />
                    </td>
                    <td>{new Date(r.reservation_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Staff Reservation Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Reserve Plot on Behalf of Customer" 
        maxWidth="720px"
        scrollable
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleStaffReserve} disabled={submitting}>
              {submitting ? 'Reserving...' : 'Submit Reservation'}
            </button>
          </>
        }
      >
        <form onSubmit={handleStaffReserve}>
          {/* Customer Selection */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} style={{ color: 'var(--primary)' }} /> Select Customer <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input 
              type="text" 
              className="form-control mb-2" 
              placeholder="Filter customer list by name or username..." 
              value={customerSearch} 
              onChange={e => setCustomerSearch(e.target.value)} 
            />
            <select 
              className="form-control" 
              required 
              size="4" 
              value={form.customer_id} 
              onChange={e => setForm({ ...form, customer_id: e.target.value })}
            >
              {customers
                .filter(c => `${c.first_name} ${c.last_name} ${c.username} ${c.email}`.toLowerCase().includes(customerSearch.toLowerCase()))
                .map(c => (
                  <option key={c.user_id} value={c.user_id}>
                    {c.first_name} {c.last_name} ({c.username}) — {c.email}
                  </option>
                ))
              }
            </select>
          </div>

          {/* Plot Selection */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} style={{ color: 'var(--primary)' }} /> Select Available Plot <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input 
              type="text" 
              className="form-control mb-2" 
              placeholder="Filter available plots (e.g. A-01, Private, Public)..." 
              value={plotSearch} 
              onChange={e => setPlotSearch(e.target.value)} 
            />
            <select 
              className="form-control" 
              required 
              size="4" 
              value={form.plot_id} 
              onChange={e => setForm({ ...form, plot_id: e.target.value })}
            >
              {plots
                .filter(p => `${p.plot_number} ${p.plot_type}`.toLowerCase().includes(plotSearch.toLowerCase()))
                .map(p => (
                  <option key={p.plot_id} value={p.plot_id}>
                    {p.plot_number} — {p.plot_type} Plot — ₱{parseFloat(p.price).toLocaleString()}
                  </option>
                ))
              }
            </select>
          </div>

          {selectedPlot && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              Selected Plot: <strong>{selectedPlot.plot_number}</strong> ({selectedPlot.plot_type}) — <strong style={{ color: '#22c55e' }}>₱{parseFloat(selectedPlot.price).toLocaleString()}</strong>
            </div>
          )}

          {/* Deceased Section */}
          <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e' }}>
              <Heart size={16} /> Deceased Loved One Information
            </h4>
            
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="e.g. Juan Dela Cruz"
                value={form.deceased_full_name} 
                onChange={e => setForm({ ...form, deceased_full_name: e.target.value })} 
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={form.deceased_date_of_birth} 
                  onChange={e => setForm({ ...form, deceased_date_of_birth: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Death <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input 
                  type="date" 
                  className="form-control" 
                  required 
                  value={form.deceased_date_of_death} 
                  onChange={e => setForm({ ...form, deceased_date_of_death: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Burial <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
              <input 
                type="date" 
                className="form-control" 
                value={form.deceased_date_of_burial} 
                onChange={e => setForm({ ...form, deceased_date_of_burial: e.target.value })} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Additional Deceased Notes <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
              <textarea 
                className="form-control" 
                rows={2} 
                placeholder="Surviving family or special remarks..."
                value={form.deceased_notes} 
                onChange={e => setForm({ ...form, deceased_notes: e.target.value })} 
              />
            </div>
          </div>

          {/* Schedule & Notes */}
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Intended Interment Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.intended_use_date} 
                onChange={e => setForm({ ...form, intended_use_date: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Special notes..."
                value={form.notes} 
                onChange={e => setForm({ ...form, notes: e.target.value })} 
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reservations;

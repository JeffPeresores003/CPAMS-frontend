import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import Alert from '../../components/ui/Alert';
import { 
  CreditCard, 
  Receipt, 
  Search, 
  MapPin, 
  Info, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/payments/my');
        // Support array response or object response { payments, reservations }
        if (Array.isArray(res.data)) {
          setPayments(res.data);
        } else if (res.data) {
          setPayments(res.data.payments || []);
          setReservations(res.data.reservations || []);
        }
      } catch {
        setAlert({ type: 'danger', message: 'Could not load payment history.' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Calculate totals
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  
  // Calculate remaining balances from accepted reservations
  const acceptedReservations = reservations.filter(r => r.reservation_status === 'Accepted');
  const totalPlotCost = acceptedReservations.reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0);
  const totalRemainingBalance = Math.max(0, totalPlotCost - totalPaid);

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.or_number && p.or_number.toLowerCase().includes(q)) ||
      (p.plot_number && p.plot_number.toLowerCase().includes(q)) ||
      (p.payment_type && p.payment_type.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>My Payments &amp; Balances</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>
            Track your plot reservation payment receipts, remaining balances, and official receipts.
          </p>
        </div>
      </div>

      <Alert type={alert.type} message={alert.message} />

      {/* Notice Banner: Walk-In / Cash Payments Only */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(14, 165, 233, 0.08)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <Building2 size={24} style={{ color: 'var(--info)', flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <h4 style={{ margin: '0 0 0.35rem', color: 'var(--info)', fontSize: '1rem' }}>
            Walk-In / Office Payments Only
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Online and digital payments are not supported at this time. To settle your remaining balance or make an installment payment, please visit the <strong>Cemetery Administration Office</strong> in person. Our staff will issue your official receipt (OR #) immediately.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Remaining Balance</span>
            <AlertCircle size={18} style={{ color: totalRemainingBalance > 0 ? '#f59e0b' : 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: totalRemainingBalance > 0 ? '#f59e0b' : '#22c55e' }}>
            ₱{totalRemainingBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            {totalRemainingBalance > 0 ? 'Outstanding balance to settle' : 'All reservations fully paid'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Amount Paid</span>
            <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#22c55e' }}>
            ₱{totalPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Across {payments.length} receipt transaction(s)
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Billed Reservations</span>
            <CreditCard size={18} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
            {acceptedReservations.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Active plots reserved
          </div>
        </div>
      </div>

      {/* Section 1: Active Billed Reservations & Balances */}
      {acceptedReservations.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            Reserved Plots &amp; Balance Status
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Plot Number</th>
                  <th>Plot Type</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th>Deceased Loved One</th>
                </tr>
              </thead>
              <tbody>
                {acceptedReservations.map(r => (
                  <tr key={r.reservation_id}>
                    <td style={{ fontWeight: 700 }}>{r.plot_number}</td>
                    <td>{r.plot_type} Plot</td>
                    <td style={{ fontWeight: 600 }}>₱{parseFloat(r.total_price).toLocaleString()}</td>
                    <td>
                      <StatusBadge value={r.balance_status} />
                    </td>
                    <td>{r.deceased_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Payment Receipts History */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={18} style={{ color: 'var(--primary)' }} />
          Official Payment Receipts
        </h3>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            placeholder="Search OR #, plot..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <LoadingSpinner size="lg" label="Loading payments..." />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center' }}>
            <EmptyState message={search ? "No receipts match your search" : "No payment receipts recorded yet"} icon={Receipt} />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Official Receipt (OR #)</th>
                <th>Plot</th>
                <th>Payment Type</th>
                <th>Amount Paid</th>
                <th>Date of Payment</th>
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
                  <td style={{ fontWeight: 600 }}>{p.plot_number || '—'}</td>
                  <td>
                    <StatusBadge value={p.payment_type} />
                  </td>
                  <td style={{ fontWeight: 700, color: '#22c55e' }}>₱{parseFloat(p.amount_paid).toLocaleString()}</td>
                  <td>{new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyPayments;

import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import Alert from '../../components/ui/Alert';
import { CreditCard } from 'lucide-react';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/payments/my');
        setPayments(res.data);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load payment history — database may be offline.' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="mb-4">My Payment History</h1>
      <Alert type={alert.type} message={alert.message} />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>OR #</th>
              <th>Plot</th>
              <th>Payment Type</th>
              <th>Amount Paid</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              : payments.length === 0
                ? <tr><td colSpan="5"><EmptyState message="No payment records found" icon={CreditCard} /></td></tr>
                : payments.map(p => (
                  <tr key={p.payment_id}>
                    <td style={{ fontFamily: 'monospace' }}>{p.or_number}</td>
                    <td>{p.plot_number || p.plot_id}</td>
                    <td><StatusBadge value={p.payment_type} /></td>
                    <td>₱{parseFloat(p.amount_paid).toLocaleString()}</td>
                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPayments;

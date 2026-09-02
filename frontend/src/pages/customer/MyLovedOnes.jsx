import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';
import Alert from '../../components/ui/Alert';
import { Heart } from 'lucide-react';

const MyLovedOnes = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/deceased/my');
        setRecords(res.data);
      } catch {
        setAlert({ type: 'danger', message: 'Could not load records — database may be offline.' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="mb-4">My Loved Ones</h1>
      <Alert type={alert.type} message={alert.message} />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Plot #</th>
              <th>Section</th>
              <th>Date of Death</th>
              <th>Date of Burial</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              : records.length === 0
                ? <tr><td colSpan="5"><EmptyState message="No records found" icon={Heart} /></td></tr>
                : records.map(r => (
                  <tr key={r.deceased_id}>
                    <td style={{ fontWeight: 600 }}>{r.full_name || r.deceased_name}</td>
                    <td>{r.plot_number}</td>
                    <td>{r.location || r.section_name || '—'}</td>
                    <td>{r.date_of_death ? new Date(r.date_of_death).toLocaleDateString() : '—'}</td>
                    <td>{r.date_of_burial ? new Date(r.date_of_burial).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLovedOnes;

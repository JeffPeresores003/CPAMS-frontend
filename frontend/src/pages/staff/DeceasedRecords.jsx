import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const DeceasedRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const decRes = await api.get('/deceased');
      setRecords(decRes.data);
    } catch {
      setAlert({ type: 'danger', message: 'Could not load data — database may be offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Deceased Records</h1>
      </div>
      <Alert type={alert.type} message={alert.message} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Deceased Name</th>
              <th>Plot</th>
              <th>Customer (Family)</th>
              <th>Date of Birth</th>
              <th>Date of Death</th>
              <th>Date of Burial</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : records.length === 0
                ? <tr><td colSpan="6"><EmptyState message="No deceased records registered" /></td></tr>
                : records.map(r => (
                  <tr key={r.deceased_id}>
                    <td style={{ fontWeight: 500 }}>{r.deceased_name}</td>
                    <td>{r.plot_number || r.plot_id}</td>
                    <td>{r.customer_name || r.customer_id}</td>
                    <td>{r.date_of_birth ? new Date(r.date_of_birth).toLocaleDateString() : '—'}</td>
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

export default DeceasedRecords;

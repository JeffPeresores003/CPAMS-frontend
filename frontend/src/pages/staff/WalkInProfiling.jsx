import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Alert from '../../components/ui/Alert';
import { UserPlus, UserCheck, HeartPulse, MapPin, CreditCard, CheckCircle } from 'lucide-react';

const WalkInProfiling = () => {
  const { user } = useAuth();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Data fetching
  const [plots, setPlots] = useState([]);

  // Form State
  
  const [customerData, setCustomerData] = useState({
    first_name: '', last_name: '', username: '', email: '', phone: ''
  });
  const [deceasedData, setDeceasedData] = useState({
    deceased_name: '', date_of_birth: '', date_of_death: '', cause_of_death: ''
  });
  const [reservationData, setReservationData] = useState({
    plot_id: '', intended_use_date: '', payment_type: 'Down Payment', amount_paid: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plotRes = await api.get('/plots', { params: { status: 'Available' } });
        setPlots(plotRes.data);
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load plots.' });
      }
    };
    fetchData();
  }, []);

  const selectedPlot = plots.find(p => p.plot_id === parseInt(reservationData.plot_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    if (reservationData.payment_type === 'Full Payment' && selectedPlot) {
      if (parseFloat(reservationData.amount_paid) !== parseFloat(selectedPlot.price)) {
        setAlert({ type: 'danger', message: `Full payment must be exactly ₱${selectedPlot.price.toLocaleString()}` });
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        staff_id: user.user_id,
        is_new_customer: true,
        customer_id: null,
        customer_data: customerData,
        deceased_data: deceasedData,
        plot_id: parseInt(reservationData.plot_id),
        intended_use_date: reservationData.intended_use_date,
        payment_type: reservationData.payment_type,
        amount_paid: parseFloat(reservationData.amount_paid)
      };

      await api.post('/walk-in', payload);
      setSuccess(true);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Transaction failed.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(1);
    setCustomerData({ first_name: '', last_name: '', username: '', email: '', phone: '' });
    setDeceasedData({ deceased_name: '', date_of_birth: '', date_of_death: '', cause_of_death: '' });
    setReservationData({ plot_id: '', intended_use_date: '', payment_type: 'Down Payment', amount_paid: '' });
    
    // Refresh plots
    api.get('/plots', { params: { status: 'Available' } }).then(r => setPlots(r.data));
  };

  if (success) {
    return (
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
        <h2 className="mb-2">Transaction Complete!</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          The customer profile, deceased record, reservation, and payment have all been successfully processed.
        </p>
        <button className="btn btn-primary" onClick={resetForm}>Start New Walk-in</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Walk-in Profiling</h1>
      <Alert type={alert.type} message={alert.message} />

      <div className="card">
        {/* Stepper */}
        <div className="flex justify-between mb-6 border-b" style={{ borderColor: 'var(--border-color)', paddingBottom: '1rem' }}>
          {[
            { num: 1, label: 'Deceased Info', icon: HeartPulse },
            { num: 2, label: 'Plot Selection', icon: MapPin },
            { num: 3, label: 'Payment', icon: CreditCard },
            { num: 4, label: 'Customer Account', icon: UserPlus }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2" style={{ flex: 1, color: step >= s.num ? 'var(--primary)' : 'var(--text-muted)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s.num ? 'rgba(59,130,246,0.1)' : 'var(--background-alt)',
                border: `2px solid ${step >= s.num ? 'var(--primary)' : 'transparent'}`
              }}>
                <s.icon size={20} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          
          {/* STEP 1: DECEASED */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="mb-4">Deceased Information</h3>
              <div className="grid grid-cols-2">
                <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-control" required value={deceasedData.deceased_name} onChange={e=>setDeceasedData({...deceasedData, deceased_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Cause of Death</label><input type="text" className="form-control" value={deceasedData.cause_of_death} onChange={e=>setDeceasedData({...deceasedData, cause_of_death: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-control" required value={deceasedData.date_of_birth} onChange={e=>setDeceasedData({...deceasedData, date_of_birth: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Date of Death</label><input type="date" className="form-control" required value={deceasedData.date_of_death} onChange={e=>setDeceasedData({...deceasedData, date_of_death: e.target.value})} /></div>
              </div>
            </div>
          )}

          {/* STEP 2: PLOT */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="mb-4">Plot Selection</h3>
              <div className="form-group">
                <label className="form-label">Available Plots</label>
                <select className="form-control" required value={reservationData.plot_id} onChange={e => setReservationData({...reservationData, plot_id: e.target.value})}>
                  <option value="">Select a plot...</option>
                  {plots.map(p => (
                    <option key={p.plot_id} value={p.plot_id}>
                      {p.plot_number} ({p.plot_type}) — ₱{parseFloat(p.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPlot && (
                <div className="card mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)' }}>
                  <h4 style={{ margin: 0, color: 'var(--success)' }}>Selected Plot Details</h4>
                  <p style={{ margin: '0.5rem 0 0 0' }}>Plot: <strong>{selectedPlot.plot_number}</strong></p>
                  <p style={{ margin: 0 }}>Type: <strong>{selectedPlot.plot_type}</strong></p>
                  <p style={{ margin: 0 }}>Price: <strong>₱{parseFloat(selectedPlot.price).toLocaleString()}</strong></p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="mb-4">Schedule & Payment</h3>
              
              <div className="form-group">
                <label className="form-label">Intended Interment Date</label>
                <input type="date" className="form-control" required value={reservationData.intended_use_date} onChange={e => setReservationData({...reservationData, intended_use_date: e.target.value})} />
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Payment Type</label>
                  <select className="form-control" required value={reservationData.payment_type} onChange={e => {
                    const type = e.target.value;
                    const amount = (type === 'Full Payment' && selectedPlot) ? selectedPlot.price : reservationData.amount_paid;
                    setReservationData({...reservationData, payment_type: type, amount_paid: amount});
                  }}>
                    <option>Down Payment</option>
                    <option>Full Payment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount Paid (₱)</label>
                  <input type="number" step="0.01" className="form-control" required 
                    value={reservationData.amount_paid} 
                    onChange={e => setReservationData({...reservationData, amount_paid: e.target.value})}
                    readOnly={reservationData.payment_type === 'Full Payment'} 
                  />
                </div>
              </div>

              {selectedPlot && (
                <div className="flex justify-between items-center mb-6" style={{ padding: '1rem', background: 'var(--background-alt)', borderRadius: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Total Plot Price:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>₱{parseFloat(selectedPlot.price).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CUSTOMER */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="mb-4">Customer Information & Account Creation</h3>
              <div className="grid grid-cols-2">
                <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-control" required value={customerData.first_name} onChange={e=>setCustomerData({...customerData, first_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-control" required value={customerData.last_name} onChange={e=>setCustomerData({...customerData, last_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Username</label><input type="text" className="form-control" required value={customerData.username} onChange={e=>setCustomerData({...customerData, username: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" value={customerData.email} onChange={e=>setCustomerData({...customerData, email: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input type="text" className="form-control" value={customerData.phone} onChange={e=>setCustomerData({...customerData, phone: e.target.value})} /></div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={step === 1 || loading}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : step === 4 ? 'Complete Transaction' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkInProfiling;

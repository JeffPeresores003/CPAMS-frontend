import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, ChevronRight } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

// ── Sections ──────────────────────────────────────────────────
const Sections = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ section_name: '', description: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetch = async () => {
    setLoading(true);
    try { const r = await api.get('/sections'); setSections(r.data); }
    catch { setAlert({ type: 'danger', message: 'Failed to load sections.' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sections', form);
      setAlert({ type: 'success', message: 'Section created.' });
      setShowModal(false);
      setForm({ section_name: '', description: '' });
      fetch();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create section.' });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2>Sections</h2>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Section</button>
        )}
      </div>
      <Alert type={alert.type} message={alert.message} />
      <div className="table-container">
        <table>
          <thead><tr><th>Name</th><th>Description</th><th>Blocks</th></tr></thead>
          <tbody>
            {loading ? Array.from({length:3}).map((_,i)=><TableRowSkeleton key={i} cols={3}/>)
              : sections.length === 0 ? <tr><td colSpan="3"><EmptyState message="No sections yet" /></td></tr>
              : sections.map(s => (
                <tr key={s.section_id}>
                  <td>{s.section_name}</td>
                  <td>{s.description || '—'}</td>
                  <td>{s.block_count ?? '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Add Section" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Section Name</label><input type="text" className="form-control" required value={form.section_name} onChange={e=>setForm({...form,section_name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="flex gap-2 mt-2"><button type="submit" className="btn btn-primary">Create</button><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button></div>
          </form>
        </Modal>
      )}
    </>
  );
};

// ── Plots ──────────────────────────────────────────────────────
const Plots = () => {
  const { user } = useAuth();
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [form, setForm] = useState({ block_id: '', plot_number: '', plot_type: 'Private', price: '' });

  const fetchPlots = async () => {
    setLoading(true);
    try { const r = await api.get('/plots'); setPlots(r.data); } catch { setAlert({type:'danger',message:'Failed to load plots.'}); } finally { setLoading(false); }
  };
  const fetchBlocks = async () => {
    try { const r = await api.get('/blocks'); setBlocks(r.data); } catch {}
  };
  useEffect(() => { fetchPlots(); fetchBlocks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/plots', { ...form, price: parseFloat(form.price) });
      setAlert({ type: 'success', message: 'Plot created successfully.' });
      setShowModal(false);
      setForm({ block_id: '', plot_number: '', plot_type: 'Private', price: '' });
      fetchPlots();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.error || 'Failed to create plot.' });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2>Plots</h2>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Plot</button>
        )}
      </div>
      <Alert type={alert.type} message={alert.message} />
      <div className="table-container">
        <table>
          <thead><tr><th>Plot #</th><th>Type</th><th>Price</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? Array.from({length:5}).map((_,i)=><TableRowSkeleton key={i} cols={5}/>)
              : plots.length === 0 ? <tr><td colSpan="5"><EmptyState message="No plots yet" /></td></tr>
              : plots.map(p=>(
                <tr key={p.plot_id}>
                  <td>{p.plot_number}</td>
                  <td><span className={`badge badge-${p.plot_type==='Private'?'info':'success'}`}>{p.plot_type}</span></td>
                  <td>₱{parseFloat(p.price).toLocaleString()}</td>
                  <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Add New Plot" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-2">
            <div className="form-group" style={{gridColumn:'span 2'}}>
              <label className="form-label">Block</label>
              <select className="form-control" required value={form.block_id} onChange={e=>setForm({...form,block_id:e.target.value})}>
                <option value="">Select Block</option>
                {blocks.map(b=><option key={b.block_id} value={b.block_id}>Block {b.block_name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Plot Number</label><input type="text" className="form-control" required value={form.plot_number} onChange={e=>setForm({...form,plot_number:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Type</label><select className="form-control" value={form.plot_type} onChange={e=>setForm({...form,plot_type:e.target.value})}><option>Private</option><option>Public</option></select></div>
            <div className="form-group"><label className="form-label">Price (₱)</label><input type="number" step="0.01" className="form-control" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
            <div style={{gridColumn:'span 2'}} className="flex gap-2 mt-2"><button type="submit" className="btn btn-primary">Create Plot</button><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button></div>
          </form>
        </Modal>
      )}
    </>
  );
};

// ── Main CemeterySetup tab page ────────────────────────────────
const CemeterySetup = () => {
  const [activeTab, setActiveTab] = useState('sections');
  const tabs = ['sections', 'plots'];

  return (
    <div>
      <h1 className="mb-4">Cemetery Setup</h1>
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t}
            className={`btn ${activeTab === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>
      {activeTab === 'sections' && <Sections />}
      {activeTab === 'plots' && <Plots />}
    </div>
  );
};

export default CemeterySetup;

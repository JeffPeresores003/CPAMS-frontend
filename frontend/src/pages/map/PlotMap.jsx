import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Search } from 'lucide-react';

const PlotMap = () => {
  const { user } = useAuth();
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Dimensions for the CSS Grid Map
  const [gridSize, setGridSize] = useState({ maxX: 10, maxY: 10 });

  useEffect(() => {
    const fetchMap = async () => {
      setLoading(true);
      try {
        const url = user.role === 'Customer' ? '/map/my' : '/map';
        const res = await api.get(url);
        
        let mx = 10;
        let my = 10;
        res.data.forEach(p => {
          if (p.coord_x > mx) mx = p.coord_x;
          if (p.coord_y > my) my = p.coord_y;
        });
        
        setGridSize({ maxX: mx, maxY: my });
        setMapData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMap();
  }, [user]);

  const getStatusColor = (status, isMine) => {
    if (isMine) return 'var(--primary)'; // Highlight customer's own plot
    switch (status) {
      case 'Available': return 'var(--status-available)';
      case 'Reserved': return 'var(--status-reserved)';
      case 'Occupied': return 'var(--status-occupied)';
      default: return 'var(--text-muted)';
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 1; y <= gridSize.maxY; y++) {
      for (let x = 1; x <= gridSize.maxX; x++) {
        const plot = mapData.find(p => p.coord_x === x && p.coord_y === y);
        
        const isMatched = search && plot && plot.plot_number.toLowerCase().includes(search.toLowerCase());

        cells.push(
          <div 
            key={`${x}-${y}`} 
            title={plot ? `Plot: ${plot.plot_number}\nStatus: ${plot.status}\nType: ${plot.plot_type}` : 'Empty Space'}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              backgroundColor: plot ? getStatusColor(plot.status, plot.is_mine) : 'rgba(255,255,255,0.05)',
              border: plot ? '1px solid rgba(0,0,0,0.2)' : '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              color: '#fff',
              cursor: plot ? 'pointer' : 'default',
              boxShadow: isMatched ? '0 0 0 4px white' : 'none',
              transform: isMatched ? 'scale(1.1)' : 'none',
              zIndex: isMatched ? 10 : 1,
              transition: 'var(--transition)',
              opacity: plot ? 1 : 0.3
            }}
          >
            {plot ? plot.plot_number : ''}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <h1>{user.role === 'Customer' ? 'My Plot Map' : 'Cemetery Plot Map'}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="flex items-center gap-2" style={{ background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search plot..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className="card mb-4 flex gap-4" style={{ padding: '1rem' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 16, height: 16, background: 'var(--status-available)', borderRadius: 2 }}></div> Available
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 16, height: 16, background: 'var(--status-reserved)', borderRadius: 2 }}></div> Reserved
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 16, height: 16, background: 'var(--status-occupied)', borderRadius: 2 }}></div> Occupied
        </div>
        {user.role === 'Customer' && (
          <div className="flex items-center gap-2 ml-4">
            <div style={{ width: 16, height: 16, background: 'var(--primary)', borderRadius: 2, border: '2px solid white' }}></div> My Plots
          </div>
        )}
      </div>

      <div className="card" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <div>Loading map...</div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridSize.maxX}, 40px)`, 
              gridTemplateRows: `repeat(${gridSize.maxY}, 40px)`,
              gap: '4px',
              padding: '1rem'
            }}
          >
            {renderGrid()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotMap;

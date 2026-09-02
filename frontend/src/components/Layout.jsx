import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '270px',
        padding: '2.5rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxWidth: 'calc(100vw - 270px)',
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

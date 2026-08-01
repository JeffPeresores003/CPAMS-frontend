import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import UserList from './pages/users/UserList';
import PendingCustomers from './pages/users/PendingCustomers';
import WalkInProfiling from './pages/staff/WalkInProfiling';
import CemeterySetup from './pages/admin/CemeterySetup';
import Reports from './pages/admin/Reports';
import Reservations from './pages/staff/Reservations';
import Payments from './pages/staff/Payments';
import DeceasedRecords from './pages/staff/DeceasedRecords';
import MyLovedOnes from './pages/customer/MyLovedOnes';
import MyPayments from './pages/customer/MyPayments';
import MyReservations from './pages/customer/MyReservations';

// Placeholder components for pages not yet implemented
const Placeholder = ({ title }) => <div className="card"><h1>{title}</h1><p>Under construction...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/change-password" element={<ChangePassword />} />
            
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Admin Only Routes */}
              <Route element={<RoleGuard allowedRoles={['Admin']} />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/pending" element={<PendingCustomers />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Staff + Admin Routes */}
              <Route element={<RoleGuard allowedRoles={['Admin', 'Staff']} />}>
                <Route path="/customers/new" element={<WalkInProfiling />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/deceased" element={<DeceasedRecords />} />
                <Route path="/cemetery" element={<CemeterySetup />} />
              </Route>
              
              {/* Customer Routes */}
              <Route element={<RoleGuard allowedRoles={['Customer']} />}>
                <Route path="/my/reservations" element={<MyReservations />} />
                <Route path="/my/payments" element={<MyPayments />} />
                <Route path="/my/deceased" element={<MyLovedOnes />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

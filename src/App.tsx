/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/user/DashboardPage';
import DepositPage from './pages/user/DepositPage';
import WithdrawPage from './pages/user/WithdrawPage';
import InvestPage from './pages/user/InvestPage';
import TransactionsPage from './pages/user/TransactionsPage';
import NotificationsPage from './pages/user/NotificationsPage';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 shadow-lg shadow-emerald-500/20"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/user/dashboard" /> : <LoginPage mode="login" />} />
      <Route path="/signup" element={user ? <Navigate to="/user/dashboard" /> : <LoginPage mode="signup" />} />

      {/* User Protected Routes */}
      <Route path="/user" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/user/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="invest" element={<InvestPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


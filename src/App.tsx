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
import ProfilePage from './pages/user/ProfilePage';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black text-white flex animate-pulse font-sans">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex w-72 flex-col justify-between border-r border-zinc-800/80 p-8 space-y-8 shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800" />
              <div className="h-5 w-32 rounded bg-zinc-800" />
            </div>
            <div className="space-y-3 pt-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800/50" />
              ))}
            </div>
          </div>
          <div className="h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800/50" />
        </div>

        {/* Content Shell Skeleton */}
        <div className="flex-1 p-4 sm:p-8 md:p-14 space-y-6 sm:space-y-12 overflow-hidden">
          <div className="flex justify-between items-end pb-6 sm:pb-8 border-b border-zinc-800/50">
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 w-24 sm:w-32 rounded-full bg-zinc-800" />
              <div className="h-8 sm:h-10 w-48 sm:w-64 rounded-2xl bg-zinc-800" />
            </div>
            <div className="h-10 sm:h-12 w-28 sm:w-36 rounded-2xl bg-zinc-900" />
          </div>
          <div className="h-48 sm:h-72 rounded-3xl sm:rounded-[40px] bg-zinc-900/60 border border-zinc-800/60" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 sm:h-40 rounded-2xl sm:rounded-3xl bg-zinc-900/50 border border-zinc-800/40" />
            ))}
          </div>
        </div>
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
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


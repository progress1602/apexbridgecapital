import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet, 
  History, 
  Bell, 
  LogOut,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/user/dashboard' },
  { icon: ArrowDownCircle, label: 'Deposit', path: '/user/deposit' },
  { icon: ArrowUpCircle, label: 'Withdraw', path: '/user/withdraw' },
  { icon: TrendingUp, label: 'Invest', path: '/user/invest' },
  { icon: History, label: 'Transactions', path: '/user/transactions' },
  { icon: Bell, label: 'Notifications', path: '/user/notifications' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-black text-zinc-100 flex font-sans selection:bg-brand-purple/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-zinc-800/10 bg-brand-black p-8 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-3 mb-12 px-2 group">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(75,47,168,0.2)] group-hover:scale-110 transition-transform duration-500">
             <TrendingUp size={20} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-serif italic uppercase">ApexBridge<span className="text-brand-purple">Capital</span></span>
        </Link>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 ml-4">Terminal Access</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group text-[11px] font-black uppercase tracking-widest border",
                isActive 
                  ? "bg-zinc-800/40 text-brand-purple border-zinc-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)]" 
                  : "text-zinc-500 border-transparent hover:bg-zinc-800/20 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3")} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-zinc-800/50">
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-3xl mb-6 shadow-inner group hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-800 shadow-xl group-hover:scale-105 transition-transform duration-500">
              <img src={`https://i.pravatar.cc/100?u=${user?.name[0]}`} alt="user" className="w-full h-full grayscale" referrerPolicy="no-referrer" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black uppercase tracking-widest truncate text-white">{user?.name.split(' ')[0]}</p>
              <p className="text-[9px] text-brand-purple/60 font-black uppercase tracking-widest mt-0.5">Tier 2 Private</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full text-left text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all group"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Nav Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-black border-b border-zinc-800/80 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-purple rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
            <TrendingUp size={18} className="text-black" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-serif italic uppercase">ApexBridge<span className="text-brand-purple">Capital</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition-all">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 z-40 bg-brand-black pt-32 px-6 overflow-y-auto"
          >
            <nav className="space-y-3 pb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 px-4 italic">Protocol Terminal</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-6 py-5 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all",
                    isActive ? "bg-brand-purple text-black shadow-[0_10px_30px_rgba(75,47,168,0.2)] font-black" : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                  )}
                >
                  <item.icon size={22} />
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-8 mt-8 border-t border-zinc-800/50">
                 <button
                    onClick={handleLogout}
                    className="flex justify-between items-center w-full px-6 py-5 bg-red-500/5 border border-red-500/20 rounded-[24px] text-red-500 text-sm font-black uppercase tracking-widest"
                 >
                    <span>Sign Out Terminal</span>
                    <LogOut size={20} />
                 </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col p-5 lg:p-14 pt-24 lg:pt-14 bg-brand-black relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl w-full mx-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

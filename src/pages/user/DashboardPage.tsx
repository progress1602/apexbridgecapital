import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../hooks/useMockData';
import { cn, formatCurrency } from '../../lib/utils';
import { 
  TrendingUp, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet, 
  Activity, 
  ArrowUpRight,
  PlusCircle,
  CreditCard,
  Clock,
  Bell,
  Info,
  Layers,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, investments } = useMockData();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Capital Matrix Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
            Portfolio <span className="text-zinc-600 italic">Core.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2">Authenticated as <span className="text-white">{user?.name}</span> • Tier 2 Priority</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/user/invest" className="px-8 py-4 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-95">
            Deploy Capital
          </Link>
        </div>
      </div>

      {/* Main Balance Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0c0c0e] border border-zinc-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
           <div className="flex justify-between items-start mb-12">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Valuation</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Real-time</span>
              </div>
           </div>
           <div className="space-y-2">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-mono break-all leading-none">{formatCurrency(user?.balance || 0)}</h2>
              <div className="flex items-center gap-4 text-emerald-400 font-black uppercase tracking-[0.2em] text-xs pt-4">
                 <span className="flex items-center gap-1"><TrendingUp size={14} /> +12.4%</span>
                 <span className="text-zinc-600">vs Benchmark</span>
              </div>
           </div>
           <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-zinc-800/50">
              {[
                { label: 'Staked Capital', val: '$44,200', pct: '75%' },
                { label: 'Yield Accrued', val: '$2,140.22', pct: '11%' },
                { label: 'Market Cap', val: '$1.2B', pct: 'N/A' },
                { label: 'Latency', val: '12ms', pct: 'OPT' }
              ].map((m, i) => (
                <div key={i}>
                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">{m.label}</p>
                   <p className="text-sm font-bold text-zinc-300 font-mono tracking-tight">{m.val}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 bg-emerald-500 rounded-[40px] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(16,185,129,0.1)] group">
           <div>
              <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center text-black mb-10 group-hover:rotate-12 transition-transform">
                 <Zap size={24} />
              </div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-none italic">Velocity <br /> Liquidity.</h3>
              <p className="text-black/50 text-[10px] font-black uppercase tracking-widest mt-4 leading-relaxed">Your capital is set to T+0 instant settlement protocol.</p>
           </div>
           <Link to="/user/deposit" className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
             Refuel Balance <ArrowUpRight size={14} />
           </Link>
        </div>
      </div>

      {/* Grid: Stakes & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Deployments */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-white font-serif italic">Active <span className="text-zinc-600">Deployments.</span></h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {investments.map((inv) => (
              <motion.div 
                key={inv.id} 
                whileHover={{ y: -4 }}
                className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex flex-col sm:flex-row justify-between items-center gap-6 group transition-all hover:bg-[#0c0c0e] hover:border-emerald-500/30"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-[24px] bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-all shadow-inner">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{inv.planName}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Registry: #{inv.id.slice(0,8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 w-full sm:w-auto justify-between sm:justify-end">
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Staked Value</p>
                      <p className="text-2xl font-bold text-white font-mono tracking-tighter">{formatCurrency(inv.amount)}</p>
                   </div>
                   <div className="h-10 w-px bg-zinc-800 hidden sm:block" />
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 font-mono">Current ROI</p>
                      <p className="text-2xl font-bold text-emerald-500 font-mono tracking-tighter">+{inv.roi}</p>
                   </div>
                </div>
              </motion.div>
            ))}
            {investments.length === 0 && (
              <Link to="/user/invest" className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-[40px] text-zinc-600 uppercase tracking-[0.2em] font-black text-xs hover:border-emerald-500/30 hover:text-zinc-400 transition-all">
                Zero active positions. Initialize deployment?
              </Link>
            )}
          </div>
        </section>

        {/* Ledger Proxy */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-white font-serif italic">Ledger <span className="text-zinc-600">Proxy.</span></h3>
          </div>
          <div className="bg-[#0c0c0e] rounded-[40px] border border-zinc-800 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
             <div className="space-y-px">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center py-6 border-b border-zinc-800/50 last:border-0 group cursor-default">
                     <div className="flex gap-4 items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-800 bg-zinc-900 group-hover:border-zinc-700 transition-colors",
                          tx.status === 'approved' && "text-emerald-500/50"
                        )}>
                           {tx.type === 'deposit' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-100 italic">{tx.type} protocol</p>
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-0.5">{tx.method || tx.plan}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={cn("text-base font-bold font-mono tracking-tighter", tx.type === 'withdrawal' ? 'text-zinc-400' : 'text-emerald-400')}>
                          {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-1">{tx.status}</p>
                     </div>
                  </div>
                ))}
             </div>
             <Link to="/user/transactions" className="block w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mt-4">
               Audit Full Ledger
             </Link>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full" />
             <div className="flex gap-6 items-start">
                <Info size={24} className="text-emerald-500 shrink-0 mt-1" />
                <div className="space-y-2">
                   <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Market Intelligence Pulse</h4>
                   <p className="text-xs text-zinc-500 leading-relaxed font-medium">Your active capital is outperforming market benchmarks by <span className="text-white">4.2%</span>. Optimal node for rebalancing detected.</p>
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

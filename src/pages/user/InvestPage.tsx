import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../hooks/useMockData';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Crown, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Info,
  Check,
  Clock,
  Activity,
  History as HistoryIcon,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';

const plans = [
  { 
    id: 'basic', 
    name: 'Starter Node', 
    roi: '8%', 
    duration: '7 Days', 
    min: 100, 
    max: 1000, 
    icon: Zap,
    color: 'from-emerald-500/20 to-teal-500/20',
    features: ['Instant returns', 'Weekly compound', '24/7 Support']
  },
  { 
    id: 'gold', 
    name: 'Premium Flow', 
    roi: '15%', 
    duration: '30 Days', 
    min: 1500, 
    max: 10000, 
    icon: Target,
    color: 'from-emerald-500/30 to-emerald-600/30',
    features: ['High-yield analytics', 'Re-investment option', 'Priority payouts']
  },
  { 
    id: 'vip', 
    name: 'Institutional', 
    roi: '28%', 
    duration: '90 Days', 
    min: 15000, 
    max: 100000, 
    icon: Crown,
    color: 'from-emerald-500 to-emerald-600',
    features: ['Managed portfolio', 'Personal broker', 'Tax optimization']
  },
];

export default function InvestPage() {
  const { user, updateBalance } = useAuth();
  const { addInvestment, addTransaction, investments } = useMockData();
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [amount, setAmount] = useState(plans[0].min.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const fee = Number(amount) * 0.1;
  const totalCharge = Number(amount) + fee;

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || totalCharge > user.balance) return;

    setIsLoading(true);
    setTimeout(() => {
      updateBalance(-totalCharge);
      addInvestment({
        planName: selectedPlan.name,
        amount: Number(amount),
        roi: selectedPlan.roi,
      });
      addTransaction({
        type: 'investment',
        amount: totalCharge,
        status: 'approved',
        plan: selectedPlan.name
      });
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (showProgress) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700 pb-32">
        <div className="flex items-center justify-between">
           <button onClick={() => setShowProgress(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
              <HistoryIcon size={14} /> Close Terminal
           </button>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Live Syncing</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-10">
              {investments.filter(inv => inv.status === 'active').map((inv) => (
                <div key={inv.id} className="bg-[#0c0c0e] border border-zinc-800 rounded-[48px] p-10 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                         <Activity size={24} className="animate-pulse" />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Deployment Active</p>
                      <h3 className="text-4xl font-black text-white font-serif italic italic uppercase tracking-tighter">{inv.planName}</h3>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Entry</p>
                         <p className="text-xl font-bold text-white font-mono tracking-tighter">{formatCurrency(inv.amount)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Target ROI</p>
                         <p className="text-xl font-bold text-emerald-500 font-mono tracking-tighter">{inv.roi}</p>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Commencement</p>
                         <p className="text-sm font-bold text-zinc-400 font-mono tracking-tight">{inv.startDate}</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-10 border-t border-zinc-800/50">
                      <div className="flex justify-between items-end mb-2">
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 font-serif italic">Liquidity Growth Matrix</p>
                         <span className="text-emerald-500 font-mono text-sm font-black">74.2%</span>
                      </div>
                      <div className="h-4 w-full bg-zinc-900 rounded-full border border-zinc-800 p-1">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '74.2%' }}
                           transition={{ duration: 2, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full relative"
                         >
                            <div className="absolute right-0 top-0 w-8 h-full bg-white/20 blur-sm animate-pulse" />
                         </motion.div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                      <div className="p-6 bg-zinc-900/50 border border-emerald-500/10 rounded-3xl space-y-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Projected Earning</p>
                         <p className="text-2xl font-black text-white font-mono tracking-tighter">{formatCurrency(inv.amount * 1.15)}</p>
                      </div>
                      <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl space-y-1 flex items-center justify-between">
                         <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Settlement Cycle</p>
                            <p className="text-lg font-bold text-zinc-400 italic">Pending Unlock</p>
                         </div>
                         <Clock size={20} className="text-zinc-700" />
                      </div>
                   </div>
                </div>
              ))}

              {investments.filter(inv => inv.status === 'active').length === 0 && (
                <div className="py-32 text-center bg-[#0c0c0e] border border-zinc-800 rounded-[56px] space-y-6">
                   <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800 shadow-inner">
                      <Activity size={32} />
                   </div>
                   <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] italic underline decoration-zinc-800/50 underline-offset-8">No active growth matrix</p>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-10 space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 italic">
                    <Target size={14} /> Growth Logistics
                 </h4>
                 <div className="space-y-6">
                    {[
                      { l: 'Node Status', v: 'OPTIMAL', c: 'text-emerald-500' },
                      { l: 'Sync Latency', v: '< 2ms', c: 'text-zinc-400' },
                      { l: 'Protocol Stability', v: '99.98%', c: 'text-zinc-400' },
                      { l: 'Network Hashrate', v: 'Distributed', c: 'text-zinc-400' }
                    ].map((st, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                         <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{st.l}</span>
                         <span className={cn("text-[10px] font-mono font-black", st.c)}>{st.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[48px] p-10 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-emerald-500/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                 <ShieldCheck size={40} className="text-zinc-800 mb-6 group-hover:scale-110 transition-transform" />
                 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic">Protected Staking</p>
                 <p className="text-xs text-zinc-600 mt-4 italic font-medium leading-relaxed">
                   All active capital deployments are collateralized via institutional reserve vaults for zero-drift security.
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 animate-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <CheckCircle2 size={56} className="relative z-10" />
        </div>
        <h1 className="text-4xl font-black uppercase text-white mb-6 tracking-tighter font-serif italic">Capital Stationed.</h1>
        <p className="text-zinc-500 mb-4 px-10 leading-relaxed font-medium text-lg">Your deployment into the <span className="text-emerald-500">{selectedPlan.name}</span> is now active.</p>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-12 max-w-sm mx-auto">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 font-mono">
              <span>Principal</span>
              <span className="text-white">{formatCurrency(Number(amount))}</span>
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono">
              <span>Protocol Fee (10%)</span>
              <span className="text-emerald-500">{formatCurrency(fee)}</span>
           </div>
        </div>
        <button 
          onClick={() => { setAmount(selectedPlan.min.toString()); setIsSuccess(false); setShowProgress(true); }}
          className="px-12 py-5 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
        >
          Monitor Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Strategic Yield Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
            Asset <span className="text-zinc-600 italic">Deployment.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Allocating capital into high-efficiency vaults. Selected nodes are optimized for T+0 instant settlement.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500 italic">
           Available Liquidity: <span className="text-white ml-2 tabular-nums">{formatCurrency(user?.balance || 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => { setSelectedPlan(plan); setAmount(plan.min.toString()); }}
            className={cn(
              "text-left p-10 md:p-12 rounded-[48px] md:rounded-[56px] border transition-all duration-700 relative overflow-hidden group shadow-2xl flex flex-col justify-between h-full min-h-[450px] md:min-h-[500px]",
              selectedPlan.id === plan.id 
                ? "bg-[#0c0c0e] border-emerald-500/40 ring-1 ring-emerald-500/20" 
                : "bg-transparent border-zinc-800/40 hover:bg-[#0c0c0e]/50 hover:border-zinc-700"
            )}
          >
            {selectedPlan.id === plan.id && (
              <div className="absolute top-8 right-10 md:right-12 flex items-center gap-2">
                 <div className="w-1.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">Active Node</span>
              </div>
            )}
            
            <div>
              <div className={cn("inline-flex w-14 h-14 md:w-16 md:h-16 items-center justify-center rounded-[20px] md:rounded-[24px] mb-8 md:mb-12 shadow-inner group-hover:scale-110 transition-transform duration-500", 
                plan.id === 'vip' ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-emerald-500 border border-zinc-700")}>
                <plan.icon size={24} className="md:size-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 font-serif italic tracking-tighter uppercase">{plan.name}</h3>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-6 md:mb-8 italic">{plan.duration} SETTLEMENT</p>
              
              <div className="mb-8 md:mb-12">
                <span className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter font-mono">{plan.roi}</span>
                <span className="text-[10px] text-emerald-500 font-black ml-3 uppercase tracking-widest">Yield Target</span>
              </div>

              <div className="space-y-4 mb-4">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-zinc-400 font-medium">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                       <Check size={10} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800/50 grid grid-cols-2 gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
              <div>
                 <p className="mb-1">Min Entry</p>
                 <p className="text-white font-mono text-sm tracking-tighter">${plan.min}</p>
              </div>
              <div className="text-right">
                 <p className="mb-1">Upper Limit</p>
                 <p className="text-white font-mono text-sm tracking-tighter">{plan.max >= 100000 ? 'INF' : `$${plan.max}`}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Investment Execution Terminal */}
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all opacity-50" />
        <form onSubmit={handleInvest} className="relative z-10 bg-[#0c0c0e] border border-zinc-800 rounded-[48px] md:rounded-[56px] p-8 md:p-16 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-zinc-800/50">
              <div>
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Execution Mode</p>
                 <h2 className="text-2xl md:text-3xl font-black text-emerald-500 font-serif italic tracking-tighter uppercase italic">Vault #{selectedPlan.name.replace(/\s+/g, '')}</h2>
              </div>
              <div className="sm:text-right">
                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Liquidity State</p>
                 <p className="text-sm font-black text-white italic uppercase tracking-widest tabular-nums flex items-center gap-2 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready to Transact
                 </p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-6">
                 <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 italic">
                   <label>Deployment Quantum</label>
                   <span className="text-zinc-600 hidden sm:inline">Wallet: {formatCurrency(user?.balance || 0)}</span>
                 </div>
                 <div className="relative group">
                    <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-emerald-500 text-3xl md:text-5xl font-black italic">$</div>
                    <input
                      type="number"
                      required
                      min={selectedPlan.min}
                      max={selectedPlan.max}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] py-10 md:py-14 pl-16 md:pl-28 pr-12 text-4xl md:text-7xl font-black text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-tighter shadow-inner placeholder:text-zinc-800"
                      placeholder="0"
                    />
                 </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-6 md:p-10 space-y-5 shadow-inner">
                 <div className="flex justify-between items-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 px-2 italic font-mono">
                    <span>Protocol Maintenance Fee (10%)</span>
                    <span className="text-emerald-500/70">+{formatCurrency(fee)}</span>
                 </div>
                 <div className="h-[2px] bg-zinc-800/40 w-full" />
                 <div className="flex justify-between items-center text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-white px-2">
                    <span className="font-serif italic tracking-tighter text-zinc-400">Total Deployment Charge</span>
                    <span className="text-emerald-500 text-xl font-mono tracking-tighter">{formatCurrency(totalCharge)}</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center gap-6 group hover:border-emerald-500/20 transition-all cursor-default relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-all" />
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 shadow-inner group-hover:rotate-6 transition-transform">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Estimated Return</p>
                      <p className="text-2xl font-bold text-white font-mono tracking-tighter">
                        {amount ? formatCurrency(Number(amount) * (1 + parseInt(selectedPlan.roi) / 100)) : '$0.00'}
                      </p>
                    </div>
                 </div>
                 <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center gap-6 group hover:border-emerald-500/20 transition-all cursor-default relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-all" />
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 shadow-inner group-hover:rotate-6 transition-transform">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Release Cycle</p>
                      <p className="text-2xl font-bold text-white font-mono tracking-tighter italic uppercase">{selectedPlan.duration}</p>
                    </div>
                 </div>
              </div>
           </div>

           <button
             type="submit"
             disabled={isLoading || !amount || Number(amount) < selectedPlan.min || totalCharge > (user?.balance || 0)}
             className="w-full py-8 md:py-10 bg-emerald-500 text-black rounded-[32px] md:rounded-[40px] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-emerald-400 transition-all duration-300 disabled:opacity-30 disabled:grayscale shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex items-center justify-center gap-4 group active:scale-[0.98]"
           >
             {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Commence Capital Deployment <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /></>}
           </button>

           {totalCharge > (user?.balance || 0) && (
             <div className="flex items-center justify-center gap-3 text-red-500/80 animate-pulse">
                <AlertTriangle size={14} />
                <p className="text-[9px] font-black uppercase tracking-[0.35em] font-mono italic">Insufficient Protocol Liquidity</p>
             </div>
           )}
        </form>
      </div>

      {/* Investment History Hub */}
      <div className="space-y-12">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800/50 pb-8">
            <div>
               <h2 className="text-3xl md:text-4xl font-black text-white italic font-serif tracking-tighter uppercase italic">Legacy <span className="text-zinc-600">History.</span></h2>
               <p className="text-zinc-500 text-xs font-medium mt-1 font-mono tracking-widest uppercase italic">Archives of all previous capital deployment strings.</p>
            </div>
            <button 
              onClick={() => setShowProgress(true)}
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[9px] rounded-full hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl"
            >
               <Activity size={14} className="text-emerald-500" /> Active Progress Terminal
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {investments.map((inv) => (
              <div key={inv.id} className="bg-[#0c0c0e] border border-zinc-800 rounded-[40px] p-10 hover:border-zinc-700 transition-all group relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HistoryIcon size={40} className="text-zinc-500" />
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className={cn(
                         "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                         inv.status === 'active' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                       )}>
                         {inv.status} Protocol
                       </span>
                       <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase italic">{inv.startDate}</span>
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tighter font-serif">{inv.planName}</h4>
                       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Deployment ID: #{inv.id.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Entry</p>
                          <p className="text-lg font-bold text-white font-mono tracking-tighter">{formatCurrency(inv.amount)}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Yield</p>
                          <p className="text-lg font-bold text-emerald-500 font-mono tracking-tighter">{inv.roi}</p>
                       </div>
                    </div>
                    <button onClick={() => setShowProgress(true)} className="w-full py-4 border border-zinc-800 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all flex items-center justify-center gap-2">
                       Analyze Growth <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
            
            {investments.length === 0 && (
              <div className="col-span-full py-32 text-center bg-[#0c0c0e] border border-zinc-800 rounded-[56px] space-y-6">
                 <HistoryIcon size={48} className="text-zinc-800 mx-auto" />
                 <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] italic underline decoration-zinc-800/50 underline-offset-8">Intelligence Archives Clear</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

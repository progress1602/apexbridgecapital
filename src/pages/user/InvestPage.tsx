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
  Clock
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
  const { addInvestment, addTransaction } = useMockData();
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [amount, setAmount] = useState(plans[0].min.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
              <span>Principal</span>
              <span className="text-white">{formatCurrency(Number(amount))}</span>
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Protocol Fee (10%)</span>
              <span className="text-emerald-500">{formatCurrency(fee)}</span>
           </div>
        </div>
        <button 
          onClick={() => { setAmount(selectedPlan.min.toString()); setIsSuccess(false); }}
          className="px-12 py-5 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
        >
          Monitor Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32">
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
           Available Liquidity: <span className="text-white ml-2">{formatCurrency(user?.balance || 0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => { setSelectedPlan(plan); setAmount(plan.min.toString()); }}
            className={cn(
              "text-left p-12 rounded-[56px] border transition-all duration-700 relative overflow-hidden group shadow-2xl flex flex-col justify-between h-full min-h-[500px]",
              selectedPlan.id === plan.id 
                ? "bg-[#0c0c0e] border-emerald-500/40 ring-1 ring-emerald-500/20" 
                : "bg-transparent border-zinc-800/40 hover:bg-[#0c0c0e]/50 hover:border-zinc-700"
            )}
          >
            {selectedPlan.id === plan.id && (
              <div className="absolute top-8 right-12 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">Active Node</span>
              </div>
            )}
            
            <div>
              <div className={cn("inline-flex w-16 h-16 items-center justify-center rounded-[24px] mb-12 shadow-inner group-hover:scale-110 transition-transform duration-500", 
                plan.id === 'vip' ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-emerald-500 border border-zinc-700")}>
                <plan.icon size={28} />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 font-serif italic tracking-tighter">{plan.name}</h3>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-8 italic">{plan.duration} SETTLEMENT</p>
              
              <div className="mb-12">
                <span className="text-6xl font-black text-white tabular-nums tracking-tighter font-mono">{plan.roi}</span>
                <span className="text-xs text-emerald-500 font-black ml-3 uppercase tracking-widest">Yield Target</span>
              </div>

              <div className="space-y-4 mb-12">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                       <Check size={12} />
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
      <div className="max-w-3xl mx-auto relative group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
        <form onSubmit={handleInvest} className="relative z-10 bg-[#0c0c0e] border border-zinc-800 rounded-[56px] p-12 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center pb-8 border-b border-zinc-800/50">
             <div>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Execution Mode</p>
                <h2 className="text-2xl font-black text-emerald-500 font-serif italic tracking-tighter">Vault #{selectedPlan.name.replace(/\s+/g, '')}</h2>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Liquidity State</p>
                <p className="text-sm font-black text-white italic uppercase tracking-widest tabular-nums">Ready to Transact</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 italic">
               <label>Deployment Quantum</label>
               <span className="text-zinc-600">Wallet: {formatCurrency(user?.balance || 0)}</span>
             </div>
             <div className="relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 text-3xl font-black italic">$</div>
                <input
                  type="number"
                  required
                  min={selectedPlan.min}
                  max={selectedPlan.max}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] py-10 pl-16 pr-10 text-5xl md:text-7xl font-black text-white focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-tighter shadow-inner placeholder:text-zinc-800"
                  placeholder="0.00"
                />
             </div>

             <div className="bg-zinc-900/80 border border-zinc-800 rounded-[32px] p-8 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 px-2 italic">
                   <span>Protocol Maintenance Fee (10%)</span>
                   <span className="text-emerald-500">+{formatCurrency(fee)}</span>
                </div>
                <div className="h-px bg-zinc-800/50 w-full" />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-white px-2">
                   <span>Total Deployment Charge</span>
                   <span className="text-emerald-500 text-lg">{formatCurrency(totalCharge)}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center gap-6 group hover:border-emerald-500/20 transition-all cursor-default relative overflow-hidden">
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
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center gap-6 group hover:border-emerald-500/20 transition-all cursor-default relative overflow-hidden">
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
            className="w-full py-7 bg-emerald-500 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-400 transition-all duration-300 disabled:opacity-30 disabled:grayscale shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex items-center justify-center gap-4 group active:scale-[0.98]"
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
    </div>
  );
}

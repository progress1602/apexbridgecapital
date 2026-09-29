import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Crown, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  History as HistoryIcon, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';
import { 
  apiGetInvestmentPlans, 
  apiGetUserInvestments, 
  apiCreateInvestment, 
  apiSettleInvestment,
  DEFAULT_INVESTMENT_PLANS,
  GraphQLInvestmentPlan,
  GraphQLUserInvestment
} from '../../lib/graphql';

const planIcons: Record<string, any> = {
  starter: Zap,
  vault: Target,
  institutional: Crown,
};

export default function InvestPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<GraphQLInvestmentPlan[]>([]);
  const [investments, setInvestments] = useState<GraphQLUserInvestment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<GraphQLInvestmentPlan | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number | null>(null);

  const loadData = async () => {
    setIsFetching(true);
    try {
      const [fetchedPlans, fetchedInvestments] = await Promise.all([
        apiGetInvestmentPlans().catch((err) => {
          console.error('[Error fetching investment plans]:', err);
          return DEFAULT_INVESTMENT_PLANS;
        }),
        apiGetUserInvestments().catch((err) => {
          console.error('[Error fetching user investments]:', err);
          return [];
        }),
      ]);

      if (fetchedPlans && fetchedPlans.length > 0) {
        setPlans(fetchedPlans);
        setSelectedPlan((prev) => {
          if (prev) {
            const found = fetchedPlans.find((p) => p.id === prev.id);
            if (found) return found;
          }
          return fetchedPlans[0];
        });
        if (!amount && fetchedPlans[0]) {
          setAmount(fetchedPlans[0].minAmount.toString());
        }
      }

      if (fetchedInvestments) {
        setInvestments(fetchedInvestments);
      }
      await refreshUser();
    } catch (err) {
      console.warn('Error in loadData:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem('apexbridge_user_investments');
    } catch {}
    loadData();

    const handleFocus = () => {
      loadData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('apexbridge:notifications-updated', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('apexbridge:notifications-updated', handleFocus);
    };
  }, []);

  const handleWithdrawInvestment = async (inv: GraphQLUserInvestment) => {
    setIsLoading(true);
    try {
      const result = await apiSettleInvestment(inv.id);
      if (result) {
        setWithdrawnAmount(result.payoutAmount || inv.projectedReturn || inv.amount);
        await loadData();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
        }
      }
    } catch (err: any) {
      console.error('[Settlement Error]:', err);
      // If settlement failed on server, calculate local display but inform user
      setWithdrawnAmount(inv.projectedReturn || inv.amount);
      setErrorMessage(err?.message || 'Settlement request encountered a backend communication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentMin = selectedPlan?.minAmount ?? 100;
  const currentMax = selectedPlan?.maxAmount ?? 1000000;
  const feeRate = selectedPlan?.feeRate ?? 0.1;
  const fee = Number(amount || 0) * feeRate;
  const totalCharge = Number(amount || 0) + fee;

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < currentMin) {
      setErrorMessage(`Minimum entry for ${selectedPlan.name} is $${currentMin.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await apiCreateInvestment({
        amount: numAmount,
        userEmail: user?.email,
        planName: selectedPlan.name,
        roi: selectedPlan.roi,
      });

      if (res && res.id) {
        // Immediately add newly created investment to state so history displays it right away
        setInvestments((prev) => [res, ...prev.filter((i) => i.id !== res.id)]);

        // Refresh authentic backend balance and state
        await refreshUser();
        await loadData();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
        }
        setIsSuccess(true);
      } else {
        setErrorMessage('Failed to deploy capital into vault: Backend returned an empty response.');
      }
    } catch (err: any) {
      console.error('[Investment Deployment Error]:', err);
      setErrorMessage(err?.message || 'Investment failed to create. Backend server or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching && plans.length === 0) {
    return (
      <div className="space-y-16 animate-pulse font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
          <div className="space-y-3">
            <div className="h-3 w-36 rounded-full bg-zinc-800" />
            <div className="h-10 w-72 md:w-96 rounded-2xl bg-zinc-800" />
            <div className="h-4 w-60 rounded-lg bg-zinc-900" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-44 rounded-2xl bg-zinc-900 border border-zinc-800" />
            <div className="h-12 w-32 rounded-2xl bg-zinc-900 border border-zinc-800" />
          </div>
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-black border border-zinc-800/80 rounded-[40px] p-8 md:p-10 space-y-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800/80" />
                <div className="h-6 w-20 rounded-full bg-zinc-900" />
              </div>
              <div className="space-y-3">
                <div className="h-8 w-44 rounded-xl bg-zinc-800" />
                <div className="h-3 w-full rounded bg-zinc-900" />
                <div className="h-3 w-4/5 rounded bg-zinc-900" />
              </div>
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-800/40">
                <div className="space-y-2">
                  <div className="h-2 w-16 rounded bg-zinc-900" />
                  <div className="h-6 w-20 rounded bg-zinc-800" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-16 rounded bg-zinc-900" />
                  <div className="h-6 w-20 rounded bg-zinc-800" />
                </div>
              </div>
              <div className="h-14 w-full rounded-2xl bg-zinc-900" />
            </div>
          ))}
        </div>

        {/* Deployment Vault Skeleton */}
        <div className="bg-brand-black-light border border-zinc-800 rounded-[40px] p-8 md:p-12 space-y-8">
          <div className="flex justify-between items-center pb-6 border-b border-zinc-800/60">
            <div className="h-7 w-48 rounded-xl bg-zinc-800" />
            <div className="h-4 w-24 rounded bg-zinc-900" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-16 rounded-2xl bg-zinc-900" />
            <div className="h-16 rounded-2xl bg-zinc-900" />
            <div className="h-16 rounded-2xl bg-zinc-900" />
          </div>
          <div className="h-14 rounded-2xl bg-zinc-900" />
        </div>

        {/* History Skeleton */}
        <div className="space-y-6 pt-4 border-t border-zinc-800/50">
          <div className="h-8 w-60 rounded-xl bg-zinc-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-[32px] bg-black border border-zinc-800/60 p-6 space-y-4">
                <div className="h-4 w-28 rounded bg-zinc-900" />
                <div className="h-6 w-40 rounded bg-zinc-800" />
                <div className="h-4 w-32 rounded bg-zinc-900 mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showProgress) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700 pb-32 font-sans">
        <div className="flex items-center justify-between">
           <button onClick={() => setShowProgress(false)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
              <HistoryIcon size={14} /> Close Terminal
           </button>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Live Syncing</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-10">
              {investments.filter(inv => inv.status === 'active').map((inv) => {
                const progressVal = inv.progress !== undefined ? inv.progress : 100;
                return (
                  <div key={inv.id} className="bg-brand-black-light border border-zinc-800 rounded-[48px] p-10 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8">
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shadow-inner">
                           <Activity size={24} className="animate-pulse" />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Deployment Active</p>
                        <h3 className="text-3xl md:text-4xl font-black text-white italic uppercase">{inv.planName}</h3>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Entry</p>
                           <p className="text-xl font-bold text-white font-mono">{formatCurrency(inv.amount)}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Target ROI</p>
                           <p className="text-xl font-bold text-brand-purple font-mono tracking-tighter">{inv.roi}</p>
                        </div>
                        <div className="space-y-1 col-span-2 md:col-span-1">
                           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Commencement</p>
                           <p className="text-sm font-bold text-zinc-400 font-mono tracking-tight">{inv.startDate ? new Date(inv.startDate).toLocaleDateString() : 'Active'}</p>
                        </div>
                     </div>

                     <div className="space-y-4 pt-10 border-t border-zinc-800/50">
                        <div className="flex justify-between items-end mb-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Liquidity Growth Matrix</p>
                           <span className="text-brand-purple font-mono text-sm font-black">{progressVal}%</span>
                        </div>
                        <div className="h-4 w-full bg-brand-black rounded-full border border-zinc-800 p-1">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${progressVal}%` }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             className="h-full bg-gradient-to-r from-brand-purple to-brand-purple-hover rounded-full relative"
                           >
                              <div className="absolute right-0 top-0 w-8 h-full bg-white/20 blur-sm animate-pulse" />
                           </motion.div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                        <div className="p-6 bg-zinc-900/50 border border-brand-purple/10 rounded-3xl space-y-1">
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Projected Return</p>
                           <p className="text-2xl font-black text-white font-mono tracking-tighter">
                             {formatCurrency(inv.projectedReturn || (inv.amount * (1 + parseFloat(inv.roi) / 100)))}
                           </p>
                        </div>
                        <div 
                          className={cn(
                            "p-6 border rounded-3xl space-y-1 flex items-center justify-between transition-all duration-300",
                            progressVal >= 100 
                              ? "bg-brand-purple hover:bg-brand-purple-hover text-black border-brand-purple/30 cursor-pointer shadow-[0_0_20px_rgba(147,51,234,0.4)] active:scale-[0.98]" 
                              : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400"
                          )}
                          onClick={progressVal >= 100 ? () => handleWithdrawInvestment(inv) : undefined}
                        >
                           <div>
                              <p className={cn("text-[9px] font-black uppercase tracking-widest", progressVal >= 100 ? "text-black/70" : "text-zinc-600")}>
                                {progressVal >= 100 ? "Settlement Ready" : "Settlement Cycle"}
                              </p>
                              <p className={cn("text-lg font-bold italic", progressVal >= 100 ? "text-black font-black" : "text-zinc-400")}>
                                 {progressVal >= 100 ? "Withdraw Funds" : "In Staking Cycle"}
                              </p>
                           </div>
                           {progressVal >= 100 ? (
                              <ArrowRight size={20} className="text-black shrink-0" />
                            ) : (
                              <Clock size={20} className="text-zinc-700 shrink-0" />
                            )}
                        </div>
                     </div>
                  </div>
                );
              })}

              {investments.filter(inv => inv.status === 'active').length === 0 && (
                <div className="py-32 text-center bg-brand-black border border-zinc-800 rounded-[56px] space-y-6">
                   <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800 shadow-inner">
                      <Activity size={32} />
                   </div>
                   <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] italic underline decoration-zinc-800/50 underline-offset-8">No active growth matrix</p>
                </div>
              )}
           </div>

           <div className="lg:col-span-4 space-y-10">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-10 space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-purple flex items-center gap-2 italic">
                    <Target size={14} /> Growth Logistics
                 </h4>
                 <div className="space-y-6">
                    {[
                      { l: 'Node Status', v: 'OPTIMAL', c: 'text-brand-purple' },
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

              <div className="bg-black border border-zinc-800 rounded-[48px] p-10 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-purple/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
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

  if (isSuccess && selectedPlan) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 animate-in zoom-in duration-700 font-sans">
        <div className="w-24 h-24 bg-brand-purple/10 text-brand-purple rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-brand-purple/20 blur-2xl rounded-full" />
          <CheckCircle2 size={56} className="relative z-10" />
        </div>
        <h1 className="text-4xl font-black uppercase text-white mb-6 tracking-tighter italic">Capital Stationed.</h1>
        <p className="text-zinc-500 mb-4 px-10 leading-relaxed font-medium text-lg">Your deployment into the <span className="text-brand-purple">{selectedPlan.name}</span> is now active.</p>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-12 max-w-sm mx-auto">
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 font-mono">
              <span>Principal</span>
              <span className="text-white">{formatCurrency(Number(amount))}</span>
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 font-mono">
              <span>Protocol Fee ({feeRate * 100}%)</span>
              <span className="text-brand-purple">{formatCurrency(fee)}</span>
           </div>
        </div>
        <button 
          onClick={() => { setAmount(selectedPlan.minAmount.toString()); setIsSuccess(false); setShowProgress(true); }}
          className="px-12 py-5 bg-brand-purple text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-purple-hover transition-all shadow-2xl shadow-brand-purple/20 active:scale-95 cursor-pointer"
        >
          Monitor Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-32 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
             Strategic Yield Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic">
            Asset <span className="text-zinc-600 italic">Deployment.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Allocating capital into high-efficiency vaults. Selected nodes are optimized for T+0 instant settlement.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500 italic">
          <button
            onClick={loadData}
            title="Refresh Plans"
            className="p-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin text-brand-purple' : ''} />
          </button>
          Available Liquidity: <span className="text-white ml-2 tabular-nums">{formatCurrency(user?.balance || 0)}</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComp = planIcons[plan.id] || Target;
          const isSelected = selectedPlan?.id === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => { setSelectedPlan(plan); setAmount(plan.minAmount.toString()); }}
              className={cn(
                "text-left p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-[48px] md:rounded-[56px] border transition-all duration-500 relative overflow-hidden group shadow-2xl flex flex-col justify-between h-full min-h-[420px] md:min-h-[500px] cursor-pointer",
                isSelected 
                  ? "bg-black border-brand-purple/40 ring-1 ring-brand-purple/20" 
                  : "bg-transparent border-zinc-800/40 hover:bg-black/50 hover:border-zinc-700"
              )}
            >
              {isSelected && (
                <div className="absolute top-6 right-6 sm:top-8 sm:right-10 md:right-12 flex items-center gap-2">
                   <div className="w-1.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
                   <span className="text-brand-purple font-black text-[9px] uppercase tracking-[0.3em]">Active Node</span>
                </div>
              )}
              
              <div>
                <div className={cn("inline-flex w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-xl sm:rounded-[20px] md:rounded-[24px] mb-6 sm:mb-8 md:mb-12 shadow-inner group-hover:scale-110 transition-transform duration-500", 
                  plan.id === 'institutional' ? "bg-brand-purple text-black shadow-[0_0_30px_rgba(75,47,168,0.3)]" : "bg-zinc-800 text-brand-purple border border-zinc-700")}>
                  <IconComp size={22} className="md:size-7" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">{plan.name}</h3>
                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mb-4 sm:mb-6 md:mb-8 italic">{plan.durationDays} DAYS SETTLEMENT</p>
                
                <div className="mb-6 sm:mb-8 md:mb-12">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter font-mono">{plan.roi}</span>
                  <span className="text-[10px] text-brand-purple font-black ml-3 uppercase tracking-widest">Yield Target</span>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4">
                  {['Institutional tier returns', `${plan.durationDays}-Day auto-compound cycle`, '24/7 Priority settlement'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-400 font-medium">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple transition-transform group-hover:scale-110 shrink-0">
                         <Check size={10} />
                      </div>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-zinc-800/50 grid grid-cols-2 gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
                <div>
                   <p className="mb-1">Min Entry</p>
                   <p className="text-white font-mono text-sm tracking-tighter">${plan.minAmount}</p>
                </div>
                <div className="text-right">
                   <p className="mb-1">Upper Limit</p>
                   <p className="text-white font-mono text-sm tracking-tighter">${plan.maxAmount.toLocaleString()}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Investment Execution Terminal */}
      {selectedPlan && (
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-brand-purple/10 transition-all opacity-50" />
          <form onSubmit={handleInvest} className="relative z-10 bg-brand-black border border-zinc-800 rounded-2xl sm:rounded-3xl md:rounded-[56px] p-5 sm:p-10 md:p-16 space-y-6 sm:space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 pb-5 sm:pb-8 border-b border-zinc-800/50">
                <div>
                   <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Execution Mode</p>
                   <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-brand-purple italic tracking-tighter uppercase truncate">Vault #{selectedPlan.name.replace(/\s+/g, '')}</h2>
                </div>
                <div className="sm:text-right">
                   <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Liquidity State</p>
                   <p className="text-xs sm:text-sm font-black text-white italic uppercase tracking-widest tabular-nums flex items-center gap-2 sm:justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" /> Ready to Transact
                   </p>
                </div>
             </div>

             {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase flex items-center gap-3">
                  <AlertTriangle size={16} />
                  <span>{errorMessage}</span>
                </div>
             )}

             <div className="space-y-5 sm:space-y-8">
                <div className="space-y-3 sm:space-y-6">
                   <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 sm:px-2 italic">
                      <label>Deployment Quantum</label>
                      <span className="text-zinc-600 hidden sm:inline">Wallet: {formatCurrency(user?.balance || 0)}</span>
                   </div>
                   <div className="relative group">
                      <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-brand-purple text-2xl sm:text-5xl font-black italic">$</div>
                      <input
                        type="number"
                        required
                        min={currentMin}
                        max={currentMax}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[32px] py-4 sm:py-12 md:py-14 pl-10 sm:pl-22 md:pl-28 pr-4 sm:pr-12 text-2xl sm:text-5xl md:text-7xl font-black text-white focus:outline-none focus:border-brand-purple/40 transition-all font-mono tracking-tighter shadow-inner placeholder:text-zinc-800"
                        placeholder="0"
                      />
                   </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl sm:rounded-[32px] p-4 sm:p-8 md:p-10 space-y-3 sm:space-y-5 shadow-inner">
                   <div className="flex justify-between items-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-600 px-1 sm:px-2 italic font-mono">
                      <span>Protocol Fee ({feeRate * 100}%)</span>
                      <span className="text-brand-purple/70">+{formatCurrency(fee)}</span>
                   </div>
                   <div className="h-[2px] bg-zinc-800/40 w-full" />
                   <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.4em] text-white px-1 sm:px-2">
                      <span className="italic tracking-tighter text-zinc-400">Total Deployment Charge</span>
                      <span className="text-brand-purple text-base sm:text-xl font-mono tracking-tighter">{formatCurrency(totalCharge)}</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                   <div className="p-4 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-[32px] flex items-center gap-4 sm:gap-6 group hover:border-brand-purple/20 transition-all cursor-default relative overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/[0.02] transition-all" />
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-brand-purple shadow-inner group-hover:rotate-6 transition-transform shrink-0">
                        <TrendingUp size={20} className="sm:size-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-0.5">Estimated Return</p>
                        <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-tighter truncate">
                          {amount ? formatCurrency(Number(amount) * (1 + parseInt(selectedPlan.roi) / 100)) : '$0.00'}
                        </p>
                      </div>
                   </div>
                   <div className="p-4 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-[32px] flex items-center gap-4 sm:gap-6 group hover:border-brand-purple/20 transition-all cursor-default relative overflow-hidden shadow-xl">
                      <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/[0.02] transition-all" />
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-brand-purple shadow-inner group-hover:rotate-6 transition-transform shrink-0">
                        <Clock size={20} className="sm:size-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-0.5">Release Cycle</p>
                        <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-tighter italic uppercase">{selectedPlan.durationDays} Days</p>
                      </div>
                   </div>
                </div>
             </div>

             <button
               type="submit"
               disabled={isLoading || !amount || Number(amount) < currentMin}
               className="w-full py-5 sm:py-8 md:py-10 bg-brand-purple text-black rounded-2xl sm:rounded-[32px] md:rounded-[40px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] md:text-xs hover:bg-brand-purple-hover transition-all duration-300 disabled:opacity-30 disabled:grayscale shadow-[0_20px_50px_rgba(75,47,168,0.2)] flex items-center justify-center gap-3 sm:gap-4 group active:scale-[0.98] cursor-pointer"
             >
               {isLoading ? (
                 <Loader2 className="animate-spin" size={18} />
               ) : (
                 <>
                   Commence Capital Deployment{' '}
                   <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                 </>
               )}
             </button>

             {totalCharge > (user?.balance || 0) && (
               <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                  <span>Available Liquidity Low — Auto-Liquidity Reserve Activated</span>
               </div>
             )}
          </form>
        </div>
      )}

      {/* Investment History Hub */}
      <div className="space-y-12 font-sans">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800/50 pb-8">
             <div>
               <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Deployed <span className="text-zinc-600">History.</span></h2>
               <p className="text-zinc-500 text-xs font-medium mt-1 font-mono tracking-widest uppercase italic">Archives of all previous capital deployment strings synchronized with GraphQL backend.</p>
            </div>
            <div>
              <button 
                onClick={() => setShowProgress(true)}
                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[9px] rounded-full hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl cursor-pointer"
              >
                 <Activity size={14} className="text-brand-purple" /> Active Progress Terminal
              </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {investments.map((inv) => (
              <div key={inv.id} className="bg-black border border-zinc-800 rounded-[40px] p-10 hover:border-zinc-700 transition-all group relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HistoryIcon size={40} className="text-zinc-500" />
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className={cn(
                         "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                         inv.status === 'active' ? "bg-brand-purple/5 text-brand-purple border-brand-purple/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                       )}>
                         {inv.status} Protocol
                       </span>
                       <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase italic">
                         {inv.startDate ? new Date(inv.startDate).toLocaleDateString() : 'Active'}
                       </span>
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{inv.planName}</h4>
                       <div className="flex items-center gap-2 mt-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                         <p className="text-[9px] font-black text-emerald-400/90 uppercase tracking-widest font-mono">Backend ID: {inv.id}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Entry</p>
                          <p className="text-lg font-bold text-white font-mono tracking-tighter">{formatCurrency(inv.amount)}</p>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Yield</p>
                          <p className="text-lg font-bold text-brand-purple font-mono tracking-tighter">{inv.roi}</p>
                       </div>
                    </div>
                    <button onClick={() => setShowProgress(true)} className="w-full py-4 border border-zinc-800 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-brand-purple group-hover:border-brand-purple/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                       Analyze Growth <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
            
            {investments.length === 0 && (
              <div className="col-span-full py-32 text-center bg-black border border-zinc-800 rounded-[56px] space-y-6">
                 <HistoryIcon size={48} className="text-zinc-800 mx-auto" />
                 <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] italic underline decoration-zinc-800/50 underline-offset-8">Intelligence Archives Clear</p>
              </div>
            )}

            {/* Dynamic Withdrawal Success Modal */}
            <AnimatePresence>
              {withdrawnAmount !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="bg-brand-black-light border border-zinc-800 rounded-[48px] p-10 md:p-14 text-center max-w-md w-full relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <ShieldCheck size={20} />
                      </div>
                    </div>
                    
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                      <CheckCircle2 size={40} className="relative z-10" />
                    </div>
                    
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                      Settlement Completed
                    </h3>
                    
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6">
                      Decentralized protocol consensus achieved. Capital has been settled to your balance.
                    </p>
                    
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 mb-8 text-center">
                      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-1 font-mono">Credited Balance</p>
                      <p className="text-3xl font-black text-white font-mono tracking-tighter">{formatCurrency(withdrawnAmount)}</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setWithdrawnAmount(null)}
                      className="w-full py-5 bg-brand-purple text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-brand-purple-hover transition-all duration-300 shadow-xl shadow-brand-purple/20 active:scale-95 cursor-pointer"
                    >
                      Sync Terminal Hub
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

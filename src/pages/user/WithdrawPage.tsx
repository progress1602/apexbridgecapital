import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../hooks/useMockData';
import { 
  ArrowUpCircle, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  Lock,
  Wallet,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  History,
  Check,
  Clock
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function WithdrawPage() {
  const { user, updateBalance } = useAuth();
  const { addTransaction } = useMockData();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fee = Number(amount) * 0.1;
  const netAmount = Number(amount) - fee;
  const totalDeduction = Number(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || totalDeduction > user.balance) return;

    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      updateBalance(-totalDeduction);
      addTransaction({
        type: 'withdrawal',
        amount: totalDeduction,
        status: 'pending',
        method: bankName
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 animate-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <Clock className="relative z-10" size={56} />
        </div>
        <h1 className="text-4xl font-black uppercase text-white mb-6 tracking-tighter font-serif italic uppercase">Protocol Clearance.</h1>
        <p className="text-zinc-500 mb-8 px-10 leading-relaxed font-medium text-lg italic">
          Your transaction is currently <span className="text-white underline decoration-emerald-500/50">Awaiting Admin Approval</span>. 
          <br />
          <span className="text-emerald-500/80 text-sm font-black uppercase tracking-widest mt-4 block">It may take up to 24 hours after withdrawal fee has been made.</span>
        </p>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 mb-12 space-y-6 text-left shadow-2xl">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Total Liquidated</span>
              <span className="text-white">{formatCurrency(Number(amount))}</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500 border-t border-zinc-800/50 pt-6">
              <span>Settlement Interest (10%)</span>
              <span className="text-red-500">-{formatCurrency(fee)}</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white border-t border-zinc-800/50 pt-6">
              <span>Net to Receive</span>
              <span className="text-emerald-500 text-xl font-mono tracking-tighter">{formatCurrency(netAmount)}</span>
           </div>
        </div>

        <button 
          onClick={() => { setAmount(''); setStep(1); setIsSuccess(false); }}
          className="px-12 py-5 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
        >
          Monitor Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Liquidity Outbound
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
            Liquidate <span className="text-zinc-600 italic">Assets.</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500",
                  step >= s ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                )}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                <div className={cn(
                  "hidden md:block h-px w-8 bg-zinc-800",
                  s === 3 && "hidden"
                )} />
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-[56px] p-12 md:p-20 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                >
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2">Liquidation Quantum (USD)</label>
                   <div className="relative group">
                      <span className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-emerald-500 font-black italic text-4xl md:text-5xl">$</span>
                      <input
                        type="number"
                        required
                        value={amount}
                        max={user?.balance}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] py-12 md:py-16 pl-16 md:pl-24 pr-10 text-4xl md:text-8xl font-black text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-zinc-800 shadow-inner font-mono tracking-tighter"
                        placeholder="0"
                      />
                   </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800">
                     <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-zinc-500 px-2 italic">
                        <span>Available for Liquidation</span>
                        <span className="text-white">{formatCurrency(user?.balance || 0)}</span>
                     </div>
                  </div>

                  <button 
                    disabled={!amount || Number(amount) < 20 || Number(amount) > (user?.balance || 0)}
                    onClick={() => setStep(2)}
                    className="w-full py-8 bg-emerald-500 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-400 transition-all disabled:opacity-30 flex items-center justify-center gap-4 group shadow-xl shadow-emerald-500/10"
                  >
                    Initiate Clearance <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-[56px] p-12 md:p-20 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2 flex items-center gap-3">
                         <Building2 size={16} className="text-emerald-500" /> Institution Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Global Treasury Provider"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-[28px] py-6 px-10 text-white font-bold tracking-tight focus:border-emerald-500/40 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2 flex items-center gap-3">
                         <CreditCard size={16} className="text-emerald-500" /> Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="000 000 000 000"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-[28px] py-6 px-10 text-white font-mono tracking-widest focus:border-emerald-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2 flex items-center gap-3">
                       <Wallet size={16} className="text-emerald-500" /> Beneficiary Legal ID
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Identical to Internal Registry Documentation"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-[28px] py-6 px-10 text-white font-bold uppercase focus:border-emerald-500/40 outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-6">
                     <button onClick={() => setStep(1)} className="flex-1 py-7 border border-zinc-800 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:bg-zinc-800 transition-all">Back</button>
                     <button 
                       disabled={!bankName || !accountNumber || !accountName}
                       onClick={() => setStep(3)} 
                       className="flex-[2] py-7 bg-emerald-500 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10"
                     >
                       Validate Credentials
                     </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#0c0c0e] border border-zinc-800 rounded-[56px] p-12 md:p-20 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                >
                  <div className="text-center space-y-6">
                     <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
                        <TrendingUp size={32} />
                     </div>
                     <h2 className="text-3xl font-black text-white italic font-serif tracking-tighter uppercase">Audit Summary.</h2>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800/50 rounded-[40px] overflow-hidden">
                     <div className="p-8 space-y-4 border-b border-zinc-800/50">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                           <span>Principal To Liquidate</span>
                           <span className="text-white font-mono">{formatCurrency(Number(amount))}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                           <span>Settlement Interest Charge (10%)</span>
                           <span className="text-red-500 font-mono">-{formatCurrency(fee)}</span>
                        </div>
                     </div>
                     <div className="p-8 bg-black/40">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-white">
                           <span>Net Disbursed Capital</span>
                           <span className="text-2xl font-mono tracking-tighter text-emerald-500">{formatCurrency(netAmount)}</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex items-start gap-4">
                     <AlertTriangle className="text-emerald-500 shrink-0 mt-1" size={18} />
                     <p className="text-[11px] text-zinc-400 font-bold leading-relaxed italic uppercase">Protocol Integrity Note: All withdrawals require multi-sig manual clearance by admin nodes. Approximate settlement T+1 cycle.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                     <button onClick={() => setStep(2)} className="flex-1 py-7 border border-zinc-800 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:bg-zinc-800 transition-all">Back</button>
                     <button 
                       onClick={handleSubmit}
                       disabled={isSubmitting}
                       className="flex-[2] py-7 bg-emerald-500 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3"
                     >
                       {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Broadcast for Approval <History size={16} /></>}
                     </button>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <div className="p-12 rounded-[56px] bg-zinc-900 border border-zinc-800 shadow-2xl space-y-12">
              <div className="flex items-center gap-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest italic border-b border-zinc-800 pb-8">
                 <ShieldCheck size={18} /> Security Manifest
              </div>
              <ul className="space-y-8">
                {[
                  "Mandatory T+1 settlement delay.",
                  "Zero threshold for drift events.",
                  "10% Protocol Maintenance Feed.",
                  "AES-256 encrypted endpoints."
                ].map((txt, i) => (
                  <li key={i} className="flex gap-4 items-start text-[11px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                     <div className="w-2 h-2 rounded-full border border-emerald-500/50 mt-1.5 shrink-0" />
                     {txt}
                  </li>
                ))}
              </ul>
              <div className="pt-8 border-t border-zinc-800 space-y-4">
                 <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] italic text-center">Liquidity Assurance Level</p>
                 <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-emerald-500" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


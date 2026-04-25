import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../hooks/useMockData';
import { 
  ArrowDownCircle, 
  Upload, 
  Bitcoin, 
  CreditCard, 
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';

const paymentMethods = [
  { id: 'btc', name: 'Bitcoin (BTC)', icon: Bitcoin, color: 'text-emerald-500', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { id: 'eth', name: 'Ethereum (ETH)', icon: Building, color: 'text-blue-500', address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88' },
  { id: 'bank', name: 'Bank Transfer', icon: CreditCard, color: 'text-zinc-500', address: 'ApexBridge Intl / 29384729 / SWIFT: ABCCEU' },
];

export default function DepositPage() {
  const { addTransaction } = useMockData();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(paymentMethods[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(method.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      // Simulate file upload
      setTimeout(() => {
        setFile(selectedFile);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && !file) return;
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      addTransaction({
        type: 'deposit',
        amount: Number(amount),
        status: 'pending',
        method: method.name
      });
      setIsSubmitting(false);
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
        <h1 className="text-4xl font-black uppercase text-white mb-6 tracking-tighter font-serif italic">Protocol Notified.</h1>
        <p className="text-zinc-500 mb-12 px-10 leading-relaxed font-medium text-lg">Deposit request has been broadcasted to our audit nodes. Capital will be stationed into your balance following block confirmation.</p>
        <button 
          onClick={() => { setStep(1); setAmount(''); setIsSuccess(false); }}
          className="px-12 py-5 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
        >
          Station New Liquidity
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-32">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Liquidity Inbound
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
            Station <span className="text-zinc-600 italic">Capital.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Funding your brokerage terminal via encrypted institutional channels. T+1 global settlement standard.
          </p>
        </div>
      </div>

      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[56px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        {/* Steps Header */}
        <div className="flex border-b border-zinc-800/50">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn(
              "flex-1 py-6 text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-r border-zinc-800/50 last:border-0 relative overflow-hidden",
              step === s ? "text-emerald-500 bg-emerald-500/[0.03]" : "text-zinc-600"
            )}>
              {step === s && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500" />}
              Channel 0{s}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-12 md:p-20 space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">Select Settlement Layer</label>
                  <div className="grid grid-cols-1 gap-4">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={cn(
                          "w-full flex items-center justify-between p-8 rounded-[32px] border transition-all duration-500 group",
                          method.id === m.id ? "bg-zinc-900 border-emerald-500/40 shadow-inner" : "bg-transparent border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className={cn("w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform", method.id === m.id ? m.color : "text-zinc-600")}>
                            <m.icon size={24} />
                          </div>
                          <div className="text-left">
                            <span className={cn("text-lg font-black uppercase tracking-tighter italic block", method.id === m.id ? "text-white" : "text-zinc-500")}>{m.name}</span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1">Instant Node Routing</p>
                          </div>
                        </div>
                        {method.id === m.id && (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                             <Check size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">
                    <label>Funding Quantum (USD)</label>
                    <span className="text-emerald-500/60 flex items-center gap-2"><AlertCircle size={12} /> Min: $100.00</span>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-emerald-500 text-3xl font-black italic">$</span>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] py-10 pl-16 pr-10 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-5xl md:text-6xl font-black text-white shadow-inner tracking-tighter"
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  disabled={!amount || Number(amount) < 100}
                  onClick={() => setStep(2)}
                  className="w-full py-7 bg-emerald-500 text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-400 transition-all disabled:opacity-30 shadow-[0_20px_50px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                >
                  Confirm Strategy
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="p-12 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10 text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse" />
                   <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.4em] mb-4 italic">Settlement Required</p>
                   <p className="text-6xl md:text-7xl font-black text-white font-mono tracking-tighter mb-4">{formatCurrency(Number(amount))}</p>
                   <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                      <method.icon size={12} className="text-emerald-500" />
                      <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase italic">{method.name} Transfer Protocol</span>
                   </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2">Protocol Destination</label>
                  <div 
                    onClick={handleCopy}
                    className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] relative font-mono text-sm break-all text-emerald-400/80 group cursor-pointer hover:bg-zinc-800 transition-all border-dashed"
                  >
                    {method.address}
                    <div className={cn(
                      "absolute right-6 top-1/2 -translate-y-1/2 transition-all",
                      copied ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                    )}>
                      <span className={cn(
                        "text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest shadow-xl",
                        copied ? "bg-white text-black" : "bg-emerald-500 text-black"
                      )}>
                        {copied ? 'Captured' : 'Copy Hub'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase text-center italic">Deploy only via the selected protocol to avoid asset drift.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={() => setStep(1)} className="flex-1 py-6 border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-800 transition-colors">Abort</button>
                   <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-emerald-500 text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all">Protocol Transmitted</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12 text-center"
              >
                <div className="space-y-6">
                   <div className="w-24 h-24 rounded-[32px] bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-emerald-500 shadow-inner group transition-transform hover:scale-110">
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={40} />
                      ) : file ? (
                        <Check className="text-emerald-500" size={40} />
                      ) : (
                        <Upload size={40} className="group-hover:translate-y-1 transition-transform" />
                      )}
                   </div>
                   <div>
                      <h3 className="font-black text-3xl text-white uppercase italic tracking-tighter">
                        {isUploading ? 'Syncing...' : file ? 'Proof Locked.' : 'Audit Link.'}
                      </h3>
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-2">
                        {file ? `File: ${file.name}` : 'Station receipt for block verification'}
                      </p>
                   </div>
                </div>

                <div className={cn(
                  "border border-dashed rounded-[40px] p-16 text-center cursor-pointer transition-all group relative overflow-hidden",
                  file ? "border-emerald-500/50 bg-emerald-500/[0.05]" : "border-zinc-800 hover:bg-emerald-500/[0.02] hover:border-emerald-500/30"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                  <input 
                    type="file" 
                    className="hidden" 
                    id="proof-upload" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer space-y-4 relative z-10 block">
                    <p className="text-sm font-black text-white uppercase tracking-widest group-hover:text-emerald-500 transition-colors italic">
                      {file ? 'Re-attach Proof?' : 'Attach Ledger Proof'}
                    </p>
                    <p className="text-[9px] text-zinc-700 font-black tracking-[0.2em] uppercase leading-relaxed">PNG, JPG, or PDF Cluster <br /> (Max Station: 10MB)</p>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     type="button"
                     onClick={() => { setStep(2); setFile(null); }} 
                     className="flex-1 py-6 border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-800"
                   >
                     Back
                   </button>
                   <button 
                     type="submit"
                     disabled={isSubmitting || !file || isUploading}
                     className="flex-[2] py-6 bg-emerald-500 text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Broadcasting Request'}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowDownCircle, 
  Upload, 
  Bitcoin, 
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  RefreshCw,
  Coins,
  Layers,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';
import { 
  apiGetDepositMethods, 
  apiCreateDeposit, 
  GraphQLDepositMethod,
  DEFAULT_DEPOSIT_METHODS,
  getStoredToken
} from '../../lib/graphql';

const methodIcons: Record<string, any> = {
  btc: Bitcoin,
  bitcoin: Bitcoin,
  eth: Layers,
  ethereum: Layers,
};

export default function DepositPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [methods, setMethods] = useState<GraphQLDepositMethod[]>(DEFAULT_DEPOSIT_METHODS);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<GraphQLDepositMethod | null>(DEFAULT_DEPOSIT_METHODS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMethods = async () => {
    setIsLoadingMethods(true);
    try {
      const data = await apiGetDepositMethods();
      if (data && data.length > 0) {
        setMethods(data);
        setMethod((prev) => {
          if (prev) {
            const found = data.find((d) => d.id === prev.id || d.name.toLowerCase() === prev.name.toLowerCase());
            if (found) return found;
          }
          return data[0];
        });
      }
    } catch (err) {
      console.warn('Failed to load deposit methods:', err);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  useEffect(() => {
    loadMethods();
    refreshUser();
  }, [refreshUser]);

  const handleCopy = () => {
    if (!method) return;
    navigator.clipboard.writeText(method.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptBase64(typeof reader.result === 'string' ? reader.result : null);
        setFile(selectedFile);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) return;

    if (!getStoredToken()) {
      setErrorMessage('Your authentication session is missing or expired. Please sign in to create a deposit.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiCreateDeposit({
        method: method.name || method.id,
        amount: Number(amount),
        currency: method.symbol || method.name || 'USD',
        transactionHash: transactionHash.trim() || null,
        receiptImage: receiptBase64 || null,
      });

      if (res && res.id) {
        await refreshUser();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
        }
        setIsSuccess(true);
      }
    } catch (err: any) {
      const msg = err?.message || 'Deposit creation failed.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMethods && methods.length === 0) {
    return (
      <div className="py-32 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Querying GraphQL Deposit Channels...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 animate-in zoom-in duration-700 font-sans">
        <div className="w-24 h-24 bg-brand-purple/10 text-brand-purple rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-brand-purple/20 blur-2xl rounded-full" />
          <CheckCircle2 size={56} className="relative z-10" />
        </div>
        <h1 className="text-4xl font-black uppercase text-white mb-6">Protocol Notified.</h1>
        <p className="text-zinc-500 mb-12 px-10 leading-relaxed font-medium text-lg">
          Deposit request of <span className="text-white font-mono">{formatCurrency(Number(amount))}</span> has been broadcasted to the backend ledger. Balance will be stationed upon verification.
        </p>
        <button 
          onClick={() => { 
            setStep(1); 
            setAmount(''); 
            setFile(null); 
            setReceiptBase64(null);
            setTransactionHash('');
            setIsSuccess(false); 
          }}
          className="px-12 py-5 bg-brand-purple text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-purple-hover transition-all shadow-2xl shadow-brand-purple/20 active:scale-95 cursor-pointer"
        >
          Station New Liquidity
        </button>
      </div>
    );
  }

  const currentMinDeposit = method?.minDeposit ?? 50;

  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-32 font-sans">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
             Liquidity Inbound
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Station <span className="text-zinc-600">Capital.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Funding your brokerage terminal via encrypted institutional channels. T+1 global settlement standard.
          </p>
        </div>
        <button
          onClick={loadMethods}
          title="Refresh Methods"
          className="p-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={isLoadingMethods ? 'animate-spin text-brand-purple' : ''} />
        </button>
      </div>

      <div className="bg-brand-black-light border border-zinc-800 rounded-[56px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Steps Header */}
        <div className="flex border-b border-zinc-800/50">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn(
              "flex-1 py-6 text-center text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-r border-zinc-800/50 last:border-0 relative overflow-hidden",
              step === s ? "text-brand-purple bg-brand-purple/[0.03]" : "text-zinc-600"
            )}>
              {step === s && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-purple" />}
              Channel 0{s}
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="m-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {(errorMessage.includes('Unauthorized') || errorMessage.includes('token') || errorMessage.includes('sign in') || errorMessage.includes('log in')) && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-brand-purple text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-brand-purple-hover transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <LogIn size={12} />
                Authenticate Now
              </button>
            )}
          </div>
        )}

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
                    {methods.map((m) => {
                      const lowerId = (m.id || '').toLowerCase();
                      const lowerName = (m.name || '').toLowerCase();
                      const IconComp = methodIcons[lowerId] || (lowerId.includes('eth') || lowerName.includes('eth') ? Layers : Bitcoin);
                      const isSelected = method?.id === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m)}
                          className={cn(
                            "w-full flex items-center justify-between p-8 rounded-[32px] border transition-all duration-500 group cursor-pointer",
                            isSelected ? "bg-brand-black border-brand-purple/40 shadow-inner" : "bg-transparent border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex items-center gap-6">
                            <div className={cn("w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform text-brand-purple")}>
                              <IconComp size={24} />
                            </div>
                            <div className="text-left">
                              <span className={cn("text-lg font-black uppercase italic block", isSelected ? "text-white" : "text-zinc-500")}>{m.name}</span>
                              <p className="text-[9px] font-black uppercase text-zinc-600 mt-1">Network: {m.network} • Min ${m.minDeposit}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                               <Check size={16} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic font-mono">
                    <label>Funding Quantum (USD)</label>
                    <span className="text-brand-purple/60 flex items-center gap-2"><AlertCircle size={12} /> Min: ${currentMinDeposit}</span>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-brand-purple text-3xl md:text-5xl font-black italic">$</span>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      min={currentMinDeposit}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[32px] py-10 md:py-14 pl-14 md:pl-22 pr-8 focus:outline-none focus:border-brand-purple/40 transition-all font-mono text-4xl md:text-6xl font-black text-white shadow-inner tracking-tighter"
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  disabled={!amount || Number(amount) < currentMinDeposit || !method}
                  onClick={() => setStep(2)}
                  className="w-full py-7 bg-brand-purple text-black rounded-[32px] font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-purple-hover transition-all disabled:opacity-30 shadow-[0_20px_50px_rgba(75,47,168,0.2)] active:scale-[0.98] cursor-pointer"
                >
                  Confirm Strategy
                </button>
              </motion.div>
            )}

            {step === 2 && method && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="p-12 rounded-[40px] bg-brand-purple/5 border border-brand-purple/10 text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-brand-purple/[0.02] animate-pulse" />
                   <p className="text-[10px] text-brand-purple/60 font-black uppercase tracking-[0.4em] mb-4 italic">Settlement Required</p>
                   <p className="text-6xl md:text-7xl font-black text-white font-mono tracking-tighter mb-4">{formatCurrency(Number(amount))}</p>
                   <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                      <span className="text-[9px] text-zinc-400 font-black tracking-widest uppercase italic">{method.name} ({method.network})</span>
                   </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2">Protocol Destination Address</label>
                  <div 
                    onClick={handleCopy}
                    className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] relative font-mono text-sm break-all text-brand-purple-hover/80 group cursor-pointer hover:bg-zinc-800 transition-all border-dashed"
                  >
                    {method.address}
                    <div className={cn(
                      "absolute right-6 top-1/2 -translate-y-1/2 transition-all",
                      copied ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                    )}>
                      <span className={cn(
                        "text-[10px] px-4 py-2 rounded-xl font-black uppercase tracking-widest shadow-xl",
                        copied ? "bg-white text-black" : "bg-brand-purple text-black"
                      )}>
                        {copied ? 'Captured' : 'Copy Hub'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase text-center italic">
                    Requires {method.confirmationsRequired} network confirmations. Deploy only via {method.network}.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     type="button"
                     onClick={() => setStep(1)} 
                     className="flex-1 py-6 border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-800 transition-colors cursor-pointer"
                   >
                     Abort
                   </button>
                   <button 
                     type="button"
                     onClick={() => setStep(3)} 
                     className="flex-[2] py-6 bg-brand-purple text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-purple-hover shadow-xl shadow-brand-purple/20 active:scale-[0.98] transition-all cursor-pointer"
                   >
                     Protocol Transmitted
                   </button>
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
                   <div className="w-24 h-24 rounded-[32px] bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-brand-purple shadow-inner group transition-transform hover:scale-110">
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={40} />
                      ) : file ? (
                        <Check className="text-brand-purple" size={40} />
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
                  "border border-dashed rounded-[40px] p-12 text-center cursor-pointer transition-all group relative overflow-hidden",
                  file ? "border-brand-purple/50 bg-brand-purple/[0.05]" : "border-zinc-800 hover:bg-brand-purple/[0.02] hover:border-brand-purple/30"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-purple/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                  <input 
                    type="file" 
                    className="hidden" 
                    id="proof-upload" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer space-y-4 relative z-10 block">
                    <p className="text-sm font-black text-white uppercase tracking-widest group-hover:text-brand-purple transition-colors italic">
                      {file ? 'Re-attach Proof Receipt?' : 'Attach Ledger Proof / Receipt'}
                    </p>
                    <p className="text-[9px] text-zinc-700 font-black tracking-[0.2em] uppercase leading-relaxed">PNG, JPG, or PDF (Max: 10MB)</p>
                  </label>
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic pl-2">
                    Transaction Hash / TXID (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="e.g. 0x4f8b92e... or TXID"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-[24px] py-4 px-6 text-white font-mono text-xs focus:border-brand-purple/40 outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                     type="button"
                     onClick={() => { setStep(2); setFile(null); }} 
                     className="flex-1 py-6 border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-800 cursor-pointer"
                   >
                     Back
                   </button>
                   <button 
                     type="submit"
                     disabled={isSubmitting || isUploading}
                     className="flex-[2] py-6 bg-brand-purple text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-purple-hover shadow-xl shadow-brand-purple/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30 cursor-pointer"
                   >
                     {isSubmitting ? (
                       <Loader2 className="animate-spin" size={18} />
                     ) : file ? (
                       'Transmit With Proof Receipt'
                     ) : (
                       'Transmit Deposit Request'
                     )}
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

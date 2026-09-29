import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { 
  apiGetTransactions, 
  GraphQLTransaction 
} from '../../lib/graphql';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  TrendingUp, 
  Search, 
  Filter,
  Download,
  X,
  ShieldCheck,
  Globe,
  FileText,
  BadgeCheck,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TransactionsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<GraphQLTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'investment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'failed' | 'canceled'>('all');
  
  const [selectedTx, setSelectedTx] = useState<GraphQLTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Clear legacy mock data from browser storage so it never pollutes the view
  useEffect(() => {
    try {
      localStorage.removeItem('apexbridge_transactions');
    } catch {
      // ignore
    }
  }, []);

  const loadTransactions = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      // Query backend with base variables as requested: { type: "", status: "", page: 1, limit: 100 }
      const res = await apiGetTransactions({
        type: '',
        status: '',
        page: 1,
        limit: 100,
      });

      setTransactions(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error('[Transactions Query Error]:', err);
      setFetchError(err?.message || 'Unable to fetch transactions from server.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions(false);

    // Auto-refresh when returning to tab from playground
    const handleFocus = () => {
      loadTransactions(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTransactions(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous 10-second polling to reflect real-time playground transactions
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadTransactions(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return transactions.filter(tx => {
      const idMatch = (tx.id || '').toLowerCase().includes(query);
      const planMatch = (tx.plan || '').toLowerCase().includes(query);
      const typeMatch = (tx.type || '').toLowerCase().includes(query);
      const statusMatch = (tx.status || '').toLowerCase().includes(query);
      const matchesSearch = !query || idMatch || planMatch || typeMatch || statusMatch;

      const txType = (tx.type || '').toLowerCase();
      const matchesType = activeFilter === 'all' || txType === activeFilter;

      const txStatus = (tx.status || '').toLowerCase();
      let matchesStatus = false;
      if (statusFilter === 'all') {
        matchesStatus = true;
      } else if (statusFilter === 'approved') {
        matchesStatus = txStatus === 'approved' || txStatus === 'completed' || txStatus === 'success';
      } else if (statusFilter === 'pending') {
        matchesStatus = txStatus === 'pending' || txStatus === 'processing';
      } else if (statusFilter === 'failed') {
        matchesStatus = txStatus === 'failed' || txStatus === 'rejected';
      } else if (statusFilter === 'canceled') {
        matchesStatus = txStatus === 'canceled' || txStatus === 'cancelled';
      } else {
        matchesStatus = txStatus === statusFilter;
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, activeFilter, statusFilter]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved' || s === 'completed' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
          <CheckCircle2 size={11} /> {status}
        </span>
      );
    }
    if (s === 'pending' || s === 'processing') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border text-amber-400 border-amber-500/20 bg-amber-500/10">
          <Clock size={11} className="animate-spin text-amber-400" /> {status}
        </span>
      );
    }
    if (s === 'canceled' || s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border text-zinc-400 border-zinc-700 bg-zinc-800">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border text-red-400 border-red-500/20 bg-red-500/10">
        <XCircle size={11} /> {status || 'failed'}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'deposit') {
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <ArrowDownCircle size={18} />
        </div>
      );
    }
    if (t === 'withdrawal') {
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <ArrowUpCircle size={18} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-brand-purple/10 text-brand-purple border-brand-purple/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
        <TrendingUp size={18} />
      </div>
    );
  };

  const formatAmountSign = (type: string, amount: number) => {
    const t = (type || '').toLowerCase();
    const isNegative = t === 'withdrawal' || t === 'investment';
    return {
      prefix: isNegative ? '-' : '+',
      colorClass: isNegative ? 'text-red-400' : 'text-emerald-400',
    };
  };

  const totalVolume = transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const approvedVolume = transactions
    .filter(tx => {
      const s = (tx.status || '').toLowerCase();
      return s === 'approved' || s === 'completed' || s === 'success';
    })
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
             Live Ledger Query Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Ledger <span className="text-zinc-600">History.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Immutable record of all protocol transactions fetched live from the backend ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => loadTransactions(true)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2 px-5 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:border-zinc-700 transition-all active:scale-95 disabled:opacity-50"
            title="Re-query live transactions from GraphQL backend"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-brand-purple" : ""} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>

          <button 
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-3 px-7 py-4 bg-white text-black border border-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
          >
            <Download size={14} /> Audit Report
          </button>
        </div>
      </div>

      {/* Query error alert if any */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span className="break-words leading-relaxed">{fetchError}</span>
          </div>
          <div className="flex items-center gap-2">
            {fetchError.toLowerCase().includes('unauthorized') && (
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-3 py-1 bg-brand-purple text-black rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-brand-purple-hover flex items-center gap-1.5"
              >
                <LogIn size={12} /> Sign In
              </button>
            )}
            <button 
              onClick={() => loadTransactions(false)}
              className="px-3 py-1 bg-red-500/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500/30"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-purple transition-colors pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, operation, or plan..." 
            className="w-full bg-brand-black border border-zinc-800 rounded-[22px] py-4 pl-14 pr-6 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-brand-purple/50 shadow-inner transition-all font-semibold"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           {/* Type Filter */}
           <div className="relative group flex-1 md:flex-none">
             <select 
               value={activeFilter}
               onChange={(e) => setActiveFilter(e.target.value as any)}
               className="w-full appearance-none pl-11 pr-10 py-4 bg-brand-black border border-zinc-800 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 focus:outline-none focus:border-brand-purple/50 cursor-pointer"
             >
               <option value="all">All Types</option>
               <option value="deposit">Deposits</option>
               <option value="withdrawal">Withdrawals</option>
               <option value="investment">Investments</option>
             </select>
             <Filter size={13} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-purple pointer-events-none" />
           </div>
           
           {/* Status Filter */}
           <div className="relative group flex-1 md:flex-none">
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="w-full appearance-none pl-11 pr-10 py-4 bg-brand-black border border-zinc-800 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 focus:outline-none focus:border-brand-purple/50 cursor-pointer"
             >
               <option value="all">All Status</option>
               <option value="approved">Approved</option>
               <option value="pending">Pending</option>
               <option value="failed">Failed</option>
               <option value="canceled">Canceled</option>
             </select>
             <TrendingUp size={13} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-purple pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-black border border-zinc-800/80 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent pointer-events-none" />

        {/* Loading Skeleton */}
        {isLoading && (
          <div>
            {/* Desktop Table Skeleton */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800/60 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 bg-zinc-950/40">
                    <th className="px-8 py-6">Transaction ID</th>
                    <th className="px-8 py-6">Operation</th>
                    <th className="px-6 py-6 min-w-[180px] max-w-[280px]">Plan / Channel</th>
                    <th className="px-8 py-6">Timestamp</th>
                    <th className="px-8 py-6 text-right">Quantum</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-8 py-6">
                        <div className="h-4 w-24 bg-zinc-800/70 rounded" />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-4 w-20 bg-zinc-800/70 rounded" />
                            <div className="h-2.5 w-12 bg-zinc-900 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 min-w-[180px] max-w-[280px]">
                        <div className="h-6 w-32 bg-zinc-800/60 rounded-xl" />
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-3.5 w-24 bg-zinc-900 rounded" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="h-5 w-20 bg-zinc-800/80 rounded ml-auto" />
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="h-6 w-20 bg-zinc-800/60 rounded-full mx-auto" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="h-4 w-16 bg-zinc-900 rounded ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Skeleton */}
            <div className="block lg:hidden divide-y divide-zinc-800/60 p-4 space-y-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="p-4 space-y-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/70" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-24 bg-zinc-800/70 rounded" />
                        <div className="h-3 w-16 bg-zinc-900 rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-zinc-800/50 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-2xl bg-zinc-900/60" />
                    <div className="h-16 rounded-2xl bg-zinc-900/60" />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-3 w-20 bg-zinc-900 rounded" />
                    <div className="h-3 w-16 bg-zinc-900 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTransactions.length === 0 && (
          <div className="py-24 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-5 shadow-inner">
               <History size={28} />
            </div>
            <h3 className="text-white font-black uppercase text-sm tracking-[0.25em] mb-2">
              No Ledger Records Found
            </h3>
            <p className="text-zinc-500 text-xs font-medium max-w-sm leading-relaxed mb-6">
              {searchQuery || activeFilter !== 'all' || statusFilter !== 'all'
                ? 'No live transactions match your specified filter parameters.'
                : 'Your ledger is currently clear. Transactions initiated via deposits, capital plans, or withdrawals will reflect here immediately.'}
            </p>
            {(searchQuery || activeFilter !== 'all' || statusFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setStatusFilter('all');
                }}
                className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Mobile View: Cards */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="block lg:hidden divide-y divide-zinc-800/60">
            {filteredTransactions.map((tx) => {
              const { prefix, colorClass } = formatAmountSign(tx.type, tx.amount);
              return (
                <div key={tx.id} className="p-6 space-y-5 hover:bg-zinc-900/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      {getTypeIcon(tx.type)}
                      <div>
                        <span className="font-black text-white uppercase italic block text-base leading-tight">
                          {tx.type || 'Transaction'}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-zinc-500">
                            #{String(tx.id).slice(0, 10)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(tx.id, tx.id)}
                            className="text-zinc-600 hover:text-zinc-300 transition-colors"
                            title="Copy ID"
                          >
                            {copiedId === tx.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/50">
                      <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">Quantum</p>
                      <span className={cn("font-black font-mono text-base tracking-tight block", colorClass)}>
                        {prefix}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/50 min-w-0 flex flex-col justify-between">
                      <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest mb-1">Plan / Channel</p>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-200 break-words leading-snug">
                        {tx.plan || tx.method || 'Standard Clearance'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 pt-1">
                    <span>{tx.date || 'Pending timestamp'}</span>
                    <button 
                      onClick={() => setSelectedTx(tx)}
                      className="text-[9px] font-black uppercase tracking-wider text-brand-purple hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop View: Table */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800/60 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 bg-zinc-950/40">
                  <th className="px-8 py-6">Transaction ID</th>
                  <th className="px-8 py-6">Operation</th>
                  <th className="px-6 py-6 min-w-[180px] max-w-[280px]">Plan / Channel</th>
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6 text-right">Quantum</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-sm">
                {filteredTransactions.map((tx) => {
                  const { prefix, colorClass } = formatAmountSign(tx.type, tx.amount);
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.015] transition-colors group">
                      <td className="px-8 py-6 font-mono text-[11px] text-zinc-500 font-bold tracking-wider group-hover:text-zinc-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <span>#{String(tx.id).slice(0, 12)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.id, tx.id)}
                            className="opacity-40 group-hover:opacity-100 hover:text-white transition-opacity"
                            title="Copy full transaction ID"
                          >
                            {copiedId === tx.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3.5">
                          {getTypeIcon(tx.type)}
                          <div>
                            <span className="font-black text-white uppercase italic block text-base leading-none">
                              {tx.type}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1 block">
                              Verified
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 min-w-[180px] max-w-[280px] whitespace-normal">
                        <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px] px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl inline-block max-w-full break-words leading-relaxed">
                          {tx.plan || tx.method || 'Standard Clearance'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-zinc-500 font-mono text-[11px]">
                        {tx.date || 'Pending sync'}
                      </td>
                      <td className="px-8 py-6 text-right font-mono font-black text-base tracking-tight">
                        <span className={colorClass}>
                          {prefix}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedTx(tx)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-black border border-zinc-800 rounded-[36px] p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Info size={18} className="text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white tracking-tight">Transaction Detail</h3>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol Ledger Entry</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Transaction Hash / ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-white break-all">{selectedTx.id}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTx.id, 'modal')}
                      className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] font-mono text-zinc-300 hover:text-white shrink-0"
                    >
                      {copiedId === 'modal' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Operation</p>
                    <p className="font-black text-white uppercase text-sm">{selectedTx.type}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                    <div>{getStatusBadge(selectedTx.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Amount</p>
                    <p className="font-mono font-black text-white text-base">{formatCurrency(selectedTx.amount)}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Plan / Channel</p>
                    <p className="font-bold text-zinc-200 text-xs break-words leading-relaxed">{selectedTx.plan || selectedTx.method || 'Standard Clearance'}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Timestamp</p>
                  <p className="font-mono text-xs text-zinc-300">{selectedTx.date || 'Pending sync'}</p>
                </div>

                {selectedTx.receiptImage && (
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/60">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Attached Proof Receipt</p>
                    <div className="rounded-xl overflow-hidden border border-zinc-800 max-h-48 flex items-center justify-center bg-black/60 p-2">
                      <img 
                        src={selectedTx.receiptImage} 
                        alt="Deposit Receipt" 
                        className="max-h-44 w-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audit Report Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowAuditModal(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-sm"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-4xl bg-white text-zinc-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
             >
                {/* Modal Header */}
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                         <ShieldCheck className="text-white" size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black italic font-serif tracking-tight uppercase">Protocol Audit Report</h3>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Ref ID: APEX-LEDGER-LIVE</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setShowAuditModal(false)}
                     className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                   >
                     <X size={18} />
                   </button>
                </div>

                {/* Report Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white">
                   <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8">
                      <div className="space-y-3">
                         <div className="text-3xl font-black font-serif italic uppercase tracking-tighter">ApexBridge<span className="text-brand-purple">Capital</span></div>
                         <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                            Institutional Liquidity Hub<br />
                            Zürich, Switzerland • Registry No. 883.21<br />
                            security@apexbridge.protocol
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="inline-block px-3 py-1.5 border-2 border-zinc-900 text-zinc-900 text-[10px] font-black uppercase tracking-widest mb-3">CONFIDENTIAL</div>
                         <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                           Issuance: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                         </div>
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Total Ledger Volume</p>
                         <p className="text-2xl font-black italic tracking-tighter text-zinc-900">{formatCurrency(totalVolume)}</p>
                         <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-brand-purple uppercase">
                            <TrendingUp size={12} /> Live Backend Feed
                         </div>
                      </div>
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Verified Operations</p>
                         <p className="text-2xl font-black italic tracking-tighter text-zinc-900">{transactions.length} Events</p>
                         <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase">
                            <BadgeCheck size={12} /> {transactions.length > 0 ? 'Backend Synchronized' : 'Clear Ledger'}
                         </div>
                      </div>
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Settled Volume</p>
                         <p className="text-2xl font-black italic tracking-tighter text-zinc-900">{formatCurrency(approvedVolume)}</p>
                         <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase">
                            <Globe size={12} /> Validated Status
                         </div>
                      </div>
                   </div>

                   {/* Protocol Compliance */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] border-b border-zinc-100 pb-3">Protocol Compliance Summary</h4>
                      <div className="space-y-4">
                         {[
                           { label: 'Backend Clearance', status: 'Live', desc: 'Direct GraphQL protocol queries without client synthetic data.' },
                           { label: 'Security Handshake', status: 'Encrypted', desc: 'Token bearer validation and sanitized session telemetry.' },
                           { label: 'Ledger Auditability', status: 'Compliant', desc: 'Full event tracking maintained on production database.' }
                         ].map((item, idx) => (
                           <div key={idx} className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-full border border-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                                 <FileText size={14} className="text-zinc-900" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-black text-xs uppercase tracking-widest">{item.label}</h5>
                                    <span className="text-[8px] font-black text-brand-purple uppercase tracking-widest bg-brand-purple/10 px-2 py-0.5 rounded">{item.status}</span>
                                 </div>
                                 <p className="text-[11px] text-zinc-500 font-bold leading-normal">{item.desc}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="pt-8 border-t-2 border-zinc-100 flex justify-between items-end">
                      <div className="space-y-1">
                         <div className="w-36 h-0.5 bg-zinc-900" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">ApexBridge System Core</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Automated Ledger Officer</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => window.print()}
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors"
                         >
                            <Download size={13} /> Print Report
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

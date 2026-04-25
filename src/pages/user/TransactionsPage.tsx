import { useState, useMemo } from 'react';
import { useMockData } from '../../hooks/useMockData';
import { formatCurrency } from '../../lib/utils';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  TrendingUp, 
  Search, 
  Filter,
  Download,
  MoreVertical,
  X,
  ShieldCheck,
  Globe,
  FileText,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TransactionsPage() {
  const { transactions } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'investment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'failed'>('all');
  const [showAuditModal, setShowAuditModal] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (tx.method || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (tx.plan || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeFilter === 'all' || tx.type === activeFilter;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, activeFilter, statusFilter]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Audit Trail
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-serif italic">
            Ledger <span className="text-zinc-600 italic">History.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Immutable record of all protocol interactions, clearing, and settlement activities documented in real-time.
          </p>
        </div>
        <button 
          onClick={() => setShowAuditModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black border border-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-2xl active:scale-95"
        >
          <Download size={14} /> Comprehensive Audit Report
        </button>
      </div>

      {/* Filters/Search Hub */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hash, institution or transaction ID..." 
            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-[28px] py-6 pl-16 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/40 shadow-inner transition-all font-bold tracking-tight"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative group flex-1 md:flex-none">
             <select 
               value={activeFilter}
               onChange={(e) => setActiveFilter(e.target.value as any)}
               className="w-full appearance-none px-12 py-6 bg-[#0c0c0e] border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
             >
               <option value="all">All Layers</option>
               <option value="deposit">Deposits</option>
               <option value="withdrawal">Withdrawals</option>
               <option value="investment">Investments</option>
             </select>
             <Filter size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
           </div>
           
           <div className="relative group flex-1 md:flex-none">
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="w-full appearance-none px-12 py-6 bg-[#0c0c0e] border border-zinc-800 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
             >
               <option value="all">All Status</option>
               <option value="approved">Approved</option>
               <option value="pending">Pending</option>
               <option value="failed">Failed</option>
             </select>
             <TrendingUp size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800/50 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                <th className="px-10 py-8">Tx Hash</th>
                <th className="px-10 py-8">Operation</th>
                <th className="px-10 py-8">Gateway</th>
                <th className="px-10 py-8">Timestamp</th>
                <th className="px-10 py-8 text-right">Quantum</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.015] transition-all group">
                  <td className="px-10 py-8 font-mono text-[11px] text-zinc-600 font-bold tracking-widest group-hover:text-emerald-500/60 transition-colors">#{tx.id.toUpperCase()}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110",
                        tx.type === 'deposit' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : 
                        tx.type === 'withdrawal' ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "bg-zinc-800 text-zinc-300 border-zinc-700"
                      )}>
                        {tx.type === 'deposit' ? <ArrowDownCircle size={16} /> : 
                         tx.type === 'withdrawal' ? <ArrowUpCircle size={16} /> : <TrendingUp size={16} />}
                      </div>
                      <div>
                        <span className="font-black text-white uppercase tracking-tighter italic block text-lg leading-none">{tx.type}</span>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 mt-1">Validated</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-zinc-400 font-black uppercase tracking-widest text-[11px] px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full italic">
                      {tx.method || tx.plan || 'Clearing'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-zinc-500 font-black uppercase tracking-widest text-[10px] font-mono">{tx.date}</td>
                  <td className="px-10 py-8 text-right">
                    <span className={cn(
                      "font-black tabular-nums font-mono text-xl tracking-tighter",
                      tx.type === 'withdrawal' || tx.type === 'investment' ? "text-red-500" : "text-white"
                    )}>
                      {tx.type === 'withdrawal' || tx.type === 'investment' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border shadow-inner",
                      tx.status === 'approved' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : 
                      tx.status === 'pending' ? "text-blue-500 border-blue-500/20 bg-blue-500/5" : "text-red-500 border-red-500/20 bg-red-500/5"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 hover:text-white hover:border-zinc-500 transition-all shadow-inner">
                       <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <History size={48} className="text-zinc-800" />
                       <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] italic leading-none underline decoration-zinc-800/50 underline-offset-8">No matching records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-4xl bg-white text-zinc-900 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] flex flex-col max-h-[90vh]"
             >
                {/* Modal Header */}
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                         <ShieldCheck className="text-white" size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black italic font-serif tracking-tight uppercase">Protocol Audit Report</h3>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Ref ID: AB-LEDGER-2026-XQ</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setShowAuditModal(false)}
                     className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                   >
                     <X size={20} />
                   </button>
                </div>

                {/* Report Content - Styled to look like a document */}
                <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white">
                   {/* Official Letterhead Heading */}
                   <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-12">
                      <div className="space-y-4">
                         <div className="text-3xl font-black font-serif italic uppercase tracking-tighter">ApexBridge<span className="text-emerald-500">Capital</span></div>
                         <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-loose">
                            Institutional Liquidity Hub<br />
                            Zürich, Switzerland • Registry No. 883.21<br />
                            security@apexbridge.protocol
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="inline-block px-4 py-2 border-2 border-zinc-900 text-zinc-900 text-[10px] font-black uppercase tracking-widest mb-4">CONFIDENTIAL</div>
                         <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Date of Issuance: April 24, 2026</div>
                      </div>
                   </div>

                   {/* Report Stats Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Net Asset Valuation</p>
                         <p className="text-3xl font-black italic tracking-tighter text-zinc-900">{formatCurrency(transactions.reduce((acc, tx) => acc + tx.amount, 0))}</p>
                         <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase">
                            <TrendingUp size={12} /> Positive Variance
                         </div>
                      </div>
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Verified Operations</p>
                         <p className="text-3xl font-black italic tracking-tighter text-zinc-900">{transactions.length} Events</p>
                         <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase">
                            <BadgeCheck size={12} /> 100% Integrity
                         </div>
                      </div>
                      <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                         <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Terminal State</p>
                         <p className="text-3xl font-black italic tracking-tighter text-zinc-900">SECURE</p>
                         <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase">
                            <Globe size={12} /> GMT+1 SYNC
                         </div>
                      </div>
                   </div>

                   {/* Audit Details */}
                   <div className="space-y-8">
                      <h4 className="text-sm font-black uppercase tracking-[0.25em] border-b border-zinc-100 pb-4">Protocol Compliance Summary</h4>
                      <div className="space-y-6">
                         {[
                           { label: 'Layer 1 Validation', status: 'Passed', desc: 'All transaction hashes verified against institutional registry.' },
                           { label: 'Liquidity Solvency', status: 'Verified', desc: 'Sufficient capital reserves documented for all active deployment strings.' },
                           { label: 'Security Handshake', status: 'Encrypted', desc: 'AES-256 end-to-end telemetry confirmed for every ledger event.' }
                         ].map((item, idx) => (
                           <div key={idx} className="flex gap-6 items-start">
                              <div className="w-10 h-10 rounded-full border-2 border-zinc-900 flex items-center justify-center shrink-0">
                                 <FileText size={18} className="text-zinc-900" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-black text-xs uppercase tracking-widest">{item.label}</h5>
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">{item.status}</span>
                                 </div>
                                 <p className="text-[11px] text-zinc-500 font-bold tracking-tight leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Footer Sign-off */}
                   <div className="pt-12 border-t-2 border-zinc-100 flex justify-between items-end">
                      <div className="space-y-2">
                         <div className="w-48 h-1 bg-zinc-900" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">ApexBridge System Core</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Automated Compliance Officer</p>
                      </div>
                      <div className="flex items-center gap-6">
                         <button 
                           onClick={() => alert('Intelligence Export Initiated: APEX-REPORT.pdf generated.')}
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all active:scale-95"
                         >
                            <Download size={14} /> Export PDF
                         </button>
                         <button 
                           onClick={() => window.open('https://etherscan.io', '_blank')}
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all active:scale-95"
                         >
                            <ExternalLink size={14} /> Ledger Link
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


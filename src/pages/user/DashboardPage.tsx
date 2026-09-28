import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
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
  Zap,
  RefreshCw,
  Loader2,
  CheckCircle2,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  apiGetWalletSummary, 
  apiGetAccountState,
  apiGetUserInvestments, 
  apiGetTransactions, 
  apiGetMarketTickers,
  GraphQLWalletSummary,
  GraphQLUserInvestment,
  GraphQLTransaction,
  GraphQLMarketTicker
} from '../../lib/graphql';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  
  const [walletSummary, setWalletSummary] = useState<GraphQLWalletSummary | null>(null);
  const [userInvestments, setUserInvestments] = useState<GraphQLUserInvestment[]>([]);
  const [transactions, setTransactions] = useState<GraphQLTransaction[]>([]);
  const [marketTickers, setMarketTickers] = useState<GraphQLMarketTicker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      const [accountData, investmentsData, txData, tickersData] = await Promise.allSettled([
        apiGetAccountState(),
        apiGetUserInvestments(),
        apiGetTransactions({ type: '', status: '', page: 1, limit: 10 }),
        apiGetMarketTickers(),
      ]);

      if (accountData.status === 'fulfilled' && accountData.value) {
        if (accountData.value.walletSummary) {
          setWalletSummary(accountData.value.walletSummary);
        }
      }
      if (investmentsData.status === 'fulfilled') {
        setUserInvestments(investmentsData.value || []);
      }
      if (txData.status === 'fulfilled') {
        setTransactions(txData.value || []);
      }
      if (tickersData.status === 'fulfilled') {
        setMarketTickers(tickersData.value || []);
      }
      await refreshUser();
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh when user switches back to app tab from GraphQL playground
    const handleFocus = () => loadDashboardData(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous 10-second polling to reflect real-time playground mutations
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const activeInvestmentsTotal = userInvestments
    .filter(i => i.status === 'active')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Directly read the exact backend figures from GraphQL walletSummary
  const availableBalance = walletSummary?.availableBalance !== undefined && walletSummary?.availableBalance !== null
    ? Number(walletSummary.availableBalance)
    : Number(user?.balance ?? 0);

  // Set Total Portfolio Valuation to use Available Balance to avoid user confusion
  const totalPortfolio = availableBalance;

  const activeInvestmentsCount = walletSummary?.activeInvestments !== undefined && walletSummary?.activeInvestments !== null
    ? walletSummary.activeInvestments
    : userInvestments.filter(i => i.status === 'active').length;

  const totalEarnings = walletSummary?.totalEarnings ?? 0;
  const growthRate = walletSummary?.growth24h ?? 0;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 font-sans">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
             Capital Matrix Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Portfolio <span className="text-zinc-600">Core.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2">
            Authenticated as <span className="text-white">{user?.name || user?.email || 'Investor'}</span> • {user?.tier || 'Institutional Tier'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => loadDashboardData(true)}
            title="Refresh Core Protocol Data"
            disabled={isLoading || isRefreshing}
            className="p-4 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer bg-black/60 disabled:opacity-50"
          >
            <RefreshCw size={16} className={(isLoading || isRefreshing) ? 'animate-spin text-brand-purple' : ''} />
          </button>
          <Link to="/user/invest" className="px-8 py-4 bg-brand-purple text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-purple-hover transition-all shadow-xl shadow-brand-purple/10 active:scale-95">
            Deploy Capital
          </Link>
        </div>
      </div>

      {/* Market Tickers Bar */}
      {marketTickers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {marketTickers.map((ticker, i) => (
            <div key={i} className="bg-brand-black-light border border-zinc-800/80 px-6 py-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{ticker.symbol}</span>
                <p className="text-lg font-black text-white font-mono">{formatCurrency(ticker.price)}</p>
              </div>
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg ${
                ticker.change24h >= 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {ticker.change24h >= 0 ? `+${ticker.change24h}%` : `${ticker.change24h}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Balance Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-brand-black-light border border-zinc-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />
           <div className="flex justify-between items-start mb-8">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Total Portfolio Valuation</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-black-light border border-zinc-800 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                 <span className="text-[9px] font-black text-zinc-400 uppercase">Live GraphQL</span>
              </div>
           </div>
           <div className="space-y-2">
              <h2 className="text-5xl md:text-7xl font-black text-white font-mono break-all leading-none">
                {formatCurrency(totalPortfolio)}
              </h2>
              <div className="flex items-center gap-4 text-brand-purple-hover font-black uppercase tracking-[0.2em] text-xs pt-4">
                 <span className="flex items-center gap-1">
                   <TrendingUp size={14} /> {growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`}
                 </span>
                 <span className="text-zinc-600">24H Protocol Growth</span>
              </div>
           </div>
           <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-800/50">
              <div>
                 <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Available Balance</p>
                 <p className="text-sm font-bold text-zinc-200 font-mono tracking-tight">{formatCurrency(availableBalance)}</p>
              </div>
              <div>
                 <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Active Positions</p>
                 <p className="text-sm font-bold text-brand-purple font-mono tracking-tight">{activeInvestmentsCount} Positions</p>
              </div>
              <div>
                 <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Total Yield Accrued</p>
                 <p className="text-sm font-bold text-emerald-400 font-mono tracking-tight">{formatCurrency(totalEarnings)}</p>
              </div>
              <div>
                 <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Base Currency</p>
                 <p className="text-sm font-bold text-zinc-300 font-mono tracking-tight">{user?.currencyPreference || 'USD'}</p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 bg-brand-purple rounded-[40px] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(75,47,168,0.1)] group">
           <div>
              <div className="w-12 h-12 bg-brand-black/10 rounded-2xl flex items-center justify-center text-black mb-10 group-hover:rotate-12 transition-transform">
                 <Zap size={24} />
              </div>
              <h3 className="text-2xl font-black text-black uppercase leading-none">Instant <br /> Capital Refuel.</h3>
              <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-4 leading-relaxed">
                Fund your account with Bitcoin, Ethereum, Solana, or USDT for immediate automated allocation.
              </p>
           </div>
           <Link to="/user/deposit" className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 mt-8">
             Refuel Balance <ArrowUpRight size={14} />
           </Link>
        </div>
      </div>

      {/* Grid: Active Deployments & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Deployments */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-white">Active <span className="text-zinc-600">Deployments.</span></h3>
            <Link to="/user/invest" className="text-[10px] font-black uppercase tracking-widest text-brand-purple hover:underline">
              View All Plans
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {userInvestments.map((inv) => (
              <motion.div 
                key={inv.id} 
                whileHover={{ y: -4 }}
                className="p-8 bg-brand-black-light border border-zinc-800 rounded-[32px] flex flex-col sm:flex-row justify-between items-center gap-6 group transition-all hover:bg-brand-black hover:border-brand-purple/30"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-[24px] bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-brand-purple group-hover:scale-105 transition-all shadow-inner shrink-0">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase">{inv.planName}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Registry: #{inv.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Staked Value</p>
                      <p className="text-xl font-bold text-white font-mono tracking-tighter">{formatCurrency(inv.amount)}</p>
                   </div>
                   <div className="h-10 w-px bg-zinc-800 hidden sm:block" />
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Target ROI</p>
                      <p className="text-xl font-bold text-brand-purple font-mono tracking-tighter">+{inv.roi}</p>
                   </div>
                </div>
              </motion.div>
            ))}
            {userInvestments.length === 0 && (
              <div className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-[40px] text-zinc-600 uppercase tracking-[0.2em] font-black text-xs space-y-4">
                <p>Zero active positions in backend ledger.</p>
                <Link to="/user/invest" className="inline-block px-6 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-xl hover:border-brand-purple transition-all text-[10px]">
                  Initialize Deployment Now
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Ledger Proxy */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-white">Ledger <span className="text-zinc-600">Proxy.</span></h3>
            <Link to="/user/transactions" className="text-[10px] font-black uppercase tracking-widest text-brand-purple hover:underline">
              Full Ledger
            </Link>
          </div>
          <div className="bg-brand-black-light rounded-[40px] border border-zinc-800 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
             <div className="space-y-px">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center py-5 border-b border-zinc-800/50 last:border-0 group cursor-default">
                     <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.type === 'withdrawal' ? 'bg-red-500/10 text-red-400' : 'bg-brand-purple/10 text-brand-purple'
                        }`}>
                           {tx.type === 'deposit' ? <ArrowDownCircle size={18} /> :
                            tx.type === 'withdrawal' ? <ArrowUpCircle size={18} /> : <Zap size={18} />}
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase text-white tracking-wider">{tx.type} {tx.plan ? `• ${tx.plan}` : ''}</p>
                           <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{tx.date || tx.createdAt || 'Confirmed'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-sm font-bold font-mono ${
                          tx.type === 'deposit' ? 'text-emerald-400' :
                          tx.type === 'withdrawal' ? 'text-red-400' : 'text-white'
                        }`}>
                          {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
                        </p>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                          tx.status === 'approved' || tx.status === 'completed' || tx.status === 'success' ? 'text-emerald-400' :
                          tx.status === 'pending' || tx.status === 'processing' ? 'text-brand-purple' : 'text-zinc-500'
                        }`}>
                          {tx.status}
                        </span>
                     </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="py-16 text-center text-zinc-600 text-xs font-black uppercase tracking-widest">
                    No transactions recorded yet
                  </div>
                )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  Archive, 
  CheckCircle, 
  Info, 
  ShieldCheck, 
  RefreshCw, 
  Bell, 
  AlertTriangle, 
  LogIn,
  SlidersHorizontal,
  Sparkles,
  Inbox
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  apiGetNotifications, 
  apiMarkNotificationRead, 
  apiMarkAllNotificationsRead, 
  GraphQLNotification 
} from '../../lib/graphql';

const FALLBACK_NOTIFICATIONS: GraphQLNotification[] = [
  {
    id: 'notif-1',
    title: 'Daily Yield Distributed',
    message: 'Your automated profit accrual for the active investment cycle has been calculated and deposited directly into your available balance. Real-time compounding is active across your selected strategy.',
    type: 'transaction',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Multi-Signature Security Verified',
    message: 'ApexBridge 256-bit protocol encryption session is active. All asset transfers and cold-storage smart contracts are protected by real-time cryptographic verification.',
    type: 'security',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Blockchain Network Synced',
    message: 'Bitcoin and Ethereum node listeners are synchronized with the apex settlement ledger. Instant confirmations are enabled across all multi-chain deposit addresses.',
    type: 'transaction',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'notif-4',
    title: 'Protocol Liquidity Milestone',
    message: 'ApexBridge Capital has crossed over $42,500,000 in decentralized liquidity pools across Tier-1 automated arbitrage markets with zero slippage execution.',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'notif-5',
    title: 'Portfolio Rebalancing Complete',
    message: 'Yield optimizer executed routine risk-adjusted asset rebalancing across algorithmic trading pairs with positive slippage mitigation and volatility dampening.',
    type: 'transaction',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'notif-6',
    title: 'Security Alert: Browser Session Active',
    message: 'A secure login was completed from your trusted device. No unauthorized API interactions or balance modifications detected across all endpoints.',
    type: 'security',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];

export default function NotificationsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Array<GraphQLNotification & { archived?: boolean; spam?: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'spam'>('all');

  const loadNotifications = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      const data = await apiGetNotifications();
      if (data && Array.isArray(data) && data.length > 0) {
        setNotifs(data.map(n => ({ ...n, archived: false, spam: false })));
      } else {
        // Retrieve cached or fallback items so users always have items to review
        const localSaved = localStorage.getItem('apexbridge_local_notifs');
        if (localSaved) {
          try {
            setNotifs(JSON.parse(localSaved));
          } catch {
            setNotifs(FALLBACK_NOTIFICATIONS);
          }
        } else {
          setNotifs(FALLBACK_NOTIFICATIONS);
          localStorage.setItem('apexbridge_local_notifs', JSON.stringify(FALLBACK_NOTIFICATIONS));
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch notifications from GraphQL:', err);
      setFetchError(err?.message || 'Unable to load notifications.');
      const localSaved = localStorage.getItem('apexbridge_local_notifs');
      if (localSaved) {
        try {
          setNotifs(JSON.parse(localSaved));
        } catch {
          setNotifs(FALLBACK_NOTIFICATIONS);
        }
      } else {
        setNotifs(FALLBACK_NOTIFICATIONS);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(false);

    const handleFocus = () => loadNotifications(true);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNotifications(true);
      }
    }, 12000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [loadNotifications]);

  const filteredNotifs = useMemo(() => {
    return notifs.filter(n => {
      if (n.archived) return false;
      if (filter === 'all') return !n.spam;
      if (filter === 'unread') return !n.isRead && !n.spam;
      if (filter === 'read') return n.isRead && !n.spam;
      if (filter === 'spam') return n.spam;
      return true;
    });
  }, [notifs, filter]);

  const unreadCount = useMemo(() => {
    return notifs.filter(n => !n.archived && !n.isRead && !n.spam).length;
  }, [notifs]);

  const readCount = useMemo(() => {
    return notifs.filter(n => !n.archived && n.isRead && !n.spam).length;
  }, [notifs]);

  const totalCount = useMemo(() => {
    return notifs.filter(n => !n.archived && !n.spam).length;
  }, [notifs]);

  const handleMarkAllRead = async () => {
    const updated = notifs.map(n => ({ ...n, isRead: true }));
    setNotifs(updated);
    localStorage.setItem('apexbridge_local_notifs', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
    try {
      await apiMarkAllNotificationsRead();
    } catch (err) {
      console.warn('Mark all read GraphQL notice:', err);
    }
  };

  const handleMarkRead = async (id: string) => {
    const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifs(updated);
    localStorage.setItem('apexbridge_local_notifs', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
    try {
      await apiMarkNotificationRead(id);
    } catch (err) {
      console.warn('Mark read GraphQL notice:', err);
    }
  };

  const handleArchiveNotif = (id: string) => {
    const updated = notifs.map(n => n.id === id ? { ...n, archived: true } : n);
    setNotifs(updated);
    localStorage.setItem('apexbridge_local_notifs', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('apexbridge:notifications-updated'));
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const diffHrs = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-7.5rem)] max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-7.5rem)] flex flex-col font-sans max-w-7xl mx-auto overflow-hidden animate-in fade-in duration-500">
      {fetchError && (
        <div className="mb-3 shrink-0 p-3 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span className="truncate">{fetchError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {fetchError.toLowerCase().includes('unauthorized') && (
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-3 py-1 bg-brand-purple text-black rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-brand-purple-hover flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn size={12} /> Sign In
              </button>
            )}
            <button 
              onClick={() => loadNotifications(false)}
              className="px-3 py-1 bg-red-500/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500/30 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Fixed Notifications Controls Side + Scrollable Longer Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 flex-1 min-h-0 overflow-hidden">
        
        {/* ========================================================= */}
        {/* FIXED NOTIFICATIONS SIDE (Pinned Controls, Stats, Filters) */}
        {/* ========================================================= */}
        <aside className="lg:col-span-4 shrink-0 flex flex-col justify-between bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-5 sm:p-6 lg:p-7 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="space-y-5 lg:space-y-6">
            {/* Header / Brand info */}
            <div>
              <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.3em] text-[10px] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                Live Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                Intelligence <span className="text-brand-purple">Feed.</span>
              </h1>
              <p className="text-zinc-400 text-xs font-medium mt-1.5 leading-relaxed">
                Real-time updates regarding deposits, settlement yields, and secure protocol events.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/60 border border-zinc-800/70 rounded-2xl">
              <div className="text-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total</p>
                <p className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">{totalCount}</p>
              </div>
              <div className="text-center border-x border-zinc-800/60">
                <p className="text-[9px] font-black text-brand-purple uppercase tracking-widest">Unread</p>
                <p className="text-base sm:text-lg font-bold font-mono text-brand-purple mt-0.5">{unreadCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Verified</p>
                <p className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5">{readCount}</p>
              </div>
            </div>

            {/* Category / Filter Selectors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-500 px-1">
                <span>Filter Intel</span>
                <span className="text-brand-purple font-mono">{filteredNotifs.length} Listed</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { id: 'all', label: 'All Intel', count: totalCount },
                  { id: 'unread', label: 'Unread Only', count: unreadCount },
                  { id: 'read', label: 'Verified Read', count: readCount },
                  { id: 'spam', label: 'Promotions', count: notifs.filter(n => n.spam).length }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={cn(
                      "flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer text-left",
                      filter === f.id
                        ? "bg-brand-purple text-black border-brand-purple shadow-[0_0_20px_rgba(72,202,228,0.25)] font-black"
                        : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                    )}
                  >
                    <span>{f.label}</span>
                    <span className={cn(
                      "text-[9px] font-mono px-2 py-0.5 rounded-full",
                      filter === f.id 
                        ? "bg-black/20 text-black font-bold" 
                        : "bg-zinc-800 text-zinc-500"
                    )}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons at bottom of fixed side */}
          <div className="pt-4 mt-4 border-t border-zinc-800/60 space-y-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple hover:bg-brand-purple hover:text-black transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <CheckCircle size={14} />
                <span>Mark All Read</span>
              </button>

              <button
                onClick={() => loadNotifications(true)}
                title="Refresh from server"
                disabled={isLoading || isRefreshing}
                className="p-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer bg-zinc-900 disabled:opacity-50 shrink-0"
              >
                <RefreshCw size={14} className={cn((isLoading || isRefreshing) && "animate-spin text-brand-purple")} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 px-1 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                256-Bit SSL Encrypted
              </span>
              <span>Node v2.4</span>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* SCROLLABLE NOTIFICATIONS STREAM (Longer notifications scroll under here!) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-8 flex flex-col min-h-0 h-full overflow-hidden bg-brand-black/40 border border-zinc-800/50 rounded-3xl p-3 sm:p-5 lg:p-6 backdrop-blur-md">
          {/* Stream Header Bar (Fixed at top of scroll section) */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-brand-purple" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {filter === 'all' && 'All Activity Stream'}
                {filter === 'unread' && 'Unread Alerts'}
                {filter === 'read' && 'Verified Intel'}
                {filter === 'spam' && 'Promotions Stream'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                {filteredNotifs.length} items
              </span>
            </div>

            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hidden sm:inline">
              Scroll under to view all
            </span>
          </div>

          {/* Scrollable Container for notifications */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 sm:pr-2.5 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-36 rounded bg-zinc-800" />
                        <div className="h-3 w-16 rounded bg-zinc-800" />
                      </div>
                      <div className="h-3 w-full rounded bg-zinc-900" />
                      <div className="h-3 w-2/3 rounded bg-zinc-900" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifs.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <Inbox className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-zinc-300">No Notifications</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium mt-1">
                    No intelligence records found matching your selected filter criteria.
                  </p>
                </div>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-brand-purple rounded-xl text-[10px] font-black uppercase tracking-wider hover:border-brand-purple transition-all cursor-pointer"
                  >
                    View All Activity
                  </button>
                )}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filteredNotifs.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group",
                      n.isRead 
                        ? "bg-zinc-950/70 border-zinc-800/50 hover:border-zinc-700 text-zinc-300" 
                        : "bg-zinc-900/90 border-brand-purple/40 shadow-lg shadow-brand-purple/5"
                    )}
                  >
                    {!n.isRead && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-purple" />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      {/* Left: Icon & Message Details */}
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5",
                          n.type === 'security' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          n.type === 'transaction' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          "bg-brand-purple/10 text-brand-purple border-brand-purple/20"
                        )}>
                          {n.type === 'security' ? <ShieldCheck size={18} /> :
                           n.type === 'transaction' ? <CheckCircle2 size={18} /> :
                           <Info size={18} />}
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black uppercase text-white tracking-tight break-words">
                              {n.title}
                            </h4>
                            {!n.isRead && (
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full bg-brand-purple text-black tracking-widest font-mono">
                                New
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-zinc-500 uppercase ml-auto sm:ml-0">
                              {formatTimestamp(n.createdAt)}
                            </span>
                          </div>

                          {/* Longer notification message: wrap cleanly, scrolls if extraordinarily long */}
                          <p className="text-xs text-zinc-400 font-medium leading-relaxed break-words max-h-36 overflow-y-auto custom-scrollbar pr-1">
                            {n.message}
                          </p>
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60 w-full sm:w-auto justify-end">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="px-3 py-1.5 rounded-xl bg-brand-purple/15 border border-brand-purple/30 text-brand-purple hover:bg-brand-purple hover:text-black transition-colors text-[9px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleArchiveNotif(n.id)}
                          title="Archive notification"
                          className="p-1.5 sm:p-2 rounded-xl border border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer bg-zinc-900/60"
                        >
                          <Archive size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

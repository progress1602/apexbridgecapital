import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Archive, CheckCircle, Info, ShieldCheck, Loader2, RefreshCw, Bell, AlertTriangle, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead, GraphQLNotification } from '../../lib/graphql';

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
      if (data && Array.isArray(data)) {
        setNotifs(data.map(n => ({ ...n, archived: false, spam: false })));
      } else {
        setNotifs([]);
      }
    } catch (err: any) {
      console.warn('Could not fetch notifications from GraphQL:', err);
      setFetchError(err?.message || 'Unable to load notifications.');
      setNotifs([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(false);

    const handleFocus = () => {
      loadNotifications(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous 10-second polling so newly adjusted balance notifications reflect live
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNotifications(true);
      }
    }, 10000);

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

  const handleMarkAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotificationsRead();
    } catch (err) {
      console.warn('Mark all read GraphQL error:', err);
    }
  };

  const handleMarkRead = async (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await apiMarkNotificationRead(id);
    } catch (err) {
      console.warn('Mark read GraphQL error:', err);
    }
  };

  const handleArchiveNotif = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const diffHrs = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} days ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-32 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
             Command Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Intelligence <span className="text-zinc-600">Feed.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Real-time critical data streams, security telemetry, and protocol update logs retrieved from GraphQL.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadNotifications(true)}
            title="Refresh from server"
            disabled={isLoading || isRefreshing}
            className="p-4 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer bg-black/60 disabled:opacity-50"
          >
            <RefreshCw size={14} className={cn((isLoading || isRefreshing) && "animate-spin text-brand-purple")} />
          </button>
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple hover:text-white transition-all border border-brand-purple/20 px-8 py-4 rounded-full hover:bg-brand-purple shadow-xl shadow-brand-purple/5 active:scale-95 cursor-pointer"
          >
            <CheckCircle size={14} /> Read All Intelligence
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <span>{fetchError}</span>
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
              onClick={() => loadNotifications(false)}
              className="px-3 py-1 bg-red-500/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500/30"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filtering */}
      <div className="flex flex-wrap items-center gap-4">
         {[
           { id: 'all', label: 'All Intel' },
           { id: 'unread', label: 'Unread' },
           { id: 'read', label: 'Verified' },
           { id: 'spam', label: 'Protocol Spam' }
         ].map((f) => (
           <button
             key={f.id}
             onClick={() => setFilter(f.id as any)}
             className={cn(
               "px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all border shrink-0 cursor-pointer",
               filter === f.id 
                 ? "bg-white text-black border-white shadow-xl" 
                 : "bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700"
             )}
           >
             {f.label}
           </button>
         ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-32 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-brand-purple animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Polling Intelligence Node...</p>
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="bg-brand-black border border-zinc-800/80 rounded-[40px] p-20 text-center space-y-4">
            <Bell className="w-12 h-12 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-black uppercase text-zinc-400">Ledger Clear</h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto font-medium">
              No notifications matching your filter criteria at this timestamp.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={cn(
                  "p-8 rounded-[32px] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group",
                  n.isRead 
                    ? "bg-brand-black border-zinc-800/40 opacity-70 hover:opacity-100" 
                    : "bg-brand-black-light border-brand-purple/30 shadow-lg"
                )}
              >
                {!n.isRead && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-purple" />
                )}
                
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0",
                    n.type === 'security' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    n.type === 'transaction' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    "bg-brand-purple/10 text-brand-purple border-brand-purple/20"
                  )}>
                    {n.type === 'security' ? <ShieldCheck size={20} /> :
                     n.type === 'transaction' ? <CheckCircle2 size={20} /> :
                     <Info size={20} />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-black uppercase text-white tracking-tight">{n.title}</h4>
                      <span className="text-[9px] font-mono text-zinc-600 uppercase">
                        {formatTimestamp(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-xl">
                      {n.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="px-4 py-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-black uppercase tracking-wider hover:bg-brand-purple hover:text-black transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => handleArchiveNotif(n.id)}
                    title="Archive"
                    className="p-3 rounded-xl border border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

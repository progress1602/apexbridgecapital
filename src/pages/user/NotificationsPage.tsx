import { useState, useMemo } from 'react';
import { Bell, Info, ShieldCheck, Mail, CheckCircle2, Archive, CheckCircle, Trash2, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const initialNotifications = [
  {
    id: 1,
    title: 'Account Secured',
    message: 'Your biometric verification has been successfully set up for all high-volume withdrawals.',
    type: 'security',
    date: '2 hours ago',
    unread: true,
    archived: false,
    spam: false
  },
  {
    id: 2,
    title: 'Market Opportunity',
    message: 'New Institutional investment plans are now available with up to 32% APY for select members.',
    type: 'system',
    date: '1 day ago',
    unread: false,
    archived: false,
    spam: true
  },
  {
    id: 3,
    title: 'Deposit Confirmed',
    message: 'Digital asset transfer of $5,000.00 has been verified and credited to your main balance.',
    type: 'transaction',
    date: '2 days ago',
    unread: false,
    archived: false,
    spam: false
  }
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'spam'>('all');

  const filteredNotifs = useMemo(() => {
    return notifs.filter(n => {
      if (n.archived) return false;
      if (filter === 'all') return !n.spam;
      if (filter === 'unread') return n.unread && !n.spam;
      if (filter === 'read') return !n.unread && !n.spam;
      if (filter === 'spam') return n.spam;
      return true;
    });
  }, [notifs, filter]);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const archiveNotif = (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-1000 pb-32 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.4em] text-[10px] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
             Command Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black  text-white  ">
            Intelligence <span className="text-zinc-600 ">Feed.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed max-w-xl">
             Real-time critical data streams, security telemetry, and protocol update logs managed by ApexBridge Capital AI.
          </p>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple hover:text-white transition-all border border-brand-purple/20 px-8 py-4 rounded-full hover:bg-brand-purple shadow-xl shadow-brand-purple/5 active:scale-95"
        >
          <CheckCircle size={14} /> Read All Intelligence
        </button>
      </div>

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
               "px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all border shrink-0",
               filter === f.id 
                 ? "bg-white text-black border-white shadow-xl" 
                 : "bg-brand-black text-zinc-600 border-zinc-800 hover:border-zinc-700"
             )}
           >
             {f.label}
           </button>
         ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredNotifs.map((notif) => (
            <motion.div 
              key={notif.id} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "p-8 md:p-10 rounded-[48px] border transition-all duration-500 relative group overflow-hidden",
                notif.unread 
                  ? "bg-black/80 border-brand-purple/30 shadow-[0_40px_100px_rgba(75,47,168,0.05)]" 
                  : "bg-black border-zinc-800/50 hover:border-zinc-700"
              )}
            >
              {notif.unread && (
                <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-brand-purple shadow-[0_0_20px_rgba(75,47,168,0.5)] animate-pulse" />
              )}
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-2xl border transition-transform group-hover:scale-110 duration-500",
                  notif.type === 'security' ? "bg-red-500/10 text-red-500 border-red-500/10" :
                  notif.type === 'transaction' ? "bg-brand-purple/10 text-brand-purple border-brand-purple/10" : "bg-blue-500/10 text-blue-500 border-blue-500/10"
                )}>
                  {notif.type === 'security' ? <ShieldCheck size={32} /> :
                   notif.type === 'transaction' ? <CheckCircle2 size={32} /> : <Info size={32} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <h3 className="font-black text-white text-2xl  uppercase italic">{notif.title}</h3>
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5 shadow-inner">{notif.date}</span>
                  </div>
                  <p className="text-[15px] text-zinc-400 leading-relaxed font-bold tracking-tight max-w-2xl">{notif.message}</p>
                  
                  <div className="mt-8 flex items-center gap-6">
                    <button 
                      onClick={() => markRead(notif.id)}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple hover:text-brand-purple-hover transition-colors bg-brand-purple/5 px-6 py-3 rounded-full border border-brand-purple/10 shadow-lg active:scale-95"
                    >
                      {notif.unread ? 'Acknowledge' : 'Verified'}
                    </button>
                    <button 
                      onClick={() => archiveNotif(notif.id)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-red-500 transition-colors group/btn"
                    >
                      <Archive size={14} className="group-hover/btn:-translate-y-1 transition-transform" /> Archive
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifs.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-brand-black-light border border-zinc-800 flex items-center justify-center mx-auto text-zinc-800 shadow-inner">
               <Mail size={48} />
            </div>
            <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.4em] italic underline decoration-zinc-800 underline-offset-8">Intelligence buffer clear</p>
          </div>
        )}
      </div>

      {/* Subscription Card */}
      <div className="mt-20 p-12 md:p-20 rounded-[72px] bg-black border border-brand-purple/20 text-white relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-purple/[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-[2000ms] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-purple/[0.02] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
         
         <div className="relative z-10 space-y-8 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4 max-w-xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 rounded-full border border-brand-purple/20 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                  <span className="text-[9px] font-black text-brand-purple uppercase ">Premium Signal Intel</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter  italic leading-none">Stay <span className="text-brand-purple">Liquid.</span> Stay <span className="text-zinc-600 underline decoration-zinc-800">Informed.</span></h2>
               <p className="text-zinc-500 text-lg leading-relaxed font-medium">Activate specialized neural signals to receive real-time intelligence on institutional pivot points and whale settlement activities.</p>
            </div>
            <div className="shrink-0">
               <button className="px-12 py-6 bg-brand-purple text-black rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-brand-purple-hover transition-all hover:scale-110 active:scale-95 shadow-[0_20px_60px_rgba(75,47,168,0.3)]">Activate Alpha Signals</button>
            </div>
         </div>
      </div>
    </div>
  );
}


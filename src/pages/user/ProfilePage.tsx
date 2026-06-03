import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Wallet, 
  ShieldCheck, 
  CheckCircle, 
  Edit3, 
  Key, 
  Loader2, 
  CheckSquare, 
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  // Local state for fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || '');
  const [wallet, setWallet] = useState(user?.walletAddress || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  if (!user) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate saving delay
    setTimeout(() => {
      updateProfile({
        name,
        email,
        phone,
        country,
        walletAddress: wallet,
      });
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Auto-dismiss success notification
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    }, 1200);
  };

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(user.balance);

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-[10px] font-black uppercase tracking-widest mb-4">
            <User size={12} /> USER PROFILE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            My <span className="text-zinc-650 text-zinc-650 text-zinc-600">Profile.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2">Manage your personal details and account settings.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3.5 bg-brand-purple text-black font-black uppercase text-[11px] rounded-2xl flex items-center gap-2 hover:bg-brand-purple-hover active:scale-95 transition-all shadow-lg shadow-brand-purple/20 border border-brand-purple/30 font-sans"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-4 text-xs font-black uppercase tracking-wider font-sans"
        >
          <CheckCircle size={20} className="shrink-0" />
          <span>Profile updated successfully.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account details summaries */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Identity Snapshot Card */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-purple/40 shadow-xl mb-6 relative group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={`https://i.pravatar.cc/200?u=${user.name}`} 
                  alt="Identity Snapshot" 
                  className="w-full h-full grayscale filter contrast-125" 
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h2>
              <p className="text-brand-purple text-[10px] font-black uppercase mt-1">Verified Member</p>
              
              <span className="mt-4 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 text-[9px] font-bold">
                ID: #{user.id}
              </span>
            </div>

            <div className="border-t border-zinc-800/60 pt-6 space-y-4">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase">Status</span>
                <span className="text-emerald-400 font-black uppercase flex items-center gap-1">
                  Verified <ShieldCheck size={12} />
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase">Account Tier</span>
                <span className="text-white font-black uppercase">Premium Account</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase">Country</span>
                <span className="text-white font-black uppercase">{user.country || 'Global'}</span>
              </div>
            </div>
          </div>

          {/* Core Balance Snapshot */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Account Balance</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{formattedBalance}</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Available Balance
            </div>
          </div>

          {/* Security Protocols */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-wider pb-4 border-b border-zinc-800/60 flex items-center gap-2">
              <Key size={14} className="text-brand-purple" /> Security Settings
            </h4>
            
            <div className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
              <div>
                <p className="text-[11px] text-white font-bold uppercase">Two-Factor Auth (2FA)</p>
                <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Secure login and withdrawals</p>
              </div>
              <button 
                type="button"
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 border cursor-pointer ${
                  is2FAEnabled ? 'bg-brand-purple/20 border-brand-purple' : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                <motion.div 
                  layout
                  className={`w-4 h-4 rounded-full ${is2FAEnabled ? 'bg-brand-purple absolute right-1' : 'bg-zinc-500'}`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800 flex gap-4">
              <Info size={16} className="text-brand-purple shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-zinc-400 font-black uppercase">Identity Status</p>
                <p className="text-[9.5px] text-zinc-650 leading-relaxed mt-1">
                  Your account has been fully verified for dynamic transfers and premium investing.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Editable / View Profile Details */}
        <div className="lg:col-span-8">
          <div className="bg-brand-black-light border border-zinc-800 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="border-b border-zinc-800/60 pb-6 mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Profile Details</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase mt-1">Update your account information</p>
              </div>
              
              <div className="text-[10px] text-zinc-600 font-bold uppercase bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                {isEditing ? 'EDITING' : 'SECURED'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-650 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="e.g. Alexander Gale"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="email"
                      required
                      disabled={!isEditing}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-650 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="e.g. contact@domain.com"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-650 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>
                </div>

                {/* Country / Jurisdictional Base */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Country</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-650 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="e.g. Switzerland"
                    />
                  </div>
                </div>

              </div>

              {/* Secure Web3 Settlement Wallet */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Crypto Wallet Address</label>
                  <span className="text-[9px] text-brand-purple font-black">DEFAULT WALLET</span>
                </div>
                <div className="relative">
                  <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-mono text-white placeholder-zinc-650 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                    placeholder="e.g. 0x0000000000000000000000000000000000000000"
                  />
                </div>
                <p className="text-[9px] text-zinc-650 font-bold uppercase pl-1">All fund transfers and withdrawal requests default to this secure wallet address.</p>
              </div>

              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 pt-6 border-t border-zinc-800"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-4 bg-brand-purple text-black font-black uppercase text-[11px] rounded-2xl flex items-center gap-2 hover:bg-brand-purple-hover active:scale-95 transition-all shadow-lg shadow-brand-purple/20 disabled:opacity-50 shrink-0 font-sans"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <CheckSquare size={14} /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset values
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phone || '');
                      setCountry(user.country || '');
                      setWallet(user.walletAddress || '');
                      setIsEditing(false);
                    }}
                    className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] rounded-2xl hover:bg-zinc-800 active:scale-95 transition-all font-sans"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

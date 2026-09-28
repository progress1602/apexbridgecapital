import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar, { isUserUploadedAvatar } from '../../components/UserAvatar';
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
  Info,
  DollarSign,
  Camera,
  Trash2,
  Copy,
  Check,
  Terminal
} from 'lucide-react';
import { motion } from 'motion/react';
import { getStoredToken } from '../../lib/graphql';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [copiedToken, setCopiedToken] = useState(false);
  
  // Local state for fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || '');
  const [wallet, setWallet] = useState(user?.walletAddress || '');
  const [currencyPreference, setCurrencyPreference] = useState(user?.currencyPreference || 'USD');
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is2FAEnabled ?? true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const avatarData = reader.result;
        if (user) {
          try {
            localStorage.setItem(`apexbridge_custom_avatar_${user.id || user.email}`, avatarData);
          } catch {
            // ignore
          }
        }
        await updateProfile({ avatar: avatarData });
      }
      setIsUploadingAvatar(false);
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    if (user) {
      try {
        localStorage.removeItem(`apexbridge_custom_avatar_${user.id || user.email}`);
      } catch {
        // ignore
      }
    }
    await updateProfile({ avatar: '' });
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCountry(user.country || '');
      setWallet(user.walletAddress || '');
      setCurrencyPreference(user.currencyPreference || 'USD');
      if (user.is2FAEnabled !== undefined) {
        setIs2FAEnabled(user.is2FAEnabled);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        is2FAEnabled,
        currencyPreference,
        country,
        walletAddress: wallet,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    await updateProfile({
      is2FAEnabled: nextState,
    });
  };

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(user.balance || 0);

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-[10px] font-black uppercase tracking-widest mb-4">
            <User size={12} /> USER PROFILE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            My <span className="text-zinc-600">Profile.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2">Manage your personal details and account settings via GraphQL protocol.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3.5 bg-brand-purple text-black font-black uppercase text-[11px] rounded-2xl flex items-center gap-2 hover:bg-brand-purple-hover active:scale-95 transition-all shadow-lg shadow-brand-purple/20 border border-brand-purple/30 font-sans cursor-pointer"
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
          <span>Profile updated successfully in GraphQL backend.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Account details summaries */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Identity Snapshot Card */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col items-center text-center py-6">
              <div className="relative mb-6">
                <UserAvatar 
                  src={user.avatar} 
                  name={user.name || user.email} 
                  size="xl"
                  className="border-2 border-brand-purple/40 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <label 
                  htmlFor="avatar-file-input"
                  title="Upload profile picture"
                  className="absolute -bottom-1 -right-1 w-9 h-9 bg-brand-purple hover:bg-brand-purple-hover text-black rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-90 border-2 border-brand-black"
                >
                  {isUploadingAvatar ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {isUserUploadedAvatar(user.avatar) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-[10px] font-bold text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider mb-2 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} /> Remove Custom Photo
                </button>
              )}
              
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h2>
              <p className="text-brand-purple text-[10px] font-black uppercase mt-1">{user.tier || 'Tier 2 - Verified'}</p>
              
              <span className="mt-4 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 text-[9px] font-bold font-mono">
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
                <span className="text-zinc-500 font-bold uppercase">Role</span>
                <span className="text-white font-black uppercase">{user.role || 'Investor'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase">Account Tier</span>
                <span className="text-white font-black uppercase">{user.tier || 'Tier 2 - Verified'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-bold uppercase">Base Currency</span>
                <span className="text-brand-purple font-black uppercase">{currencyPreference}</span>
              </div>
            </div>
          </div>

          {/* Core Balance Snapshot */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Account Balance</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{formattedBalance}</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Available Liquidity
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
                onClick={handleToggle2FA}
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
                <p className="text-[9.5px] text-zinc-400 leading-relaxed mt-1">
                  Your account is secured with end-to-end encryption and verified for protocol operations.
                </p>
              </div>
            </div>
          </div>

          {/* GraphQL Playground Integration Card */}
          <div className="bg-brand-black-light border border-zinc-800 p-8 rounded-[40px] space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-brand-purple" /> GraphQL Playground Headers
            </h4>
            <p className="text-[9.5px] text-zinc-400 leading-relaxed">
              To query <span className="font-mono text-brand-purple">userInvestments</span> or test <span className="font-mono text-brand-purple">createInvestment</span> on your GraphQL Playground, paste this in the <span className="text-white font-bold">HTTP Headers</span> tab:
            </p>
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl font-mono text-[9px] text-zinc-300 break-all select-all">
              {JSON.stringify({ Authorization: `Bearer ${getStoredToken() || '<YOUR_TOKEN>'}` }, null, 2)}
            </div>
            <button
              type="button"
              onClick={() => {
                const token = getStoredToken();
                if (token) {
                  navigator.clipboard.writeText(JSON.stringify({ Authorization: `Bearer ${token}` }, null, 2));
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 2500);
                }
              }}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedToken ? (
                <>
                  <Check size={14} className="text-emerald-400" /> Copied Playground Header!
                </>
              ) : (
                <>
                  <Copy size={14} className="text-brand-purple" /> Copy Playground Header JSON
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Editable / View Profile Details */}
        <div className="lg:col-span-8">
          <div className="bg-brand-black-light border border-zinc-800 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="border-b border-zinc-800/60 pb-6 mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Profile Details</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase mt-1">GraphQL Synced Account Parameters</p>
              </div>
              
              <div className="text-[10px] text-zinc-400 font-bold uppercase bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
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
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
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
                      disabled
                      value={email}
                      className="w-full bg-zinc-900/60 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-zinc-400 focus:outline-none cursor-not-allowed opacity-75 font-mono"
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
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50 font-mono"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>
                </div>

                {/* Currency Preference */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Currency Preference</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select
                      disabled={!isEditing}
                      value={currencyPreference}
                      onChange={(e) => setCurrencyPreference(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                    >
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="USDT">USDT (Tether USD)</option>
                    </select>
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
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="e.g. Switzerland"
                    />
                  </div>
                </div>

                {/* Secure Web3 Settlement Wallet */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Crypto Wallet Address</label>
                  </div>
                  <div className="relative">
                    <Wallet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                      placeholder="0x..."
                    />
                  </div>
                </div>

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
                    className="px-6 py-4 bg-brand-purple text-black font-black uppercase text-[11px] rounded-2xl flex items-center gap-2 hover:bg-brand-purple-hover active:scale-95 transition-all shadow-lg shadow-brand-purple/20 disabled:opacity-50 shrink-0 font-sans cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving to GraphQL...
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
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phone || '');
                      setCountry(user.country || 'United States');
                      setWallet(user.walletAddress || '0x71C27581B855A5100650A195EAD84CA6762C3A59');
                      setIsEditing(false);
                    }}
                    className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] rounded-2xl hover:bg-zinc-800 active:scale-95 transition-all font-sans cursor-pointer"
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

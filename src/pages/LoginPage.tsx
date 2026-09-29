import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  AlertCircle, 
  Eye, 
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Activity,
  KeyRound,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  mode: 'login' | 'signup';
}

export default function LoginPage({ mode }: LoginPageProps) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength calculator for signup
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please acknowledge the protocol terms to proceed with account creation.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signup(email.trim(), password, name.trim());
        if (res.success) {
          navigate('/user/dashboard');
        } else {
          setErrorMessage(res.message || 'Registration could not be completed. Please try again.');
        }
      } else {
        const res = await login(email.trim(), password);
        if (res.success) {
          navigate('/user/dashboard');
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      console.error('[Authentication Process Error]:', err);
      setErrorMessage(err?.message || 'An unexpected connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-brand-purple/30 selection:text-white">
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-brand-purple/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Left Panel: Institutional Showcase (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-12 xl:p-16 border-r border-zinc-800/60 bg-zinc-950/40 backdrop-blur-3xl relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-brand-purple rounded-xl flex items-center justify-center text-black shadow-lg shadow-brand-purple/20 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase">
              ApexBridge<span className="text-brand-purple">Capital</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mainnet Online
          </div>
        </div>

        {/* Center Pitch */}
        <div className="space-y-8 my-auto py-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-purple text-xs font-black uppercase tracking-[0.25em]">
              <Zap size={14} />
              <span>Next-Gen Decentralized Liquidity</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight uppercase">
              {mode === 'login' ? (
                <>
                  Institutional Access <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-300">
                    To Prime Yield.
                  </span>
                </>
              ) : (
                <>
                  Deploy Capital <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-300">
                    With Algorithmic Precision.
                  </span>
                </>
              )}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md font-medium">
              Seamless access to multi-sig staking vaults, institutional yield protocols, and sub-10ms decentralized liquidity pools.
            </p>
          </div>

          {/* Key Institutional Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Total Liquidity</span>
              <p className="text-lg font-black text-white font-mono">$8.4B+</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Latency</span>
              <p className="text-lg font-black text-white font-mono">&lt; 10ms</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Security</span>
              <p className="text-lg font-black text-brand-purple font-mono">100%</p>
            </div>
          </div>

          {/* Trust Guarantee Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-white uppercase tracking-wide">Enterprise-Grade Security</p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Zero-knowledge authentication and multi-tier cryptographic isolation protect your capital at all times.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-6 border-t border-zinc-900/80">
          <span>ApexBridge Protocol v2.4</span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Activity size={12} className="text-emerald-400" /> 99.99% Uptime
          </span>
        </div>
      </div>

      {/* Right Panel: The Authentication Console */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 relative z-10 overflow-y-auto min-h-screen">
        {/* Top Bar Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-xs font-bold tracking-wider uppercase cursor-pointer py-1"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-brand-purple shrink-0" />
            <span className="truncate">Return to Gateway</span>
          </Link>

          {/* Segmented Mode Switcher */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800/80 p-1 rounded-2xl shadow-inner shrink-0">
            <Link
              to="/login"
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-brand-purple text-black font-black shadow-sm shadow-brand-purple/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register
            </Link>
          </div>
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-md mx-auto my-auto py-2 sm:py-8">
          {/* Mobile Brand Logo (hidden on desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-black shadow-lg shadow-brand-purple/20">
              <TrendingUp size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-lg font-black tracking-tight text-white uppercase">
              ApexBridge<span className="text-brand-purple">Capital</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl sm:rounded-3xl md:rounded-[40px] p-5 sm:p-8 md:p-10 shadow-2xl relative backdrop-blur-2xl"
          >
            {/* Top Sheen */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />

            {/* Header Titles */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 text-brand-purple text-[10px] font-black uppercase tracking-[0.25em] mb-2">
                <KeyRound size={12} />
                <span>{mode === 'login' ? 'Authentication Terminal' : 'Institutional Onboarding'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {mode === 'login' ? 'Access Terminal' : 'Open Account'}
              </h1>
              <p className="text-zinc-400 text-xs mt-1.5 font-medium">
                {mode === 'login' 
                  ? 'Enter your credentials to manage your portfolio.' 
                  : 'Establish a new verified account to deploy institutional capital.'}
              </p>
            </div>

            {/* Error Message Notification */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start justify-between gap-3 text-xs font-medium">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                      <span className="break-words leading-relaxed">{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-400/70 hover:text-red-300 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                      aria-label="Dismiss error"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <User size={12} className="text-brand-purple" />
                    <span>Full Legal Name</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Vance"
                      className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-base sm:text-sm font-medium shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Mail size={12} className="text-brand-purple" />
                  <span>Account Email</span>
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@apexbridge.cap"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-base sm:text-sm font-mono shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock size={12} className="text-brand-purple" />
                    <span>Pass-Key</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold uppercase text-zinc-500 hover:text-brand-purple transition-colors flex items-center gap-1 cursor-pointer select-none"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff size={12} />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={showPassword ? 'Enter pass-key' : '••••••••••••'}
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3.5 pl-4 pr-11 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-base sm:text-sm shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator (For Signup) */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="pt-1.5 px-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 1 ? 'bg-amber-400' : 'bg-zinc-800'}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 2 ? 'bg-brand-purple' : 'bg-zinc-800'}`} />
                      <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 3 ? 'bg-emerald-400' : 'bg-zinc-800'}`} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span>Security Level</span>
                      <span className={passwordStrength === 3 ? 'text-emerald-400' : passwordStrength === 2 ? 'text-brand-purple' : 'text-amber-400'}>
                        {passwordStrength === 3 ? 'Maximum' : passwordStrength === 2 ? 'Medium' : 'Basic'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Login Extra: Remember Me & Reset */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-zinc-800 bg-zinc-950 text-brand-purple focus:ring-0 focus:ring-offset-0 cursor-pointer accent-brand-purple"
                    />
                    <span className="text-[11px] font-medium">Keep terminal active</span>
                  </label>
                  <span className="text-[11px] text-zinc-500 hover:text-brand-purple transition-colors cursor-pointer select-none">
                    Security assistance
                  </span>
                </div>
              )}

              {/* Signup Extra: Terms Acknowledgement */}
              {mode === 'signup' && (
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-zinc-400 hover:text-zinc-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded-md border-zinc-800 bg-zinc-950 text-brand-purple focus:ring-0 focus:ring-offset-0 cursor-pointer accent-brand-purple shrink-0"
                    />
                    <span className="text-[11px] leading-relaxed text-zinc-400">
                      I agree to the <span className="text-white underline underline-offset-2">Protocol Operating Terms</span> and institutional security disclosures.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 bg-brand-purple text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-purple-hover transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-xl shadow-brand-purple/20 group hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>{mode === 'login' ? 'Authenticating Terminal...' : 'Deploying Account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Enter Terminal' : 'Create Account'}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Alternate Mode Link */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
              <p className="text-zinc-400 text-xs font-medium">
                {mode === 'login' ? "Don't have an account yet?" : "Already hold an active account?"}{' '}
                <Link
                  to={mode === 'login' ? '/signup' : '/login'}
                  className="text-brand-purple hover:text-brand-purple-hover font-bold ml-1 transition-colors underline-offset-4 hover:underline"
                >
                  {mode === 'login' ? 'Register now' : 'Sign in to terminal'}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Console Footer */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck size={14} className="text-brand-purple" />
            <span>256-Bit SSL Encrypted Protocol Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

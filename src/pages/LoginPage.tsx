import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowLeft, Loader2, TrendingUp, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const res = await signup(email.trim(), password, name.trim());
        if (res.success) {
          navigate('/user/dashboard');
        } else {
          setErrorMessage(res.message || 'Signup failed. Please try again.');
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
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-zinc-100 flex flex-col font-sans">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-[10px] font-black uppercase">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-brand-purple" />
          Gateway Exit
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-purple/20" />
          
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center text-black shadow-lg shadow-brand-purple/20">
              <TrendingUp size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2 text-white uppercase">{mode === 'login' ? 'Authentication' : 'Onboarding'}</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase">{mode === 'login' ? 'Secure terminal access' : 'Join the ApexBridge protocol'}</p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs font-bold font-sans"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Identity Tag</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-purple transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Secure Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-purple transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="protocol@apexbridge.cap"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-all font-mono shadow-inner text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Pass-Key</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-black uppercase text-zinc-500 hover:text-brand-purple transition-colors flex items-center gap-1.5 cursor-pointer select-none"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={13} className="text-zinc-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} className="text-zinc-400" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-purple transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={showPassword ? 'Enter your pass-key' : '••••••••'}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-12 text-white focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-5 bg-brand-purple text-black rounded-2xl font-black uppercase text-[10px] hover:bg-brand-purple-hover transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-brand-purple/10 group hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (mode === 'login' ? 'Execute Access' : 'Register Protocol')}
            </button>
          </form>

          <p className="text-center mt-8 text-zinc-500 text-[10px] font-black uppercase">
            {mode === 'login' ? "New Allocator?" : "Existing Partner?"}
            <Link 
              to={mode === 'login' ? "/signup" : "/login"} 
              className="text-brand-purple-hover font-black ml-2 hover:underline decoration-1 underline-offset-4"
            >
              {mode === 'login' ? 'Create Account' : 'Sign In Now'}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

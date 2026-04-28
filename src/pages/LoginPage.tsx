import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  mode: 'login' | 'signup';
}

export default function LoginPage({ mode }: LoginPageProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock simulation
    setTimeout(() => {
      login(email);
      navigate('/user/dashboard');
      setIsLoading(false);
    }, 1500);
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

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight mb-2 text-white   uppercase tracking-tight">{mode === 'login' ? 'Authentication' : 'Onboarding'}</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase">{mode === 'login' ? 'Secure terminal access' : 'Join the ApexBridge protocol'}</p>
          </div>

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
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner"
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-all font-mono shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Pass-Key</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-purple transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-5 bg-brand-purple text-black rounded-2xl font-black uppercase text-[10px] hover:bg-brand-purple-hover transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-brand-purple/10 group hover:scale-[1.02] active:scale-[0.98]"
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

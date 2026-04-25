import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ChevronRight, 
  TrendingUp, 
  BarChart3, 
  Users,
  Lock,
  ArrowUpRight,
  Target,
  Cpu,
  Fingerprint,
  Layers,
  Activity,
  Check,
  Star,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

const stats = [
  { label: 'Platform Liquidity', value: '$8.4B+' },
  { label: 'Institutional Clients', value: '1,200+' },
  { label: 'Average APY', value: '14.2%' },
];

const partners = [
  'Goldman Sachs', 'BlackRock', 'JP Morgan', 'Morgan Stanley', 'Citadel', 'Jane Street'
];

const testimonials = [
  {
    name: "Marcus Schmidt",
    role: "Portfolio Manager",
    location: "Munich, Germany",
    content: "The tier-one liquidity provided by ApexBridge Capital has revolutionized our regional capital deployment strategy. Exceptional transparency.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2570&auto=format&fit=crop"
  },
  {
    name: "Yuki Tanaka",
    role: "CEO, NexGen Trade",
    location: "Tokyo, Japan",
    content: "Sub-10ms execution at scale is no longer a corporate myth. ApexBridge delivers the precision terminal we needed for global arbitrage.",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    name: "Elena Rossi",
    role: "Hedge Fund Analyst",
    location: "Milan, Italy",
    content: "Their mathematical isolation protocols are industry-leading. For the first time, institutional stakings feel truly sovereign.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2670&auto=format&fit=crop"
  },
  {
    name: "Lucas Ferreira",
    role: "Fintech Lead",
    location: "São Paulo, Brazil",
    content: "Instant P2P asset settlement across 140 countries is a game-changer for our liquidity pools. The UI is a masterclass in fintech design.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2570&auto=format&fit=crop"
  },
  {
    name: "Sarah O'Connor",
    role: "Wealth Advisor",
    location: "Dublin, Ireland",
    content: "The Alpha Bolt technology ensures our client yields are always optimized. It's the only platform we trust with high-net-worth accounts.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2670&auto=format&fit=crop"
  },
  {
    name: "Ahmed Al-Sayed",
    role: "Private Equity Associate",
    location: "Dubai, UAE",
    content: "Accessing deep liquidity pools was previously restricted to massive conglomerates. ApexBridge democratized this access for our firm.",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2670&auto=format&fit=crop"
  },
  {
    name: "Svetlana Petrov",
    role: "Quant Researcher",
    location: "Zurich, Switzerland",
    content: "Mathematical precision meets intuitive design. The intelligence matrix offers real-time alpha metrics that are consistently accurate.",
    image: "https://images.unsplash.com/photo-1598550874175-4d0fe4a7c7ea?q=80&w=2670&auto=format&fit=crop"
  },
  {
    name: "David Chen",
    role: "Asset Allocator",
    location: "Singapore",
    content: "The bridge between traditional finance and sovereign wealth protocols has finally been built. ApexBridge is the future of capital.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2570&auto=format&fit=crop"
  }
];

export default function LandingPage() {
  const [investment, setInvestment] = useState(10000);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 overflow-x-hidden selection:bg-emerald-500/30 selection:text-white font-sans">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#070708]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
               <TrendingUp size={24} className="text-black" />
            </div>
            <span className="text-lg md:text-2xl font-bold tracking-tight text-white font-serif italic uppercase">
              ApexBridge<span className="text-emerald-500">Capital</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
            <a href="#protocol" className="hover:text-emerald-400 transition-colors">Protocol</a>
            <a href="#infrastructure" className="hover:text-emerald-400 transition-colors">Security</a>
            <a href="#yield" className="hover:text-emerald-400 transition-colors">Yield Engines</a>
            <a href="#partners" className="hover:text-emerald-400 transition-colors">Institutional</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Portal Access</Link>
              <Link to="/signup" className="px-7 py-3 bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 border border-transparent transition-all duration-500 shadow-xl shadow-white/5 active:scale-95">
                Open Account
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors relative z-50"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 lg:hidden bg-[#070708] flex flex-col"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]" />
              
              <div className="relative z-10 flex flex-col pt-32 px-10 gap-10">
                {[
                  { name: 'Protocol', href: '#protocol' },
                  { name: 'Security', href: '#infrastructure' },
                  { name: 'Yield Engines', href: '#yield' },
                  { name: 'Institutional', href: '#partners' }
                ].map((item, idx) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-white italic tracking-tighter uppercase font-serif hover:text-emerald-500 transition-colors"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto p-10 space-y-4 border-t border-zinc-800/50 bg-[#0c0c0e]/50 backdrop-blur-xl relative z-10">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-5 text-center text-zinc-400 text-sm font-black uppercase tracking-widest border border-zinc-800 rounded-2xl hover:text-white"
                >
                  Portal Access
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-5 bg-emerald-500 text-black text-center text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10"
                >
                  Open Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="relative pt-32 md:pt-48 pb-20 px-6 overflow-hidden">
          {/* Hero Mature Institutional Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" 
              alt="Institutional Capital" 
              className="w-full h-full object-cover opacity-40 blur-[2px] scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#070708] via-[#070708]/80 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
            <div className="xl:col-span-7 space-y-8 md:space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/50 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8 shadow-inner">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Market Execution: Active
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter italic font-serif text-balance">
                  PRECISION <br />
                  <span className="text-zinc-600 block mt-2 animate-pulse">CAPITAL.</span>
                </h1>
                
                <p className="text-zinc-500 text-lg md:text-xl max-w-xl mt-10 leading-relaxed font-medium">
                  The sophisticated interface for deep liquidity management and diversified stakings. Join the private network of global allocators.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mt-12">
                  <Link to="/signup" className="flex items-center justify-center gap-3 px-8 md:px-10 py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 group">
                    Deploy Capital Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="flex items-center justify-center gap-3 px-8 md:px-10 py-5 bg-zinc-800/50 border border-zinc-700/50 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all">
                    View Alpha Plans
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-12 border-t border-zinc-800/50 mt-12">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#070708] overflow-hidden bg-zinc-800">
                           <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full grayscale opacity-70" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                   </div>
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] leading-tight">
                     Trusted by <span className="text-emerald-500 font-black">12,400+</span> <br /> Institutional Partners
                   </p>
                </div>
              </motion.div>
            </div>

            <div className="xl:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Floating Widget: Yield Calculator */}
                <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">Projection Terminal</h3>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[8px] font-black uppercase tracking-widest">Live Alpha</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                      <span>Principal Amount</span>
                      <span className="text-emerald-500 font-mono tracking-normal">${investment.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="100000" 
                      step="1000"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-zinc-800 rounded-lg cursor-pointer h-1.5 appearance-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl group hover:border-zinc-700 transition-all">
                      <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-2">Standard ROI</p>
                      <p className="text-2xl font-bold text-white font-mono tracking-tighter">${(investment * 1.12).toLocaleString()}<span className="text-[10px] text-emerald-500/50 block font-sans tracking-widest uppercase">+12%</span></p>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full" />
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mb-2">Max Alpha</p>
                      <p className="text-2xl font-bold text-white font-mono tracking-tighter">${(investment * 1.32).toLocaleString()}<span className="text-[10px] text-emerald-500 block font-sans tracking-widest uppercase">+32%</span></p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                     {[
                       { label: 'Asset Protection', val: 'Active Isolation', icon: ShieldCheck },
                       { label: 'Instant Liquidity', val: 'T+24 Settlement', icon: Zap }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between px-5 py-4 bg-zinc-950/50 rounded-2xl border border-zinc-900/50 hover:bg-zinc-900 transition-colors">
                          <div className="flex items-center gap-3">
                             <item.icon size={16} className="text-emerald-500" />
                             <span className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em]">{item.label}</span>
                          </div>
                          <span className="text-[10px] text-white font-black italic uppercase tracking-widest">{item.val}</span>
                       </div>
                     ))}
                  </div>

                  <Link to="/signup" className="block w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 mt-6 active:scale-95">
                    Authenticate Secure Access
                  </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

        {/* Institutional Backing / Partners */}
        <section id="partners" className="py-20 border-y border-zinc-800/10 overflow-hidden bg-[#0c0c0e]">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-12 italic">Settlement provided by institutional custodians</p>
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-30 grayscale saturate-0 contrast-150">
               {partners.map((p, i) => (
                 <span key={i} className="text-2xl md:text-3xl font-black font-serif italic text-white tracking-tighter hover:text-emerald-500 transition-all cursor-default scale-90 md:scale-100">
                   {p}
                 </span>
               ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
             {stats.map((stat, i) => (
               <div key={i} className="text-center space-y-4 group">
                 <div className="text-6xl lg:text-8xl font-black text-white tracking-tighter italic font-serif leading-none group-hover:scale-110 transition-transform duration-700">{stat.value}</div>
                 <div className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-[10px] font-mono">{stat.label}</div>
                 <div className="w-12 h-[1px] bg-emerald-500/30 mx-auto" />
               </div>
             ))}
          </div>
        </section>

        {/* Bento Grid: The Protocol Advantage */}
        <section id="protocol" className="py-24 md:py-32 px-6 bg-[#09090a]">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16 md:mb-32 space-y-6">
                <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter font-serif italic uppercase leading-none">Protocol Core.</h2>
                <p className="text-zinc-500 uppercase tracking-[0.4em] font-black text-[10px]">High Efficiency Capital Deployment</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                {/* Large Main Feature */}
                <div className="md:col-span-12 lg:col-span-8 bg-[#0c0c0e] border border-zinc-800/40 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group hover:border-emerald-500/20 transition-all duration-700 shadow-2xl">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" 
                        alt="Security" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                   <div className="relative z-10">
                      <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center text-emerald-500 mb-10 border border-zinc-800 shadow-inner group-hover:rotate-12 transition-transform">
                         <ShieldCheck size={32} />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter font-serif italic">Mathematical Isolation <br /> of Capital.</h3>
                      <p className="text-zinc-500 max-w-md text-lg md:text-xl leading-relaxed font-medium">Your assets are segregated from operational accounts using cryptographic multi-sig isolation. Minimal risk, absolute clarity.</p>
                   </div>
                   <div className="relative z-10 grid grid-cols-4 gap-6 pt-16 mt-16 border-t border-zinc-800/50">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 bg-zinc-800 rounded shadow-inner" />
                      ))}
                   </div>
                </div>

                {/* Right Top */}
                <div className="md:col-span-6 lg:col-span-4 bg-emerald-500 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col justify-between group overflow-hidden relative shadow-[0_20px_50px_rgba(16,185,129,0.15)] active:scale-95 transition-all">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 mix-blend-overlay grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                        alt="Alpha" 
                        className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative z-10 flex justify-between items-start">
                      <div className="w-14 h-14 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-black">
                         <Zap size={28} />
                      </div>
                      <ArrowUpRight size={24} className="text-black/40 group-hover:text-black transition-colors" />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-3xl font-black text-black mb-3 uppercase tracking-tighter italic">Alpha Bolt</h3>
                      <p className="text-black/50 text-[10px] font-black uppercase tracking-[0.25em]">Sub-10ms Trade routing Engine</p>
                   </div>
                </div>

                {/* Bottom Center */}
                <div className="md:col-span-6 lg:col-span-5 bg-zinc-900/50 border border-zinc-800/40 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col justify-between group hover:bg-zinc-900 transition-all shadow-2xl relative overflow-hidden">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2670&auto=format&fit=crop" 
                        alt="Global" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="flex items-center gap-6 mb-12 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                         <Globe size={22} />
                      </div>
                      <div className="h-px flex-1 bg-zinc-800/50" />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Global Reserve</h3>
                      <p className="text-zinc-500 text-base leading-relaxed font-medium">Liquidate into fiat or digital stores in over 140+ countries within one banking day. Complete sovereign control.</p>
                   </div>
                </div>

                {/* Bottom Left Small */}
                <div className="md:col-span-12 lg:col-span-7 bg-[#0c0c0e] border border-zinc-800/40 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between group overflow-hidden shadow-2xl relative gap-8">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1558494949-ef010ccdcc91?q=80&w=2670&auto=format&fit=crop" 
                        alt="Intelligence" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="flex-1 space-y-6 relative z-10">
                      <div className="flex gap-3">
                         {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-2 bg-emerald-500 rounded-full" />)}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">Intelligence Matrix</h3>
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Real-time Portfolio Alpha metrics</p>
                   </div>
                   <div className="w-40 h-40 bg-emerald-500/5 rounded-full border border-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative z-10">
                      <BarChart3 size={48} className="text-emerald-500/40 animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Client Portal Preview - THE "VIBE" SECTION */}
        <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-[#070708]">
           <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="order-2 lg:order-1 relative w-full">
                 <div className="absolute inset-0 bg-emerald-500/10 blur-[140px] rounded-full" />
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9, y: 40 }}
                   whileInView={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ duration: 1 }}
                   viewport={{ once: true }}
                   className="relative bg-[#0c0c0e] border border-zinc-800 rounded-[48px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group"
                 >
                    <div className="flex items-center justify-between mb-10 px-4">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                       </div>
                       <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Secure Client Access Proxy</div>
                    </div>
                    <div className="space-y-10">
                       <div className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                          <div className="flex justify-between items-start mb-6">
                             <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Net Valuation</p>
                                <p className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">$1,240,402.10</p>
                             </div>
                             <div className="px-3 py-1 bg-emerald-500/20 rounded-lg text-emerald-500 text-[10px] font-bold">+14.2%</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-2 bg-emerald-500 rounded-full" />
                             <div className="h-2 bg-zinc-800 rounded-full" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-3">
                             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Accrued Yield</p>
                             <p className="text-xl font-bold text-white font-mono">$12,402.00</p>
                             <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-emerald-500" />
                             </div>
                          </div>
                          <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-3">
                             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Active Node</p>
                             <p className="text-xl font-bold text-emerald-500 font-serif italic">Premium Flow</p>
                             <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-emerald-500 rounded-full" />)}
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>

              <div className="order-1 lg:order-2 space-y-10">
                 <span className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.5em] block">Unified Asset Management</span>
                 <h2 className="text-5xl md:text-7xl font-black text-white font-serif italic tracking-tighter leading-none">
                    YOUR ASSETS, <br />
                    <span className="text-zinc-600 italic">DEMOCRATIZED.</span>
                  </h2>
                  <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                    Experience a tier-one trading floor from your private mobile terminal. Deep analytics, instant stakings, and absolute transparency are standard features of the ApexBridge protocol.
                  </p>
                  <ul className="space-y-6">
                     {[
                       'Automated Dividend Compounding',
                       'Instant P2P Asset Settlement',
                       'Military-Grade Encryption Protocol',
                       'Dedicated Wealth Concierge'
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-4 text-zinc-300 font-bold uppercase tracking-widest text-xs">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                             <Check size={14} />
                          </div>
                          {item}
                       </li>
                     ))}
                  </ul>
                  <div className="pt-6">
                    <Link to="/signup" className="inline-flex items-center gap-4 text-emerald-500 font-black uppercase tracking-widest text-xs group">
                       EXPLORE PORTAL INTERFACE <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
              </div>
           </div>
        </section>

        {/* Security / Infrastructure */}
        <section id="infrastructure" className="py-40 px-6 bg-[#070708]">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
                <div className="space-y-12">
                   <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Hardware-Back Security</div>
                   <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase font-serif mb-6">THE FORTRESS.</h2>
                   <div className="space-y-10">
                      {[
                        { title: 'Privacy Protocols', desc: 'Secure history without exposing sensitive data points.', icon: Lock },
                        { title: 'Biometric Gateway', desc: 'Secure withdrawals with biometric verification.', icon: Fingerprint },
                        { title: 'Cold-Vault Isolation', desc: 'Assets stored in physical vaults across 3 continents.', icon: Layers }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-8 group pt-6 border-t border-zinc-800/50">
                           <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all duration-300 shrink-0">
                              <item.icon size={24} />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tighter italic">{item.title}</h4>
                              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full" />
                   <div className="bg-zinc-900/50 border border-emerald-500/10 rounded-[64px] p-10 md:p-14 relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-4 mb-14">
                         <div className="w-3 h-3 rounded-full bg-emerald-500" />
                         <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-60" />
                         <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-20" />
                         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-4">System Shield: Fully Optimized</span>
                      </div>
                      
                      <div className="space-y-12">
                         <div className="flex justify-between items-end border-b border-zinc-800/50 pb-10">
                            <div>
                               <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-2">Protocol Hash</p>
                               <p className="text-xs font-mono text-zinc-400">0x7F8C4...B2D1</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-2">Node Efficiency</p>
                               <p className="text-2xl font-black text-emerald-500 font-mono tracking-tighter">99.8%</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-6 gap-3">
                            {Array.from({length: 30}).map((_, i) => (
                               <div key={i} className="h-10 bg-zinc-950/80 border border-zinc-800/50 rounded-xl flex items-center justify-center hover:border-emerald-500/20 transition-all">
                                  <div className="w-1.5 h-1.5 bg-emerald-500/10 rounded-full" />
                               </div>
                            ))}
                         </div>

                         <div className="p-8 bg-zinc-950/80 rounded-[40px] border border-zinc-800/50 flex flex-col md:flex-row items-center gap-8 shadow-inner">
                            <Activity className="text-emerald-500/30 animate-pulse hidden md:block" size={32} />
                            <div className="flex-1 w-full">
                               <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-4">
                                  <span>Network Latency Shield</span>
                                  <span>0.00ms Drop</span>
                               </div>
                               <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                  <motion.div 
                                    animate={{ x: [-200, 200] }} 
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" 
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <section className="py-24 md:py-40 px-6 bg-[#09090a] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-zinc-800/50" />
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 md:mb-24">
                 <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase font-serif mb-6">PROTOCOL TESTIMONIALS.</h2>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">Verified Global Asset Allocators</p>
              </div>

              <div className="relative min-h-[600px] md:min-h-[500px] flex items-center justify-center">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center max-w-5xl"
                    >
                       <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-full aspect-square rounded-[64px] overflow-hidden border border-zinc-800 shadow-2xl">
                             <img 
                               src={testimonials[activeTestimonial].image} 
                               alt={testimonials[activeTestimonial].name}
                               className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000"
                               referrerPolicy="no-referrer"
                             />
                          </div>
                          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500 flex items-center justify-center rounded-3xl shadow-xl shadow-emerald-500/20 z-10">
                             <Users size={48} className="text-black" />
                          </div>
                       </div>

                       <div className="space-y-10">
                          <div className="space-y-4">
                             <div className="flex gap-1 text-emerald-500">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                             </div>
                             <p className="text-2xl md:text-3xl font-medium text-white italic leading-relaxed font-serif uppercase tracking-tight">
                                "{testimonials[activeTestimonial].content}"
                             </p>
                          </div>
                          
                          <div className="pt-10 border-t border-zinc-800/50">
                             <h4 className="text-xl font-black text-white italic tracking-widest uppercase">{testimonials[activeTestimonial].name}</h4>
                             <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-2">{testimonials[activeTestimonial].role}</p>
                             <div className="flex items-center gap-3 mt-4 text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">
                                <Globe size={12} />
                                {testimonials[activeTestimonial].location}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 </AnimatePresence>

                 {/* Slider Controls */}
                 <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-4">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={cn(
                          "w-3 h-3 rounded-full border transition-all duration-500",
                          activeTestimonial === i 
                            ? "bg-emerald-500 border-emerald-500 w-10" 
                            : "bg-transparent border-zinc-700 hover:border-emerald-500"
                        )}
                      />
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 md:py-48 px-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
           <div className="max-w-6xl mx-auto rounded-[32px] sm:rounded-[56px] md:rounded-[80px] border border-zinc-800/50 bg-[#0c0c0d] p-8 sm:p-16 md:p-32 text-center relative shadow-[0_0_150px_rgba(0,0,0,0.8)] border-b-0 overflow-hidden">
              <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="space-y-8 md:space-y-12 relative z-10"
              >
                 <div className="inline-block px-6 py-3 md:px-10 md:py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                    <span className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em]">Secure Your Legacy</span>
                 </div>
                 <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-white tracking-tighter italic font-serif leading-none">THE PRIVATE <br /> POOL AWAITS.</h2>
                 <p className="text-zinc-500 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed italic">Account verification is instant. Deploy capital to institutional registries in under 120 seconds.</p>
                 <div className="flex flex-col xl:flex-row items-center justify-center gap-6 md:gap-8 pt-6 md:pt-10">
                    <Link to="/signup" className="group w-full xl:w-auto px-10 py-5 md:px-16 md:py-7 bg-white text-black rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] md:text-[12px] flex items-center justify-center gap-4 md:gap-5 hover:bg-emerald-500 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95">
                       Apply For Portal Access
                       <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                    <div className="flex flex-col items-center xl:items-start gap-2">
                       <div className="flex items-center gap-3 text-emerald-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                          <Lock size={14} /> AES-256 Protocol Active
                       </div>
                       <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">ISO-27001 Certified System</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* Comprehensive Footer */}
        <footer className="py-32 px-6 bg-[#070708] border-t border-zinc-900/50">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                 <div className="lg:col-span-5 space-y-10">
                    <Link to="/" className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl">
                          <TrendingUp size={24} />
                       </div>
                       <span className="text-3xl font-bold text-white font-serif italic tracking-tighter uppercase">ApexBridge<span className="text-emerald-500">Capital</span></span>
                    </Link>
                    <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-medium">
                      The high-precision gateway for sovereign wealth, institutional stakings, and liquid managed asset protocols. Engineered for the next century of finance.
                    </p>
                    <div className="flex gap-6 pt-4">
                       {[1,2,3,4].map(idx => (
                         <div key={idx} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all cursor-pointer">
                            <Activity size={18} />
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
                    {[
                      { title: 'Institutional', links: ['Yield Modeling', 'Execution Routing', 'Alpha Discovery', 'Market Liquidity'] },
                      { title: 'Compliance', links: ['Privacy Charter', 'AML Framework', 'Regulatory Hub', 'Risk Advisory'] },
                      { title: 'Global', links: ['Node Network', 'Custodian Map', 'System Status', 'Help Terminal'] }
                    ].map((group, idx) => (
                      <div key={idx} className="space-y-8">
                         <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">{group.title}</h4>
                         <ul className="space-y-5">
                            {group.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                 <a href="#" className="text-zinc-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest block transform hover:translate-x-1 decoration-emerald-500/30 underline-offset-4">{link}</a>
                              </li>
                            ))}
                         </ul>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-16 border-t border-zinc-900/50 flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-left">
                 <div className="space-y-4">
                    <div className="text-[10px] text-zinc-700 font-mono tracking-[0.2em] uppercase italic leading-loose">
                       © 2024 APEXBRIDGE CAPITAL ASSET MANAGEMENT GLOBAL. ALL SYSTEMS OPERATIONAL. <br />
                       FINANCIAL PROTOCOLS LICENSED BY GLOBAL CUSTODIAN ADVISORY.
                    </div>
                 </div>
                 <div className="flex flex-wrap justify-center gap-10 items-center">
                    <div className="flex items-center gap-3 text-zinc-700">
                       <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Protocol Shield: V2.4-Active</span>
                    </div>
                    <div className="h-6 w-px bg-zinc-900 hidden sm:block" />
                    <span className="text-[10px] text-zinc-800 font-mono italic tracking-[0.3em] font-black">ISO-9001 QUALIFIED</span>
                    <span className="text-[10px] text-zinc-800 font-mono italic tracking-[0.3em] font-black">SOC-2 TYPE II</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

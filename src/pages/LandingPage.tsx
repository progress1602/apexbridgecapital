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
  X,
  Github,
  Linkedin,
  Mail
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
  
  return (    <div className="min-h-screen bg-brand-black text-zinc-100 overflow-x-hidden selection:bg-brand-purple/30 selection:text-white font-sans">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900/50 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group relative z-50">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:scale-110 transition-transform duration-500 shrink-0">
               <TrendingUp size={20} className="text-white md:size-6" />
            </div>
            <span className="text-sm md:text-2xl font-black tracking-tight text-white uppercase truncate">
              ApexBridge<span className="text-purple-500">Capital</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em]">
            <span className="relative text-purple-400 cursor-pointer">
              Home
              <span className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-4 h-[3px] bg-purple-500 rounded-full" />
            </span>
            <a href="#protocol" className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Markets</a>
            <a href="#protocol" className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Alpha Plans</a>
            <a href="#infrastructure" className="text-zinc-400 hover:text-white transition-colors cursor-pointer">About Us</a>
            <a href="#yield" className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Resources</a>
            <a href="#partners" className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="px-6 py-3 border border-zinc-800 hover:border-purple-500 hover:text-purple-400 text-white text-[11px] font-black uppercase rounded-lg transition-all tracking-widest text-center">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black uppercase rounded-lg transition-all duration-200 shadow-lg tracking-widest text-center">
                Deploy Capital
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white transition-colors relative z-50 cursor-pointer"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-brand-black/98 backdrop-blur-2xl border-b border-zinc-800 flex flex-col justify-between overflow-y-auto px-6 py-8"
            >
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Protocol Navigation</p>
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Markets', href: '#protocol' },
                  { name: 'Alpha Plans', href: '#protocol' },
                  { name: 'About Us', href: '#infrastructure' },
                  { name: 'Resources', href: '#yield' },
                  { name: 'Contact', href: '#partners' }
                ].map((item, idx) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.2 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg sm:text-xl font-black text-white hover:text-purple-400 uppercase tracking-tight py-2.5 px-3 rounded-xl hover:bg-zinc-900/60 transition-all flex items-center justify-between border-b border-zinc-900/50"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight size={16} className="text-zinc-600" />
                  </motion.a>
                ))}
              </div>

              <div className="pt-8 mt-6 border-t border-zinc-800/80 space-y-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3.5 text-center text-zinc-300 text-xs font-black uppercase tracking-wider border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3.5 bg-purple-600 text-white text-center text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-colors"
                >
                  Deploy Capital
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Hero Section */}
      <main className="relative z-10">
        <section className="relative pt-24 md:pt-40 pb-20 px-4 md:px-6 overflow-hidden bg-black flex flex-col justify-between">
                    {/* Background Layer (vibrant & visible on both md and lg screens, matches image perfectly) */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <img 
              src="https://res.cloudinary.com/progresshenry/image/upload/v1781474630/background_iuvp53.jpg" 
              alt="Precision Capital Backdrop" 
              className="w-full h-full object-cover object-[78%_center] lg:object-right opacity-100 filter contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant black gradient mask to guarantee text readability without losing the background graphics */}
            <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-black via-black/85 md:via-black/75 to-transparent pointer-events-none" />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left Column matching image text layouts */}
              <div className="md:col-span-7 space-y-7 md:space-y-9">
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-7 sm:space-y-8"
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-purple-500/20 rounded-full bg-black/40 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="tracking-[0.25em] text-[10px] md:text-[11px] font-black uppercase text-purple-400">
                      MARKET EXECUTION: ACTIVE
                    </span>
                  </div>
                  
                  {/* Heading */}
                  <h1 className="text-4xl sm:text-6xl md:text-[85px] leading-[0.95] md:leading-[0.9] font-black text-white uppercase tracking-tight text-left break-words">
                    PRECISION <br />
                    <span className="text-purple-500 font-black block mt-1">CAPITAL.</span>
                  </h1>
                  
                  {/* Paragraph Info */}
                  <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-bold tracking-tight text-left">
                    The sophisticated interface for deep liquidity management and diversified stakings. Join the private network of global allocators.
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 pt-2">
                    <Link to="/signup" className="flex items-center justify-center gap-2 px-9 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-[11px] tracking-widest rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/10 active:scale-95 shrink-0">
                      DEPLOY CAPITAL NOW <ArrowRight size={14} />
                    </Link>
                    <a href="#protocol" className="flex items-center justify-center gap-2 px-9 py-4 bg-transparent border border-purple-600 hover:bg-purple-600/10 text-white font-black uppercase text-[11px] tracking-widest rounded-lg transition-all duration-200 active:scale-95 shrink-0">
                      VIEW ALPHA PLANS
                    </a>
                  </div>

                  {/* Mobile-only Optimized Woman Image Block (fully visible, styled with a purple rim, never overlapping text) */}
                  <div className="md:hidden w-full relative rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl mt-6 bg-zinc-950">
                    <div className="aspect-[1.4] sm:aspect-[1.8] w-full">
                      <img 
                        src="https://res.cloudinary.com/progresshenry/image/upload/v1781474630/background_iuvp53.jpg" 
                        alt="ApexBridge Capital Portfolio representation" 
                        className="w-full h-full object-cover object-[76%_center] filter contrast-[1.05]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Seamless bottom fade overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Trust indicator overlapping avatars */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-5 border-t border-zinc-900/40">
                    <div className="flex -space-x-3.5">
                      {[
                        { initials: 'MS', bg: 'from-purple-900/50 to-zinc-900' },
                        { initials: 'YT', bg: 'from-zinc-800 to-zinc-900' },
                        { initials: 'ER', bg: 'from-purple-950 to-zinc-900' },
                        { initials: 'LF', bg: 'from-zinc-900 to-black' },
                      ].map((partner, idx) => (
                        <div 
                          key={idx} 
                          className={`w-11 h-11 rounded-full border-2 border-zinc-950 overflow-hidden bg-gradient-to-br ${partner.bg} shadow-md flex items-center justify-center text-[11px] font-black text-purple-300 font-mono`}
                        >
                          {partner.initials}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] sm:text-[11px] text-purple-400 font-black uppercase tracking-[0.2em]">TRUSTED BY 12,400+</p>
                      <p className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">INSTITUTIONAL PARTNERS</p>
                    </div>
                  </div>

                  {/* Email contact strip */}
                  <div className="pt-2">
                    <div className="w-full max-w-md border border-purple-500/20 bg-zinc-950/65 backdrop-blur-sm p-3.5 sm:p-4 px-4 sm:px-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-purple-400 shrink-0" />
                        <span className="text-purple-400 uppercase tracking-widest text-[10px] font-black">Email Us</span>
                      </div>
                      <div className="hidden sm:block w-px h-4 bg-zinc-800" />
                      <a href="mailto:apexbridgecapital1@gmail.com" className="text-zinc-300 font-bold tracking-tight text-[11px] hover:text-purple-400 transition-colors break-all">
                        apexbridgecapital1@gmail.com
                      </a>
                    </div>
                  </div>

                </motion.div>
              </div>

              {/* On md and larger screens, this spacer ensures the background image of the woman remains perfectly visible on the right */}
              <div className="md:col-span-5 h-[350px] md:h-[500px] lg:h-[550px] pointer-events-none hidden md:block" />

            </div>
          </div>

          {/* Bottom Pillar Columns Row */}
          <div className="border-t border-zinc-900/60 w-full mt-16 md:mt-24 pt-10 md:pt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0">
              
              {/* Enterprise Security */}
              <div className="flex items-center gap-4 group md:pr-6 md:border-r border-zinc-800/40 pb-6 md:pb-0 border-b md:border-b-0 border-zinc-900/60">
                <div className="w-12 h-12 rounded-full border border-purple-500/80 bg-purple-500/5 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <Lock size={18} className="text-purple-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase">
                    ENTERPRISE SECURITY
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                    Bank-grade security for your assets.
                  </p>
                </div>
              </div>

              {/* Deep Liquidity Access */}
              <div className="flex items-center gap-4 group md:px-6 md:border-r border-zinc-800/40 pb-6 md:pb-0 border-b md:border-b-0 border-zinc-900/60">
                <div className="w-12 h-12 rounded-full border border-purple-500/80 bg-purple-500/5 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <TrendingUp size={18} className="text-purple-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase">
                    DEEP LIQUIDITY ACCESS
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                    Access global liquidity pools seamlessly.
                  </p>
                </div>
              </div>

              {/* Diversified Stakings */}
              <div className="flex items-center gap-4 group md:px-6 md:border-r border-zinc-800/40 pb-6 md:pb-0 border-b md:border-b-0 border-zinc-900/60">
                <div className="w-12 h-12 rounded-full border border-purple-500/80 bg-purple-500/5 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <Globe size={18} className="text-purple-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase">
                    DIVERSIFIED STAKINGS
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                    Maximize returns with strategic allocations.
                  </p>
                </div>
              </div>

              {/* Private Network Access */}
              <div className="flex items-center gap-4 group md:pl-6">
                <div className="w-12 h-12 rounded-full border border-purple-500/80 bg-purple-500/5 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)] transition-transform duration-300 group-hover:scale-105">
                  <Users size={18} className="text-purple-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase">
                    PRIVATE NETWORK ACCESS
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                    Join a network of elite institutional allocators.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* Institutional Backing / Partners */}
        <section id="partners" className="py-20 border-y border-zinc-800/10 overflow-hidden bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <p className="text-center text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-600 mb-8 md:mb-12">Settlement provided by institutional custodians</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 md:gap-x-20 gap-y-8 md:gap-y-10 opacity-30 grayscale saturate-0 contrast-150">
               {partners.map((p, i) => (
                 <span key={i} className="text-xl md:text-3xl font-black text-white hover:text-brand-purple transition-all cursor-default uppercase">
                   {p}
                 </span>
               ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 lg:gap-24">
             {stats.map((stat, i) => (
                <div key={i} className={cn("text-center space-y-3 md:space-y-4 group", i === 2 && "sm:col-span-2 md:col-span-1")}>
                  <div className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-none group-hover:scale-110 transition-transform duration-700 tabular-nums uppercase">{stat.value}</div>
                  <div className="text-brand-purple font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[10px] font-mono">{stat.label}</div>
                  <div className="w-10 md:w-12 h-[1px] bg-brand-purple/30 mx-auto" />
                </div>
             ))}
          </div>
        </section>

        {/* Bento Grid: The Protocol Advantage */}
        <section id="protocol" className="py-20 md:py-32 px-4 md:px-6 bg-brand-black">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-12 md:mb-32 space-y-4 md:space-y-6">
                <div className="w-12 md:w-16 h-1 bg-brand-purple mx-auto rounded-full" />
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-none">Protocol <span className="text-zinc-700">Core.</span></h2>
                <p className="text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-[9px] md:text-[10px]">High Efficiency Capital Deployment</p>
             </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-5 md:gap-10">
                {/* Large Main Feature */}
                <div className="sm:col-span-2 md:col-span-12 lg:col-span-8 bg-brand-black border border-zinc-800/40 rounded-[28px] sm:rounded-[32px] md:rounded-[56px] p-6 sm:p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group hover:border-brand-purple/20 transition-all duration-700 shadow-2xl min-h-[380px] sm:min-h-[400px]">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" 
                        alt="Security" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                   <div className="relative z-10">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-900 rounded-2xl sm:rounded-3xl flex items-center justify-center text-brand-purple mb-8 sm:mb-10 border border-zinc-800 shadow-inner group-hover:rotate-12 transition-transform">
                         <ShieldCheck size={28} className="sm:size-8" />
                      </div>
                      <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-6 sm:mb-8 uppercase leading-tight sm:leading-none break-words">Mathematical Isolation <br className="hidden sm:inline" /> <span className="text-zinc-600">of Capital.</span></h3>
                      <p className="text-zinc-400 max-w-md text-base sm:text-lg md:text-xl leading-relaxed font-bold tracking-tight">Your assets are segregated from operational accounts using cryptographic multi-sig isolation. Minimal risk, absolute clarity.</p>
                   </div>
                   <div className="relative z-10 grid grid-cols-4 gap-4 sm:gap-6 pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-zinc-800/50">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 bg-zinc-800 rounded shadow-inner" />
                      ))}
                   </div>
                </div>

                {/* Right Top */}
                <div className="sm:col-span-1 md:col-span-6 lg:col-span-4 bg-brand-purple rounded-[28px] sm:rounded-[32px] md:rounded-[56px] p-6 sm:p-8 md:p-12 flex flex-col justify-between group overflow-hidden relative shadow-[0_20px_50px_rgba(75,47,168,0.15)] active:scale-95 transition-all min-h-[260px] sm:min-h-[300px]">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 mix-blend-overlay grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                        alt="Alpha" 
                        className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-hover to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative z-10 flex justify-between items-start">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-black">
                         <Zap size={24} className="md:size-7" />
                      </div>
                      <ArrowUpRight size={20} className="text-black/40 group-hover:text-black transition-colors md:size-6" />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-2 md:mb-3 uppercase">Alpha Bolt</h3>
                      <p className="text-black/50 text-[9px] font-black uppercase tracking-[0.25em]">Sub-10ms Trade routing Engine</p>
                   </div>
                </div>
                {/* Bottom Center */}
                <div className="sm:col-span-1 md:col-span-6 lg:col-span-5 bg-zinc-900/50 border border-zinc-800/40 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col justify-between group hover:bg-zinc-900 transition-all shadow-2xl relative overflow-hidden min-h-[300px]">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2670&auto=format&fit=crop" 
                        alt="Global" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                         <Globe size={18} className="md:size-[22px]" />
                      </div>
                      <div className="h-px flex-1 bg-zinc-800/50" />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 uppercase">Global Reserve</h3>
                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-bold tracking-tight">Liquidate into fiat or digital stores in over 140+ countries within one banking day. Complete sovereign control.</p>
                   </div>
                </div>

                {/* Bottom Left Small */}
                <div className="sm:col-span-2 md:col-span-12 lg:col-span-7 bg-black border border-zinc-800/40 rounded-[32px] md:rounded-[56px] p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between group overflow-hidden shadow-2xl relative gap-8 min-h-[250px]">
                   {/* Background Image */}
                   <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 grayscale">
                      <img 
                        src="https://images.unsplash.com/photo-1558494949-ef010ccdcc91?q=80&w=2670&auto=format&fit=crop" 
                        alt="Intelligence" 
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <div className="flex-1 space-y-4 md:space-y-6 relative z-10 w-full">
                      <div className="flex gap-2 md:gap-3">
                         {[1,2,3,4,5].map(i => <div key={i} className="w-6 md:w-8 h-1.5 md:h-2 bg-brand-purple rounded-full" />)}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase">Intelligence Matrix</h3>
                      <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Real-time Portfolio Alpha metrics</p>
                   </div>
                   <div className="w-32 h-32 md:w-40 md:h-40 bg-brand-purple/5 rounded-full border border-brand-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative z-10 shrink-0">
                      <BarChart3 size={40} className="text-brand-purple/40 animate-pulse md:size-[48px]" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Client Portal Preview - THE "VIBE" SECTION */}        <section className="py-20 md:py-40 px-4 md:px-6 relative overflow-hidden bg-brand-black">
           <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
              <div className="order-2 lg:order-1 relative w-full">
                 <div className="absolute inset-0 bg-brand-purple/10 blur-[140px] rounded-full" />
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95, y: 40 }}
                   whileInView={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ duration: 1 }}
                   viewport={{ once: true }}
                   className="relative bg-black border border-zinc-800 rounded-[32px] md:rounded-[48px] p-6 md:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group"
                 >
                    <div className="flex items-center justify-between mb-8 md:mb-10 px-2 md:px-4">
                       <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-purple/20" />
                       </div>
                       <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-600">Secure Client Access Proxy</div>
                    </div>
                    <div className="space-y-6 md:space-y-10" >
                       <div className="p-5 sm:p-6 md:p-8 bg-zinc-900/50 rounded-2xl md:rounded-3xl border border-zinc-800">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                             <div>
                                <p className="text-[8px] font-black uppercase text-zinc-500 mb-1">Net Valuation</p>
                                <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono break-all">$1,240,402.10</p>
                             </div>
                             <div className="px-3 py-1 bg-brand-purple/20 rounded-lg text-brand-purple text-[10px] font-bold self-start sm:self-center">+14.2%</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-2 bg-brand-purple rounded-full" />
                             <div className="h-2 bg-zinc-800 rounded-full" />
                          </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                          <div className="p-5 md:p-6 bg-zinc-900 rounded-2xl md:rounded-3xl border border-zinc-800 space-y-3">
                             <p className="text-[8px] font-black uppercase text-zinc-500">Accrued Yield</p>
                             <p className="text-lg md:text-xl font-bold text-white font-mono">$12,402.00</p>
                             <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-brand-purple" />
                             </div>
                          </div>
                          <div className="p-5 md:p-6 bg-zinc-900 rounded-2xl md:rounded-3xl border border-zinc-800 space-y-3">
                             <p className="text-[8px] font-black uppercase text-zinc-500">Active Node</p>
                             <p className="text-lg md:text-xl font-bold text-brand-purple">Premium Flow</p>
                             <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-brand-purple rounded-full" />)}
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>

              <div className="order-1 lg:order-2 space-y-6 md:space-y-10">
                 <span className="text-brand-purple text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] block">Unified Asset Management</span>
                 <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.95] md:leading-none uppercase">
                    YOUR ASSETS, <br />
                    <span className="text-zinc-600">DEMOCRATIZED.</span>
                  </h2>
                  <p className="text-zinc-400 text-base md:text-xl font-bold leading-relaxed max-w-xl font-sans tracking-tight">
                    Experience a tier-one trading floor from your private mobile terminal. Deep analytics, instant stakings, and absolute transparency are standard features of the ApexBridge protocol.
                  </p>
                  <ul className="space-y-4 md:space-y-6">
                     {[
                       'Automated Dividend Compounding',
                       'Instant P2P Asset Settlement',
                       'Military-Grade Encryption Protocol',
                       'Dedicated Wealth Concierge'
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 md:gap-4 text-zinc-300 font-black uppercase text-[9px] md:text-xs">
                           <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                              <Check size={12} className="md:size-[14px]" />
                           </div>
                           {item}
                        </li>
                     ))}
                  </ul>
                  <div className="pt-4 md:pt-6">
                    <Link to="/signup" className="inline-flex items-center gap-4 text-brand-purple font-black uppercase text-[10px] md:text-xs group">
                       EXPLORE PORTAL INTERFACE <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform md:size-[18px]" />
                    </Link>
                  </div>
              </div>
           </div>
        </section>

        {/* Security / Infrastructure */}
        <section id="infrastructure" className="py-24 md:py-40 px-4 md:px-6 bg-brand-black">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 lg:gap-32 items-center">
                <div className="space-y-10 md:space-y-12">
                   <div className="inline-block px-4 py-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Hardware-Back Security</div>
                   <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase mb-6 leading-tight">THE <span className="text-zinc-600">FORTRESS.</span></h2>
                   <div className="space-y-8 md:space-y-10">
                      {[
                         { title: 'Privacy Protocols', desc: 'Secure history without exposing sensitive data points.', icon: Lock },
                         { title: 'Biometric Gateway', desc: 'Secure withdrawals with biometric verification.', icon: Fingerprint },
                         { title: 'Cold-Vault Isolation', desc: 'Assets stored in physical vaults across 3 continents.', icon: Layers }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-5 md:gap-8 group pt-6 border-t border-zinc-800/50">
                           <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-brand-purple group-hover:border-brand-purple/30 transition-all duration-300 shrink-0">
                              <item.icon size={20} className="md:size-6" />
                           </div>
                           <div>
                              <h4 className="text-base md:text-lg font-black text-white mb-1 md:mb-2 uppercase">{item.title}</h4>
                              <p className="text-zinc-500 text-xs md:text-base leading-relaxed font-bold tracking-tight">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-brand-purple/5 blur-[120px] rounded-full" />
                   <div className="bg-zinc-900/50 border border-brand-purple/10 rounded-[40px] md:rounded-[64px] p-8 md:p-14 relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-14">
                         <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                         <div className="w-2.5 h-2.5 rounded-full bg-brand-purple opacity-60" />
                         <div className="w-2.5 h-2.5 rounded-full bg-brand-purple opacity-20" />
                         <span className="text-[8px] md:text-[9px] font-black text-zinc-600 uppercase ml-2 md:ml-4">System Shield: Fully Optimized</span>
                      </div>
                      
                      <div className="space-y-10 md:space-y-12">
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-zinc-800/50 pb-8 md:pb-10">
                            <div>
                               <p className="text-[8px] text-zinc-500 font-black uppercase mb-1 md:mb-2">Protocol Hash</p>
                               <p className="text-[10px] font-mono text-zinc-400">0x7F8C4...B2D1</p>
                            </div>
                            <div className="sm:text-right">
                               <p className="text-[8px] text-zinc-500 font-black uppercase mb-1 md:mb-2">Node Efficiency</p>
                               <p className="text-xl md:text-2xl font-black text-brand-purple font-mono">99.8%</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 md:gap-3">
                            {Array.from({length: 25}).map((_, i) => (
                               <div key={i} className="h-8 md:h-10 bg-zinc-950/80 border border-zinc-800/50 rounded-lg md:rounded-xl flex items-center justify-center hover:border-brand-purple/20 transition-all cursor-default">
                                  <div className="w-1 h-1 bg-brand-purple/10 rounded-full" />
                               </div>
                            ))}
                         </div>

                         <div className="p-6 md:p-8 bg-zinc-950/80 rounded-[24px] md:rounded-[40px] border border-zinc-800/50 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-inner">
                            <Activity className="text-brand-purple/30 animate-pulse block" size={28} />
                            <div className="flex-1 w-full">
                               <div className="flex justify-between text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-zinc-600 mb-3 md:mb-4">
                                  <span>Network Latency Shield</span>
                                  <span>0.00ms Drop</span>
                               </div>
                               <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                  <motion.div 
                                    animate={{ x: [-200, 200] }} 
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-brand-purple to-transparent" 
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
        <section className="py-20 md:py-40 px-4 md:px-6 bg-brand-black relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-zinc-800/50" />
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-24">
                 <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase mb-4 md:mb-6 leading-tight">PROTOCOL <span className="text-zinc-600">TESTIMONIALS.</span></h2>
                 <p className="text-brand-purple text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Verified Global Asset Allocators</p>
              </div>

              <div className="relative min-h-[620px] sm:min-h-[500px] flex items-center justify-center pb-12 sm:pb-0">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl"
                    >
                       <div className="relative group w-full max-w-sm mx-auto lg:max-w-none">
                          <div className="absolute inset-0 bg-brand-purple/20 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-full aspect-square rounded-[40px] md:rounded-[64px] overflow-hidden border border-zinc-800 shadow-2xl">
                             <img 
                               src={testimonials[activeTestimonial].image} 
                               alt={testimonials[activeTestimonial].name}
                               className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000"
                               referrerPolicy="no-referrer"
                             />
                          </div>
                          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-brand-purple flex items-center justify-center rounded-2xl md:rounded-3xl shadow-xl shadow-brand-purple/20 z-10 shrink-0">
                             <Users className="text-black w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12" />
                          </div>
                       </div>

                       <div className="space-y-8 md:space-y-10">
                          <div className="space-y-3 md:space-y-4">
                             <div className="flex gap-1 text-brand-purple">
                                {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" className="w-3 h-3 md:w-3.5 md:h-3.5" />)}
                             </div>
                             <p className="text-lg sm:text-xl md:text-3xl font-medium text-white leading-relaxed uppercase tracking-tight">
                                "{testimonials[activeTestimonial].content}"
                             </p>
                          </div>
                          
                          <div className="pt-6 sm:pt-8 md:pt-10 border-t border-zinc-800/50">
                             <h4 className="text-base sm:text-lg md:text-xl font-black text-white uppercase">{testimonials[activeTestimonial].name}</h4>
                             <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2">
                               {testimonials[activeTestimonial].role}
                             </p>
                             <div className="flex items-center gap-2 mt-3 md:mt-4 text-[9px] md:text-[10px] text-brand-purple/60 font-black uppercase">
                                <Globe className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {testimonials[activeTestimonial].location}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 </AnimatePresence>


                 {/* Slider Controls */}
                 <div className="absolute bottom-[-40px] sm:bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={cn(
                          "w-3 h-3 rounded-full border transition-all duration-500",
                          activeTestimonial === i 
                            ? "bg-brand-purple border-brand-purple w-10" 
                            : "bg-transparent border-zinc-700 hover:border-brand-purple-hover"
                        )}
                      />
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-48 px-4 md:px-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-purple/20 to-transparent" />
           <div className="max-w-6xl mx-auto rounded-[32px] sm:rounded-[40px] md:rounded-[80px] border border-zinc-800/50 bg-black p-6 sm:p-12 md:p-32 text-center relative shadow-[0_0_150px_rgba(0,0,0,0.8)] border-b-0 overflow-hidden">
              <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-brand-purple/5 blur-[160px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="space-y-8 md:space-y-12 relative z-10"
              >
                 <div className="inline-block px-6 py-3 md:px-10 md:py-4 bg-brand-purple/5 border border-brand-purple/10 rounded-full">
                    <span className="text-brand-purple text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">Secure Your Legacy</span>
                 </div>
                 <h2 className="text-3xl sm:text-6xl md:text-9xl font-black text-white leading-tight sm:leading-none uppercase break-words">THE PRIVATE <br className="hidden sm:block" /> <span className="text-zinc-700">POOL AWAITS.</span></h2>
                 <p className="text-zinc-500 text-sm sm:text-base md:text-2xl max-w-2xl mx-auto font-bold leading-relaxed font-sans">Account verification is instant. Deploy capital to institutional registries in under 120 seconds.</p>
                 <div className="flex flex-col xl:flex-row items-center justify-center gap-6 md:gap-8 pt-6 md:pt-10">
                    <Link to="/signup" className="group w-full xl:w-auto px-8 sm:px-10 py-4 sm:py-5 md:px-16 md:py-7 bg-white text-black rounded-2xl md:rounded-[32px] font-black uppercase text-[10px] md:text-[12px] flex items-center justify-center gap-4 md:gap-5 hover:bg-brand-purple-hover transition-all shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 shrink-0">
                       Apply For Portal Access
                       <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </Link>
                    <div className="flex flex-col items-center xl:items-start gap-2">
                       <div className="flex items-center gap-3 text-brand-purple text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                          <Lock size={14} /> AES-256 Protocol Active
                       </div>
                       <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold uppercase">ISO-27001 Certified System</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* Comprehensive Footer */}
        <footer className="py-20 sm:py-32 px-4 sm:px-6 bg-brand-black border-t border-zinc-900/50">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20 mb-20 sm:mb-32">
                 <div className="lg:col-span-5 space-y-8 sm:space-y-10">
                    <Link to="/" className="flex items-center gap-3 sm:gap-4">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-purple rounded-2xl flex items-center justify-center text-black shadow-xl">
                          <TrendingUp size={20} className="sm:size-6" />
                       </div>
                       <span className="text-2xl sm:text-3xl font-black text-white uppercase">ApexBridge<span className="text-brand-purple">Capital</span></span>
                    </Link>
                    <p className="text-zinc-500 text-sm sm:text-lg leading-relaxed max-w-md font-bold tracking-tight">
                      The high-precision gateway for sovereign wealth, institutional stakings, and liquid managed asset protocols. Engineered for the next century of finance.
                    </p>
                    <div className="flex gap-4 sm:gap-6 pt-2 sm:pt-4">
                       {[Globe, Github, Linkedin, Mail].map((Icon, idx) => (
                          <div key={idx} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-brand-purple hover:border-brand-purple/30 transition-all cursor-pointer group">
                             <Icon size={18} className="group-hover:scale-110 transition-transform" />
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-24">
                    {[
                      { title: 'Institutional', links: ['Yield Modeling', 'Execution Routing', 'Alpha Discovery', 'Market Liquidity'] },
                      { title: 'Compliance', links: ['Privacy Charter', 'AML Framework', 'Regulatory Hub', 'Risk Advisory'] },
                      { title: 'Global', links: ['Node Network', 'Custodian Map', 'System Status', 'Help Terminal'] }
                    ].map((group, idx) => (
                      <div key={idx} className="space-y-8">
                         <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-purple">{group.title}</h4>
                         <ul className="space-y-5">
                            {group.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                 <a href="#" className="text-zinc-600 hover:text-white transition-all text-xs font-black uppercase block transform hover:translate-x-1 decoration-brand-purple/30 underline-offset-4">{link}</a>
                              </li>
                            ))}
                         </ul>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-16 border-t border-zinc-900/50 flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-left">
                 <div className="space-y-4">
                    <div className="text-[10px] text-zinc-700 font-mono tracking-[0.2em] uppercase leading-loose">
                       © 2024 APEXBRIDGE CAPITAL ASSET MANAGEMENT GLOBAL. ALL SYSTEMS OPERATIONAL. <br />
                       FINANCIAL PROTOCOLS LICENSED BY GLOBAL CUSTODIAN ADVISORY.
                    </div>
                 </div>
                 <div className="flex flex-wrap justify-center gap-10 items-center">
                    <div className="flex items-center gap-3 text-zinc-700">
                       <div className="w-2 h-2 bg-brand-purple/50 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black uppercase">Protocol Shield: V2.4-Active</span>
                    </div>
                    <div className="h-6 w-px bg-zinc-900 hidden sm:block" />
                    <span className="text-[10px] text-zinc-800 font-mono tracking-[0.3em] font-black uppercase">ISO-9001 QUALIFIED</span>
                    <span className="text-[10px] text-zinc-800 font-mono tracking-[0.3em] font-black uppercase">SOC-2 TYPE II</span>
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

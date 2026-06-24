import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Factory, TrendingUp, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

export const Header = ({ onStartDiagnosis, onGoHome, onGoAdmin, showCta, ctaHref }: { onStartDiagnosis?: () => void; onGoHome?: () => void; onGoAdmin?: () => void; showCta?: boolean; ctaHref?: string }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b",
      isScrolled
        ? "bg-white/80 backdrop-blur-xl border-emerald-100 py-3 shadow-sm"
        : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-oem-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
            <Factory className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-lg md:text-xl font-display font-extrabold tracking-tight text-oem-dark uppercase">
            ENSU<span className="text-oem-primary">.ai</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {showCta && ctaHref ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-oem-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-200 hover:scale-105 transition-all"
            >
              Buat Sekarang
              <ArrowRight className="w-3 h-3" />
            </a>
          ) : (
            <>
              <button
                onClick={onGoAdmin}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-oem-primary transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </button>
              <button
                onClick={onStartDiagnosis}
                className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-oem-primary text-white rounded-full shadow-md shadow-emerald-200 hover:scale-105 transition-all"
              >
                Scan DNA Produk
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const Hero = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
  return (
    <section className="pt-24 md:pt-40 pb-16 md:pb-24 oem-grid relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern Laboratory" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-oem-light via-oem-light/95 to-oem-light" />
      </div>

      {/* Organic Background Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[100px] floating" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[80px] floating" style={{ animationDelay: '-5s' }} />

      {/* Floating Card 1: Product Match */}
      <motion.div 
        initial={{ opacity: 0, x: 50, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute right-[12%] top-[18%] z-20 hidden lg:block"
      >
        <motion.div
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="bg-white/80 backdrop-blur-2xl border border-white/60 p-5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] w-64 group hover:scale-105 transition-transform duration-500"
        >
          <div className="relative mb-5 aspect-square rounded-[1.5rem] overflow-hidden bg-emerald-50">
            <img 
              src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=400" 
              alt="Serum Product" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
            />
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              98% AURA MATCH
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-[13px] font-extrabold text-oem-dark uppercase tracking-tight leading-tight">Serum DNA <br/>Local Glow</h3>
              <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">ALPHA</div>
            </div>
            <div className="pt-2 border-t border-emerald-100/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-tighter">Pasaran Tempatan</span>
                <span className="text-sm font-black text-emerald-600">RM 450M</span>
              </div>
              <div className="w-full bg-emerald-100/50 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 2: Strategic Potential */}
      <motion.div 
        initial={{ opacity: 0, x: -30, y: 40, rotate: -6 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -6 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute left-[58%] top-[45%] z-30 hidden lg:block"
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="bg-oem-dark/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] w-52 group hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-4 text-white" />
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Strategi</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Potensi Metafizik</p>
            <p className="text-xl font-extrabold text-white leading-tight tracking-tight">HIGH SCORING</p>
          </div>
          <div className="mt-5 pt-4 border-t border-white/5 flex items-end justify-between">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-3.5 bg-emerald-500/30 rounded-full group-hover:bg-emerald-500/60 transition-colors" />)}
            </div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Optimal</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 3: Market Trend */}
      <motion.div 
        initial={{ opacity: 0, x: 80, rotate: -3 }}
        animate={{ opacity: 1, x: 0, rotate: -3 }}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="absolute right-[5%] bottom-[12%] z-10 hidden xl:block"
      >
        <motion.div
          animate={{ 
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="bg-white/80 backdrop-blur-2xl border border-white/60 p-5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] w-60 group animate-pulse-slow"
        >
          <div className="relative mb-5 aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50">
            <img 
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" 
              alt="Cleanser Product" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
            />
            <div className="absolute top-4 left-4 bg-oem-dark text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
              TRENDING (MY)
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-[13px] font-extrabold text-oem-dark uppercase tracking-tight">Micro-Wash <br/>Eco-System</h3>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-tighter">Nilai Pasaran</span>
              <span className="text-sm font-black text-oem-primary">RM 1.2B</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl flex-1"
          >
            <div className="mb-8">
              <span className="pill-container text-[9px]">
                Eksplorasi DNA Founder
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[7rem] font-extrabold mb-6 md:mb-12 leading-[1] md:leading-[0.9] tracking-tight text-oem-dark uppercase">
              PRODUK <br className="hidden sm:block"/>
              DNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 animate-gradient-x">FOUNDER.</span>
            </h1>
            <p className="text-base md:text-xl text-oem-dark/40 mb-8 md:mb-14 max-w-2xl leading-relaxed font-medium">
              Jenama yang kuat bermula dari <span className="text-oem-dark font-bold underline decoration-emerald-200">personaliti diri sendiri</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
              <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
                <button
                  onClick={onStartDiagnosis}
                  className="btn-organic group w-full sm:w-auto"
                >
                  SCAN DNA PRODUK <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <p className="text-[10px] font-semibold text-oem-dark/40 tracking-wide text-center sm:text-left">
                  Inject DNA dalam produk ni — supaya setiap titisan cerita founder hidup dalam setiap botol.
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=ensu${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-oem-dark tracking-tighter">1,200+ FOUNDER</span>
                  <span className="text-[9px] font-bold text-oem-primary uppercase tracking-[0.2em]">Telah Berjaya</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Saintis Ensu Character */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center flex-shrink-0 relative"
          >
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -top-4 -left-24 z-10 bg-white border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg max-w-[200px]"
            >
              <p className="text-[11px] font-bold text-oem-dark leading-snug">Eh, jom scan DNA bisnes kau! 🧬</p>
              <p className="text-[9px] text-oem-dark/40 mt-0.5 font-medium">— Saintis Ensu</p>
            </motion.div>

            {/* Character image container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-72 h-[420px] relative">
                {/* Glow behind character */}
                <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-3xl scale-75 translate-y-8" />
                <img
                  src="/ChatGPT_Image_Jun_24,_2026,_09_18_31_PM copy copy.png"
                  alt="Saintis Ensu"
                  className="w-full h-full object-cover object-top rounded-3xl shadow-2xl shadow-emerald-200/40 border border-white/60"
                />
                {/* Name badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-oem-dark/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                  Saintis Ensu
                </div>
                {/* AI badge */}
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  AI
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

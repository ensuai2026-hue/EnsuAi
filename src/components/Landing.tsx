import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Factory, TrendingUp, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

export const Header = ({ onStartDiagnosis, onGoHome, onGoAdmin }: { onStartDiagnosis?: () => void; onGoHome?: () => void; onGoAdmin?: () => void }) => {
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
        ? "bg-white/90 backdrop-blur-xl border-emerald-100 py-3 shadow-sm"
        : "bg-transparent border-transparent py-4 md:py-5"
    )}>
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between gap-4">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0"
          aria-label="Ke laman utama"
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-oem-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
            <Factory className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-base md:text-xl font-display font-extrabold tracking-tight text-oem-dark uppercase">
            ENSU<span className="text-oem-primary">.ai</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-oem-dark/40">
          <button
            onClick={onGoHome}
            className="hover:text-oem-primary transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oem-primary transition-all group-hover:w-full" />
          </button>
          <button
            onClick={onStartDiagnosis}
            className="hover:text-oem-primary transition-colors relative group"
          >
            Scan DNA
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oem-primary transition-all group-hover:w-full" />
          </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onGoAdmin}
            className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-oem-primary transition-colors"
            aria-label="Akses panel admin"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </button>
          <button
            onClick={onStartDiagnosis}
            className="btn-outline !text-[10px] !py-2 !px-4 md:!px-6 whitespace-nowrap"
          >
            Mula Bersembang
          </button>
        </div>
      </div>
    </header>
  );
};

export const Hero = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
  return (
    <section className="pt-20 md:pt-36 pb-14 md:pb-24 oem-grid relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2000"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-oem-light via-oem-light/95 to-oem-light" />
      </div>

      {/* Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] floating pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-emerald-50 rounded-full blur-[80px] floating pointer-events-none" style={{ animationDelay: '-5s' }} />

      {/* Floating Card 1: Product Match — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: 50, rotate: 3 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute right-[10%] top-[15%] z-20 hidden xl:block"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white/80 backdrop-blur-2xl border border-white/60 p-5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] w-56 group hover:scale-105 transition-transform duration-500"
        >
          <div className="relative mb-4 aspect-square rounded-[1.5rem] overflow-hidden bg-emerald-50">
            <img
              src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=400"
              alt="Serum Product"
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
            />
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
              98% MATCH
            </div>
          </div>
          <div className="space-y-2.5">
            <h3 className="text-[12px] font-extrabold text-oem-dark uppercase tracking-tight leading-tight">Serum DNA Local Glow</h3>
            <div className="pt-2 border-t border-emerald-100/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-tighter">Pasaran</span>
                <span className="text-sm font-black text-emerald-600">RM 450M</span>
              </div>
              <div className="w-full bg-emerald-100/50 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 2: Strategic Potential — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 40, rotate: -6 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -6 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute left-[57%] top-[48%] z-30 hidden xl:block"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="bg-oem-dark/95 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] w-48 group hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Strategi</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Potensi Metafizik</p>
          <p className="text-lg font-extrabold text-white leading-tight tracking-tight mt-0.5">HIGH SCORING</p>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-end justify-between">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-3 bg-emerald-500/30 rounded-full" />)}
            </div>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Optimal</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl flex-1 text-center lg:text-left"
          >
            <div className="mb-6 md:mb-8">
              <span className="pill-container text-[9px]">Eksplorasi DNA Founder</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-extrabold mb-6 md:mb-10 leading-[1.0] tracking-tight text-oem-dark uppercase">
              PRODUK<br />
              DNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 animate-gradient-x">FOUNDER.</span>
            </h1>
            <p className="text-sm md:text-lg text-oem-dark/40 mb-8 md:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Kitorang kaji personaliti korang sampai ke akar umbi untuk bina jenama yang bukan saja catchy, tapi betul-betul ada <span className="text-oem-dark font-bold underline decoration-emerald-200">soul</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 md:gap-8">
              <button onClick={onStartDiagnosis} className="btn-organic group w-full sm:w-auto">
                SCAN DNA <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=ensu${i}`} alt="" className="w-full h-full object-cover" />
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

          {/* Right: Saintis Ensu Character — large screens only */}
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
              className="absolute -top-6 left-0 z-10 bg-white border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg max-w-[200px]"
            >
              <p className="text-[11px] font-bold text-oem-dark leading-snug">Eh, jom scan DNA bisnes kau!</p>
              <p className="text-[9px] text-oem-dark/40 mt-0.5 font-medium">— Saintis Ensu</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-64 h-[380px] xl:w-72 xl:h-[420px] relative">
                <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-3xl scale-75 translate-y-8 pointer-events-none" />
                <img
                  src="https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Saintis Ensu"
                  className="w-full h-full object-cover object-top rounded-3xl shadow-2xl shadow-emerald-200/40 border border-white/60"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-oem-dark/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                  Saintis Ensu
                </div>
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

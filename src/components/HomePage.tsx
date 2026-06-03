import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Dna, Star, Scan, Zap, Shield, Activity } from 'lucide-react';

interface HomePageProps {
  onStartDiagnosis: () => void;
}

function useParallax(multiplier = 0.03) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const x = useTransform(springX, v => v * multiplier);
  const y = useTransform(springY, v => v * multiplier);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return { x, y };
}

const HexGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 56,16 56,36 30,50 4,36 4,16" fill="none" stroke="#10b981" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-10"
    animate={{ top: ['0%', '100%'] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
  />
);

const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={className}
    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export const HomePage = ({ onStartDiagnosis }: HomePageProps) => {
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const parallax = useParallax(25);

  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyBtn(heroBottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setScanActive(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: '1,200+', label: 'Founder Aktif', icon: Activity },
    { value: '98%', label: 'Aura Match Rate', icon: Zap },
    { value: 'RM 2.4B', label: 'Pasaran Dijana', icon: Shield },
  ];

  return (
    <div className="bg-[#030d0a] min-h-screen overflow-hidden">
      {/* Sticky CTA */}
      <motion.div
        initial={false}
        animate={{ opacity: showStickyBtn ? 1 : 0, y: showStickyBtn ? 0 : 20, pointerEvents: showStickyBtn ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={onStartDiagnosis}
          className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-300 group"
        >
          <Scan className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[11px] font-black uppercase tracking-widest">Scan DNA</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
        {/* Hex grid */}
        <HexGrid />

        {/* Scan line */}
        <ScanLine />

        {/* Ambient orbs */}
        <FloatingOrb
          delay={0}
          className="absolute top-[8%] right-[10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"
        />
        <FloatingOrb
          delay={2}
          className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-emerald-400/8 rounded-full blur-[100px] pointer-events-none"
        />
        <FloatingOrb
          delay={4}
          className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-teal-500/6 rounded-full blur-[80px] pointer-events-none"
        />

        {/* Corner decorations */}
        <div className="absolute top-24 left-6 md:left-10 border-l-2 border-t-2 border-emerald-500/20 w-10 h-10 pointer-events-none" />
        <div className="absolute top-24 right-6 md:right-10 border-r-2 border-t-2 border-emerald-500/20 w-10 h-10 pointer-events-none" />
        <div className="absolute bottom-10 left-6 md:left-10 border-l-2 border-b-2 border-emerald-500/20 w-10 h-10 pointer-events-none" />
        <div className="absolute bottom-10 right-6 md:right-10 border-r-2 border-b-2 border-emerald-500/20 w-10 h-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Status pill */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">Platform AI Jenama Malaysia #1</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.9] tracking-tight mb-5">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block text-white"
                >
                  Kilang OEM
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block text-white"
                >
                  Dengan{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 animate-gradient-x">
                      Formula
                    </span>
                    <motion.span
                      className="absolute -inset-1 bg-emerald-500/15 rounded-lg blur-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </span>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="block text-white"
                >
                  Saintis.
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm md:text-base text-white/30 leading-relaxed font-medium mb-8 max-w-md"
              >
                20+ Tahun Kepakaran OEM — AI-Powered. Science-Backed.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <button
                  onClick={onStartDiagnosis}
                  className="relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 group-hover:from-emerald-400 group-hover:to-teal-300" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
                  <Scan className="relative z-10 w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative z-10 text-white">Scan DNA Produk</span>
                  <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-default"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <stat.icon className="w-3 h-3 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                    <div className="text-[8px] font-bold text-white/25 uppercase tracking-[0.2em] mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Character card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center lg:justify-end"
              style={{ x: parallax.x, y: parallax.y }}
            >
              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-6 left-4 lg:left-0 z-20 bg-[#0a1f18] border border-emerald-500/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-2xl shadow-emerald-500/10 max-w-[220px] backdrop-blur-xl"
              >
                <p className="text-[11px] font-bold text-white/80 leading-snug">
                  "Saya Saintis Ensu — pakar DNA jenama anda!"
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Online</span>
                </div>
              </motion.div>

              {/* Character */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-[3rem] pointer-events-none overflow-hidden">
                  <motion.div
                    className="absolute inset-0 rounded-[3rem] border-2 border-emerald-500/20"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                {/* Outer glow */}
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3.5rem] blur-2xl pointer-events-none" />

                {/* Scan overlay */}
                <div className="relative w-72 h-[420px] lg:w-80 lg:h-[460px] rounded-[3rem] overflow-hidden">
                  <img
                    src="/ChatGPT_Image_May_23,_2026,_10_48_53_AM.png"
                    alt="Saintis Formula OEM"
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Scan animation */}
                  {scanActive && (
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Corner scan brackets */}
                  {[
                    'top-4 left-4 border-l-2 border-t-2',
                    'top-4 right-4 border-r-2 border-t-2',
                    'bottom-20 left-4 border-l-2 border-b-2',
                    'bottom-20 right-4 border-r-2 border-b-2',
                  ].map((cls, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-5 h-5 border-emerald-400/60 ${cls}`}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}

                  {/* Name badge */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border border-emerald-500/20 flex items-center gap-2">
                    <Dna className="w-3.5 h-3.5 text-emerald-400" />
                    Saintis Ensu
                    <span className="bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-md ml-1">AI</span>
                  </div>
                </div>

                {/* Certified badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ scale: 1.08 }}
                  className="absolute top-8 -right-4 bg-[#0a1f18] border border-emerald-500/20 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-tight">Certified</div>
                      <div className="text-[8px] text-white/30 font-bold tracking-widest">DNA Expert</div>
                    </div>
                  </div>
                </motion.div>

                {/* Scan count badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                  whileHover={{ scale: 1.08 }}
                  className="absolute bottom-24 -left-6 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">1,200+ Scan</div>
                  <div className="text-[8px] text-white/30 font-bold mt-0.5">Berjaya dilakukan</div>
                  <div className="mt-2 flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        className="w-1 h-3 rounded-full bg-emerald-500/40"
                        animate={{ scaleY: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

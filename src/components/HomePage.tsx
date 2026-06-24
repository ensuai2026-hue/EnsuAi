import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Dna, Star, CircleCheck as CheckCircle, Scan } from 'lucide-react';
import { TabsSection } from './TabsSection';

interface HomePageProps {
  onStartDiagnosis: () => void;
}

export const HomePage = ({ onStartDiagnosis }: HomePageProps) => {
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyBtn(heroBottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-oem-light min-h-screen">
      {/* Sticky Scan DNA Button */}
      <motion.div
        initial={false}
        animate={{ opacity: showStickyBtn ? 1 : 0, y: showStickyBtn ? 0 : 20, pointerEvents: showStickyBtn ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={onStartDiagnosis}
          className="flex items-center gap-3 bg-oem-dark text-white px-6 py-4 rounded-2xl shadow-2xl shadow-oem-dark/30 hover:bg-oem-primary transition-all duration-300 group"
        >
          <Scan className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
          <span className="text-[11px] font-black uppercase tracking-widest">Scan DNA</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Lab background"
            className="w-full h-full object-cover opacity-[0.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-oem-light via-oem-light/98 to-emerald-50/60" />
        </div>

        {/* Blobs */}
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[0%] w-[350px] h-[350px] bg-emerald-50/60 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4">
                <span className="pill-container text-[9px]">Platform AI Jenama Malaysia #1</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-oem-dark uppercase leading-[0.93] tracking-tight mb-5">
                Kilang OEM<br />
                Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Formula</span><br />
                Eksklusif.
              </h1>

              <p className="text-sm md:text-base text-oem-dark/40 leading-relaxed font-medium mb-7 max-w-xl">
                20+ Tahun Kepakaran OEM
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={onStartDiagnosis} className="btn-organic group">
                  Scan DNA Produk <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

              {/* Stats inline */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-emerald-100">
                {[
                  { value: '1,200+', label: 'Founder Aktif' },
                  { value: '98%', label: 'Aura Match Rate' },
                  { value: 'RM 2.4B', label: 'Pasaran Dijana' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-xl md:text-2xl lg:text-3xl font-extrabold text-oem-dark tracking-tight">{stat.value}</div>
                    <div className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Saintis Ensu */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-6 left-4 lg:left-0 z-20 bg-white border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xl max-w-[220px]"
              >
                <p className="text-[11px] font-bold text-oem-dark leading-snug">
                  "Saya bantu inject DNA dalam produk anda!"
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                </div>
              </motion.div>

              {/* Character */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-emerald-300/25 rounded-[3rem] blur-3xl scale-90 translate-y-8 pointer-events-none" />

                <div className="relative w-72 h-[420px] lg:w-80 lg:h-[460px]">
                  <img
                    src="/ChatGPT_Image_May_23,_2026,_10_48_53_AM.png"
                    alt="Saintis Formula OEM"
                    className="w-full h-full object-cover object-top rounded-[3rem] shadow-2xl shadow-emerald-200/50 border border-white/80"
                  />
                  {/* Name badge */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-oem-dark/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl flex items-center gap-2">
                    <Dna className="w-3.5 h-3.5 text-emerald-400" />
                    Saintis Ensu
                    <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full ml-1">AI</span>
                  </div>

                  {/* Floating badge: certified */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="absolute top-8 -right-4 bg-white border border-emerald-100 rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      <div>
                        <div className="text-[10px] font-black text-oem-dark uppercase tracking-tight">Certified</div>
                        <div className="text-[8px] text-oem-dark/30 font-bold tracking-widest">DNA Expert</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating badge: scan count */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="absolute bottom-24 -left-6 bg-oem-dark text-white rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">1,200+ Scan</div>
                    <div className="text-[8px] text-white/40 font-bold mt-0.5">Berjaya dilakukan</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <TabsSection />
    </div>
  );
};

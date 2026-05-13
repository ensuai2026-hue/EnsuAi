import { useState, useRef } from 'react';
import { Header, Hero } from './components/Landing';
import { HomePage } from './components/HomePage';
import { FounderDiagnosis } from './components/FounderDiagnosis';
import { ProductRecommendation } from './components/ProductRecommendation';
import { Footer } from './components/Footer';
import { PersonalityProfile } from './services/geminiService';
import { AnimatePresence, motion } from 'motion/react';
import { Brain, Bot, Factory, Fingerprint, FlaskConical, Cpu, ArrowRight, Dna, Target, Rocket } from 'lucide-react';

type View = 'home' | 'scan' | 'results';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const diagnosisRef = useRef<HTMLDivElement>(null);

  const handleStartDiagnosis = () => {
    setView('scan');
    setProfile(null);
    setTimeout(() => {
      diagnosisRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReportComplete = (data: PersonalityProfile) => {
    setProfile(data);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setProfile(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setView('home');
    setProfile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-oem-primary selection:text-white bg-oem-light">
      <Header onStartDiagnosis={handleStartDiagnosis} onGoHome={handleGoHome} />

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HomePage onStartDiagnosis={handleStartDiagnosis} />
            </motion.div>
          )}

          {view === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onStartDiagnosis={handleStartDiagnosis} />

              <div ref={diagnosisRef}>
                <section className="py-10 md:py-16 bg-oem-light border-t border-oem-primary/10">
                  <FounderDiagnosis onReportComplete={handleReportComplete} />
                </section>
              </div>

              {/* How It Works */}
              <section className="py-24 md:py-40 oem-grid relative">
                <div className="absolute top-0 left-0 w-full h-full bg-emerald-50/20 backdrop-blur-3xl -z-10" />
                <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                  <div className="mb-20 md:mb-32 text-center md:text-left">
                    <div className="mb-6">
                      <span className="pill-container text-[9px]">Infrastruktur Ensu</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1] mb-8">Inject DNA <br/> dalam product.</h2>
                    <p className="text-lg md:text-xl text-oem-dark/30 max-w-3xl font-medium tracking-tight">Kitorang mengadun DNA dan personaliti unik founder untuk menghasilkan produk yang bukan sekadar laku, tapi ikonik dan memorable sepanjang zaman.</p>
                  </div>
                  <div className="relative pt-12">
                    <div className="hidden lg:block absolute top-[76px] left-[12%] right-[12%] h-[2px] bg-emerald-100" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
                      {[
                        { id: "01", title: "Analisis Personaliti", desc: "Mengkaji DNA dan karakter unik anda melalui diagnosis AI yang mendalam.", icon: Fingerprint, label: "Intelligence" },
                        { id: "02", title: "Inject DNA Produk", desc: "Memindahkan intipati karakter anda ke dalam formulasi dan visi produk.", icon: Dna, label: "Alchemy" },
                        { id: "03", title: "Pemilihan Produk", desc: "Mencari 'perfect match' kategori produk yang sejajar dengan aura anda.", icon: Target, label: "Selection" },
                        { id: "04", title: "Become a Founder", desc: "Melancarkan jenama ikonik anda ke pasaran dengan strategi alpha.", icon: Rocket, label: "Execution" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                          className="relative group pt-16"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                              className="w-14 h-14 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center shadow-sm relative z-20 group-hover:border-emerald-500 transition-colors duration-500"
                            >
                              <div className="w-3 h-3 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100" />
                            </motion.div>
                            <span className="mt-3 text-[10px] font-black text-oem-primary/40 tracking-widest uppercase">Fasa {item.id}</span>
                          </div>
                          <div className="organic-card p-8 md:p-10 flex flex-col items-start text-left bg-white/60 backdrop-blur-md border border-emerald-50 hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.12)] transition-all duration-700 h-full">
                            <div className="w-full flex justify-between items-start mb-8">
                              <div className="p-4 rounded-2xl bg-emerald-50 text-oem-primary group-hover:bg-oem-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                <item.icon size={24} strokeWidth={2} />
                              </div>
                              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600/40">{item.label}</div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-oem-dark uppercase tracking-tight leading-tight group-hover:text-oem-primary transition-colors">{item.title}</h3>
                            <p className="text-xs md:text-sm text-oem-dark/50 font-medium leading-relaxed italic pr-2">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'results' && profile && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductRecommendation profile={profile} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

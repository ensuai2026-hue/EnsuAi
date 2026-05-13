import { useState, useRef } from 'react';
import { Header } from './components/Landing';
import { HomePage } from './components/HomePage';
import { FounderDiagnosis } from './components/FounderDiagnosis';
import { ProductRecommendation } from './components/ProductRecommendation';
import { Footer } from './components/Footer';
import { PersonalityProfile } from './services/geminiService';
import { AnimatePresence, motion } from 'motion/react';

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
              <div className="pt-24" ref={diagnosisRef}>
                <section className="py-10 md:py-16 bg-oem-light border-t border-oem-primary/10">
                  <FounderDiagnosis onReportComplete={handleReportComplete} />
                </section>
              </div>
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalityProfile } from '../services/geminiService';
import { Sparkles, Target, Shield, User, ChevronRight, Heart, CircleCheck as CheckCircle2, Leaf, ShoppingBag, Zap, ChartBar as BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Props {
  profile: PersonalityProfile;
  leadId: string | null;
  onReset: () => void;
  adminMode?: boolean;
}

export const ProductRecommendation = ({ profile, onReset, adminMode }: Props) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const selectedProduct = profile.recommendations[selectedProductIndex];

  return (
    <div className={cn('min-h-screen bg-oem-cream pb-12 md:pb-24 px-4 md:px-10 overflow-x-hidden', adminMode ? 'pt-6 md:pt-10' : 'pt-24 md:pt-32')}>
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start"
        >
          {/* Left Side: Persona Profile Card (Futuristic Data Hub) */}
          <div className="lg:col-span-12 xl:col-span-4 xl:sticky xl:top-32 order-2 xl:order-1">
            <div className="bg-white/80 backdrop-blur-xl border border-emerald-50 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_50px_100px_-30px_rgba(16,185,129,0.08)] relative overflow-hidden group">
              {/* Futuristic Scanning Line Effect */}
              <motion.div 
                animate={{ y: [0, 500, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none z-0"
              />
              
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                <Leaf className="w-56 h-56 text-emerald-950" />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 bg-oem-dark rounded-2xl flex items-center justify-center text-emerald-400 shadow-2xl relative z-10">
                           <Shield className="w-8 h-8" />
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute -inset-2 bg-emerald-500/20 rounded-2xl blur-xl" 
                        />
                      </div>
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-[0.5em] text-oem-dark/20 mb-1">DNA Foundership Established</div>
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                           <div className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">DNA Founder v2.41</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Futuristic DNA Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.4em] text-oem-dark/40">
                    <span>Data Integrity</span>
                    <span>99.9% Secure</span>
                  </div>
                  <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "99.9%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] rounded-lg border border-emerald-100/50">
                      Signature Profile Extraction
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.15] break-words relative">
                    <span className="relative z-10">{profile.personalityType}</span>
                    <div className="absolute -left-4 top-0 w-1.5 h-full bg-oem-primary/30" />
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.characterTraits.map((trait, i) => (
                    <motion.span 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-5 py-2.5 bg-white text-oem-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-emerald-50 shadow-sm transition-all hover:bg-emerald-500 hover:text-white"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>

                <div className="pt-10 border-t border-emerald-50/50">
                  <div className="prose prose-slate max-w-none prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-p:text-oem-dark/60 prose-strong:text-emerald-600 prose-strong:font-black prose-headings:text-oem-dark prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                    <ReactMarkdown>{profile.fullDiagnosis}</ReactMarkdown>
                  </div>
                </div>

                <div className="pt-8 flex items-end justify-between">
                   <div className="space-y-1">
                      <div className="text-[9px] font-black text-oem-dark/20 uppercase tracking-[0.4em]">Decrypted By</div>
                      <div className="text-xs font-black text-oem-dark uppercase tracking-widest leading-none">ENS-AI CORTEX</div>
                   </div>
                   <div className="flex gap-1.5">
                      {[1,2,3,4].map(i => <div key={i} className="w-1 h-6 bg-emerald-100 rounded-full" />)}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: 3 Product Recommendations (Actionable Insights) */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8 md:space-y-10 order-1 xl:order-2">
            {/* Product Selector Tabs */}
            <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2rem] md:rounded-[3rem] shadow-2xl p-2 md:p-4">
              <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 snap-x snap-mandatory">
                {profile.recommendations.map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedProductIndex(i)}
                    className={cn(
                      "snap-start flex-shrink-0 w-[calc(50%-4px)] sm:w-auto sm:flex-1 py-4 md:py-6 px-3 md:px-6 rounded-[1.5rem] md:rounded-[2.5rem] transition-all flex flex-col items-center gap-1.5 md:gap-2 border-2 relative overflow-hidden",
                      selectedProductIndex === i
                        ? "bg-oem-dark border-oem-dark text-white shadow-2xl scale-[1.02]"
                        : "text-oem-dark/30 border-transparent hover:bg-emerald-50 hover:text-oem-primary"
                    )}
                  >
                    {selectedProductIndex === i && (
                      <motion.div
                        layoutId="tab-glow"
                        className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none"
                      />
                    )}
                    <span className={cn("text-[9px] font-black uppercase tracking-[0.35em] relative z-10 whitespace-nowrap", selectedProductIndex === i ? "text-emerald-400" : "text-oem-dark/10")}>
                      Product Match 0{i+1}
                    </span>
                    <span className="text-[11px] md:text-sm font-black w-full text-center tracking-tight uppercase leading-tight relative z-10 line-clamp-2">{rec.name}</span>
                    {selectedProductIndex === i && (
                      <div className="absolute bottom-2 w-8 h-1 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProductIndex}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white border border-emerald-50/50 p-6 sm:p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden group"
              >
                {/* Tech Grid Background Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10 space-y-10 md:space-y-16">
                  {/* Top Header: Name & ID */}
                  <div className="flex flex-row justify-between items-start gap-4 md:gap-8">
                    <div className="min-w-0 flex-1 space-y-4 md:space-y-6">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative">
                          <div className="text-oem-primary font-mono text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tighter">
                            {selectedProduct.matchPercentage}%
                          </div>
                          <motion.div 
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full"
                          />
                        </div>
                        <div className="h-12 w-px bg-emerald-100" />
                        <div className="space-y-1">
                          <div className="text-emerald-500 font-black text-[12px] uppercase tracking-[0.5em]">Kesesuaian DNA</div>
                          <div className="text-oem-dark/20 text-[10px] font-bold uppercase tracking-widest italic">Aura Sync Perfected</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 md:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.15] break-words">
                          {selectedProduct.name}
                        </h2>
                        <div className="p-5 md:p-8 bg-slate-50/80 backdrop-blur-md rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 relative group/desc">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 md:w-1.5 md:h-12 bg-oem-primary rounded-r-full" />
                          <p className="text-oem-dark/60 text-sm md:text-base leading-relaxed font-medium italic pl-3 md:pl-4">"{selectedProduct.description}"</p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 md:w-20 md:h-20 bg-oem-dark text-white rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-emerald-900/20 relative overflow-hidden flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-transparent group-hover:scale-150 transition-transform duration-1000" />
                      <ShoppingBag className="w-6 h-6 md:w-9 md:h-9 relative z-10" />
                    </motion.div>
                  </div>

                  {/* Scientific Data Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
                    {/* Market Value Visualizer */}
                    <div className="lg:col-span-12 p-8 md:p-16 bg-oem-dark rounded-[2.5rem] md:rounded-[4rem] text-white relative shadow-2xl overflow-hidden group/stats">
                      <div className="absolute top-0 right-0 p-16 opacity-5 md:opacity-10 blur-sm group-hover/stats:scale-125 transition-transform duration-[4s] select-none pointer-events-none">
                        <BarChart3 className="w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem]" />
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center relative z-10">
                        <div className="space-y-6 md:space-y-10">
                          <div>
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-emerald-500 font-black text-[9px] md:text-[11px] uppercase tracking-[0.6em]">Market Potential Report</span>
                            </div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase break-words">
                              {selectedProduct.estimatedMarketValue}
                            </p>
                          </div>
                          
                          <div className="inline-flex items-center gap-4 md:gap-6 py-4 px-6 md:py-5 md:px-8 bg-white/5 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl">
                             <div className="flex -space-x-3 md:-space-x-4">
                               {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-oem-dark bg-emerald-200 shadow-xl" />)}
                             </div>
                             <div className="space-y-1">
                               <span className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-widest block">Exponential Demand</span>
                               <span className="text-[8px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]">Sentiment Analysis: 98.4%</span>
                             </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6 md:space-y-8 bg-black/20 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 backdrop-blur-2xl">
                           {[
                             { label: 'Market Resilience', val: '92%', color: 'bg-emerald-500', icon: Shield },
                             { label: 'Audience Synergy', val: '88%', color: 'bg-emerald-400', icon: Heart },
                             { label: 'Scaling Precision', val: '95%', color: 'bg-emerald-600', icon: Target }
                           ].map((stat, i) => (
                             <div key={i} className="space-y-3 md:space-y-4">
                                <div className="flex justify-between items-end">
                                   <div className="flex items-center gap-3">
                                      <stat.icon className="w-3 md:w-4 h-3 md:h-4 text-emerald-500/40" />
                                      <span className="text-[9px] md:text-[11px] font-black uppercase text-white/40 tracking-[0.3em]">{stat.label}</span>
                                   </div>
                                   <span className="text-xl md:text-2xl font-black font-mono text-emerald-500 tracking-tighter">{stat.val}</span>
                                </div>
                                <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                                   <motion.div 
                                     initial={{ width: 0 }} 
                                     whileInView={{ width: stat.val }} 
                                     transition={{ duration: 2, delay: i * 0.2, ease: [0.34, 1.56, 0.64, 1] }} 
                                     className={cn("h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]", stat.color)} 
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    {/* Launch Highlights */}
                    <div className="md:col-span-1 lg:col-span-6 p-8 md:p-12 bg-white border border-emerald-50 rounded-[2.5rem] md:rounded-[4rem] shadow-sm flex flex-col relative overflow-hidden group/launch">
                      <div className="flex items-center gap-5 mb-8 md:mb-12">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[2rem] bg-emerald-50 flex items-center justify-center text-oem-primary shadow-inner">
                          <Zap className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-950/20">Launch DNA</span>
                          <div className="text-sm md:text-base font-black text-oem-dark uppercase tracking-tight">Kekuatan Strategi</div>
                        </div>
                      </div>
                      <div className="space-y-6 md:space-y-8 flex-1">
                        {selectedProduct.sellingPoints.map((point, i) => (
                          <div key={i} className="flex gap-4 md:gap-8 items-start group/point">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-[1rem] md:rounded-[1.25rem] bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-1 transition-all group-hover/point:bg-oem-dark group-hover/point:text-emerald-400 group-hover/point:rotate-[15deg]">
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <p className="text-base md:text-lg font-black text-oem-dark uppercase tracking-tighter leading-tight pt-1 transition-transform group-hover/point:translate-x-2">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Ecosystem Niche */}
                    <div className="md:col-span-1 lg:col-span-6 p-8 md:p-12 bg-white border border-emerald-50 rounded-[2.5rem] md:rounded-[4rem] flex flex-col relative overflow-hidden group/niche shadow-sm">
                      <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover/niche:scale-150 group-hover/niche:rotate-[30deg] transition-all duration-[3s]">
                        <Target className="w-96 h-96" />
                      </div>
                      <div className="flex items-center gap-5 mb-8 md:mb-12 relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[2rem] bg-oem-dark flex items-center justify-center text-emerald-500 shadow-xl">
                          <Target className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-oem-dark/20">Market Segment</span>
                           <div className="text-sm md:text-base font-black text-oem-dark uppercase tracking-tight">Niche Ekosistem</div>
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-oem-dark tracking-tight leading-[1.2] uppercase relative z-10 break-words mb-8 md:mb-10">{selectedProduct.targetAudience}</p>
                      
                      <div className="mt-auto pt-8 md:pt-10 border-t border-emerald-50 relative z-10 flex justify-between items-end">
                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                             <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-500 animate-pulse border-2 md:border-4 border-emerald-100" />
                             <p className="text-[10px] md:text-[12px] text-emerald-600 font-black uppercase tracking-widest">Global Ready Status</p>
                           </div>
                           <p className="text-[9px] md:text-[10px] text-oem-dark/20 italic font-black uppercase tracking-[0.5em]">DNA-BLUEPRINT AUTH v2.41</p>
                        </div>
                        <div className="w-10 md:w-12 h-1 bg-emerald-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>


        {/* Global CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center pt-4 md:pt-8 pb-8">
          <button
            onClick={onReset}
            className="px-8 py-4 md:px-10 md:py-6 text-xs md:text-sm font-black uppercase tracking-[0.4em] text-oem-dark/30 hover:text-oem-primary transition-all flex items-center gap-3 md:gap-4 group order-2 sm:order-1"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-50">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
            </div>
            Ulang Diagnosis
          </button>

          <a
            href="https://wa.me/60123456789?text=Saya%20baru%20selesai%20Scan%20DNA%20dengan%20Ensu%20Saintis%20dan%20ingin%20tahu%20lebih%20lanjut."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-6 md:px-16 md:py-8 bg-oem-primary text-white rounded-full text-base md:text-xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:scale-[1.03] transition-all relative overflow-hidden group order-1 sm:order-2 flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
              BUAT SEKARANG <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </div>
  );
};

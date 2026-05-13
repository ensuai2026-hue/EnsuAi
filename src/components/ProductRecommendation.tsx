import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalityProfile } from '../services/geminiService';
import { Sparkles, Target, Shield, User, ChevronRight, Heart, Award, CheckCircle2, Leaf, ShoppingBag, Zap, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Props {
  profile: PersonalityProfile;
  onReset: () => void;
}

export const ProductRecommendation = ({ profile, onReset }: Props) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const selectedProduct = profile.recommendations[selectedProductIndex];

  return (
    <div className="min-h-screen bg-oem-cream pt-20 md:pt-32 pb-12 md:pb-24 px-4 md:px-10 overflow-x-hidden">
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
                  <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1] break-words relative">
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
            {/* Product Selector Tabs (High-Tech Selector) */}
            <div className="flex overflow-x-auto no-scrollbar sm:flex-nowrap gap-3 md:gap-4 p-2 md:p-4 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {profile.recommendations.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedProductIndex(i)}
                  className={cn(
                    "flex-1 min-w-[140px] py-4 md:py-6 px-4 md:px-6 rounded-[1.5rem] md:rounded-[2.5rem] transition-all flex flex-col items-center gap-1.5 md:gap-2 border-2 relative overflow-hidden group/btn",
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
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.4em] relative z-10", selectedProductIndex === i ? "text-emerald-400" : "text-oem-dark/10")}>
                    Product Match 0{i+1}
                  </span>
                  <span className="text-xs md:text-sm font-black truncate w-full text-center tracking-tight uppercase leading-none relative z-10">{rec.name}</span>
                  {selectedProductIndex === i && (
                    <div className="absolute bottom-2 w-8 h-1 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
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
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
                    <div className="max-w-2xl space-y-6 md:space-y-8">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative">
                          <div className="text-oem-primary font-mono text-5xl sm:text-6xl md:text-8xl font-black leading-none tracking-tighter">
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
                        <h2 className="text-3xl sm:text-5xl md:text-8xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1]">
                          {selectedProduct.name}
                        </h2>
                        <div className="p-5 md:p-8 bg-slate-50/80 backdrop-blur-md rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 relative group/desc">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 md:w-1.5 md:h-12 bg-oem-primary rounded-r-full" />
                          <p className="text-oem-dark/60 text-base md:text-2xl leading-relaxed font-medium italic pl-3 md:pl-4">"{selectedProduct.description}"</p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-20 h-20 md:w-32 md:h-32 bg-oem-dark text-white rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center shadow-3xl shadow-emerald-900/20 relative overflow-hidden flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-transparent group-hover:scale-150 transition-transform duration-1000" />
                      <ShoppingBag className="w-10 h-10 md:w-16 md:h-16 relative z-10" />
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
                            <p className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white tracking-tight leading-tight md:leading-[0.9] uppercase">
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
                            <p className="text-lg md:text-2xl font-black text-oem-dark uppercase tracking-tighter leading-[0.9] pt-1 transition-transform group-hover/point:translate-x-2">{point}</p>
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
                      <p className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-oem-dark tracking-tight leading-[1.1] md:leading-[1] uppercase relative z-10 break-words mb-10 md:mb-14">{selectedProduct.targetAudience}</p>
                      
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

        {/* 3 Most Effective Strategies */}
        <section className="space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 md:gap-4 text-emerald-600">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Market Expansion</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1]">3 Strategi Alpha</h2>
              <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-6 md:w-8 h-1 bg-emerald-500 rounded-full" />
                 <p className="text-oem-dark/30 font-black text-[9px] tracking-[0.4em] uppercase">Tactical Execution Plan</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6">
            {profile.strategies.map((strategy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-emerald-50 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 text-[6rem] md:text-[10rem] font-black text-emerald-500/5 group-hover:scale-110 transition-transform duration-1000 select-none">
                  {i+1}
                </div>
                <div className="relative z-10">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 rounded-[1.25rem] md:rounded-2xl flex items-center justify-center text-oem-primary mb-6 md:mb-8 group-hover:bg-oem-primary group-hover:text-white transition-colors duration-500 overflow-hidden shadow-inner">
                      <Zap className="w-5 h-5 md:w-7 md:h-7" />
                   </div>
                   <h3 className="text-xl md:text-3xl font-extrabold text-oem-dark leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{strategy}</h3>
                   <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-emerald-50/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Execute Now</span>
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sales Advisor Report (Intelligence Hub) */}
        <section className="bg-oem-dark rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 relative overflow-hidden text-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] border border-white/5 mx-4 md:mx-0">
          {/* Background Tech Elements */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="absolute top-0 right-0 p-16 md:p-24 opacity-5 pointer-events-none">
            <BarChart3 className="w-64 md:w-96 h-64 md:h-96 text-emerald-400" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-start">
            <div className="lg:col-span-5 space-y-10 md:space-y-12">
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-3 md:gap-4 px-4 py-2 md:px-6 md:py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl md:rounded-2xl border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Internal Intelligence Report</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold uppercase tracking-tight leading-tight md:leading-[0.9]">Blueprint<br/><span className="text-emerald-500">Sales Alpha</span></h2>
                <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed max-w-sm">Menganalisa "pahit" pelanggan secara sub-atomik & taktik closing paling tajam.</p>
              </div>
              
              <div className="space-y-8 pt-8 md:pt-12 border-t border-white/10">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md">
                      <Shield className="w-5 h-5 md:w-7 md:h-7 text-emerald-500" />
                   </div>
                   <div>
                      <div className="text-[9px] font-black uppercase text-slate-500 tracking-[0.4em] mb-1">Clearance Protocol</div>
                      <div className="text-lg md:text-xl font-black text-white tracking-widest">SAINTIS-L-01</div>
                   </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                   {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-1.5 md:h-2 bg-emerald-500/20 rounded-full relative overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute inset-0 bg-emerald-500"
                      />
                   </div>)}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 relative shadow-2xl">
               <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12">
                    <User className="text-white w-6 h-6 md:w-8 md:h-8" />
                  </div>
               </div>
               
               <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-strong:text-emerald-400 prose-strong:font-black prose-p:text-lg md:prose-p:text-2xl prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter pl-6 md:pl-8 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-full" />
                  <ReactMarkdown>{profile.salesAdvisorReport}</ReactMarkdown>
               </div>
               
               <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 italic">EndOfTransmission_</span>
                  <div className="flex gap-1.5 md:gap-2">
                     <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                     <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500/30" />
                     <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500/10" />
                  </div>
               </div>
            </div>
          </div>
        </section>

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
          
          <button className="w-full sm:w-auto px-10 py-6 md:px-16 md:py-8 bg-oem-primary text-white rounded-full text-base md:text-xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:scale-[1.03] transition-all relative overflow-hidden group order-1 sm:order-2">
            <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
              MANIFESTASIKAN PRODUK <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

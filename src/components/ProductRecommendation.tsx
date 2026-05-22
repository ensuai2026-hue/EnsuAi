import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalityProfile } from '../services/geminiService';
import { Sparkles, Target, Shield, User, ChevronRight, Heart, CircleCheck as CheckCircle2, Leaf, ShoppingBag, Zap, ChartBar as BarChart3, TrendingUp, X, Phone, Mail, Wallet, Package, Hash, CircleCheck as CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

interface Props {
  profile: PersonalityProfile;
  leadId: string | null;
  onReset: () => void;
}

interface LeadForm {
  name: string;
  phone: string;
  email: string;
  budget: string;
  product_type: string;
  quantity: string;
}

const LeadCaptureModal = ({ leadId, onClose }: { leadId: string | null; onClose: () => void }) => {
  const [form, setForm] = useState<LeadForm>({ name: '', phone: '', email: '', budget: '', product_type: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (leadId) {
      await supabase.from('leads').update({
        name: form.name || undefined,
        phone: form.phone,
        email: form.email,
        budget: form.budget,
        product_type: form.product_type,
        quantity: form.quantity,
      }).eq('id', leadId);
    }
    setLoading(false);
    setSubmitted(true);
  };

  const fields: { key: keyof LeadForm; label: string; placeholder: string; icon: React.ElementType; type?: string; required?: boolean }[] = [
    { key: 'name', label: 'Nama Penuh', placeholder: 'Nama anda', icon: User, required: true },
    { key: 'phone', label: 'No. WhatsApp', placeholder: '012-3456789', icon: Phone, required: true },
    { key: 'email', label: 'E-mel', placeholder: 'email@anda.com', icon: Mail, type: 'email', required: true },
    { key: 'budget', label: 'Bajet Anggaran', placeholder: 'Contoh: RM5,000 - RM10,000', icon: Wallet, required: true },
    { key: 'product_type', label: 'Jenis Produk', placeholder: 'Contoh: Supplement, Skincare, F&B', icon: Package, required: true },
    { key: 'quantity', label: 'Kuantiti / Bil. SKU', placeholder: 'Contoh: 500 unit, 2 SKU', icon: Hash, required: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight mb-2">Terima Kasih!</h3>
              <p className="text-slate-500 font-medium text-sm">Maklumat anda telah dihantar. Team Ensu akan menghubungi anda tidak lama lagi.</p>
            </div>
            <button onClick={onClose} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors">
              Tutup
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-slate-900 px-6 py-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Manifestasikan Produk Anda</h3>
              </div>
              <p className="text-slate-400 text-xs font-medium pl-11">Isi maklumat di bawah, team Ensu akan hubungi anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
              {fields.map(({ key, label, placeholder, icon: Icon, type, required }) => (
                <div key={key}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type={type ?? 'text'}
                      required={required}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {loading ? 'Menghantar...' : 'Hantar Maklumat'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const ProductRecommendation = ({ profile, leadId, onReset }: Props) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const selectedProduct = profile.recommendations[selectedProductIndex];

  return (
    <div className="min-h-screen bg-oem-cream pt-20 md:pt-28 pb-12 md:pb-20 px-4 md:px-8 lg:px-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10 items-start"
        >
          {/* Left: DNA Profile Card */}
          <div className="xl:col-span-4 xl:sticky xl:top-28 order-2 xl:order-1">
            <div className="bg-white/80 backdrop-blur-xl border border-emerald-50 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-[0_40px_80px_-20px_rgba(16,185,129,0.08)] relative overflow-hidden group">
              {/* Scanning line */}
              <motion.div
                animate={{ y: [0, 400, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none z-0"
              />

              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
                <Leaf className="w-40 h-40 md:w-56 md:h-56 text-emerald-950" />
              </div>

              <div className="relative z-10 space-y-8 md:space-y-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-oem-dark rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl relative z-10">
                      <Shield className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -inset-2 bg-emerald-500/20 rounded-2xl blur-xl pointer-events-none"
                    />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-oem-dark/20 mb-1">DNA Foundership</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <div className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">DNA Founder v2.41</div>
                    </div>
                  </div>
                </div>

                {/* DNA Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em] text-oem-dark/30">
                    <span>Data Integrity</span>
                    <span>99.9% Secure</span>
                  </div>
                  <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '99.9%' }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-[0.3em] rounded-lg border border-emerald-100/50 inline-block">
                    Signature Profile
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1] break-words relative">
                    <span className="relative z-10">{profile.personalityType}</span>
                    <div className="absolute -left-4 top-0 w-1 md:w-1.5 h-full bg-oem-primary/30" />
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.characterTraits.map((trait, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 md:px-4 py-2 bg-white text-oem-dark text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border border-emerald-50 shadow-sm transition-all hover:bg-emerald-500 hover:text-white cursor-default"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>

                <div className="pt-6 md:pt-8 border-t border-emerald-50/50">
                  <div className="prose prose-sm prose-slate max-w-none prose-p:text-sm md:prose-p:text-base prose-p:leading-relaxed prose-p:font-medium prose-p:text-oem-dark/60 prose-strong:text-emerald-600 prose-strong:font-black prose-headings:text-oem-dark prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                    <ReactMarkdown>{profile.fullDiagnosis}</ReactMarkdown>
                  </div>
                </div>

                <div className="pt-6 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-oem-dark/20 uppercase tracking-[0.3em]">Decrypted By</div>
                    <div className="text-[11px] font-black text-oem-dark uppercase tracking-widest">ENS-AI CORTEX</div>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-5 bg-emerald-100 rounded-full" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Recommendations */}
          <div className="xl:col-span-8 space-y-7 md:space-y-9 order-1 xl:order-2">
            {/* Product Selector Tabs */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 p-2 md:p-3 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-2xl md:rounded-[2.5rem] shadow-xl">
              {profile.recommendations.map((rec, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedProductIndex(i)}
                  className={cn(
                    'flex-1 min-w-[130px] py-3 md:py-5 px-3 md:px-5 rounded-xl md:rounded-[2rem] transition-all flex flex-col items-center gap-1 md:gap-1.5 border-2 relative overflow-hidden',
                    selectedProductIndex === i
                      ? 'bg-oem-dark border-oem-dark text-white shadow-xl scale-[1.02]'
                      : 'text-oem-dark/30 border-transparent hover:bg-emerald-50 hover:text-oem-primary'
                  )}
                >
                  {selectedProductIndex === i && (
                    <motion.div
                      layoutId="tab-glow"
                      className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none"
                    />
                  )}
                  <span className={cn('text-[9px] font-black uppercase tracking-[0.3em] relative z-10', selectedProductIndex === i ? 'text-emerald-400' : 'text-oem-dark/20')}>
                    Match 0{i + 1}
                  </span>
                  <span className="text-[11px] md:text-xs font-black truncate w-full text-center tracking-tight uppercase relative z-10">{rec.name}</span>
                  {selectedProductIndex === i && (
                    <div className="absolute bottom-1.5 w-6 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProductIndex}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white border border-emerald-50/50 p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[3rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                     style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative z-10 space-y-8 md:space-y-12">
                  {/* Header: Match % & Name */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 md:gap-8">
                    <div className="max-w-2xl space-y-4 md:space-y-6 flex-1">
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="relative">
                          <div className="text-oem-primary font-mono text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tighter">
                            {selectedProduct.matchPercentage}%
                          </div>
                          <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-3 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"
                          />
                        </div>
                        <div className="h-10 w-px bg-emerald-100" />
                        <div className="space-y-0.5">
                          <div className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.4em]">Kesesuaian DNA</div>
                          <div className="text-oem-dark/20 text-[9px] font-bold uppercase tracking-widest italic">Aura Sync Perfected</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1] break-words">
                          {selectedProduct.name}
                        </h2>
                        <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-3xl border border-slate-100 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-oem-primary rounded-r-full" />
                          <p className="text-oem-dark/60 text-sm md:text-base leading-relaxed font-medium italic pl-3">"{selectedProduct.description}"</p>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-16 h-16 md:w-24 md:h-24 bg-oem-dark text-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 to-transparent" />
                      <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 relative z-10" />
                    </motion.div>
                  </div>

                  {/* Market Data Dashboard */}
                  <div className="grid grid-cols-1 gap-5 md:gap-6">
                    {/* Market Value */}
                    <div className="p-6 md:p-10 bg-oem-dark rounded-2xl md:rounded-[2.5rem] text-white relative shadow-xl overflow-hidden group/stats">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.06] pointer-events-none">
                        <BarChart3 className="w-48 h-48 md:w-72 md:h-72" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                        <div className="space-y-5 md:space-y-7">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">Market Potential</span>
                            </div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
                              {selectedProduct.estimatedMarketValue}
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-4 py-3 px-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex -space-x-2 md:-space-x-3">
                              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-oem-dark bg-emerald-200 shadow-sm" />)}
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest block">Exponential Demand</span>
                              <span className="text-[8px] text-white/30 font-bold uppercase tracking-[0.3em]">Sentiment: 98.4%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5 bg-black/20 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5">
                          {[
                            { label: 'Market Resilience', val: '92%', color: 'bg-emerald-500', icon: Shield },
                            { label: 'Audience Synergy', val: '88%', color: 'bg-emerald-400', icon: Heart },
                            { label: 'Scaling Precision', val: '95%', color: 'bg-emerald-600', icon: Target }
                          ].map((stat, i) => (
                            <div key={i} className="space-y-2.5">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <stat.icon className="w-3.5 h-3.5 text-emerald-500/40" />
                                  <span className="text-[9px] md:text-[10px] font-black uppercase text-white/40 tracking-[0.25em]">{stat.label}</span>
                                </div>
                                <span className="text-lg md:text-xl font-black font-mono text-emerald-500">{stat.val}</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: stat.val }}
                                  transition={{ duration: 2, delay: i * 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                                  className={cn('h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]', stat.color)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Launch Highlights + Niche */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      {/* Launch Highlights */}
                      <div className="p-6 md:p-8 bg-white border border-emerald-50 rounded-2xl md:rounded-3xl shadow-sm flex flex-col group/launch">
                        <div className="flex items-center gap-4 mb-7">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-oem-primary shadow-inner">
                            <Zap className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-950/20 block">Launch DNA</span>
                            <div className="text-sm font-black text-oem-dark uppercase tracking-tight">Kekuatan Strategi</div>
                          </div>
                        </div>
                        <div className="space-y-4 flex-1">
                          {selectedProduct.sellingPoints.map((point, i) => (
                            <div key={i} className="flex gap-3 items-start group/point">
                              <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover/point:bg-oem-dark group-hover/point:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <p className="text-sm md:text-base font-black text-oem-dark uppercase tracking-tight leading-[1.1] pt-1 transition-transform group-hover/point:translate-x-1">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Niche Ecosystem */}
                      <div className="p-6 md:p-8 bg-white border border-emerald-50 rounded-2xl md:rounded-3xl flex flex-col group/niche shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                          <Target className="w-48 h-48" />
                        </div>
                        <div className="flex items-center gap-4 mb-7 relative z-10">
                          <div className="w-11 h-11 rounded-2xl bg-oem-dark flex items-center justify-center text-emerald-500 shadow-xl">
                            <Target className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-oem-dark/20 block">Market Segment</span>
                            <div className="text-sm font-black text-oem-dark uppercase tracking-tight">Niche Ekosistem</div>
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-oem-dark tracking-tight leading-[1.15] uppercase relative z-10 break-words mb-auto">{selectedProduct.targetAudience}</p>

                        <div className="mt-8 pt-6 border-t border-emerald-50 relative z-10 flex justify-between items-end">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border-2 border-emerald-100" />
                              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Global Ready</p>
                            </div>
                            <p className="text-[8px] text-oem-dark/20 italic font-black uppercase tracking-[0.4em]">DNA-BLUEPRINT v2.41</p>
                          </div>
                          <div className="w-8 h-1 bg-emerald-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 3 Alpha Strategies */}
        <section className="space-y-6 md:space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Market Expansion</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.1]">3 Strategi Alpha</h2>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-emerald-500 rounded-full" />
                <p className="text-oem-dark/30 font-black text-[9px] tracking-[0.35em] uppercase">Tactical Execution Plan</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {profile.strategies.map((strategy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-emerald-50 p-7 md:p-8 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 text-[5rem] md:text-[7rem] font-black text-emerald-500/5 group-hover:scale-110 transition-transform duration-1000 select-none pointer-events-none">
                  {i + 1}
                </div>
                <div className="relative z-10">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-oem-primary mb-6 group-hover:bg-oem-primary group-hover:text-white transition-colors duration-500 shadow-inner">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-oem-dark leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{strategy}</h3>
                  <div className="mt-5 pt-4 border-t border-emerald-50/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Execute Now</span>
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sales Advisor Report */}
        <section className="bg-oem-dark rounded-3xl md:rounded-[3rem] p-7 md:p-16 relative overflow-hidden text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] border border-white/5">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="absolute top-0 right-0 p-12 md:p-20 opacity-[0.05] pointer-events-none">
            <BarChart3 className="w-48 h-48 md:w-80 md:h-80 text-emerald-400" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="lg:col-span-5 space-y-7 md:space-y-10">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.35em]">Internal Intelligence</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-tight">Blueprint<br /><span className="text-emerald-500">Sales Alpha</span></h2>
                <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed max-w-sm">Menganalisa "pahit" pelanggan secara sub-atomik & taktik closing paling tajam.</p>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5">
                    <Shield className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-500 tracking-[0.35em] mb-0.5">Clearance Protocol</div>
                    <div className="text-base font-black text-white tracking-widest">SAINTIS-L-01</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="h-1.5 bg-emerald-500/20 rounded-full relative overflow-hidden">
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute inset-0 bg-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 relative shadow-2xl">
              <div className="absolute -top-5 -right-5 md:-top-6 md:-right-6">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12">
                  <User className="text-white w-6 h-6" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-strong:text-emerald-400 prose-strong:font-black prose-p:text-sm md:prose-p:text-base prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter pl-5 md:pl-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-full" />
                <ReactMarkdown>{profile.salesAdvisorReport}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 italic">EndOfTransmission_</span>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center pt-2 pb-6">
          <button
            onClick={onReset}
            className="px-7 py-4 text-xs font-black uppercase tracking-[0.35em] text-oem-dark/30 hover:text-oem-primary transition-all flex items-center gap-3 group order-2 sm:order-1"
          >
            <div className="w-9 h-9 rounded-full border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
            Ulang Diagnosis
          </button>

          <button
            onClick={() => setShowLeadModal(true)}
            className="w-full sm:w-auto px-10 py-5 md:px-14 md:py-6 bg-oem-primary text-white rounded-full text-sm md:text-base font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:scale-[1.03] transition-all relative overflow-hidden group order-1 sm:order-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              MANIFESTASIKAN PRODUK <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLeadModal && (
          <LeadCaptureModal leadId={leadId} onClose={() => setShowLeadModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

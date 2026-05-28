import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader as Loader2, Sparkles, User, Bot, Dna, ChevronRight } from 'lucide-react';
import { diagnoseFounder, chatWithScientist, extractLeadData, PersonalityProfile } from '../services/geminiService';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface Props {
  onReportComplete: (profile: PersonalityProfile, leadId: string | null) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const TypewriterText = ({ text, onDone }: { text: string; onDone?: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
  }, [text]);

  useEffect(() => {
    if (idx.current >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, idx.current + 1));
      idx.current += 1;
    }, 12);
    return () => clearTimeout(t);
  }, [displayed, text, onDone]);

  return <p className="whitespace-pre-wrap">{displayed}</p>;
};

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-1 py-1">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-emerald-400"
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

const STEPS = [
  { label: 'Nama & Umur', done: (msgs: Message[]) => msgs.filter(m => m.role === 'user').length >= 2 },
  { label: 'Bisnes & Visi', done: (msgs: Message[]) => msgs.filter(m => m.role === 'user').length >= 4 },
  { label: 'DNA Lengkap', done: (msgs: Message[]) => msgs.filter(m => m.role === 'user').length >= 6 },
];

export const FounderDiagnosis = ({ onReportComplete }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Salam! Saya Ensu Saintis. Sebelum kita mula kaji DNA bisnes anda, boleh saya tahu nama anda siapa?' }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [ageSelected, setAgeSelected] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const leadIdRef = useRef<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const AGE_OPTIONS = ['20 - 30', '30 - 40', '40 - 50', '50 ke atas'];

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Upsert lead row — creates on first call, updates on subsequent
  const upsertLead = async (msgs: Message[], extra: Record<string, unknown> = {}) => {
    const currentId = leadIdRef.current;
    if (currentId) {
      await supabase.from('leads').update({ messages: msgs, ...extra }).eq('id', currentId);
    } else {
      const { data, error } = await supabase.from('leads').insert({
        messages: msgs,
        completed: false,
        ...extra,
      }).select('id').maybeSingle();
      if (error) console.error('Lead insert error:', error);
      if (data?.id) {
        leadIdRef.current = data.id;
        setLeadId(data.id);
      }
    }
  };

  // Save messages then run AI extraction in background — non-blocking
  const saveLeadMessages = async (msgs: Message[]) => {
    await upsertLead(msgs);
    // Fire AI extraction async so it doesn't delay the chat UX
    extractLeadData(msgs).then(extracted => {
      const currentId = leadIdRef.current;
      if (!currentId) return;
      supabase.from('leads').update({
        name: extracted.name,
        age_range: extracted.age_range,
        note: extracted.note,
        email: extracted.email,
        phone: extracted.phone,
        product_type: extracted.product_type,
        budget: extracted.budget,
        quantity: extracted.quantity,
      }).eq('id', currentId).then(({ error }) => {
        if (error) console.error('Lead extraction update error:', error);
      });
    }).catch(() => {});
  };

  // Final save with personality profile — awaited fully before showing report
  const saveLeadFinal = async (msgs: Message[], profile?: PersonalityProfile) => {
    const extracted = await extractLeadData(msgs);
    await upsertLead(msgs, {
      name: extracted.name,
      age_range: extracted.age_range,
      note: extracted.note,
      email: extracted.email,
      phone: extracted.phone,
      product_type: extracted.product_type,
      budget: extracted.budget,
      quantity: extracted.quantity,
      ...(profile ? { personality_profile: profile, completed: true } : {}),
    });
  };

  const isAskingAboutAge = (text: string) => {
    const lower = text.toLowerCase();
    return (lower.includes('umur') || lower.includes('usia') || lower.includes('berapa tahun') || lower.includes('anggaran')) && !ageSelected;
  };

  const lastBotMsg = messages.filter(m => m.role === 'bot').at(-1)?.content ?? '';
  const showAgeOptions = isAskingAboutAge(lastBotMsg) && !isTyping && !ageSelected;

  const sendBotReply = async (msgs: Message[]) => {
    setIsTyping(true);
    try {
      const response = await chatWithScientist(msgs);
      const withBot: Message[] = [...msgs, { role: 'bot', content: response }];
      setMessages(withBot);
      await saveLeadMessages(withBot);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Maaf, hubungan transmisi saya sedikit terganggu. Boleh anda nyatakan semula?' }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleAgeSelect = async (age: string) => {
    setAgeSelected(true);
    const updated: Message[] = [...messages, { role: 'user', content: age }];
    setMessages(updated);
    await sendBotReply(updated);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isAnalyzing) return;
    const updated: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(updated);
    setInput('');
    await sendBotReply(updated);
  };

  const handleFinalAnalyze = async () => {
    if (messages.length < 2) return;
    setIsAnalyzing(true);
    try {
      const profile = await diagnoseFounder(messages);
      await saveLeadFinal(messages, profile);
      onReportComplete(profile, leadId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal memproses DNA anda.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const userMsgCount = messages.filter(m => m.role === 'user').length;
  const canFinalize = messages.length >= 4;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 flex flex-col py-12 md:py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-5">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <Dna className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">Karakter & Visi</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-oem-dark uppercase tracking-tight leading-none mb-3">
          Scan DNA<span className="text-oem-primary">.</span>
        </h2>
        <p className="text-oem-dark/40 text-sm font-medium leading-relaxed max-w-md mx-auto">
          Bincang santai dengan <span className="text-oem-primary font-bold">Ensu Saintis</span> untuk kenali DNA jenama anda.
        </p>
      </motion.div>

      {/* Progress steps */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        {STEPS.map((step, i) => {
          const done = step.done(messages);
          const active = !done && (i === 0 || STEPS[i - 1].done(messages));
          return (
            <React.Fragment key={i}>
              <div className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-500',
                done ? 'bg-emerald-500 text-white' :
                active ? 'bg-oem-dark text-white' :
                'bg-slate-100 text-slate-400'
              )}>
                <div className={cn(
                  'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black border',
                  done ? 'bg-white/30 border-white/40 text-white' :
                  active ? 'bg-white/20 border-white/30 text-white' :
                  'bg-slate-200 border-slate-300 text-slate-400'
                )}>{i + 1}</div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={cn('w-3 h-3 flex-shrink-0', done ? 'text-emerald-400' : 'text-slate-200')} />
              )}
            </React.Fragment>
          );
        })}
      </motion.div>

      {/* Chat Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col rounded-2xl border border-slate-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] bg-white overflow-hidden"
        style={{ height: '520px' }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3.5 px-5 py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-oem-dark flex items-center justify-center text-emerald-400 shadow-sm">
              <Bot size={16} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black uppercase tracking-widest text-oem-dark leading-none">Ensu Saintis</div>
            <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Aktif Mengkaji</div>
          </div>
          <div className="flex items-center gap-1.5">
            {['bg-red-300', 'bg-amber-300', 'bg-emerald-400'].map((c, i) => (
              <div key={i} className={cn('w-2.5 h-2.5 rounded-full', c)} />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-4 custom-scrollbar bg-slate-50/40"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={cn('flex items-end gap-2.5', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                <div className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
                  m.role === 'user' ? 'bg-oem-dark text-white' : 'bg-white border border-slate-200 text-emerald-600'
                )}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={cn(
                  'px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%]',
                  m.role === 'user'
                    ? 'bg-oem-dark text-white rounded-br-sm shadow-sm'
                    : 'bg-white text-slate-700 rounded-bl-sm border border-slate-200/80 shadow-sm'
                )}>
                  {m.role === 'bot' && i === messages.length - 1 && !isAnalyzing
                    ? <TypewriterText text={m.content} onDone={scrollToBottom} />
                    : <p className="whitespace-pre-wrap">{m.content}</p>}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2.5"
              >
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-200/80 shadow-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-slate-100 bg-white px-4 py-3.5">
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-3 py-3">
              <Loader2 className="w-5 h-5 text-oem-primary animate-spin" />
              <p className="text-slate-400 text-sm font-semibold">Sedang membedah DNA anda...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Age quick-select */}
              <AnimatePresence>
                {showAgeOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {AGE_OPTIONS.map(age => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => handleAgeSelect(age)}
                        className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-oem-dark text-xs font-bold hover:bg-oem-dark hover:text-white hover:border-oem-dark transition-all duration-200 active:scale-95"
                      >
                        {age}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isTyping ? 'Saintis sedang berfikir...' : 'Katakan sesuatu kepada Saintis...'}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-oem-dark placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-medium disabled:opacity-50"
                  disabled={isTyping}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-oem-dark text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 transition-all flex-shrink-0"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {/* Progress bar inside input */}
              {userMsgCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userMsgCount / 6) * 100, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 flex-shrink-0">
                    {userMsgCount}/6
                  </span>
                </div>
              )}

              {/* Finalize CTA */}
              <AnimatePresence>
                {canFinalize && (
                  <motion.button
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={handleFinalAnalyze}
                    className="w-full py-3 px-6 bg-oem-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all duration-300 active:scale-[0.98] shadow-sm"
                  >
                    <Sparkles size={12} />
                    Tamatkan Analisis — Hantar Detail ke WhatsApp
                    <Sparkles size={12} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[10px] text-slate-300 font-medium mt-5 uppercase tracking-widest"
      >
        Jawab sekurang-kurangnya 6 soalan untuk hasil diagnosis terbaik
      </motion.p>
    </div>
  );
};

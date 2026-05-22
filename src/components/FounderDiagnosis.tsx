import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Send, Loader as Loader2, Sparkles, User, Bot, Dna } from 'lucide-react';
import { diagnoseFounder, chatWithScientist, PersonalityProfile } from '../services/geminiService';
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
  <div className="flex items-center gap-1 px-1 py-1">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full bg-emerald-400"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const AGE_OPTIONS = ['20 - 30', '30 - 40', '40 - 50', '50 ke atas'];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const extractName = (msgs: Message[]) => msgs.find(m => m.role === 'user')?.content ?? null;
  const extractAgeRange = (msgs: Message[]) =>
    msgs.find(m => m.role === 'user' && /^\d{2}/.test(m.content.trim()))?.content ?? null;

  const saveLead = async (msgs: Message[], profile?: PersonalityProfile) => {
    const name = extractName(msgs);
    const age_range = extractAgeRange(msgs);
    const currentId = leadIdRef.current;
    if (currentId) {
      await supabase.from('leads').update({
        messages: msgs,
        name,
        age_range,
        ...(profile ? { personality_profile: profile, completed: true } : {}),
      }).eq('id', currentId);
    } else {
      const { data } = await supabase.from('leads').insert({
        messages: msgs,
        name,
        age_range,
        completed: false,
      }).select('id').maybeSingle();
      if (data?.id) {
        leadIdRef.current = data.id;
        setLeadId(data.id);
      }
    }
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
      saveLead(withBot);
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
    saveLead(updated);
    await sendBotReply(updated);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isAnalyzing) return;
    const updated: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(updated);
    setInput('');
    saveLead(updated);
    await sendBotReply(updated);
  };

  const handleFinalAnalyze = async () => {
    if (messages.length < 2) return;
    setIsAnalyzing(true);
    try {
      const profile = await diagnoseFounder(messages);
      await saveLead(messages, profile);
      onReportComplete(profile, leadId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal memproses DNA anda.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 flex flex-col py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-oem-primary flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Dna className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="pill-container text-[8px] block mb-0.5">Karakter & Visi</span>
            <h2 className="text-xl font-extrabold text-oem-dark uppercase tracking-tight leading-none">SCAN DNA.</h2>
          </div>
        </div>
        <p className="text-oem-dark/50 text-sm font-medium leading-relaxed">
          Bincang santai dengan <span className="text-oem-primary font-bold">Ensu Saintis</span> untuk kenali DNA jenama anda.
        </p>
      </div>

      {/* Chat Card */}
      <div
        className="flex flex-col rounded-3xl border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] bg-white overflow-hidden"
        style={{ height: '560px' }}
      >
        {/* Chat Header Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-emerald-50 bg-gradient-to-r from-white to-emerald-50/30 flex-shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Bot size={16} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-oem-dark">Ensu Saintis</div>
            <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Aktif Mengkaji</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn('w-2.5 h-2.5 rounded-full', i === 0 ? 'bg-red-300' : i === 1 ? 'bg-amber-300' : 'bg-emerald-400')} />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar bg-[#fafffe]">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={cn('flex items-end gap-2', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                  m.role === 'user' ? 'bg-oem-dark text-white' : 'bg-emerald-500 text-white'
                )}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={cn(
                  'px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed max-w-[78%] shadow-sm',
                  m.role === 'user'
                    ? 'bg-oem-dark text-white rounded-br-sm'
                    : 'bg-white text-slate-800 rounded-bl-sm border border-emerald-100/80 shadow-emerald-50'
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
                className="flex items-end gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-emerald-100/80 shadow-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-emerald-50 bg-white px-4 py-3">
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-3 py-3">
              <Loader2 className="w-5 h-5 text-oem-primary animate-spin" />
              <p className="text-oem-dark/50 text-sm font-semibold animate-pulse">Sedang membedah DNA anda...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {showAgeOptions && (
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map(age => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleAgeSelect(age)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-oem-dark text-xs font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200 active:scale-95"
                    >
                      {age}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isTyping ? 'Saintis sedang berfikir...' : 'Katakan sesuatu kepada Saintis...'}
                  className="flex-1 bg-emerald-50/40 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-oem-dark placeholder:text-oem-dark/30 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all font-medium disabled:opacity-50"
                  disabled={isTyping}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-11 h-11 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-sm shadow-emerald-200 flex-shrink-0"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {messages.length >= 4 && (
                <button
                  onClick={handleFinalAnalyze}
                  className="w-full py-3 px-6 bg-oem-dark text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors active:scale-[0.98]"
                >
                  <Sparkles size={13} />
                  Muktamadkan Analisis DNA
                  <Sparkles size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

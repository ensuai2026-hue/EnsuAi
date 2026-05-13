import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Send, Loader as Loader2, Sparkles, User, Bot } from 'lucide-react';
import { diagnoseFounder, chatWithScientistStream, PersonalityProfile } from '../services/geminiService';
import { cn } from '../lib/utils';

interface Props {
  onReportComplete: (profile: PersonalityProfile) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export const FounderDiagnosis = ({ onReportComplete }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Salam! Saya Ensu Saintis. Sebelum kita mula kaji DNA bisnes anda, boleh saya tahu nama anda siapa?' }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<boolean>(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || isAnalyzing) return;

    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    abortRef.current = false;

    // Add empty bot message to stream into
    setMessages(prev => [...prev, { role: 'bot', content: '' }]);

    try {
      const stream = chatWithScientistStream(updatedMessages);
      for await (const chunk of stream) {
        if (abortRef.current) break;
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'bot') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'bot' && last.content === '') {
          updated[updated.length - 1] = { ...last, content: 'Maaf, hubungan transmisi saya sedikit terganggu. Boleh anda nyatakan semula?' };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFinalAnalyze = async () => {
    if (messages.length < 2) return;

    setIsAnalyzing(true);
    try {
      const profile = await diagnoseFounder(messages);
      onReportComplete(profile);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal memproses DNA anda.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <div className="text-center md:text-left mb-6 md:mb-10">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-oem-primary flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Brain className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="pill-container mb-1.5 md:mb-2 text-[8px]">
              Karakter & Visi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-oem-dark uppercase tracking-tight">SCAN DNA.</h2>
          </div>
        </div>
        <p className="text-oem-dark/50 text-sm md:text-lg font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
          Bincang santai dengan <span className="text-oem-primary font-bold">Ensu Saintis</span>. Jom kenali DNA anda untuk hasilkan produk yang benar-benar berjiwa.
        </p>
      </div>

      <div className="organic-card overflow-hidden flex flex-col h-[500px] sm:h-[550px] md:h-[650px] shadow-2xl relative bg-white border border-emerald-50 hover:transform-none hover:translate-y-0">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-emerald-50 bg-emerald-50/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-oem-primary flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-oem-dark">Ensu Saintis</div>
            <div className="flex items-center gap-1">
              <div className={cn("w-1.5 h-1.5 rounded-full", isStreaming ? "bg-amber-400 animate-pulse" : "bg-emerald-500 animate-pulse")} />
              <div className={cn("text-[10px] font-bold uppercase tracking-tight", isStreaming ? "text-amber-500" : "text-emerald-600")}>
                {isStreaming ? 'Sedang Menaip...' : 'Aktif Mengkaji'}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth custom-scrollbar relative bg-white">
          <div className="relative z-10 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex items-end gap-2 md:gap-3 w-full',
                    m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm',
                    m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'
                  )}>
                    {m.role === 'user' ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <Bot className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                  <div className={cn(
                    'px-4 py-2.5 md:px-5 md:py-3 rounded-[1.25rem] text-sm md:text-[15px] font-medium leading-relaxed max-w-[85%] md:max-w-[70%] shadow-sm',
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none shadow-slate-200'
                      : 'bg-white text-emerald-950 rounded-bl-none border border-emerald-100 shadow-emerald-50/50'
                  )}>
                    <p className="whitespace-pre-wrap">
                      {m.content}
                      {m.role === 'bot' && isStreaming && i === messages.length - 1 && (
                        <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-emerald-100 z-10">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <Loader2 className="w-8 h-8 text-oem-primary animate-spin" />
              <p className="text-oem-dark/40 text-sm font-medium animate-pulse">Sedang membedah DNA anda...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isStreaming ? 'Ensu Saintis sedang menaip...' : 'Katakan sesuatu kepada Saintis...'}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-5 py-3.5 pr-14 text-oem-dark focus:border-oem-primary focus:bg-white outline-none text-base font-medium transition-all placeholder:text-oem-dark/30 disabled:opacity-50"
                  disabled={isStreaming}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="absolute right-1.5 w-10 h-10 bg-oem-primary text-white rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm shadow-emerald-200"
                >
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {messages.length >= 2 && !isStreaming && (
                <button
                  onClick={handleFinalAnalyze}
                  className="w-full py-3.5 px-6 bg-oem-dark text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-oem-primary transition-colors shadow-lg active:scale-[0.98]"
                >
                  MUKTAMADKAN ANALISIS DNA <Sparkles size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

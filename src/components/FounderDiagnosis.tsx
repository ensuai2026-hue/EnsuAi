import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Send, Loader2, Sparkles, ArrowRight, User, Bot, MessageSquare } from 'lucide-react';
import { diagnoseFounder, chatWithScientist, PersonalityProfile } from '../services/geminiService';
import { cn } from '../lib/utils';

interface Props {
  onReportComplete: (profile: PersonalityProfile) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const TypewriterText = ({ text, onType }: { text: string, onType?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        onType?.();
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onType]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

export const FounderDiagnosis = ({ onReportComplete }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Salam! Saya Ensu Saintis. Sebelum kita mula kaji DNA bisnes anda, boleh saya tahu nama anda siapa?' }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auto-scroll disabled to allow user control over the chat view
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isAnalyzing) return;

    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await chatWithScientist(updatedMessages);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "Maaf, hubungan transmisi saya sedikit terganggu. Boleh anda nyatakan semula?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinalAnalyze = async () => {
    if (messages.length < 2) return;

    setIsAnalyzing(true);
    try {
      const profile = await diagnoseFounder(messages);
      onReportComplete(profile);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal memproses DNA anda.");
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
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Aktif Mengkaji</div>
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
                    "flex items-end gap-2 md:gap-3 w-full",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                    m.role === 'user' ? "bg-slate-900 text-white" : "bg-emerald-500 text-white"
                  )}>
                    {m.role === 'user' ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <Bot className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                  <div className={cn(
                    "px-4 py-2.5 md:px-5 md:py-3 rounded-[1.25rem] text-sm md:text-[15px] font-medium leading-relaxed max-w-[85%] md:max-w-[70%] shadow-sm",
                    m.role === 'user' 
                      ? "bg-slate-900 text-white rounded-br-none shadow-slate-200" 
                      : "bg-white text-emerald-950 rounded-bl-none border border-emerald-100 shadow-emerald-50/50"
                  )}>
                    {m.role === 'bot' && i === messages.length - 1 && !isAnalyzing ? (
                      <TypewriterText text={m.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-oem-primary">
                    <Bot size={14} className="animate-pulse" />
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-oem-dark/30 text-[10px] font-bold uppercase tracking-wider">
                    Saintis sedang berfikir...
                  </div>
                </motion.div>
              )}
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
              <form 
                onSubmit={handleSendMessage} 
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isTyping ? "Ensu Saintis sedang berfikir..." : "Katakan sesuatu kepada Saintis..."}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-5 py-3.5 pr-14 text-oem-dark focus:border-oem-primary focus:bg-white outline-none text-base font-medium transition-all placeholder:text-oem-dark/30 disabled:opacity-50"
                  disabled={isTyping}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 w-10 h-10 bg-oem-primary text-white rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm shadow-emerald-200"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              
              {messages.length >= 2 && (
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

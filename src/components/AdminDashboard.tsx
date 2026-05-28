import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, CircleCheck as CheckCircle, Clock, Eye, X, LogOut, RefreshCw, MessageSquare, ChevronDown, ChevronUp, Phone, Mail, Wallet, Package, Hash, Bot, User, Dna, Search, Calendar, Download, Send, Trash2, FileText, TriangleAlert as AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { ProductRecommendation } from './ProductRecommendation';
import { PersonalityProfile } from '../services/geminiService';

interface Lead {
  id: string;
  name: string | null;
  age_range: string | null;
  note: string | null;
  phone: string | null;
  email: string | null;
  budget: string | null;
  product_type: string | null;
  quantity: string | null;
  messages: Array<{ role: string; content: string }>;
  personality_profile: Record<string, unknown> | null;
  completed: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const ADMIN_WA = '+60123456789';

const StatCard = ({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: number; color: string; bg: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn('rounded-2xl border p-5 flex items-center gap-4', bg)}
  >
    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  </motion.div>
);

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] font-black uppercase tracking-widest text-oem-dark/30">{label}</span>
    <span className="text-sm font-bold text-oem-dark">{value}</span>
  </div>
);

const buildWaMessage = (lead: Lead): string => {
  const date = new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const profile = lead.personality_profile as Record<string, string> | null;

  const parts: string[] = [
    `🧬 *LEAD BARU — ENSU.AI*`,
    `📅 ${date}`,
    ``,
    `👤 *Nama :* ${lead.name ?? '—'}`,
    `📝 *Note :* ${lead.note ?? '—'}`,
    `📧 *Emel :* ${lead.email ?? '—'}`,
    `📱 *WhatsApp :* ${lead.phone ?? '—'}`,
    ``,
    `🧪 *Jenis Produk :* ${lead.product_type ?? '—'}`,
    `💰 *Bajet :* ${lead.budget ?? '—'}`,
    `📦 *Kuantiti :* ${lead.quantity ?? '—'}`,
  ];

  if (lead.age_range) parts.push(`🎂 *Umur :* ${lead.age_range}`);

  if (profile?.personalityType) {
    parts.push(``, `🔬 *Profil DNA :* ${profile.personalityType}`);
    if (profile.entrepreneurStyle) parts.push(`⚡ *Gaya :* ${profile.entrepreneurStyle}`);
  }

  return parts.join('\n');
};

const sendToWhatsApp = (lead: Lead) => {
  const msg = buildWaMessage(lead);
  const phone = ADMIN_WA.replace(/\D/g, '');
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

const downloadCSV = (leads: Lead[]) => {
  const headers = ['Nama', 'Note', 'Umur', 'WhatsApp', 'Emel', 'Jenis Produk', 'Bajet', 'Kuantiti', 'Status', 'Tarikh'];
  const rows = leads.map(l => [
    l.name ?? '',
    l.note ?? '',
    l.age_range ?? '',
    l.phone ?? '',
    l.email ?? '',
    l.product_type ?? '',
    l.budget ?? '',
    l.quantity ?? '',
    l.completed ? 'Selesai' : 'Dalam Proses',
    new Date(l.created_at).toLocaleDateString('ms-MY'),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-ensu-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const DeleteConfirmDialog = ({ lead, onConfirm, onCancel, loading }: {
  lead: Lead; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center px-4"
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-800 mb-1">Padam Lead</div>
          <div className="text-xs text-slate-500 font-medium">
            Adakah anda pasti mahu padam lead <span className="font-bold text-slate-700">{lead.name ?? 'ini'}</span>? Tindakan ini tidak boleh dibatalkan.
          </div>
        </div>
        <div className="flex gap-2 w-full pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Padam
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const LeadDrawer = ({ lead, onClose, onDelete, onViewReport }: {
  lead: Lead; onClose: () => void; onDelete: (lead: Lead) => void; onViewReport: (lead: Lead) => void;
}) => {
  const [showMessages, setShowMessages] = useState(lead.completed);
  const profile = lead.personality_profile as Record<string, string> | null;

  const contactFields = [
    { icon: Phone, label: 'WhatsApp', value: lead.phone, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { icon: Mail, label: 'Emel', value: lead.email, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { icon: Package, label: 'Jenis Produk', value: lead.product_type, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { icon: Wallet, label: 'Bajet', value: lead.budget, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { icon: Hash, label: 'Kuantiti / SKU', value: lead.quantity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ].filter(f => f.value);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
    >
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="w-full max-w-md bg-oem-cream h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-oem-cream/90 backdrop-blur-xl border-b border-oem-dark/5 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-oem-dark flex items-center justify-center text-emerald-400 font-black text-sm shadow-md shadow-oem-dark/20">
              {(lead.name ?? '?')[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-extrabold text-oem-dark">{lead.name ?? 'Tanpa Nama'}</div>
              <div className="text-[10px] text-oem-dark/35 font-medium mt-0.5">
                {new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide',
              lead.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'
            )}>
              {lead.completed ? 'Selesai' : 'Proses'}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Basic info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3.5 border border-white shadow-sm">
              <ProfileRow label="Nama" value={lead.name ?? '—'} />
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3.5 border border-white shadow-sm">
              <ProfileRow label="Umur" value={lead.age_range ?? '—'} />
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3.5 border border-white shadow-sm">
              <ProfileRow label="Mesej" value={`${lead.messages?.length ?? 0} mesej`} />
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3.5 border border-white shadow-sm">
              <ProfileRow label="Tarikh" value={new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })} />
            </div>
          </div>

          {/* Note */}
          {lead.note && (
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Note</div>
              <div className="text-sm font-medium text-slate-700 leading-relaxed">{lead.note}</div>
            </div>
          )}

          {/* Contact & order info */}
          {contactFields.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">Kenalan & Pesanan</div>
              <div className="space-y-2">
                {contactFields.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className={cn('flex items-center gap-3 rounded-xl p-3 border', color)}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</div>
                      <div className="text-sm font-bold text-slate-700">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DNA Profile */}
          {profile && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Dna className="w-3.5 h-3.5 text-emerald-500" />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profil DNA</div>
              </div>
              <div className="space-y-2">
                {(['personalityType', 'entrepreneurStyle', 'creativeVision', 'brandDNA'] as const).map(key => {
                  const val = (profile as Record<string, string>)[key];
                  if (!val) return null;
                  return (
                    <div key={key} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                      <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{val}</div>
                    </div>
                  );
                })}
                {profile.fullDiagnosis && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Diagnosis Penuh</div>
                    <div className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-6">
                      {String(profile.fullDiagnosis)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Transcript */}
          {(lead.messages?.length ?? 0) > 0 && (
            <div>
              <button
                onClick={() => setShowMessages(v => !v)}
                className="w-full flex items-center justify-between py-2 group"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                    Transkrip ({lead.messages?.length ?? 0})
                  </span>
                </div>
                {showMessages
                  ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              <AnimatePresence>
                {showMessages && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar border border-slate-100">
                      {lead.messages?.map((msg, i) => (
                        <div key={i} className={cn('flex items-end gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                          <div className={cn(
                            'w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0',
                            msg.role === 'user' ? 'bg-oem-dark text-white' : 'bg-white border border-slate-200 text-emerald-600'
                          )}>
                            {msg.role === 'user'
                              ? <User className="w-2.5 h-2.5" />
                              : <Bot className="w-2.5 h-2.5" />}
                          </div>
                          <div className={cn(
                            'max-w-[85%] px-3 py-2 rounded-xl text-xs font-medium leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-oem-dark text-white rounded-br-none'
                              : 'bg-white text-slate-600 border border-slate-200 rounded-bl-none'
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-oem-cream/90 backdrop-blur-xl border-t border-oem-dark/5 px-5 py-4 space-y-2">
          {lead.completed && lead.personality_profile && (
            <button
              onClick={() => onViewReport(lead)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-oem-dark hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Lihat Full Report DNA
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => sendToWhatsApp(lead)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Hantar ke WhatsApp
            </button>
            <button
              onClick={() => downloadCSV([lead])}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(lead)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FullReportModal = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
  const profile = lead.personality_profile as PersonalityProfile | null;
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-oem-cream overflow-y-auto"
    >
      <div className="sticky top-0 z-10 glass-organic px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-oem-dark rounded-lg flex items-center justify-center">
            <Dna className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-oem-dark/40">
            Report DNA — {lead.name ?? 'Tanpa Nama'}
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-oem-dark/35 hover:text-oem-dark transition-colors px-3 py-2 rounded-xl hover:bg-oem-dark/5"
        >
          <X className="w-3.5 h-3.5" />
          Tutup
        </button>
      </div>
      <ProductRecommendation
        profile={profile}
        leadId={lead.id}
        onReset={onClose}
        adminMode
      />
    </motion.div>
  );
};

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reportLead, setReportLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      console.error('fetchLeads error:', err);
      setError(err.message);
    } else {
      setLeads((data ?? []) as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error: err } = await supabase.from('leads').delete().eq('id', deleteTarget.id);
    if (err) {
      console.error('Delete error:', err);
    } else {
      setLeads(prev => prev.filter(l => l.id !== deleteTarget.id));
      if (selectedLead?.id === deleteTarget.id) setSelectedLead(null);
    }
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const filtered = leads.filter(l => {
    const matchFilter =
      filter === 'all' || (filter === 'completed' ? l.completed : !l.completed);
    const matchSearch = !search ||
      (l.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (l.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalLeads = leads.length;
  const completedLeads = leads.filter(l => l.completed).length;
  const incompleteLeads = leads.filter(l => !l.completed).length;
  const todayLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-oem-cream oem-grid">
      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Header */}
      <header className="glass-organic sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-oem-dark rounded-2xl flex items-center justify-center shadow-lg shadow-oem-dark/20">
              <Dna className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-black text-oem-dark uppercase tracking-tight leading-none font-display">ENSU.AI</div>
              <div className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-[0.3em] mt-0.5">Admin Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => downloadCSV(leads)}
              disabled={leads.length === 0}
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-oem-primary transition-colors px-3 py-2 rounded-xl hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-oem-dark transition-colors px-3 py-2 rounded-xl hover:bg-oem-dark/5"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Log Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-5 md:space-y-7 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Users} label="Jumlah Lead" value={totalLeads} color="bg-oem-dark/5 text-oem-dark" bg="bg-white/80 backdrop-blur-xl border-white shadow-sm" />
          <StatCard icon={Calendar} label="Hari Ini" value={todayLeads} color="bg-emerald-100 text-oem-primary" bg="bg-white/80 backdrop-blur-xl border-emerald-50 shadow-sm" />
          <StatCard icon={CheckCircle} label="Selesai" value={completedLeads} color="bg-emerald-500/10 text-emerald-600" bg="bg-white/80 backdrop-blur-xl border-emerald-50 shadow-sm" />
          <StatCard icon={Clock} label="Proses" value={incompleteLeads} color="bg-amber-100 text-amber-600" bg="bg-white/80 backdrop-blur-xl border-amber-50 shadow-sm" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-xl rounded-2xl p-1.5 border border-white shadow-sm">
            {(['all', 'completed', 'incomplete'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                  filter === f
                    ? 'bg-oem-dark text-white shadow-md'
                    : 'text-oem-dark/30 hover:text-oem-dark hover:bg-oem-dark/5'
                )}
              >
                {f === 'all' ? 'Semua' : f === 'completed' ? 'Selesai' : 'Proses'}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-oem-dark/25" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, emel, telefon..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white bg-white/70 backdrop-blur-xl text-xs font-medium text-oem-dark placeholder:text-oem-dark/25 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-oem-dark/30 font-black uppercase tracking-widest whitespace-nowrap">{filtered.length} lead</span>
            <button
              onClick={() => downloadCSV(leads)}
              disabled={leads.length === 0}
              className="sm:hidden flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-oem-dark/40 hover:text-oem-primary px-3 py-2.5 rounded-2xl bg-white/70 border border-white shadow-sm disabled:opacity-30"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-7 h-7 border-2 border-oem-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black text-oem-dark/30 uppercase tracking-widest">Memuatkan...</span>
            </div>
          ) : error ? (
            <div className="text-center py-24 px-6">
              <div className="text-sm font-bold text-red-400 mb-2">Gagal memuatkan lead</div>
              <div className="text-xs text-oem-dark/30 mb-4">{error}</div>
              <button onClick={fetchLeads} className="text-xs font-black text-oem-primary hover:underline uppercase tracking-widest">Cuba semula</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <MessageSquare className="w-10 h-10 text-oem-dark/10 mx-auto mb-3" />
              <div className="text-sm font-black text-oem-dark/20 uppercase tracking-widest">Tiada lead dijumpai</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-oem-dark/5 bg-oem-dark/[0.02]">
                    {['Nama', 'Umur', 'Mesej', 'Status', 'Tarikh', ''].map(col => (
                      <th key={col} className="text-left px-4 md:px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-oem-dark/25">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      className="border-b border-oem-dark/5 last:border-0 hover:bg-oem-dark/[0.02] transition-colors cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-4 md:px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-oem-dark flex items-center justify-center text-emerald-400 font-black text-xs flex-shrink-0 shadow-md shadow-oem-dark/20">
                            {(lead.name ?? '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-oem-dark leading-none">
                              {lead.name ?? <span className="text-oem-dark/20 font-medium italic text-xs">tanpa nama</span>}
                            </div>
                            {lead.phone && (
                              <div className="text-[10px] text-oem-dark/35 font-medium mt-0.5">{lead.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-4 text-xs text-oem-dark/40 font-medium">{lead.age_range ?? '—'}</td>
                      <td className="px-4 md:px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3 text-oem-dark/20" />
                          <span className="text-xs text-oem-dark/40 font-medium">{lead.messages?.length ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide',
                          lead.completed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', lead.completed ? 'bg-emerald-500' : 'bg-amber-400')} />
                          {lead.completed ? 'Selesai' : 'Proses'}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-4">
                        <div className="text-xs text-oem-dark/40 font-medium leading-none">
                          {new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-[9px] text-oem-dark/20 font-medium mt-1">
                          {new Date(lead.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {lead.completed && lead.personality_profile && (
                            <button
                              onClick={e => { e.stopPropagation(); setReportLead(lead); }}
                              className="w-7 h-7 rounded-xl bg-oem-dark/5 hover:bg-oem-dark flex items-center justify-center transition-all group/rep"
                              title="Lihat Full Report"
                            >
                              <FileText className="w-3 h-3 text-oem-dark/40 group-hover/rep:text-emerald-400 transition-colors" />
                            </button>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); sendToWhatsApp(lead); }}
                            className="w-7 h-7 rounded-xl bg-emerald-50 hover:bg-oem-primary flex items-center justify-center transition-all group/wa border border-emerald-100"
                            title="Hantar ke WhatsApp"
                          >
                            <Send className="w-3 h-3 text-oem-primary group-hover/wa:text-white transition-colors" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteTarget(lead); }}
                            className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-500 flex items-center justify-center transition-all group/del border border-red-100"
                            title="Padam Lead"
                          >
                            <Trash2 className="w-3 h-3 text-red-400 group-hover/del:text-white transition-colors" />
                          </button>
                          <Eye className="w-4 h-4 text-oem-dark/15 group-hover:text-oem-primary transition-colors" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onDelete={lead => { setSelectedLead(null); setDeleteTarget(lead); }}
            onViewReport={lead => { setSelectedLead(null); setReportLead(lead); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmDialog
            lead={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reportLead && (
          <FullReportModal
            lead={reportLead}
            onClose={() => setReportLead(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

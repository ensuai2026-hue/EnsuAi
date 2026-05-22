import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, TrendingUp, CircleCheck as CheckCircle, Clock, Eye, X, LogOut, RefreshCw,
  MessageSquare, ChevronDown, ChevronUp, Phone, Mail, Wallet, Package, Hash, Bot, User,
  Dna, Search, Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Lead {
  id: string;
  name: string | null;
  age_range: string | null;
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
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-sm font-bold text-slate-700">{value}</span>
  </div>
);

const LeadDrawer = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
  const [showMessages, setShowMessages] = useState(lead.completed);
  const profile = lead.personality_profile as Record<string, string> | null;

  const contactFields = [
    { icon: Phone, label: 'WhatsApp', value: lead.phone, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { icon: Mail, label: 'E-mel', value: lead.email, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { icon: Wallet, label: 'Bajet', value: lead.budget, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { icon: Package, label: 'Jenis Produk', value: lead.product_type, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Drawer Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm">
              {(lead.name ?? '?')[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-800">{lead.name ?? 'Tanpa Nama'}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
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
            <div className="bg-slate-50 rounded-xl p-3.5">
              <ProfileRow label="Nama" value={lead.name ?? '—'} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <ProfileRow label="Umur" value={lead.age_range ?? '—'} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <ProfileRow label="Mesej" value={`${lead.messages?.length ?? 0} mesej`} />
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5">
              <ProfileRow label="Tarikh" value={new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })} />
            </div>
          </div>

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
      </motion.div>
    </motion.div>
  );
};

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads((data ?? []) as Lead[]);
    } catch (e) {
      console.error('fetchLeads error:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 15000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-oem-dark rounded-xl flex items-center justify-center">
              <Dna className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-800 uppercase tracking-tight leading-none">ENSU.AI</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Jumlah Lead" value={totalLeads} color="bg-slate-100 text-slate-600" bg="bg-white border-slate-100" />
          <StatCard icon={Calendar} label="Hari Ini" value={todayLeads} color="bg-emerald-100 text-emerald-600" bg="bg-white border-slate-100" />
          <StatCard icon={CheckCircle} label="Selesai" value={completedLeads} color="bg-teal-100 text-teal-600" bg="bg-white border-slate-100" />
          <StatCard icon={Clock} label="Dalam Proses" value={incompleteLeads} color="bg-amber-100 text-amber-600" bg="bg-white border-slate-100" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
            {(['all', 'completed', 'incomplete'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                  filter === f
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {f === 'all' ? 'Semua' : f === 'completed' ? 'Selesai' : 'Proses'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, emel, telefon..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all"
            />
          </div>

          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">{filtered.length} lead</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuatkan...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-300">Tiada lead dijumpai</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    {['Nama', 'Umur', 'Mesej', 'Status', 'Tarikh', ''].map(col => (
                      <th key={col} className="text-left px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
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
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs flex-shrink-0">
                            {(lead.name ?? '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-700 leading-none">
                              {lead.name ?? <span className="text-slate-300 font-medium italic text-xs">tanpa nama</span>}
                            </div>
                            {lead.phone && (
                              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{lead.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{lead.age_range ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3 text-slate-300" />
                          <span className="text-xs text-slate-500 font-medium">{lead.messages?.length ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide',
                          lead.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', lead.completed ? 'bg-emerald-500' : 'bg-amber-400')} />
                          {lead.completed ? 'Selesai' : 'Proses'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs text-slate-500 font-medium leading-none">
                          {new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-[9px] text-slate-300 font-medium mt-1">
                          {new Date(lead.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Eye className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
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
          <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

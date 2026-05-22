import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, TrendingUp, CircleCheck as CheckCircle, Clock, Eye, X, LogOut, RefreshCw, MessageSquare, ChevronDown, ChevronUp, Phone, Mail, Wallet, Package, Hash } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  </motion.div>
);

const LeadDrawer = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => {
  const [showMessages, setShowMessages] = useState(false);
  const profile = lead.personality_profile as Record<string, string> | null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
    >
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-base font-extrabold text-slate-800">{lead.name ?? 'Tanpa Nama'}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nama</div>
              <div className="text-sm font-bold text-slate-700">{lead.name ?? '—'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Umur</div>
              <div className="text-sm font-bold text-slate-700">{lead.age_range ?? '—'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</div>
              <div className={`text-sm font-bold ${lead.completed ? 'text-emerald-600' : 'text-amber-500'}`}>
                {lead.completed ? 'Selesai Diagnosis' : 'Dalam Proses'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mesej</div>
              <div className="text-sm font-bold text-slate-700">{lead.messages?.length ?? 0} mesej</div>
            </div>
          </div>

          {/* Contact & Order Info */}
          {(lead.phone || lead.email || lead.budget || lead.product_type || lead.quantity) && (
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Maklumat Kenalan & Pesanan</div>
              <div className="space-y-2">
                {lead.phone && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">No. WhatsApp</div>
                      <div className="text-sm font-bold text-slate-700">{lead.phone}</div>
                    </div>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">E-mel</div>
                      <div className="text-sm font-bold text-slate-700">{lead.email}</div>
                    </div>
                  </div>
                )}
                {lead.budget && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <Wallet className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">Bajet</div>
                      <div className="text-sm font-bold text-slate-700">{lead.budget}</div>
                    </div>
                  </div>
                )}
                {lead.product_type && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <Package className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Jenis Produk</div>
                      <div className="text-sm font-bold text-slate-700">{lead.product_type}</div>
                    </div>
                  </div>
                )}
                {lead.quantity && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <Hash className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Kuantiti / SKU</div>
                      <div className="text-sm font-bold text-slate-700">{lead.quantity}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personality Profile */}
          {profile && (
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Profil DNA</div>
              <div className="space-y-2">
                {['personalityType', 'entrepreneurStyle', 'creativeVision', 'brandDNA'].map(key => {
                  const val = profile[key];
                  if (!val) return null;
                  return (
                    <div key={key} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-sm text-slate-700 font-medium leading-relaxed">{String(val)}</div>
                    </div>
                  );
                })}
                {profile.fullDiagnosis && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Diagnosis Penuh</div>
                    <div className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-6">{String(profile.fullDiagnosis)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div>
            <button
              onClick={() => setShowMessages(v => !v)}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-3 hover:text-slate-600 transition-colors"
            >
              <span>Transkrip Perbualan ({lead.messages?.length ?? 0})</span>
              {showMessages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showMessages && (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {lead.messages?.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white rounded-br-none'
                        : 'bg-emerald-50 text-slate-700 border border-emerald-100 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-leads`,
        { headers: { Authorization: `Bearer ${token}`, Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
      );
      const data = await res.json();
      setLeads(Array.isArray(data) ? (data as Lead[]) : []);
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
    if (filter === 'completed') return l.completed;
    if (filter === 'incomplete') return !l.completed;
    return true;
  });

  const totalLeads = leads.length;
  const completedLeads = leads.filter(l => l.completed).length;
  const incompleteLeads = leads.filter(l => !l.completed).length;
  const todayLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs">E</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">ENSU.AI</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Jumlah Lead" value={totalLeads} color="bg-blue-50 text-blue-500" />
          <StatCard icon={TrendingUp} label="Hari Ini" value={todayLeads} color="bg-emerald-50 text-emerald-500" />
          <StatCard icon={CheckCircle} label="Selesai" value={completedLeads} color="bg-teal-50 text-teal-500" />
          <StatCard icon={Clock} label="Dalam Proses" value={incompleteLeads} color="bg-amber-50 text-amber-500" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'completed', 'incomplete'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'completed' ? 'Selesai' : 'Dalam Proses'}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-semibold">{filtered.length} lead</span>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-300">Tiada lead lagi</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Umur</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mesej</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tarikh</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs flex-shrink-0">
                            {(lead.name ?? '?')[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{lead.name ?? <span className="text-slate-300 font-medium italic">tanpa nama</span>}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{lead.age_range ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{lead.messages?.length ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                          lead.completed
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lead.completed ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          {lead.completed ? 'Selesai' : 'Dalam Proses'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                        {new Date(lead.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <div className="text-[10px] text-slate-300">
                          {new Date(lead.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-all">
                          <Eye className="w-3.5 h-3.5" />
                          Lihat
                        </button>
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

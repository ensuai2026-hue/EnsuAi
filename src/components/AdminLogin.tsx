import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const REMEMBER_EMAIL_KEY = 'ensu_admin_email';
const REMEMBER_FLAG_KEY = 'ensu_admin_remember';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_EMAIL_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem(REMEMBER_FLAG_KEY) === '1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
      localStorage.setItem(REMEMBER_FLAG_KEY, '1');
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_FLAG_KEY);
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('E-mel atau kata laluan tidak sah.');
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">Admin</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Log masuk untuk akses dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">E-mel</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@ensu.ai"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Kata Laluan</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-300 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div
              onClick={() => setRememberMe(v => !v)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                rememberMe
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-300 group-hover:border-emerald-400'
              }`}
            >
              {rememberMe && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
              Ingat e-mel saya
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs font-bold text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Sedang Log Masuk...' : 'Log Masuk'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

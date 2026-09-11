import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Headset, UserCheck, Rocket, User, Phone, Send } from 'lucide-react';
import { ENSU_WA_NUMBER } from '../lib/utils';

const steps = [
  {
    icon: MessageCircle,
    title: 'Klik Button WhatsApp',
    desc: 'Klik button WhatsApp untuk mulakan pertanyaan anda.',
  },
  {
    icon: Headset,
    title: 'Terus Ke Pegawai Pemasaran',
    desc: 'Anda akan terus dihubungkan dengan Pegawai Pemasaran Ensu Life Sciences yang aktif 24 jam.',
  },
  {
    icon: UserCheck,
    title: 'Isi Nama & No. Telefon',
    desc: 'Masukkan nama dan nombor telefon anda sebelum klik button hantar.',
  },
  {
    icon: Rocket,
    title: 'Mulakan Langkah Pertama Anda',
    desc: 'Berbincang dengan team kami dan mulakan langkah pertama untuk membina produk jenama anda.',
  },
];

export const ClosingCTA = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || 'Tanpa Nama';
    const trimmedPhone = phone.trim() || 'Tanpa No Telefon';
    const message = `Salam Sejahtera, saya ${trimmedName} (${trimmedPhone}) berminat untuk buat produk jenama sendiri di Kilang Ensu`;
    const url = `https://wa.me/${ENSU_WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative bg-oem-dark py-20 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Hubungi Kami</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight leading-[1.05] mb-4">
            Bersama Membina
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
              Produk Jenama Anda
            </span>
          </h2>
          <p className="text-sm md:text-base text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
            Empat langkah mudah untuk mulakan perbualan dengan pegawai pemasaran kami di WhatsApp.
          </p>
        </motion.div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-14 md:mb-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-6 md:p-8 h-full flex flex-col transition-all duration-500 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-2">
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[11px] font-black shadow-lg shadow-emerald-500/30 z-10">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/15 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-emerald-500 group-hover:scale-110">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 transition-colors duration-300 group-hover:text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight leading-tight mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-[13px] text-white/40 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lead Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight mb-2">
                Isi Sekarang, Kami Hubungi Anda
              </h3>
              <p className="text-xs md:text-sm text-white/40 font-medium leading-relaxed">
                Masukkan nama dan nombor telefon anda, kemudian tekan butang hantar untuk terus ke WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50">
                  <User className="w-3 h-3" />
                  Nama
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama anda"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50">
                  <Phone className="w-3 h-3" />
                  No. Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="cth: 0123456789"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-emerald-500/30"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                Hantar ke WhatsApp
              </button>
            </form>

            <p className="text-center text-[10px] text-white/25 font-bold uppercase tracking-widest mt-5">
              Aktif 24 Jam · Respon Pantas
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

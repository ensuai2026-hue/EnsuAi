import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Factory, Dna, Target, Rocket, Fingerprint, Star, CircleCheck as CheckCircle, Scan } from 'lucide-react';

interface HomePageProps {
  onStartDiagnosis: () => void;
}

export const HomePage = ({ onStartDiagnosis }: HomePageProps) => {
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyBtn(heroBottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-oem-light min-h-screen">
      {/* Sticky Scan DNA Button */}
      <motion.div
        initial={false}
        animate={{ opacity: showStickyBtn ? 1 : 0, y: showStickyBtn ? 0 : 20, pointerEvents: showStickyBtn ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={onStartDiagnosis}
          className="flex items-center gap-3 bg-oem-dark text-white px-6 py-4 rounded-2xl shadow-2xl shadow-oem-dark/30 hover:bg-oem-primary transition-all duration-300 group"
        >
          <Scan className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
          <span className="text-[11px] font-black uppercase tracking-widest">Scan DNA</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Lab background"
            className="w-full h-full object-cover opacity-[0.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-oem-light via-oem-light/98 to-emerald-50/60" />
        </div>

        {/* Blobs */}
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[0%] w-[350px] h-[350px] bg-emerald-50/60 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4">
                <span className="pill-container text-[9px]">Platform AI Jenama Malaysia #1</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-oem-dark uppercase leading-[0.93] tracking-tight mb-5">
                Kilang OEM<br />
                Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Formula</span><br />
                Saintis.
              </h1>

              <p className="text-sm md:text-base text-oem-dark/40 leading-relaxed font-medium mb-7 max-w-xl">
                20+ Tahun Kepakaran OEM
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={onStartDiagnosis} className="btn-organic group">
                  Scan DNA Produk <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button className="btn-outline px-8 py-3.5 text-[10px]">
                  Ketahui Lebih Lanjut
                </button>
              </div>

              {/* Stats inline */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-emerald-100">
                {[
                  { value: '1,200+', label: 'Founder Aktif' },
                  { value: '98%', label: 'Aura Match Rate' },
                  { value: 'RM 2.4B', label: 'Pasaran Dijana' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-xl md:text-2xl lg:text-3xl font-extrabold text-oem-dark tracking-tight">{stat.value}</div>
                    <div className="text-[9px] font-bold text-oem-dark/30 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Saintis Ensu */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-6 left-4 lg:left-0 z-20 bg-white border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xl max-w-[220px]"
              >
                <p className="text-[11px] font-bold text-oem-dark leading-snug">
                  "Saya Saintis Ensu — pakar DNA jenama anda!"
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                </div>
              </motion.div>

              {/* Character */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-emerald-300/25 rounded-[3rem] blur-3xl scale-90 translate-y-8 pointer-events-none" />

                <div className="relative w-72 h-[420px] lg:w-80 lg:h-[460px]">
                  <img
                    src="/ChatGPT_Image_May_23,_2026,_10_48_53_AM.png"
                    alt="Saintis Formula OEM"
                    className="w-full h-full object-cover object-top rounded-[3rem] shadow-2xl shadow-emerald-200/50 border border-white/80"
                  />
                  {/* Name badge */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-oem-dark/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl flex items-center gap-2">
                    <Dna className="w-3.5 h-3.5 text-emerald-400" />
                    Saintis Ensu
                    <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full ml-1">AI</span>
                  </div>

                  {/* Floating badge: certified */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="absolute top-8 -right-4 bg-white border border-emerald-100 rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      <div>
                        <div className="text-[10px] font-black text-oem-dark uppercase tracking-tight">Certified</div>
                        <div className="text-[8px] text-oem-dark/30 font-bold tracking-widest">DNA Expert</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating badge: scan count */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="absolute bottom-24 -left-6 bg-oem-dark text-white rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">1,200+ Scan</div>
                    <div className="text-[8px] text-white/40 font-bold mt-0.5">Berjaya dilakukan</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* About Company Section */}
      <section className="py-28 md:py-40 oem-grid relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: Image collage */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Team"
                    className="w-full h-56 object-cover rounded-3xl shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Lab"
                    className="w-full h-36 object-cover rounded-3xl shadow-lg"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Research"
                    className="w-full h-36 object-cover rounded-3xl shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=500"
                    alt="Innovation"
                    className="w-full h-56 object-cover rounded-3xl shadow-lg"
                  />
                </div>
              </div>

              {/* Floating company badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white border border-emerald-100 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-4 whitespace-nowrap">
                <div className="w-10 h-10 bg-oem-primary rounded-xl flex items-center justify-center shadow-md">
                  <Factory className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-oem-dark uppercase tracking-tight">Ensu.AI Smart Foundry</div>
                  <div className="text-[9px] text-oem-dark/30 font-bold tracking-widest">Est. 2024 · Kuala Lumpur, MY</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="pill-container text-[9px] mb-6 inline-block">Tentang Kami</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-oem-dark uppercase leading-[0.95] tracking-tight mb-8">
                Kami Bukan<br />
                Sekadar<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Kilang Produk.</span>
              </h2>
              <p className="text-base text-oem-dark/40 leading-relaxed font-medium mb-6">
                Ensu.AI adalah platform AI pertama di Malaysia yang menggabungkan analisis personaliti mendalam dengan teknologi formulasi produk untuk membantu founder membina jenama yang <strong className="text-oem-dark">tulen dan bermakna</strong>.
              </p>
              <p className="text-base text-oem-dark/40 leading-relaxed font-medium mb-10">
                Kami percaya bahawa setiap produk yang berjaya bermula dari kefahaman mendalam tentang siapa pengasasnya. DNA anda adalah rahsia terbesar jenama anda.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Diagnosis AI personaliti founder yang komprehensif',
                  'Padanan produk berdasarkan DNA dan karakter unik',
                  'Sokongan penuh dari formulasi hingga pelancaran',
                  'Rangkaian kilang OEM tempatan terpercaya',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-oem-dark/60 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={onStartDiagnosis} className="btn-organic group">
                Cuba Scan DNA Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-36 bg-white relative overflow-hidden">
        <div className="absolute inset-0 oem-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="pill-container text-[9px] mb-6 inline-block">Proses Kami</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-oem-dark uppercase leading-[0.95] tracking-tight">
              Macam Mana<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Ia Berfungsi?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Fingerprint, step: '01', title: 'Scan DNA', desc: 'Jawab soalan personaliti mendalam yang direka oleh pakar psikologi dan branding.' },
              { icon: Dna, step: '02', title: 'Analisis AI', desc: 'AI kami menganalisis pola unik anda dan mengekstrak "DNA jenama" tersembunyi.' },
              { icon: Target, step: '03', title: 'Padanan Produk', desc: 'Sistem mencadangkan kategori dan formulasi produk yang paling sesuai dengan aura anda.' },
              { icon: Rocket, step: '04', title: 'Launch Jenama', desc: 'Dari formulasi ke kilang ke pasaran — kami temani setiap langkah perjalanan anda.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="organic-card p-8 group"
              >
                <div className="text-[9px] font-black text-oem-primary/30 uppercase tracking-[0.4em] mb-6">{item.step}</div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-oem-primary mb-6 group-hover:bg-oem-primary group-hover:text-white transition-all duration-500">
                  <item.icon size={22} />
                </div>
                <h3 className="text-xl font-extrabold text-oem-dark uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-sm text-oem-dark/40 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Testimonials */}
      <section className="py-24 md:py-36 oem-grid relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="pill-container text-[9px] mb-6 inline-block">Founder Berjaya</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-oem-dark uppercase leading-[0.95] tracking-tight">
              Mereka Dah<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">Buktikan.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Aishah Razali',
                role: 'Founder, Glow.MY',
                avatar: 'https://i.pravatar.cc/150?u=aishah1',
                quote: 'Scan DNA Ensu bagi aku clarity yang aku tak pernah dapat dari mana-mana consultant. Produk aku sekarang betul-betul rasa macam "aku".',
                product: 'Skincare Organik',
              },
              {
                name: 'Hafizuddin Malik',
                role: 'Founder, NeuroBody',
                avatar: 'https://i.pravatar.cc/150?u=hafiz22',
                quote: 'Dalam masa 2 minggu je, Ensu.AI dah tolong aku kenal pasti niche produk yang sesuai dengan personaliti aku. Luar biasa.',
                product: 'Suplemen Kesihatan',
              },
              {
                name: 'Nurul Farhana',
                role: 'Founder, AuraScent',
                avatar: 'https://i.pravatar.cc/150?u=nurul33',
                quote: 'Proses diagnosis sangat fun tapi meaningful. Dapat tahu karakter bisnes aku yang sebenar dan macam mana nak differentiate diri.',
                product: 'Fragrance & Perfume',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="organic-card p-8 flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  ))}
                </div>
                <p className="text-sm text-oem-dark/60 font-medium leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="pt-4 border-t border-emerald-50 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100" />
                  <div>
                    <div className="text-[11px] font-black text-oem-dark uppercase tracking-tight">{t.name}</div>
                    <div className="text-[9px] text-oem-primary font-bold tracking-widest">{t.role}</div>
                  </div>
                  <div className="ml-auto bg-emerald-50 text-emerald-600 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{t.product}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-oem-dark" />
        <div className="absolute inset-0 oem-grid opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="pill-container text-[9px] mb-8 inline-block border-emerald-800 bg-emerald-900/30 text-emerald-400">
              Mulakan Perjalanan Anda
            </span>
            <h2 className="text-4xl md:text-7xl font-extrabold text-white uppercase leading-[0.92] tracking-tight mb-8">
              Inject Produk<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Dengan DNA.</span>
            </h2>
            <p className="text-base md:text-lg text-white/30 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
              Lebih 1,200 founder dah scan DNA bisnes mereka. Masa untuk kau kenal diri kau sendiri dan bina jenama yang betul-betul hidup.
            </p>
            <div className="flex justify-center">
              <button onClick={onStartDiagnosis} className="btn-organic group text-sm px-12 py-5">
                Scan DNA Sekarang — Percuma <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-[9px] font-bold text-white/20 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> Percuma</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> Tiada Kad Kredit</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-500" /> Hasil Serta-Merta</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

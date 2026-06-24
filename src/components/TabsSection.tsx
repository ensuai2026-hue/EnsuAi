import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, FlaskConical, Images, Award, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

type TabKey = 'background' | 'scientists' | 'gallery';

interface Scientist {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  expertise: string;
  display_order: number;
}

interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  category: string;
  display_order: number;
}

const TABS: { key: TabKey; label: string; icon: typeof Building2 }[] = [
  { key: 'background', label: 'Background Kami', icon: Building2 },
  { key: 'scientists', label: 'Saintis Kami', icon: FlaskConical },
  { key: 'gallery', label: 'Galeri', icon: Images },
];

export const TabsSection = () => {
  const [active, setActive] = useState<TabKey>('background');
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [sci, gal] = await Promise.all([
        supabase.from('scientists').select('*').order('display_order', { ascending: true }),
        supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
      ]);
      if (cancelled) return;
      if (!sci.error && sci.data) setScientists(sci.data as Scientist[]);
      if (!gal.error && gal.data) setGallery(gal.data as GalleryItem[]);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-oem-light relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="pill-container text-[9px]">Kenali Ensu</span>
          <h2 className="mt-5 text-4xl md:text-6xl font-extrabold text-oem-dark uppercase tracking-tight leading-[1.05]">
            Lebih daripada<br className="hidden md:block" /> sebuah <span className="text-oem-primary">kilang.</span>
          </h2>
          <p className="mt-5 text-sm md:text-base text-oem-dark/40 font-medium max-w-xl mx-auto">
            Kami adalah pasukan saintis, makmal, dan visi yang membantu founder Malaysia membina jenama ikonik.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`group relative flex items-center gap-2 px-5 md:px-7 py-3 md:py-3.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'bg-oem-dark text-white shadow-lg shadow-oem-dark/20 scale-[1.02]'
                    : 'bg-white text-oem-dark/60 border border-emerald-100 hover:border-emerald-300 hover:text-oem-dark'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? 'text-emerald-400' : 'text-oem-primary/70'}`} />
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator-dot"
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === 'background' && <BackgroundPanel />}
            {active === 'scientists' && <ScientistsPanel scientists={scientists} loading={loading} />}
            {active === 'gallery' && <GalleryPanel gallery={gallery} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const BackgroundPanel = () => {
  const pillars = [
    { icon: Award, title: '20+ Tahun Pengalaman', desc: 'Kepakaran OEM dalam formulasi produk penjagaan kulit dan kosmeseutikal premium.' },
    { icon: Leaf, title: 'Bahan Tempatan', desc: 'Mengutamakan ekstrak botani Malaysia dan bioaktif tropika dalam setiap formulasi.' },
    { icon: ShieldCheck, title: 'Sijil & Kepatuhan', desc: 'Patuh GMP, dengan pensijilan halal dan piawaian antarabangsa untuk eksport.' },
    { icon: Sparkles, title: 'Inovasi DNA', desc: 'Pelopor pendekatan "Inject DNA Founder" yang menggabungkan sains dengan personaliti.' },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
      <div className="lg:col-span-2 organic-card p-8 md:p-10 bg-white border border-emerald-50">
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-emerald-50">
          <img
            src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1000"
            alt="Latar belakang Ensu"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary/60">Cerita Kami</span>
        <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-oem-dark uppercase leading-tight">
          Dari makmal kecil ke <span className="text-oem-primary">visi besar.</span>
        </h3>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="organic-card p-8 md:p-10 bg-white border border-emerald-50">
          <p className="text-sm md:text-base text-oem-dark/70 font-medium leading-relaxed">
            Ensu lahir daripada satu pemerhatian mudah - terlalu banyak jenama Malaysia kelihatan sama.
            Botol yang serupa, formula yang generic, cerita yang boleh ditukar ganti. Kami percaya
            jenama yang ikonik bermula dari personaliti unik foundernya.
          </p>
          <p className="mt-4 text-sm md:text-base text-oem-dark/70 font-medium leading-relaxed">
            Sejak 20+ tahun, kilang kami telah membantu lebih 1,200 founder mengubah idea menjadi
            produk yang dijual di pasaran tempatan dan antarabangsa. Kini, dengan pendekatan
            "Inject DNA Founder" berasaskan AI, kami pergi lebih jauh - membantu setiap botol
            membawa cerita pemiliknya.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-white border border-emerald-50 rounded-3xl p-6 hover:border-emerald-200 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-500"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 text-oem-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-oem-dark uppercase tracking-tight mb-1.5">{p.title}</h4>
                <p className="text-xs text-oem-dark/50 font-medium leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScientistsPanel = ({ scientists, loading }: { scientists: Scientist[]; loading: boolean }) => {
  if (loading && scientists.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Memuatkan saintis...</div>;
  }
  if (!loading && scientists.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Belum ada saintis dipaparkan.</div>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
      {scientists.map((s, idx) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.08 }}
          className="group bg-white border border-emerald-50 rounded-[2rem] overflow-hidden hover:border-emerald-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(16,185,129,0.2)] transition-all duration-500"
        >
          <div className="aspect-[4/5] overflow-hidden bg-emerald-50 relative">
            {s.image_url ? (
              <img
                src={s.image_url}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-oem-primary/30">
                <FlaskConical className="w-10 h-10" />
              </div>
            )}
            {s.expertise && (
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-oem-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                {s.expertise}
              </div>
            )}
          </div>
          <div className="p-5 md:p-6">
            <h4 className="text-base font-extrabold text-oem-dark uppercase tracking-tight leading-tight">{s.name}</h4>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-oem-primary">{s.role}</p>
            {s.bio && <p className="mt-3 text-xs text-oem-dark/50 font-medium leading-relaxed">{s.bio}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const GalleryPanel = ({ gallery, loading }: { gallery: GalleryItem[]; loading: boolean }) => {
  if (loading && gallery.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Memuatkan galeri...</div>;
  }
  if (!loading && gallery.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Belum ada gambar dalam galeri.</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {gallery.map((g, idx) => {
        const isLarge = idx % 5 === 0;
        return (
          <motion.figure
            key={g.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-emerald-50 ${
              isLarge ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
            }`}
          >
            <img
              src={g.image_url}
              alt={g.title || g.caption || 'Galeri Ensu'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oem-dark/70 via-oem-dark/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {(g.title || g.caption) && (
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                {g.category && (
                  <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300 mb-1.5">
                    {g.category}
                  </span>
                )}
                {g.title && <h5 className="text-sm md:text-base font-extrabold text-white uppercase tracking-tight leading-tight">{g.title}</h5>}
                {g.caption && <p className="mt-1 text-[11px] text-white/70 font-medium leading-snug">{g.caption}</p>}
              </figcaption>
            )}
          </motion.figure>
        );
      })}
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, FlaskConical, Images, Award, Handshake, Factory, Microscope, UserRound, Sparkles, X, ChevronRight } from 'lucide-react';
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

interface BackgroundItem {
  id: string;
  section: string;
  name: string;
  subtitle: string;
  description: string;
  image_url: string;
  accent_color: string;
  display_order: number;
}

const TABS: { key: TabKey; label: string; icon: typeof Building2 }[] = [
  { key: 'background', label: 'Background Kami', icon: Building2 },
  { key: 'scientists', label: 'Saintis Kami', icon: FlaskConical },
  { key: 'gallery', label: 'Galeri', icon: Images },
];

export const TabsSection = ({ initialTab }: { initialTab?: TabKey } = {}) => {
  const [active, setActive] = useState<TabKey>(initialTab ?? 'background');
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [backgroundItems, setBackgroundItems] = useState<BackgroundItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTab) setActive(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [sci, gal, bg] = await Promise.all([
        supabase.from('scientists').select('*').order('display_order', { ascending: true }),
        supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
        supabase.from('background_items').select('*').order('display_order', { ascending: true }),
      ]);
      if (cancelled) return;
      if (!sci.error && sci.data) setScientists(sci.data as Scientist[]);
      if (!gal.error && gal.data) setGallery(gal.data as GalleryItem[]);
      if (!bg.error && bg.data) setBackgroundItems(bg.data as BackgroundItem[]);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="tabs-section" className="py-20 md:py-28 bg-oem-light relative">
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
            {active === 'background' && <BackgroundPanel items={backgroundItems} loading={loading} />}
            {active === 'scientists' && <ScientistsPanel scientists={scientists} loading={loading} />}
            {active === 'gallery' && <GalleryPanel gallery={gallery} loading={loading} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const BackgroundPanel = ({ items, loading }: { items: BackgroundItem[]; loading: boolean }) => {
  const grouped = useMemo(() => {
    const map: Record<string, BackgroundItem[]> = {
      about: [],
      'about-stat': [],
      certification: [],
      partner: [],
      factory: [],
      lab: [],
      specialist: [],
    };
    for (const it of items) {
      if (map[it.section]) map[it.section].push(it);
    }
    return map;
  }, [items]);

  if (loading && items.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Memuatkan kandungan...</div>;
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <BackgroundSection
        number="01"
        icon={Sparkles}
        title="Tentang Kami"
        subtitle="Cerita di sebalik Ensu - dari makmal kecil ke visi besar."
      >
        <AboutBlock items={grouped.about} stats={grouped['about-stat']} />
      </BackgroundSection>

      <BackgroundSection
        number="02"
        icon={Award}
        title="Pensijilan"
        subtitle="Standard kualiti, keselamatan, dan kepatuhan industri."
      >
        <LogoGrid items={grouped.certification} variant="cert" />
      </BackgroundSection>

      <BackgroundSection
        number="03"
        icon={Handshake}
        title="Rakan Strategik"
        subtitle="Institusi & agensi yang membantu kami berkembang."
      >
        <LogoGrid items={grouped.partner} variant="partner" />
      </BackgroundSection>

      <BackgroundSection
        number="04"
        icon={Factory}
        title="Kilang di Malaysia"
        subtitle="Tiga kemudahan pengeluaran berlesen di Malaysia."
      >
        <PhotoCardGrid items={grouped.factory} aspect="aspect-[4/3]" cols="md:grid-cols-3" />
      </BackgroundSection>

      <BackgroundSection
        number="05"
        icon={Microscope}
        title="Makmal Penyelidikan"
        subtitle="Makmal dalaman untuk formulasi dan analisis."
      >
        <PhotoCardGrid items={grouped.lab} aspect="aspect-[4/3]" cols="md:grid-cols-2" />
      </BackgroundSection>

      <BackgroundSection
        number="06"
        icon={UserRound}
        title="Saintis Kami"
        subtitle=" "
      >
        <PhotoCardGrid items={grouped.specialist} aspect="aspect-[3/4]" cols="md:grid-cols-2 lg:grid-cols-4" portrait />
      </BackgroundSection>
    </div>
  );
};

const AboutBlock = ({ items, stats }: { items: BackgroundItem[]; stats: BackgroundItem[] }) => {
  if (items.length === 0 && stats.length === 0) {
    return <div className="text-xs text-oem-dark/40 font-medium">Belum ada kandungan.</div>;
  }
  const hero = items[0];
  const rest = items.slice(1);

  return (
    <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
      {hero && (
        <div className="lg:col-span-2 organic-card p-6 md:p-8 bg-white border border-emerald-50 flex flex-col">
          {hero.image_url && (
            <div className="aspect-[4/5] rounded-[1.75rem] overflow-hidden mb-6 bg-emerald-50">
              <img src={hero.image_url} alt={hero.name} className="w-full h-full object-cover" />
            </div>
          )}
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary/60">{hero.subtitle || 'Cerita Kami'}</span>
          <h4 className="mt-2 text-xl md:text-2xl font-extrabold text-oem-dark uppercase leading-tight">
            {hero.name}
          </h4>
          {hero.description && (
            <p className="mt-3 text-sm text-oem-dark/65 font-medium leading-relaxed">{hero.description}</p>
          )}
        </div>
      )}

      <div className="lg:col-span-3 flex flex-col gap-5">
        {rest.map((item) => (
          <div key={item.id} className="organic-card p-6 md:p-8 bg-white border border-emerald-50">
            {item.subtitle && (
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary/60">{item.subtitle}</span>
            )}
            <h4 className="mt-2 text-lg md:text-xl font-extrabold text-oem-dark uppercase leading-tight">{item.name}</h4>
            {item.description && (
              <p className="mt-3 text-sm text-oem-dark/65 font-medium leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}

        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {stats.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-emerald-50 rounded-2xl p-4 md:p-5 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-500"
              >
                <div
                  className="text-2xl md:text-3xl font-black tracking-tight"
                  style={{ color: s.accent_color || '#0f172a' }}
                >
                  {s.name}
                </div>
                <div className="mt-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-oem-dark">
                  {s.subtitle}
                </div>
                {s.description && (
                  <p className="mt-1.5 text-[11px] text-oem-dark/50 font-medium leading-snug">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BackgroundSection = ({
  number,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  number: string;
  icon: typeof Award;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className="flex items-start gap-5 mb-8 md:mb-10">
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-oem-dark text-white flex items-center justify-center shadow-lg shadow-oem-dark/10">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
        </div>
        <div className="flex-1">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-oem-primary/60">Fasa {number}</span>
          <h3 className="mt-1 text-2xl md:text-4xl font-extrabold text-oem-dark uppercase tracking-tight leading-tight">
            {title}
          </h3>
          <p className="mt-2 text-xs md:text-sm text-oem-dark/45 font-medium max-w-2xl">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const LogoGrid = ({ items, variant }: { items: BackgroundItem[]; variant: 'cert' | 'partner' }) => {
  if (items.length === 0) {
    return <div className="text-xs text-oem-dark/40 font-medium">Belum ada item.</div>;
  }
  return (
    <div className={`grid gap-4 md:gap-5 ${variant === 'cert' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="group relative bg-white border border-emerald-50 rounded-3xl p-5 md:p-6 hover:border-emerald-200 hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center min-h-[170px] justify-center"
        >
          {item.image_url ? (
            <div className="w-20 h-20 md:w-24 md:h-24 mb-4 flex items-center justify-center">
              <img
                src={item.image_url}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 text-white font-extrabold text-lg shadow-md"
              style={{ backgroundColor: item.accent_color || '#0f172a' }}
            >
              {logoInitials(item.name)}
            </div>
          )}
          <h4 className="text-[11px] md:text-xs font-extrabold text-oem-dark uppercase tracking-tight leading-tight">
            {item.name}
          </h4>
          {item.subtitle && (
            <p className="mt-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-oem-dark/40 leading-snug">
              {item.subtitle}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const PhotoCardGrid = ({
  items,
  aspect,
  cols,
  portrait = false,
}: {
  items: BackgroundItem[];
  aspect: string;
  cols: string;
  portrait?: boolean;
}) => {
  if (items.length === 0) {
    return <div className="text-xs text-oem-dark/40 font-medium">Belum ada item.</div>;
  }
  return (
    <div className={`grid gap-5 md:gap-6 ${cols}`}>
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.06 }}
          className="group bg-white border border-emerald-50 rounded-[2rem] overflow-hidden hover:border-emerald-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(16,185,129,0.25)] transition-all duration-500"
        >
          <div className={`${aspect} overflow-hidden bg-emerald-50 relative`}>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-oem-primary/30">
                <Factory className="w-10 h-10" />
              </div>
            )}
            {item.subtitle && !portrait && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-oem-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                {item.subtitle}
              </div>
            )}
          </div>
          <div className="p-5 md:p-6">
            <h4 className={`font-extrabold text-oem-dark uppercase tracking-tight leading-tight ${portrait ? 'text-sm' : 'text-base md:text-lg'}`}>
              {item.name}
            </h4>
            {item.subtitle && (
              <p className="mt-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-oem-primary">
                {item.subtitle}
              </p>
            )}
            {item.description && (
              <p className="mt-3 text-xs text-oem-dark/55 font-medium leading-relaxed">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const logoInitials = (name: string) => {
  const cleaned = name.trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return parts
    .slice(0, 3)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
};

const ScientistsPanel = ({ scientists, loading }: { scientists: Scientist[]; loading: boolean }) => {
  const [selected, setSelected] = useState<Scientist | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading && scientists.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Memuatkan saintis...</div>;
  }
  if (!loading && scientists.length === 0) {
    return <div className="text-center text-sm text-oem-dark/40 font-medium py-16">Belum ada saintis dipaparkan.</div>;
  }
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
        {scientists.map((s, idx) => (
          <motion.button
            key={s.id}
            onClick={() => setSelected(s)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="group text-left bg-white border border-emerald-50 rounded-[2rem] overflow-hidden hover:border-emerald-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(16,185,129,0.25)] transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="aspect-[4/3] overflow-hidden bg-emerald-50 relative">
              {s.image_url ? (
                <img
                  src={s.image_url}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
              <div className="absolute inset-0 bg-gradient-to-t from-oem-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-md">
                <ChevronRight className="w-4 h-4 text-oem-primary" />
              </div>
            </div>
            <div className="p-5 md:p-6">
              <h4 className="text-base font-extrabold text-oem-dark uppercase tracking-tight leading-tight group-hover:text-oem-primary transition-colors duration-300">{s.name}</h4>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-oem-primary">{s.role}</p>
              {s.bio && <p className="mt-3 text-xs text-oem-dark/50 font-medium leading-relaxed line-clamp-2">{s.bio}</p>}
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-oem-primary/60 group-hover:text-oem-primary transition-colors duration-300">
                <span>Lihat Profil</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-oem-dark/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === overlayRef.current) setSelected(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-emerald-100 flex items-center justify-center hover:bg-oem-primary hover:text-white hover:border-oem-primary transition-all duration-300 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Hero image */}
              <div className="aspect-[16/7] overflow-hidden bg-emerald-50 relative">
                {selected.image_url ? (
                  <img
                    src={selected.image_url}
                    alt={selected.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-oem-primary/20">
                    <FlaskConical className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                {selected.expertise && (
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur text-oem-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    {selected.expertise}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-7 md:px-10 pb-10 -mt-6 relative">
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary/60 mb-2">{selected.role}</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-oem-dark uppercase tracking-tight leading-tight mb-5">
                  {selected.name}
                </h3>
                {selected.bio && (
                  <p className="text-sm text-oem-dark/65 font-medium leading-relaxed">
                    {selected.bio}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

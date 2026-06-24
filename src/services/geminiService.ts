const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kie-proxy`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

async function kieChat(messages: { role: string; content: string }[], jsonMode = false, model = 'gemini-2.5-flash'): Promise<string> {
  const body: Record<string, unknown> = {
    model,
    messages,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`KIE API error ${res.status}: ${err}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`KIE error: ${data.error}`);
  }

  return data.choices?.[0]?.message?.content || '';
}

export interface ProductRecommendation {
  name: string;
  description: string;
  sellingPoints: string[];
  matchPercentage: number;
  targetAudience: string;
  estimatedMarketValue: string;
}

export interface PersonalityProfile {
  characterTraits: string[];
  personalityType: string;
  fullDiagnosis: string;
  entrepreneurStyle: string;
  creativeVision: string;
  strategies: string[];
  salesAdvisorReport: string;
  recommendations: ProductRecommendation[];
}

const ENSU_CATALOG = `KATALOG PRODUK ENSU LIFESCIENCES — SENARAI MUKTAMAD (HANYA nama produk dalam senarai ini SAHAJA yang boleh dicadangkan. Tiada lain.):

SKINCARE: Face cleanser | Makeup remover | Scrub | Toner | Serum | Ampoule serum | Mask | Facial mask | Eye serum | Eye gel | Eye cream | Essence | Face mist | Moisturizer | Cream | Lotion | Sunscreen

PERSONAL CARE: Body shampoo | Hair shampoo | Hair conditioner | Body scrub | Body balm | Body butter | Whitening lotion | Hair serum | Hair tonic | Hair perfume | Massage oil | Massage balm

BAR SOAP / SABUN: Whitening bar soap | Turmeric bar soap | Neem bar soap | Mix herbs bar soap | Ginger bar soap | Maternity bar soap

SLIMMING / BODY CARE: Slimming lotion | Slimming serum | Slimming cream | Slimming gel

BABY CARE: Baby head to toe | Baby hair shampoo | Baby oil | Baby balm | Baby cream | Baby sunscreen | Nappy cream | Baby lotion | Baby powder

COLOUR COSMETICS / MAKEUP: Lip cream | Lip matte | Lip gloss | Lip tint | Lip mud | Lip stain | Lip oil | Lipstick | Lip balm | Collagen lipstick | Blusher stick | Blusher cream | Blusher liquid | Blusher mousse | Primer | Eyeshadow cream | Eyeshadow hot pour | Eyeshadow liquid | Eyeliner gel | Eyeliner liquid | Mascara | Foundation drop | Foundation liquid | Foundation mousse | Foundation stick | Foundation cream | Concealer | BB cream | CC cream | DD cream | EE cream | FF cream with SPF | Highlighter

BOTANICAL BEVERAGE / MINUMAN KESIHATAN: Mind juice | Women juice | Healthy juice | Slimming juice | Premix coffee | Premix tea | Detox powder | Slimming powder | Whitening powder | Healthy powder | Powder kemam | Protein powder | Fiber drink | Instant jelly | Gummies | Chewable tablet | Meal replacement

READY-TO-EAT FOOD: Aneka sambal | Aneka muruku | Aneka kuih | Biskut raya | Produk perencah | Seasoning product | Food paste | Thai sauce

PERATURAN KETAT (WAJIB DIPATUHI SETIAP MASA):
- Sebelum cadang mana-mana produk, semak dulu: adakah nama produk tersebut wujud TEPAT dalam senarai di atas? Kalau tidak ada — JANGAN cadangkan.
- JANGAN reka nama produk baru, JANGAN gabung nama produk sendiri, JANGAN tambah kategori baru.
- JANGAN claim produk boleh merawat atau menyembuhkan penyakit. Guna: "membantu rutin penjagaan badan", "sesuai untuk rutin wellness harian".
- JANGAN guna "confirm kurus", "hilang lemak cepat", "turun berat dijamin".
- Kalau user minta produk yang TIADA dalam senarai: "Buat masa ni saya hanya boleh cadangkan produk dalam katalog kami. Pilihan paling hampir ialah…" — lepas tu pilih nama yang ADA dalam senarai.
- Maksimum 3-5 produk per cadangan.`;

const SCIENTIST_SYSTEM_PROMPT = `Kau adalah "Ensu Saintis" dari ENSU LIFESCIENCES. Kau borak macam kawan rapat — santai, chill, direct. Macam WhatsApp je.

GAYA WAJIB:
- Bahasa Melayu slang harian. Contoh: "eh", "kan", "weh", "best tu", "okay cool", "haa", "serious?", "oklah"
- Ayat PENDEK. Max 2-3 ayat setiap balas.
- SATU soalan je setiap kali. Jangan tanya banyak sekaligus.
- Guna gelaran + nama diorang bila dah tahu (contoh: "Dr. Amir", "Datuk Farid", "Datin Sri Nora", "Haji Razif"). Kalau tiada gelaran, guna nama biasa je. PENTING: Guna TEPAT gelaran yang user pilih/sebut — JANGAN teka atau tukar jantina secara automatik.
- JANGAN guna ayat formal atau bombastik macam "memandangkan", "fasa eksperimen", "bawah mikroskop", "berdaya saing" — tu semua bunyinya pelik dan tak natural.

SENARAI GELARAN YANG PERLU DETECT:
- Gelaran diraja/kehormat: Datuk, Datuk Seri, Tan Sri, Tun, Datin, Datin Seri, Puan Sri
- Gelaran profesional: Dr., Prof., Prof. Madya
- Gelaran agama: Tuan Haji, Puan Hajah, Ustaz, Ustazah
- Gelaran biasa: Encik, Puan, Cik, Tuan
- Kalau user sebut gelaran diorang dalam perbualan (contoh: "saya Dr. Siti", "Datuk Razman ni"), terus ambil dan guna sepanjang perbualan.

${ENSU_CATALOG}

FLOW BORAK (ikut order ni WAJIB):
1. Tanya nama dulu — pendek je, friendly. Contoh: "Boleh saya tahu nama anda?"
2. Lepas dapat nama, WAJIB tanya gelaran. Format jawapan MESTI persis macam ni (emoji ikut terus teks, satu baris satu pilihan, TANPA tanda sempang atau bullet lain):
👑 Tan Sri
👸 Puan Sri
🏅 Datuk / Datuk Seri
💎 Datin / Datin Seri
🩺 Dr.
🎓 Prof. / Prof. Madya
🕌 Haji
🌸 Hajah
📿 Ustaz
🌺 Ustazah
👔 Encik
👗 Puan / Cik
   Contoh ayat penuh: "Okay [Nama]! Ada gelaran rasmi ke? Pilih yang berkenaan:\n👑 Tan Sri\n👸 Puan Sri\n🏅 Datuk / Datuk Seri\n💎 Datin / Datin Seri\n🩺 Dr.\n🎓 Prof. / Prof. Madya\n🕌 Haji\n🌸 Hajah\n📿 Ustaz\n🌺 Ustazah\n👔 Encik\n👗 Puan / Cik"
   PENTING: Guna TEPAT gelaran yang user pilih — JANGAN tukar atau teka jantina. Kalau user pilih "Tan Sri", panggil "Tan Sri [Nama]" bukan "Puan Sri". Kalau user pilih "Encik", panggil "Encik [Nama]" sepanjang perbualan.
   Kalau user dah sebut gelaran dalam jawapan nama diorang (contoh: "Saya Dr. Amir"), skip soalan gelaran dan terus ke step 3.
   Lepas dapat gelaran, guna gelaran + nama sepanjang perbualan. Kalau tiada gelaran, panggil nama biasa je.
3. Tanya umur — format jawapan MESTI persis macam ni (emoji ikut terus teks, satu baris satu pilihan):
🟢 20-30 tahun
🔵 30-40 tahun
🟡 40-50 tahun
🔴 50+ tahun
   Contoh ayat penuh: "Boleh tahu [Nama] dalam lingkungan umur berapa?\n🟢 20-30 tahun\n🔵 30-40 tahun\n🟡 40-50 tahun\n🔴 50+ tahun"
4. Tanya background — kerja apa sekarang, atau pernah buat apa sebelum ni. Ini penting untuk "Note" dalam rekod.
4. Tanya followers/komuniti — ada tak? Instagram, TikTok, group ke?
5. Tanya ada idea produk ke belum.
   - Belum ada → tanya niche dulu: "Nak masuk niche apa? Skincare, makeup, personal care, baby care, supplement drink, atau makanan?" Lepas user pilih, suggest 3-5 idea produk DARI KATALOG ENSU di atas SAHAJA yang sesuai dengan DNA diorang. JANGAN suggest produk luar katalog, produk digital, app, atau perkhidmatan.
   - Dah ada → semak dulu produk tu ada dalam katalog ENSU ke tak. Kalau tiada, suggest pilihan paling hampir dari katalog. Lepas tu tanya detail: jenis produk apa (Jenis Produk), berapa SKU/unit nak buat (Kuantiti), budget lebih kurang berapa (Bajet).
   Untuk soalan KUANTITI/SKU, format jawapan MESTI persis macam ni (emoji ikut terus teks, satu baris satu pilihan):
🟢 500 pcs
🔵 1000 pcs
🟡 3000 pcs
🟠 5000 pcs
🔴 5000+ pcs
   Contoh ayat penuh: "Berapa kuantiti/SKU yang [Nama] nak buat?\n🟢 500 pcs\n🔵 1000 pcs\n🟡 3000 pcs\n🟠 5000 pcs\n🔴 5000+ pcs"
6. Selepas dah tahu produk, kuantiti & bajet, tanya no. WhatsApp diorang — cakap supaya team Ensu boleh follow up.
7. Tanya e-mel diorang — "untuk hantar full DNA report nanti".

PENTING:
- MESTI kumpul: nama, background/note, jenis produk, kuantiti, bajet, phone (WhatsApp) dan email sebelum boleh bagi laporan muktamad.
- Kalau user sebut kuantiti BAWAH 500 pcs (contoh: 100 unit, 200 botol, 300 pcs) — JANGAN terus reject. Kau kena influence diorang untuk ambil 500 pcs dengan cara ni:
  1. Acknowledge dulu — "Haa faham, nak start kecil dulu kan, bagus tu mindset tu."
  2. Explain kenapa 500 pcs makes sense — "Tapi jujur cakap, kuantiti bawah 500 tu nanti cepat je habis sebelum ada masa nak gather feedback betul-betul. 500 pcs lebih selamat — boleh test market, bagi sample, lagi ada stok untuk promote."
  3. Bagi social proof — "Ramai founder yang start dengan 500 pcs je, dah prove concept, terus reorder 1000 pcs bulan depan."
  4. Close dengan soalan — "Oklah, kita proceed 500 pcs sebagai pilot batch ye? Harga seunit pun lagi murah dengan kuantiti tu."
  5. Lepas user setuju (atau tak jawab balik), rekod kuantiti sebagai "500 pcs" dan teruskan flow.
  INGAT: Tone kena macam kawan yang genuinely nak tolong diorang berjaya, bukan macam salesman paksa jual.
- Kalau user dah bagi semua maklumat tu, boleh bagitahu diorang boleh klik "Muktamadkan" untuk tengok laporan penuh.
- Stop bila user dah klik "MUKTAMADKAN ANALISIS DNA".`;

export interface ExtractedLeadData {
  name: string | null;
  age_range: string | null;
  note: string | null;
  email: string | null;
  phone: string | null;
  niche: string | null;
  product_type: string | null;
  budget: string | null;
  quantity: string | null;
}

export async function extractLeadData(history: { role: 'user' | 'bot', content: string }[]): Promise<ExtractedLeadData> {
  const conversation = history.map(m => `${m.role === 'user' ? 'USER' : 'BOT'}: ${m.content}`).join('\n');

  const prompt = `Berdasarkan perbualan di bawah, ekstrak maklumat berikut dalam format JSON. Jika maklumat tidak ada, gunakan null.

PERBUALAN:
---
${conversation}
---

Ekstrak dengan tepat:
- name: Nama penuh pengguna (termasuk gelaran jika ada, contoh: "Dr. Siti", "Datuk Razman", "Encik Ali")
- age_range: Julat umur (contoh: "20-30", "30-40", "40-50", "50+")
- note: Ringkasan latar belakang — kerja, pengalaman, bidang, komuniti/followers (1-2 ayat pendek)
- email: Alamat emel
- phone: Nombor WhatsApp/telefon (format asal seperti yang diberikan)
- niche: Niche/kategori bisnes yang dipilih (contoh: "Skincare", "Makeup", "Personal Care", "Baby Care", "Supplement Drink", "Makanan", "Slimming") — ambil dari pilihan user semasa perbualan
- product_type: Jenis produk fizikal yang ingin dibuat (contoh: "Supplement Kolagen", "Skincare Brightening")
- budget: Bajet yang dinyatakan (contoh: "RM5,000", "RM10k-20k")
- quantity: Kuantiti/SKU yang dinyatakan (contoh: "500 unit", "1000 botol", "2 SKU")

Balas JSON sahaja, tiada markdown:
{"name":null,"age_range":null,"note":null,"email":null,"phone":null,"niche":null,"product_type":null,"budget":null,"quantity":null}`;

  try {
    const text = await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-flash');
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned) as ExtractedLeadData;
  } catch {
    return { name: null, age_range: null, note: null, email: null, phone: null, niche: null, product_type: null, budget: null, quantity: null };
  }
}

export async function chatWithScientist(history: { role: 'user' | 'bot', content: string }[]) {
  const messages = [
    { role: 'system', content: SCIENTIST_SYSTEM_PROMPT },
    ...history.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ];

  return await kieChat(messages) || "Maaf, transmisi saya terganggu. Boleh kita sambung semula?";
}

export async function diagnoseFounder(history: { role: 'user' | 'bot', content: string }[]): Promise<PersonalityProfile> {
  const fullConversation = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const prompt = `Kau adalah "Ensu Saintis" dari ENSU LIFESCIENCES. Tulis laporan DNA founder dalam bahasa Melayu yang SANTAI, RINGKAS, dan PERSONAL — macam kawan rapat cakap terus terang. Bukan laporan corporate. Bukan ayat bombastik. Reader kena rasa "eh, betul ni pasal aku."

${ENSU_CATALOG}

PERBUALAN LENGKAP:
---
${fullConversation}
---

ARAHAN ANALISIS:

**fullDiagnosis** — WAJIB pakai Markdown. WAJIB ada sub-heading: ### Karakter DNA, ### Analisis Generasi & Mindset, ### Analisis Pasaran, ### Market Value. PERATURAN WAJIB:
- PENDEK. Setiap section max 3-4 ayat pendek je.
- Bahasa santai harian. Contoh: "Kau ni jenis yang...", "Orang macam kau biasanya...", "Niche ni memang padan dengan kau sebab..."
- JANGAN guna ayat formal: "memandangkan", "analisis mendalam", "berdaya saing tinggi", "dalam era digital ini", "merintis laluan baharu".
- Kena rasa personal — guna nama atau gelaran founder dalam teks.
- Highlight 1-2 kekuatan paling unik je, bukan senarai panjang.

**estimatedMarketValue** untuk setiap produk — WAJIB guna data pasaran Malaysia yang REAL dan SPESIFIK:
- Cari data dari sumber seperti Statista, Grand View Research, Allied Market Research, laporan KKM, Euromonitor, atau kajian universiti Malaysia.
- Format: "Pasaran [kategori] Malaysia bernilai RM X bilion (2024), jangkaan capai RM Y bilion menjelang 202Z." ATAU angka global jika data Malaysia terhad.
- JANGAN tulis nilai umum macam "Bernilai tinggi" atau "Potensi besar" — kena ada ANGKA.
- Contoh yang BETUL: "Pasaran skincare Malaysia cecah RM2.8 bilion (2023), jangka tumbuh 6.2% setahun hingga 2028."
- Contoh lain: "Industri wellness drink global RM850 bilion (2023) — segmen Asia Tenggara tumbuh 8.4% p.a."

**characterTraits** — 3-5 sifat pendek, jelas, macam tag. Contoh: "Pemikir Kritis", "Storyteller Semula Jadi", "Pemimpin Organik".

**personalityType** — 3-5 perkataan. Tajam dan unik. Contoh: "The Quiet Disruptor", "Mak Cik Viral", "The Science Storyteller".

**entrepreneurStyle** — 1 ayat santai je. Describe gaya diorang buat bisnes.

**creativeVision** — 1 ayat. Apa impak besar yang diorang boleh buat.

**strategies** — 3 strategi yang PRAKTIKAL dan SPESIFIK untuk founder ni. Bukan tips generic. Kena relate dengan background, produk, dan komuniti diorang. Format: ayat pendek, action-oriented.

**recommendations** — 3 produk dari katalog ENSU SAHAJA:
- name: Nama tepat dari katalog
- description: 1-2 ayat santai kenapa produk ni "soulmate" dengan DNA founder
- sellingPoints: 3 poin pendek (max 8 patah perkataan setiap satu)
- matchPercentage: Angka realistik antara 72-97
- targetAudience: Siapa pelanggan utama (1 ayat konkrit)
- estimatedMarketValue: Data pasaran REAL dengan angka (lihat arahan di atas)

**salesAdvisorReport** — Nota dalaman untuk tim sales. Pendek, direct, dalam bahasa Melayu. Apa yang team perlu tahu untuk close founder ni?

Balas DALAM FORMAT JSON SAHAJA (tanpa markdown code block):
{
  "characterTraits": ["string"],
  "personalityType": "string",
  "fullDiagnosis": "string (markdown)",
  "entrepreneurStyle": "string",
  "creativeVision": "string",
  "strategies": ["string"],
  "salesAdvisorReport": "string",
  "recommendations": [
    {
      "name": "string",
      "description": "string",
      "sellingPoints": ["string"],
      "matchPercentage": 0,
      "targetAudience": "string",
      "estimatedMarketValue": "string"
    }
  ]
}`;

  const text = await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-pro').catch(async () => {
    return await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-flash');
  });

  const tryParse = (raw: string): PersonalityProfile | null => {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    try {
      return JSON.parse(cleaned) as PersonalityProfile;
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]) as PersonalityProfile; } catch { return null; }
      }
      return null;
    }
  };

  const parsed = tryParse(text);
  if (parsed) return parsed;

  console.error('Failed to parse KIE response, retrying with flash:', text);
  const retry = await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-flash');
  const parsedRetry = tryParse(retry);
  if (parsedRetry) return parsedRetry;

  console.error('Failed to parse KIE retry response:', retry);
  throw new Error('Gagal menganalisis profil founder. Sila cuba lagi.');
}

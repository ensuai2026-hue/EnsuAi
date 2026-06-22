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
- Guna gelaran + nama diorang bila dah tahu (contoh: "Dr. Amir", "Datuk Farid", "Datin Sri Nora", "Tuan Haji Razif"). Kalau tiada gelaran, guna nama biasa je.
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
👑 Tan Sri / Puan Sri
🏅 Datuk / Datuk Seri
💎 Datin / Datin Seri
🩺 Dr.
🎓 Prof. / Prof. Madya
🕌 Haji / Hajah
📿 Ustaz / Ustazah
✅ Tiada gelaran
   Contoh ayat penuh: "Okay [Nama]! Ada gelaran rasmi ke? Pilih yang berkenaan:\n👑 Tan Sri / Puan Sri\n🏅 Datuk / Datuk Seri\n💎 Datin / Datin Seri\n🩺 Dr.\n🎓 Prof. / Prof. Madya\n🕌 Haji / Hajah\n📿 Ustaz / Ustazah\n✅ Tiada gelaran"
   Kalau user dah sebut gelaran dalam jawapan nama diorang (contoh: "Saya Dr. Amir"), skip soalan gelaran dan terus ke step 3.
   Lepas dapat gelaran, guna gelaran + nama sepanjang perbualan. Kalau tiada gelaran, panggil nama biasa je.
3. Tanya umur — bagi pilihan: 20-30, 30-40, 40-50, 50+. Jangan explain panjang kenapa tanya.
4. Tanya background — kerja apa sekarang, atau pernah buat apa sebelum ni. Ini penting untuk "Note" dalam rekod.
4. Tanya followers/komuniti — ada tak? Instagram, TikTok, group ke?
5. Tanya ada idea produk ke belum.
   - Belum ada → tanya niche dulu: "Nak masuk niche apa? Skincare, makeup, personal care, baby care, supplement drink, atau makanan?" Lepas user pilih, suggest 3-5 idea produk DARI KATALOG ENSU di atas SAHAJA yang sesuai dengan DNA diorang. JANGAN suggest produk luar katalog, produk digital, app, atau perkhidmatan.
   - Dah ada → semak dulu produk tu ada dalam katalog ENSU ke tak. Kalau tiada, suggest pilihan paling hampir dari katalog. Lepas tu tanya detail: jenis produk apa (Jenis Produk), berapa SKU/unit nak buat (Kuantiti), budget lebih kurang berapa (Bajet).
6. Selepas dah tahu produk, kuantiti & bajet, tanya no. WhatsApp diorang — cakap supaya team Ensu boleh follow up.
7. Tanya e-mel diorang — "untuk hantar full DNA report nanti".

PENTING:
- MESTI kumpul: nama, background/note, jenis produk, kuantiti, bajet, phone (WhatsApp) dan email sebelum boleh bagi laporan muktamad.
- Kalau user sebut kuantiti BAWAH 100 pcs (contoh: 50 unit, 30 botol, 20 pcs) — JANGAN terus reject. Kau kena influence diorang untuk ambil 100 pcs dengan cara ni:
  1. Acknowledge dulu — "Haa faham, nak start kecil dulu kan, bagus tu mindset tu."
  2. Explain kenapa 100 pcs makes sense — "Tapi jujur cakap, 50 pcs tu nanti cepat je habis sebelum ada masa nak gather feedback betul-betul. 100 pcs lebih selamat — boleh test market, bagi sample, lagi ada stok untuk promote."
  3. Bagi social proof — "Ramai founder yang start dengan 100 pcs je, dah prove concept, terus reorder 500 pcs bulan depan."
  4. Close dengan soalan — "Oklah, kita proceed 100 pcs sebagai pilot batch ye? Harga pun tak jauh beza sangat."
  5. Lepas user setuju (atau tak jawab balik), rekod kuantiti sebagai "100 pcs" dan teruskan flow.
  INGAT: Tone kena macam kawan yang genuinely nak tolong diorang berjaya, bukan macam salesman paksa jual.
- Kalau user dah bagi semua maklumat tu, boleh bagitahu diorang boleh klik "Muktamadkan" untuk tengok laporan penuh.
- Stop bila user dah klik "MUKTAMADKAN ANALISIS DNA".`;

export interface ExtractedLeadData {
  name: string | null;
  age_range: string | null;
  note: string | null;
  email: string | null;
  phone: string | null;
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
- name: Nama penuh pengguna
- age_range: Julat umur (contoh: "20-30", "30-40", "40-50", "50+")
- note: Ringkasan latar belakang — kerja, pengalaman, bidang, komuniti/followers (1-2 ayat pendek)
- email: Alamat emel
- phone: Nombor WhatsApp/telefon (format asal seperti yang diberikan)
- product_type: Jenis produk fizikal yang ingin dibuat (contoh: "Supplement Kolagen", "Skincare Brightening")
- budget: Bajet yang dinyatakan (contoh: "RM5,000", "RM10k-20k")
- quantity: Kuantiti/SKU yang dinyatakan (contoh: "500 unit", "1000 botol", "2 SKU")

Balas JSON sahaja, tiada markdown:
{"name":null,"age_range":null,"note":null,"email":null,"phone":null,"product_type":null,"budget":null,"quantity":null}`;

  try {
    const text = await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-flash');
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned) as ExtractedLeadData;
  } catch {
    return { name: null, age_range: null, note: null, email: null, phone: null, product_type: null, budget: null, quantity: null };
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

  const prompt = `Anda bertindak sebagai "Ensu Saintis" dari ENSU LIFESCIENCES.

${ENSU_CATALOG}

TUGAS: Lakukan analisis "Deep Thinking" (KIE - Knowledge-Infused Extraction) yang sangat tajam berdasarkan keseluruhan perbualan ini:
---
${fullConversation}
---

PROSES ANALISIS:
1. Bedah karakter founder guna bahasa **santai, moden, dan "straight-to-the-point"**. Elakkan ayat panjang sangat.
2. Gunakan **Anggaran Umur** untuk analisis generasi dan mindset mereka — ambil point yang paling "ngam" saja.
3. Kaitkan DNA founder dengan "Life Sciences" secara logik tapi senang faham.
4. Berikan huraian **Market Value** yang realistik untuk pasaran Malaysia.
5. Rangka 3 konsep produk yang betul-betul "soulmate" dengan jiwa founder. WAJIB semak katalog di atas — HANYA gunakan nama produk yang wujud TEPAT dalam senarai katalog. Contoh nama yang betul: "Serum", "Turmeric bar soap", "Women juice", "Lip tint", "Baby balm", "Fiber drink", "Food paste". JANGAN reka nama produk sendiri yang tiada dalam senarai.
6. Rangka 3 Strategi Alpha yang praktikal dan senang buat terus.
7. Sediakan "Sales Advisor Memo" (Internal): Detail SKU, apa "pahit" pelanggan nak settlekan, dan cara nak close.

MATLAMAT OUTPUT:
Diagnosis kena nampak "profesional tapi rileks" macam kawan borak kawan. Gunakan Markdown untuk 'fullDiagnosis'.
WAJIB masukkan sub-heading: ### Karakter DNA, ### Analisis Generasi & Mindset, ### Analisis Pasaran, dan ### Market Value.

Balas DALAM FORMAT JSON SAHAJA (tanpa markdown code block) mengikut skema berikut:
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

  const text = await kieChat([{ role: 'user', content: prompt }], true, 'gemini-2.5-pro');

  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned) as PersonalityProfile;
  } catch (e) {
    console.error("Failed to parse KIE response:", text);
    throw new Error("Gagal menganalisis profil founder. Sila cuba lagi.");
  }
}

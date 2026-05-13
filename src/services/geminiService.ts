const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kie-proxy`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

async function kieChat(messages: { role: string; content: string }[], jsonMode = false): Promise<string> {
  const body: Record<string, unknown> = {
    model: 'gemini-2.5-pro',
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

const SCIENTIST_SYSTEM_PROMPT = `Anda adalah "Ensu Saintis" dari ENSU LIFESCIENCES.
Tugas anda adalah berbual secara sangat santai (macam borak dalam WhatsApp) untuk menggali DNA, personaliti, dan karakter bakal founder.

GAYA KOMUNIKASI:
- Gunakan Bahasa Melayu yang chill, friendly, dan 'modern' (macam kawan borak).
- Ayat ringkas dan padat. Elakkan nampak macam borang soal selidik.
- **WAJIB: Tanya SATU soalan sahaja pada satu masa.**
- Panggil user dengan nama mereka sebaik sahaja mereka beritahu nama.

STEP PERBUALAN (DIAGNOSIS MENDALAM):
1. **Sapaan & Nama**: Mula dengan tanya nama secara mesra.
2. **Anggaran Umur**: Terus tanya anggaran umur mereka secara ringkas dan mesra. Pilihan yang ada: 20-30, 30-40, 40-50, atau 50 ke atas. JANGAN bagi penjelasan panjang lebar kenapa anda tanya (simpan kejutan/penjelasan itu untuk fasa diagnosis nanti).
3. **Latar Belakang & Identiti**: Tanya pasal background kerja dan "siapa" mereka sebelum ini (pengalaman hidup/kerjaya).
4. **Pengaruh (Followers)**: Tanya sama ada mereka ada followers atau komuniti (influencer/key opinion leader).
5. **Status Produk**: Tanya sama ada mereka dah ada idea produk atau belum.
   - **Jika BELUM ada idea**: Anda (Saintis) akan bantu beri 3 pilihan produk yang related dengan DNA mereka.
   - **Jika DAH ada idea**: Terus minta detail teknikal seperti jenis produk, anggaran SKU (kuantiti), dan bajet yang mereka sediakan.

MATLAMAT AKHIR:
- Gunakan KIE (Knowledge-Infused Extraction) untuk faham 'vibe' founder.
- Pastikan anda tahu sama ada mereka sesuai bawa produk 'High-End Luxury', 'Mass Market', 'Tech-Driven', atau 'Nature-Based'.
- JANGAN bagi report muktamad lagi. Kumpul semua point ini dalam perbualan sampai user klik "MUKTAMADKAN ANALISIS DNA".`;

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

TUGAS: Lakukan analisis "Deep Thinking" (KIE - Knowledge-Infused Extraction) yang sangat tajam berdasarkan keseluruhan perbualan ini:
---
${fullConversation}
---

PROSES ANALISIS:
1. Bedah karakter founder guna bahasa **santai, moden, dan "straight-to-the-point"**. Elakkan ayat panjang sangat.
2. Gunakan **Anggaran Umur** untuk analisis generasi dan mindset mereka — ambil point yang paling "ngam" saja.
3. Kaitkan DNA founder dengan "Life Sciences" secara logik tapi senang faham.
4. Berikan huraian **Market Value** yang realistik untuk pasaran Malaysia.
5. Rangka 3 konsep produk yang betul-betul "soulmate" dengan jiwa founder.
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

  const text = await kieChat([{ role: 'user', content: prompt }], true);

  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned) as PersonalityProfile;
  } catch (e) {
    console.error("Failed to parse KIE response:", text);
    throw new Error("Gagal menganalisis profil founder. Sila cuba lagi.");
  }
}

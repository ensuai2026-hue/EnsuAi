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

const SCIENTIST_SYSTEM_PROMPT = `Kau adalah "Ensu Saintis" dari ENSU LIFESCIENCES. Kau borak macam kawan rapat — santai, chill, direct. Macam WhatsApp je.

GAYA WAJIB:
- Bahasa Melayu slang harian. Contoh: "eh", "kan", "weh", "best tu", "okay cool", "haa", "serious?", "oklah"
- Ayat PENDEK. Max 2-3 ayat setiap balas.
- SATU soalan je setiap kali. Jangan tanya banyak sekaligus.
- Guna nama diorang bila dah tahu.
- JANGAN guna ayat formal atau bombastik macam "memandangkan", "fasa eksperimen", "bawah mikroskop", "berdaya saing" — tu semua bunyinya pelik dan tak natural.

FLOW BORAK (ikut order ni):
1. Tanya nama dulu — pendek je, friendly.
2. Tanya umur — bagi pilihan: 20-30, 30-40, 40-50, 50+. Jangan explain panjang kenapa tanya.
3. Tanya background — kerja apa sekarang, atau pernah buat apa sebelum ni.
4. Tanya followers/komuniti — ada tak? Instagram, TikTok, group ke?
5. Tanya ada idea produk ke belum.
   - Belum ada → suggest 3 idea produk yang sesuai dengan DNA diorang.
   - Dah ada → tanya detail: jenis produk, berapa SKU nak buat, budget lebih kurang berapa.

PENTING:
- Kumpul semua info ni dulu. Jangan bagi laporan muktamad lagi.
- Stop bila user dah klik "MUKTAMADKAN ANALISIS DNA".`;

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

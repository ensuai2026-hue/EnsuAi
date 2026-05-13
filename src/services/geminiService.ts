import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

function getAI() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY tidak ditetapkan. Sila tambah GEMINI_API_KEY dalam fail .env anda.");
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
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

export async function chatWithScientist(history: { role: 'user' | 'bot', content: string }[]) {
  const contents = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config: {
      systemInstruction: `Anda adalah "Ensu Saintis" dari ENSU LIFESCIENCES. 
      Tugas anda adalah berbual secara sangat santai (macam borak dalam WhatsApp) untuk menggali DNA, personaliti, dan karakter bakal founder.
      
      GAYA KOMUNIKASI:
      - Gunakan Bahasa Melayu yang chill, friendly, dan 'modern' (macam kawan borak).
      - Ayat ringkas dan padat. Elakkan nampak macam borang soal selidik.
      - **WAJIB: Tanya SATU soalan sahaja pada satu masa.** 
      - Panggil user dengan nama mereka sebaik sahaja mereka beritahu nama.
      
      STEP PERBUALAN (DIAGNOSIS MENDALAM):
      1. **Sapaan & Nama**: Mula dengan tanya nama secara mesra.
      2. **Tarikh Lahir**: Terus tanya tarikh lahir mereka secara ringkas dan mesra (DD/MM/YYYY). JANGAN bagi penjelasan panjang lebar kenapa anda tanya (simpan kejutan/penjelasan itu untuk fasa diagnosis nanti).
      3. **Latar Belakang & Identiti**: Tanya pasal background kerja dan "siapa" mereka sebelum ini (pengalaman hidup/kerjaya).
      4. **Pengaruh (Followers)**: Tanya sama ada mereka ada followers atau komuniti (influencer/key opinion leader).
      5. **Status Produk**: Tanya sama ada mereka dah ada idea produk atau belum.
         - **Jika BELUM ada idea**: Anda (Saintis) akan bantu beri 3 pilihan produk yang related dengan DNA mereka.
         - **Jika DAH ada idea**: Terus minta detail teknikal seperti jenis produk, anggaran SKU (kuantiti), dan bajet yang mereka sediakan.
      
      MATLAMAT AKHIR:
      - Gunakan KIE (Knowledge-Infused Extraction) untuk faham 'vibe' founder.
      - Pastikan anda tahu sama ada mereka sesuai bawa produk 'High-End Luxury', 'Mass Market', 'Tech-Driven', atau 'Nature-Based'.
      - JANGAN bagi report muktamad lagi. Kumpul semua point ini dalam perbualan sampai user klik "MUKTAMADKAN ANALISIS DNA".`,
      tools: [{ googleSearch: {} }]
    }
  });

  return response.text || "Maaf, transmisi saya terganggu. Boleh kita sambung semula?";
}

export async function diagnoseFounder(history: { role: 'user' | 'bot', content: string }[]): Promise<PersonalityProfile> {
  const fullConversation = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  
  const prompt = `
  Anda bertindak sebagai "Ensu Saintis" dari ENSU LIFESCIENCES.
  
  TUGAS: Lakukan analisis "Deep Thinking" (KIE - Knowledge-Infused Extraction) yang sangat tajam berdasarkan keseluruhan perbualan ini:
  ---
  ${fullConversation}
  ---
  
  PROSES ANALISIS:
  1. Bedah karakter founder guna bahasa **santai, moden, dan "straight-to-the-point"**. Elakkan ayat panjang sangat.
  2. Gunakan **Tarikh Lahir** untuk analisis metafizik ringkas (Nombor Akar/Elemen) — ambil point yang paling "ngam" saja.
  3. Kaitkan DNA founder dengan "Life Sciences" secara logik tapi senang faham.
  4. Berikan huraian **Market Value** yang realistik untuk pasaran Malaysia.
  5. Rangka 3 konsep produk yang betul-betul "soulmate" dengan jiwa founder.
  6. Rangka 3 Strategi Alpha yang praktikal dan senang buat terus.
  7. Sediakan "Sales Advisor Memo" (Internal): Detail SKU, apa "pahit" pelanggan nak settlekan, dan cara nak close.

  MATLAMAT OUTPUT:
  Diagnosis kena nampak "profesional tapi rileks" macam kawan borak kawan. Gunakan Markdown untuk 'fullDiagnosis'. 
  WAJIB masukkan sub-heading: ### Karakter DNA, ### Analisis Metafizik, ### Analisis Pasaran, dan ### Market Value.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro-preview-05-06",
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          characterTraits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 kata kunci karakter."
          },
          personalityType: {
            type: Type.STRING,
            description: "Nama unik untuk jenis personaliti mereka."
          },
          fullDiagnosis: {
            type: Type.STRING,
            description: "Diagnosis mendalam tentang karakter and potensi founder."
          },
          entrepreneurStyle: {
            type: Type.STRING,
            description: "Gaya keusahawanan mereka."
          },
          creativeVision: {
            type: Type.STRING,
            description: "Ringkasan visi kreatif mereka."
          },
          strategies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 strategi pemasaran paling berkesan."
          },
          salesAdvisorReport: {
            type: Type.STRING,
            description: "Memo untuk Sales Advisor: Detail SKU, keinginan tersembunyi pelanggan, dan teknik 'closing'."
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Nama produk yang 'evocative'." },
                description: { type: Type.STRING, description: "Huraian ringkas produk." },
                sellingPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 poin jualan utama."
                },
                matchPercentage: { type: Type.NUMBER, description: "Peratus keserasian (0-100)." },
                targetAudience: { type: Type.STRING, description: "Siapa pelanggan produk ini." },
                estimatedMarketValue: { type: Type.STRING, description: "Anggaran nilai pasaran di Malaysia (cth: RM 500 Juta Market Value)." }
              },
              required: ["name", "description", "sellingPoints", "matchPercentage", "targetAudience", "estimatedMarketValue"]
            }
          }
        },
        required: ["characterTraits", "personalityType", "fullDiagnosis", "entrepreneurStyle", "creativeVision", "strategies", "salesAdvisorReport", "recommendations"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text) as PersonalityProfile;
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Gagal menganalisis profil founder. Sila cuba lagi.");
  }
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ExtractedLeadData, PersonalityProfile } from "../services/geminiService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ENSU_WA_NUMBER = "60133278287";

export function buildLeadWhatsAppText(
  extracted: Partial<ExtractedLeadData>,
  profile?: Pick<PersonalityProfile, "personalityType" | "entrepreneurStyle"> | null
): string {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const divider = "--------------------------------";
  const lines: string[] = [];
  lines.push("[FOUNDER]");
  lines.push(`Tarikh: ${today}`);
  lines.push(divider);
  if (extracted.name) lines.push(`Nama : ${extracted.name}`);
  if (extracted.age_range) lines.push(`Umur : ${extracted.age_range}`);
  if (extracted.note) lines.push(`Note : ${extracted.note}`);
  if (extracted.email) lines.push(`Emel : ${extracted.email}`);
  if (extracted.phone) lines.push(`WhatsApp : ${extracted.phone}`);
  lines.push(divider);
  if (extracted.niche) lines.push(`Niche : ${extracted.niche}`);
  if (extracted.product_type) lines.push(`Jenis Produk : ${extracted.product_type}`);
  if (extracted.budget) lines.push(`Bajet : ${extracted.budget}`);
  if (extracted.quantity) lines.push(`Kuantiti : ${extracted.quantity}`);
  lines.push(divider);
  if (profile?.personalityType) lines.push(`Profil DNA : ${profile.personalityType}`);
  if (profile?.entrepreneurStyle) lines.push(`Gaya : ${profile.entrepreneurStyle}`);
  return lines.join("\n");
}

export function buildLeadWhatsAppUrl(
  extracted: Partial<ExtractedLeadData>,
  profile?: Pick<PersonalityProfile, "personalityType" | "entrepreneurStyle"> | null
): string {
  return `https://wa.me/${ENSU_WA_NUMBER}?text=${encodeURIComponent(
    buildLeadWhatsAppText(extracted, profile)
  )}`;
}


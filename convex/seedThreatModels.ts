import { v } from "convex/values";
import { mutation } from "./_generated/server";

type Seed = {
  creatorProfile: string;
  mainRisks: string[];
  recommendedControls: string[];
  legalCaveat: string;
};

const SEED: Seed[] = [
  {
    creatorProfile: "faceless_youtuber",
    mainRisks: [
      "Voice and on-screen handwriting can be linked across channels",
      "Metadata in exported video files (device, software, location)",
      "Payments and AdSense require tax/legal identity disclosure",
      "Familiar locations or background details leak in B-roll",
    ],
    recommendedControls: [
      "Strip metadata before publishing (see Metadata Cleaning checklist)",
      "Use a separate Google/AdSense identity from your personal accounts",
      "Vary voice via TTS or consistent vocal styling; avoid unique catchphrases",
      "Blur or anonymize identifiable locations, mail, and documents",
    ],
    legalCaveat:
      "Anonymity is not absolute. YouTube/AdSense and tax authorities require a real legal identity for monetization and payments; this guide reduces, but cannot eliminate, public linkability.",
  },
  {
    creatorProfile: "anonymous_blogger",
    mainRisks: [
      "Author email and CMS hosting account expose identity",
      "Comments, contact forms, and analytics cookies leak data",
      "Domain registration (WHOIS) can reveal ownership",
      "Affiliate and ad networks require tax identity for payouts",
    ],
    recommendedControls: [
      "Use a privacy-focused registrar with WHOIS redaction",
      "Separate author persona email from personal email",
      "Disable or moderate comments; avoid collecting PII via forms",
      "Use a dedicated legal entity for payments where appropriate",
    ],
    legalCaveat:
      "Anonymity is not absolute. Registrars, hosts, and ad/affiliate networks retain identity and may be compelled to disclose it; this guide reduces public exposure only.",
  },
  {
    creatorProfile: "tiktok_creator",
    mainRisks: [
      "Biometric and face data processed by the platform",
      "Watermarks and audio fingerprints link accounts",
      "Trending sounds and duets create cross-channel associations",
      "Payouts require legal identity and tax documentation",
    ],
    recommendedControls: [
      "Avoid showing face, tattoos, or unique identifiers on camera",
      "Use original or licensed audio to limit fingerprinting",
      "Keep TikTok account credentials separate from other platforms",
      "Review platform privacy settings and data-download options",
    ],
    legalCaveat:
      "Anonymity is not absolute. Short-form platforms process biometric and behavioral data and require identity for monetization; this guide limits voluntary disclosure only.",
  },
  {
    creatorProfile: "newsletter_operator",
    mainRisks: [
      "Email provider and payment processor store identity",
      "Subscriber data and analytics can be subpoenaed",
      "Personal writing style is a re-identification vector",
      "Custom domain and invoicing reveal ownership",
    ],
    recommendedControls: [
      "Use a newsletter platform with strong sender separation",
      "Register the sending domain via a privacy-friendly provider",
      "Vary phrasing; avoid quoting identifiable personal history",
      "Route payments through a separate legal entity",
    ],
    legalCaveat:
      "Anonymity is not absolute. Email and payment processors retain identity and may disclose it under legal process; this guide reduces public linkability only.",
  },
  {
    creatorProfile: "ai_persona_creator",
    mainRisks: [
      "Generative outputs may inherit training-data artifacts",
      "Voice cloning and deepfake detection can flag content",
      "Prompt logs and tool accounts expose operator identity",
      "Platforms may require disclosure of synthetic media",
    ],
    recommendedControls: [
      "Use watermark-free, commercial-use-licensed generation tools",
      "Keep persona prompts and tool logins on a separate account",
      "Add synthetic-media disclosure where platform policy requires it",
      "Audit outputs for accidental PII before publishing",
    ],
    legalCaveat:
      "Anonymity is not absolute. AI tool providers retain account and usage data, and some jurisdictions require labeling of synthetic media; this guide covers voluntary privacy only.",
  },
];

/** Idempotent seed of the privacy threat-model library (run once / re-runnable). */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let added = 0;
    for (const s of SEED) {
      const existing = await ctx.db
        .query("threat_models")
        .withIndex("by_profile", (q) => q.eq("creatorProfile", s.creatorProfile))
        .unique();
      if (existing) continue;
      await ctx.db.insert("threat_models", {
        creatorProfile: s.creatorProfile,
        mainRisks: s.mainRisks,
        recommendedControls: s.recommendedControls,
        legalCaveat: s.legalCaveat,
        updatedAt: Date.now(),
      });
      added++;
    }
    return { added, total: SEED.length };
  },
});

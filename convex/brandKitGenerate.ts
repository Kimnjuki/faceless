import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

type BrandKitPayload = {
  channelNames: string[];
  taglines: string[];
  colorPalette: Record<string, string>;
  toneDescriptor: string;
  logoDescription: string;
  styleGuide?: Record<string, unknown>;
};

function demoBrandKit(niche: string, platform: string, tone: string): BrandKitPayload {
  const base = niche || "Your niche";
  return {
    channelNames: [
      `${base} Anonymous`,
      `The ${base} Desk`,
      `${base} After Dark`,
      `Faceless ${base}`,
      `${base} Lab`,
    ],
    taglines: [
      `Smart ${base} — no face required`,
      `Clear ${base} for busy viewers`,
      `${tone} takes on ${base}`,
    ],
    colorPalette: { primary: "#6366f1", secondary: "#0f172a", accent: "#f59e0b" },
    toneDescriptor: tone,
    logoDescription: `Abstract mark suggesting ${base}: geometric shapes, no human likeness, high contrast for small sizes.`,
    styleGuide: {
      typography: ["Bold condensed headlines", "Neutral sans body"],
      imagery: ["Stock + screen captures", "No on-camera talent"],
      dos: ["One visual hook per thumbnail", "Consistent lower-third style"],
      donts: ["Busy patterns", "Illegible small text"],
    },
  };
}

/**
 * AI brand kit — Anthropic when configured; else demoBrandKit + insert.
 * Lives in a separate module to avoid circular type inference with api.creatorContent.
 */
export const generateBrandKit = action({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    tone: v.optional(v.string()),
    niche: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<
    BrandKitPayload & {
      brandKitId: Id<"brand_kits">;
      tokensUsed: number;
      demoMode: boolean;
    }
  > => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const platform = args.platform || "YouTube";
    const tone = args.tone || "professional";
    const niche = args.niche || "faceless content";
    const prompt = `You are a brand strategist for anonymous faceless creators.
Niche: ${niche}
Platform: ${platform}
Tone: ${tone}
Reply with ONLY valid JSON (no markdown) with this shape:
{"channelNames":["5 strings"],"taglines":["3 strings"],"colorPalette":{"primary":"#hex","secondary":"#hex","accent":"#hex"},"toneDescriptor":"string","logoDescription":"string","styleGuide":{"typography":["2+ strings"],"imagery":["2+ strings"],"dos":["2+ strings"],"donts":["2+ strings"]}}`;

    let text = "";
    let tokensUsed = 0;
    if (apiKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Anthropic API error: ${res.status} ${err}`);
      }
      const json = (await res.json()) as {
        content?: { type?: string; text?: string }[];
        usage?: { output_tokens?: number };
      };
      const block = json.content?.find((c) => c.type === "text" || c.text);
      text = block?.text ?? "";
      tokensUsed = json.usage?.output_tokens ?? 0;
    } else {
      text = JSON.stringify(demoBrandKit(niche, platform, tone));
    }

    let parsed: BrandKitPayload;
    try {
      const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned) as BrandKitPayload;
    } catch {
      parsed = demoBrandKit(niche, platform, tone);
    }

    const brandKitId: Id<"brand_kits"> = await ctx.runMutation(api.creatorContent.insertBrandKit, {
      userId: args.userId,
      nicheId: args.nicheId,
      platform,
      channelNames: parsed.channelNames.slice(0, 8),
      taglines: parsed.taglines.slice(0, 6),
      colorPalette: parsed.colorPalette,
      toneDescriptor: parsed.toneDescriptor,
      logoDescription: parsed.logoDescription,
      styleGuide: parsed.styleGuide,
    });

    await ctx.runMutation(api.creatorContent.logGeneration, {
      userId: args.userId,
      generationType: "brand_kit",
      nicheId: args.nicheId,
      platform,
      inputData: { niche, tone, platform },
      outputData: { brandKitId, preview: parsed },
      tokensUsed,
    });

    return { brandKitId, ...parsed, tokensUsed, demoMode: !apiKey };
  },
});

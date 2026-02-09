"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const NEWS_API_BASE = "https://newsapi.org/v2";
const RATE_LIMIT_DELAY_MS = 1200;

type NewsApiArticle = {
  source?: { id?: string; name?: string };
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
};

type NewsApiResponse = {
  status?: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  code?: string;
  message?: string;
};

/**
 * Fetches raw JSON from NewsAPI. Handles rate limiting and async wait.
 * Triggers content upsert mutation for each article (validates externalId to prevent duplicates).
 */
export const run = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn("NEWS_API_KEY not set; skipping news ingestion.");
      return { ok: false, reason: "missing_api_key", ingested: 0 };
    }

    const url = new URL(`${NEWS_API_BASE}/everything`);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("q", "content creation OR faceless OR creator economy");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", "20");
    url.searchParams.set("language", "en");

    let res: Response;
    try {
      res = await fetch(url.toString(), { method: "GET" });
    } catch (e) {
      console.error("NewsAPI fetch error:", e);
      return { ok: false, reason: "fetch_error", ingested: 0 };
    }

    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY_MS));
      return { ok: false, reason: "rate_limited", ingested: 0 };
    }

    const data = (await res.json()) as NewsApiResponse;
    if (data.status !== "ok" || !Array.isArray(data.articles)) {
      console.error("NewsAPI error:", data.code ?? data.message ?? data);
      return { ok: false, reason: data.code ?? "api_error", ingested: 0 };
    }

    let ingested = 0;
    for (const a of data.articles) {
      const externalId = a.url ?? `${a.source?.id ?? "unknown"}-${a.publishedAt ?? Date.now()}-${Math.random().toString(36).slice(2)}`;
      const publishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : Date.now();
      const sourceName = a.source?.name ?? "Unknown";

      await ctx.runMutation(internal.content.upsertFromIngestion, {
        item: {
          externalId,
          source: sourceName,
          isAutomated: true,
          originalUrl: a.url ?? "",
          title: a.title ?? "Untitled",
          description: a.description ?? undefined,
          url: a.url ?? undefined,
          publishedAt,
          agencyCategory: undefined,
        },
      });
      ingested++;
      await new Promise((r) => setTimeout(r, 80));
    }

    return { ok: true, ingested };
  },
});

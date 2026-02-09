/**
 * Patch article(s) to ensure publishedAt is in the past (fixes visibility).
 * Use when articles were inserted with future or incorrect timestamps.
 *
 * Usage:
 *   node scripts/patch-article-timestamps.mjs [slug]
 *   node scripts/patch-article-timestamps.mjs complete-guide-faceless-youtube-2026
 *
 * If no slug given, patches all published articles with publishedAt > now or null.
 */
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: join(root, ".env") });
  dotenv.config({ path: join(root, ".env.local") });
} catch (_) {}

const CONVEX_URL = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Set CONVEX_URL or VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

async function main() {
  const { ConvexHttpClient } = await import("convex/browser");
  const { api } = await import("../convex/_generated/api.js");

  const client = new ConvexHttpClient(CONVEX_URL);
  const slug = process.argv[2];

  // Use internal mutation if available, or we need to add one
  // For now, we'll use a simple approach: call a mutation that patches the article
  console.log("Patching article timestamps...");
  console.log("Slug filter:", slug || "(all published with bad timestamps)");

  try {
    const result = await client.mutation(api.articles.patchPublishedAt, { slug: slug || undefined });
    console.log("Patched:", result);
  } catch (e) {
    console.error("Error:", e.message || e);
    process.exit(1);
  }
}

main();

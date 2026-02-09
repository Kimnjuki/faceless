/**
 * Import articles from articles_rows.csv into Convex.
 *
 * Usage:
 *   1. Place articles_rows.csv in project root (or pass path as first arg).
 *   2. Set CONVEX_URL in .env.local (from npx convex dev).
 *   3. Run: node scripts/import-articles-from-csv.mjs [path/to/articles_rows.csv]
 *
 * CSV columns (snake_case from Supabase) are mapped to Convex camelCase.
 * Timestamps are converted to ms. category_id/author_id are skipped unless you
 * have Convex Id mappings (add categoryIdMap/authorIdMap later if needed).
 */
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

// Load env
try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: join(root, ".env") });
  dotenv.config({ path: join(root, ".env.local") });
} catch (_) {}

const CONVEX_URL = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Set CONVEX_URL or VITE_CONVEX_URL in .env.local (from npx convex dev)");
  process.exit(1);
}

// Resolve CSV path: first arg or default articles_rows.csv in project root
const csvPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(root, "articles_rows.csv");

if (!existsSync(csvPath)) {
  console.error("CSV not found:", csvPath);
  console.error("");
  console.error("Do one of the following:");
  console.error("  1. Place your CSV in the project root as: articles_rows.csv");
  console.error("  2. Or pass the full path, e.g.:");
  console.error('     node scripts/import-articles-from-csv.mjs "C:\\Users\\You\\Downloads\\articles_rows.csv"');
  console.error("  3. Or export from Supabase first: node scripts/export-supabase.mjs");
  console.error("     Then use migration-data/<date>/articles.json or convert that JSON to CSV.");
  process.exit(1);
}

/** Parse one CSV line respecting double-quoted fields (handles commas inside content). */
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || (c === "\t" && !inQuotes)) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

/** Parse CSV string into array of objects (first row = headers). */
function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => {
      const v = values[j];
      row[h] = v === "" || v === undefined ? undefined : v;
    });
    rows.push(row);
  }
  return rows;
}

/** Snake_case -> camelCase */
function toCamel(str) {
  if (!str || typeof str !== "string") return str;
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** Convert value to ms (number). */
function toMs(val) {
  if (val == null || val === "") return undefined;
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  const n = Date.parse(String(val).trim());
  return Number.isNaN(n) ? undefined : n;
}

/** Parse number from string. */
function toNum(val) {
  if (val == null || val === "") return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
}

/** Parse JSON or return undefined. */
function toJson(val) {
  if (val == null || val === "") return undefined;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return undefined;
  }
}

/** Parse array (e.g. "a,b,c" or JSON array string). */
function toArray(val) {
  if (val == null || val === "") return undefined;
  const parsed = toJson(val);
  if (Array.isArray(parsed)) return parsed;
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return undefined;
}

/** Map one CSV row (snake_case keys) to Convex article document. */
function rowToDoc(row) {
  const get = (key) => row[key] ?? row[toCamel(key)];
  const createdAt = toMs(get("created_at")) ?? Date.now();
  const updatedAt = toMs(get("updated_at")) ?? Date.now();
  const status = (get("status") || "published").toLowerCase();
  const validStatus = ["draft", "published", "archived"].includes(status) ? status : "published";

  const doc = {
    title: String(get("title") ?? "Untitled").trim(),
    slug: String(get("slug") ?? "").trim() || `article-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    content: String(get("content") ?? "").trim() || "(No content)",
    status: validStatus,
    createdAt,
    updatedAt,
  };

  const legacyId = get("id");
  if (legacyId) doc.legacyId = String(legacyId);

  const excerpt = get("excerpt");
  if (excerpt) doc.excerpt = String(excerpt).trim();

  const featuredImage = get("featured_image");
  if (featuredImage) doc.featuredImage = String(featuredImage).trim();

  const readTime = toNum(get("read_time"));
  if (readTime != null) doc.readTime = readTime;

  const wordCount = toNum(get("word_count"));
  if (wordCount != null) doc.wordCount = wordCount;

  const seoTitle = get("seo_title");
  if (seoTitle) doc.seoTitle = String(seoTitle).trim();

  const metaDescription = get("meta_description");
  if (metaDescription) doc.metaDescription = String(metaDescription).trim();

  const canonicalUrl = get("canonical_url");
  if (canonicalUrl) doc.canonicalUrl = String(canonicalUrl).trim();

  const publishedAt = toMs(get("published_at"));
  if (publishedAt != null) doc.publishedAt = publishedAt;

  const viewCount = toNum(get("view_count"));
  if (viewCount != null) doc.viewCount = viewCount;

  const shareCount = toNum(get("share_count"));
  if (shareCount != null) doc.shareCount = shareCount;

  const schemaMarkup = toJson(get("schema_markup"));
  if (schemaMarkup != null) doc.schemaMarkup = schemaMarkup;

  const internalLinks = toJson(get("internal_links"));
  if (internalLinks != null) doc.internalLinks = internalLinks;

  const contentUpgrades = toJson(get("content_upgrades"));
  if (contentUpgrades != null) doc.contentUpgrades = contentUpgrades;

  const targetPlatforms = toArray(get("target_platforms"));
  if (targetPlatforms && targetPlatforms.length) doc.targetPlatforms = targetPlatforms;

  return doc;
}

async function main() {
  const csvText = readFileSync(csvPath, "utf8");
  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    console.log("No data rows in CSV.");
    process.exit(0);
  }

  const docs = rows.map(rowToDoc).filter((d) => d.title && d.slug);

  const { ConvexHttpClient } = await import("convex/browser");
  const { api } = await import("../convex/_generated/api.js");

  const client = new ConvexHttpClient(CONVEX_URL);

  console.log(`Importing ${docs.length} articles to Convex...`);
  let ok = 0;
  let err = 0;

  for (let i = 0; i < docs.length; i++) {
    try {
      await client.mutation(api.articles.importArticle, { doc: docs[i] });
      ok++;
      if ((i + 1) % 10 === 0) process.stdout.write(`  ${i + 1}/${docs.length}\r`);
    } catch (e) {
      err++;
      console.error(`\nRow ${i + 2} (slug: ${docs[i].slug}):`, e.message || e);
    }
  }

  console.log(`\nDone. Inserted: ${ok}, errors: ${err}`);
  if (err > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

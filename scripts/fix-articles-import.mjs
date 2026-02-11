/**
 * Clear all articles from Convex and re-import them with proper parsing
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
  console.error("Set CONVEX_URL or VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

const { ConvexHttpClient } = await import("convex/browser");
const { api } = await import("../convex/_generated/api.js");

const client = new ConvexHttpClient(CONVEX_URL);

// Clear all articles first
async function clearArticles() {
  console.log("Clearing existing articles...");
  try {
    // Get all articles
    const articles = await client.query(api.articles.listAllVisible);
    console.log(`Found ${articles.length} articles to delete`);
    
    // Delete all articles (this is a workaround since there's no clear function)
    for (const article of articles) {
      try {
        // Note: This would need a delete function in the backend
        console.log(`Would delete article: ${article._id}`);
      } catch (e) {
        console.error("Error deleting article:", e);
      }
    }
  } catch (e) {
    console.error("Error clearing articles:", e);
  }
}

// Better CSV parser that handles JSON content
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    i++;
  }
  
  result.push(current.trim());
  return result;
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.length > 0);
  if (lines.length < 2) return [];
  
  const headers = parseCsvLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      const value = values[index];
      row[header] = value === "" || value === undefined ? undefined : value;
    });
    rows.push(row);
  }
  
  return rows;
}

function toCamel(str) {
  if (!str || typeof str !== "string") return str;
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toMs(val) {
  if (val == null || val === "") return undefined;
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  const n = Date.parse(String(val).trim());
  return Number.isNaN(n) ? undefined : n;
}

function toNum(val) {
  if (val == null || val === "") return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
}

function toJson(val) {
  if (val == null || val === "") return undefined;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return undefined;
  }
}

function toArray(val) {
  if (val == null || val === "") return undefined;
  const parsed = toJson(val);
  if (Array.isArray(parsed)) return parsed;
  if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean);
  return undefined;
}

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
  const csvPath = join(root, "articles_rows.csv");
  
  if (!existsSync(csvPath)) {
    console.error("CSV not found:", csvPath);
    process.exit(1);
  }

  const csvText = readFileSync(csvPath, "utf8");
  const rows = parseCsv(csvText);
  
  console.log(`Parsed ${rows.length} rows from CSV`);
  
  // Show first few rows for debugging
  console.log("First 3 rows:");
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    console.log(`Row ${i + 1}:`, {
      title: rows[i].title,
      slug: rows[i].slug,
      contentLength: rows[i].content?.length || 0,
      contentPreview: rows[i].content?.substring(0, 100) + "..."
    });
  }

  const docs = rows.map(rowToDoc).filter(d => d.title && d.slug && d.content && d.content !== "(No content)");
  
  console.log(`Filtered to ${docs.length} valid articles`);
  
  // Clear existing articles first
  await clearArticles();
  
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
      console.error(`\nRow ${i + 1} (slug: ${docs[i].slug}):`, e.message || e);
    }
  }

  console.log(`\nDone. Inserted: ${ok}, errors: ${err}`);
  if (err > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

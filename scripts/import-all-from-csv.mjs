/**
 * Import all Supabase table CSVs from project root into Convex.
 *
 * Prerequisites:
 *   1. All CSV files in project root: content_categories.csv, articles.csv, etc.
 *   2. CONVEX_URL or VITE_CONVEX_URL in .env.local (from npx convex dev).
 *   3. Run: node scripts/import-all-from-csv.mjs
 *
 * Tables are imported in dependency order. Foreign keys are resolved using
 * id maps from previously imported rows (Supabase id/user_id → Convex _id).
 */
import { readFileSync, existsSync } from "fs";
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

// Table order: parent tables before children. FK columns → ref table (id map key).
const TABLE_CONFIG = [
  { table: "content_categories", fk: { parent_id: "content_categories" } },
  { table: "tool_categories" },
  { table: "niche_categories" },
  { table: "community_categories" },
  { table: "product_categories" },
  { table: "affiliate_programs" },
  { table: "lead_magnets" },
  { table: "email_sequences" },
  { table: "learning_paths" },
  { table: "learning_path_modules" },
  { table: "platform_content_templates" },
  { table: "niche_analysis" },
  { table: "niches", fk: { category_id: "niche_categories" } },
  { table: "profiles" },
  { table: "articles", fk: { category_id: "content_categories", author_id: "profiles" } },
  { table: "article_tags", fk: { article_id: "articles" } },
  { table: "article_related", fk: { article_id: "articles", related_article_id: "articles" }, required: ["articleId", "relatedArticleId"] },
  { table: "forum_posts", fk: { category_id: "community_categories", author_id: "profiles" } },
  { table: "platform_guides", fk: { author_id: "profiles" } },
  { table: "products", fk: { category_id: "product_categories" } },
  { table: "product_variants", fk: { product_id: "products" } },
  { table: "courses", fk: { product_id: "products", instructor_id: "profiles" } },
  { table: "webinars", fk: { host_id: "profiles" } },
  { table: "support_tickets", fk: { user_id: "profiles", assigned_to: "profiles", product_id: "products" } },
  { table: "templates" },
  { table: "tools", fk: { category_id: "tool_categories" } },
  { table: "template_tools", fk: { template_id: "platform_content_templates", tool_id: "tools" }, required: ["templateId", "toolId"] },
  { table: "content_tools" },
  { table: "affiliate_links", fk: { program_id: "affiliate_programs", product_id: "products" } },
  { table: "email_campaigns", fk: { sequence_id: "email_sequences" } },
  { table: "email_subscribers", fk: { profile_id: "profiles", lead_magnet_id: "lead_magnets" } },
  { table: "course_modules", fk: { course_id: "courses" } },
  { table: "course_lessons", fk: { module_id: "course_modules" } },
  { table: "learning_modules", fk: { learning_path_id: "learning_paths" } },
  { table: "orders", fk: { user_id: "profiles" } },
  { table: "order_items", fk: { order_id: "orders", product_id: "products", variant_id: "product_variants" } },
  { table: "digital_assets", fk: { product_id: "products" } },
  { table: "webinar_registrations", fk: { webinar_id: "webinars", user_id: "profiles" } },
  { table: "subscriptions", fk: { user_id: "profiles", product_id: "products" } },
  { table: "student_progress", fk: { user_id: "profiles", course_id: "courses", lesson_id: "course_lessons" } },
  { table: "user_learning_progress", fk: { user_id: "profiles", course_id: "courses", lesson_id: "course_lessons", learning_path_id: "learning_paths", module_id: "learning_modules" } },
  { table: "post_replies", fk: { post_id: "forum_posts", author_id: "profiles", parent_reply_id: "post_replies" } },
  { table: "post_upvotes", fk: { user_id: "profiles", post_id: "forum_posts", reply_id: "post_replies" } },
  { table: "affiliate_clicks", fk: { affiliate_link_id: "affiliate_links", user_id: "profiles" } },
  { table: "affiliate_commissions", fk: { affiliate_link_id: "affiliate_links", order_id: "orders", user_id: "profiles" } },
  { table: "user_affiliate_clicks", fk: { user_id: "profiles", affiliate_link_id: "affiliate_links" } },
  { table: "conversions", fk: { user_id: "profiles" } },
  { table: "page_views", fk: { user_id: "profiles" } },
  { table: "user_events", fk: { user_id: "profiles" } },
  { table: "ticket_replies", fk: { ticket_id: "support_tickets", author_id: "profiles" } },
  { table: "niche_case_studies", fk: { niche_id: "niches" } },
  { table: "niche_content_ideas", fk: { niche_id: "niches" } },
];

const DATE_KEYS = new Set([
  "created_at", "updated_at", "published_at", "paid_at", "clicked_at", "subscribed_at",
  "unsubscribed_at", "last_engaged", "last_reply_at", "last_accessed", "viewed_at",
  "registered_at", "attended_at", "scheduled_at", "access_expires", "current_period_start", "current_period_end",
]);

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if ((c === "," || c === "\t") && !inQuotes) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

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
  try { return JSON.parse(val); } catch (_) { return undefined; }
}

function toArray(val) {
  if (val == null || val === "") return undefined;
  const parsed = toJson(val);
  if (Array.isArray(parsed)) return parsed;
  if (typeof val === "string") {
    // Handle string arrays like "[a, b, c]" or "['a', 'b']"
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const inner = trimmed.slice(1, -1);
        return inner.split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
      } catch (_) {}
    }
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return undefined;
}

function toBool(val) {
  if (val == null || val === "") return undefined;
  if (typeof val === "boolean") return val;
  const s = String(val).toLowerCase();
  return s === "true" || s === "t" || s === "1" || s === "yes";
}

/** Fields that must remain arrays (schema expects v.array(...)). */
const ARRAY_FIELDS = new Set([
  "targetPlatforms", "keyConcepts", "keyFeatures", "tags", "toolTags", "prerequisites",
  "learningObjectives", "requiredTools", "bestAiTools", "risks", "seoKeywords",
  "galleryImages", "credentials", "knowsAbout", "downloadableResources",
  "keySuccessFactors", "toolsUsed", "pros", "cons",
]);

/** Fields that are v.any() - keep array or object as-is. */
const ANY_FIELDS = new Set([
  "schemaMarkup", "internalLinks", "contentUpgrades", "segments", "customFields",
  "features", "requirements", "billingAddress", "watermarkData", "visualPlan",
  "exampleApplications", "deliverySequence", "monetizationStrategies",
  "conditions", "eventData",
]);

/** Tables that have updatedAt in schema. */
const TABLES_WITH_UPDATED_AT = new Set([
  "affiliate_programs", "articles", "lead_magnets", "niche_analysis", "niches",
  "orders", "platform_content_templates", "platform_guides", "post_replies",
  "products", "profiles", "student_progress", "subscriptions", "support_tickets",
  "templates", "tools", "user_learning_progress",
]);

/** Tables that do NOT have createdAt/updatedAt in schema - strip these fields. */
const TABLES_WITHOUT_CREATED_AT = new Set([
  "article_related",
  "content_tools",
  "learning_path_modules",
]);

/** Fields that must be strings (even if number-like). */
const STRING_FIELDS = new Set([
  "version", "sku", "orderNumber", "slug", "email", "userId",
]);

/** Fields that must be numbers (don't convert booleans). */
const NUMBER_FIELDS = new Set([
  "sortOrder", "orderIndex", "levelOrder", "moduleOrder", "manualRank", "totalPurchases",
  "shareCount", "viewCount", "downloadCount", "rating", "ratingCount",
  "upvoteCount", "replyCount", "readTime", "wordCount", "duration", "durationMinutes",
  "timeSpent", "progressPercentage", "quantity", "unitPrice", "totalPrice",
  "commissionAmount", "revenue", "conversionValue", "estimatedEarnings",
  "subscribersCount", "monthlyViews", "profitabilityScore", "evergreenScore",
  "qualityScore", "cookieDuration", "commissionRate", "profitMargin",
  "trialPeriodDays", "maxAttendees", "dripDelay", "waitTime",
]);

/** Convert array to string when schema expects string (Supabase often exports as ["x"]). */
function arrayToValue(arr, fieldName) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  if (ARRAY_FIELDS.has(fieldName) || ANY_FIELDS.has(fieldName)) return arr;
  if (arr.length === 1) return typeof arr[0] === "string" ? arr[0] : String(arr[0]);
  return arr.map((x) => (typeof x === "string" ? x : String(x))).join(", ");
}

/** Build Convex doc from CSV row: camelCase, timestamps as ms, FKs resolved from idMaps. */
function rowToDoc(row, table, fkMap, idMaps, requiredFields = []) {
  const get = (key) => row[key] ?? row[toCamel(key)];
  const doc = {};
  const now = Date.now();

  for (const [key, val] of Object.entries(row)) {
    if (val === "" || val === undefined || val === null) continue;
    const camel = toCamel(key);
    if (fkMap && fkMap[key] !== undefined) {
      const refTable = fkMap[key];
      const refId = idMaps[refTable]?.[val];
      if (refId !== undefined) {
        doc[camel] = refId;
      }
      // If FK not found, skip this field (don't set it) - required fields check will catch it
      continue;
    }
    if (key === "id") {
      doc.legacyId = String(val);
      continue;
    }
    if (DATE_KEYS.has(key)) {
      const ms = toMs(val);
      if (ms != null) doc[camel] = ms;
      continue;
    }
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      const ms = toMs(val);
      if (ms != null) doc[camel] = ms;
      continue;
    }
    // String fields: keep as string even if number-like
    if (STRING_FIELDS.has(camel)) {
      doc[camel] = String(val).trim();
      continue;
    }
    
    // Boolean detection: only for fields that should be boolean
    if (["true", "false", "t", "f", "1", "0"].includes(String(val).toLowerCase())) {
      // Don't convert to boolean if it's a number field
      if (NUMBER_FIELDS.has(camel)) {
        const num = toNum(val);
        if (num !== undefined) {
          doc[camel] = num;
          continue;
        }
      }
      const b = toBool(val);
      if (b !== undefined) {
        doc[camel] = b;
        continue;
      }
    }
    
    // Number fields: convert to number (including boolean false → 0, true → 1)
    if (NUMBER_FIELDS.has(camel)) {
      if (typeof val === "boolean") {
        doc[camel] = val ? 1 : 0;
        continue;
      }
      const num = toNum(val);
      if (num !== undefined && !Number.isNaN(num)) {
        doc[camel] = num;
        continue;
      }
    }
    
    // Generic number conversion (for non-number fields)
    const num = toNum(val);
    if (num !== undefined && !camel.includes("id") && !camel.endsWith("Url") && !NUMBER_FIELDS.has(camel)) {
      // Only convert if it's clearly a number and not a string field
      doc[camel] = num;
      continue;
    }
    const arr = toArray(val);
    if (arr !== undefined) {
      doc[camel] = arrayToValue(arr, camel);
      continue;
    }
    const obj = toJson(val);
    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
      doc[camel] = obj;
      continue;
    }
    doc[camel] = String(val).trim();
  }

  // Default createdAt for tables that have it in schema
  if (!TABLES_WITHOUT_CREATED_AT.has(table)) {
    if (doc.createdAt == null) doc.createdAt = now;
  } else {
    delete doc.createdAt;
    delete doc.updatedAt;
  }
  
  // Only add updatedAt if table schema has it
  if (TABLES_WITH_UPDATED_AT.has(table)) {
    if (doc.updatedAt == null) doc.updatedAt = doc.createdAt ?? now;
  } else {
    delete doc.updatedAt;
  }

  // Normalize: Supabase/Postgres often exports single values as ["x"]; convert to string where needed
  for (const k of Object.keys(doc)) {
    if (Array.isArray(doc[k])) {
      const normalized = arrayToValue(doc[k], k);
      if (normalized !== undefined) doc[k] = normalized;
    }
    // Convert numbers to strings for string fields
    if (STRING_FIELDS.has(k) && typeof doc[k] === "number") {
      doc[k] = String(doc[k]);
    }
  }
  
  // ARRAY_FIELDS that are still strings (e.g. "a, b, c") → split to array
  for (const k of Object.keys(doc)) {
    if (ARRAY_FIELDS.has(k) && typeof doc[k] === "string") {
      doc[k] = doc[k].split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  
  // NUMBER_FIELDS that ended up boolean (e.g. manualRank: false) → 0 or 1
  for (const k of Object.keys(doc)) {
    if (NUMBER_FIELDS.has(k) && typeof doc[k] === "boolean") {
      doc[k] = doc[k] ? 1 : 0;
    }
  }

  if (table === "articles") {
    if (!doc.title) doc.title = "Untitled";
    if (!doc.slug) doc.slug = `article-${now}-${Math.random().toString(36).slice(2, 9)}`;
    if (!doc.content) doc.content = "";
    const s = String(doc.status ?? "published").toLowerCase();
    doc.status = ["draft", "published", "archived"].includes(s) ? s : "published";
  }
  if (table === "profiles" && !doc.email) doc.email = "unknown@import.local";
  
  // platform_guides: required content, title, slug, platform
  if (table === "platform_guides") {
    if (!doc.content || typeof doc.content !== "string") doc.content = "";
    if (!doc.title) doc.title = "Untitled Guide";
    if (!doc.slug) doc.slug = `guide-${now}-${Math.random().toString(36).slice(2, 9)}`;
    if (!doc.platform) doc.platform = "youtube";
  }
  
  // Skip rows missing required fields
  for (const field of requiredFields) {
    if (doc[field] === undefined || doc[field] === null) {
      return null; // Signal to skip this row
    }
  }

  return doc;
}

async function main() {
  // List all CSV files in project root first
  const { readdirSync } = await import("fs");
  const allFiles = readdirSync(root);
  const csvFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".csv"));
  
  if (csvFiles.length === 0) {
    console.error("❌ No CSV files found in project root:", root);
    console.error("\nExpected files like: content_categories.csv, articles.csv, profiles.csv, etc.");
    console.error("\nTo export from Supabase, run: node scripts/export-supabase.mjs");
    console.error("Or place your CSV files in the project root with exact table names.");
    process.exit(1);
  }

  console.log(`✓ Found ${csvFiles.length} CSV file(s) in project root:`);
  csvFiles.forEach((f) => console.log(`  - ${f}`));
  console.log("");

  const { ConvexHttpClient } = await import("convex/browser");
  const { api } = await import("../convex/_generated/api.js");
  const client = new ConvexHttpClient(CONVEX_URL);

  const idMaps = {};
  let totalOk = 0;
  let totalErr = 0;
  let skipped = 0;

  for (const { table, fk = {}, required = [] } of TABLE_CONFIG) {
    // Try multiple naming patterns:
    // 1. Exact: table_name.csv
    // 2. With _rows: table_name_rows.csv
    // 3. Case-insensitive match for both
    let csvPath = null;
    const patterns = [
      `${table}.csv`,
      `${table}_rows.csv`,
    ];
    
    for (const pattern of patterns) {
      csvPath = join(root, pattern);
      if (existsSync(csvPath)) break;
      
      const match = csvFiles.find((f) => f.toLowerCase() === pattern.toLowerCase());
      if (match) {
        csvPath = join(root, match);
        break;
      }
    }
    
    if (!csvPath || !existsSync(csvPath)) {
      skipped++;
      continue;
    }
    
    const csvFileName = csvPath.split(/[/\\]/).pop();
    if (skipped === 0) console.log(`\nImporting tables...`);

    const csvText = readFileSync(csvPath, "utf8");
    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      console.log(`Skip ${table} (0 rows)`);
      continue;
    }

    idMaps[table] = {};
    let ok = 0;
    let err = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const doc = rowToDoc(row, table, fk, idMaps, required);
      if (doc === null) {
        err++;
        continue; // Skip rows missing required fields
      }
      try {
        const _id = await client.mutation(api.import.insertDocument, { table, doc });
        const legacyKey = row.id ?? row.user_id ?? i;
        if (legacyKey != null) idMaps[table][String(legacyKey)] = _id;
        if (table === "profiles") {
          if (row.id) idMaps.profiles[String(row.id)] = _id;
          if (row.user_id) idMaps.profiles[String(row.user_id)] = _id;
        }
        ok++;
      } catch (e) {
        err++;
        if (err <= 3) console.error(`  ${table} row ${i + 2}:`, e.message || e);
      }
      if ((i + 1) % 50 === 0) process.stdout.write(`  ${table}: ${i + 1}/${rows.length}\r`);
    }

    totalOk += ok;
    totalErr += err;
    const status = err > 0 ? `⚠️  ${ok} inserted, ${err} errors` : `✓ ${ok} inserted`;
    console.log(`  ${table}: ${status}`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Imported: ${totalOk} rows`);
  if (totalErr > 0) console.log(`  ⚠️  Errors: ${totalErr}`);
  if (skipped > 0) console.log(`  ⊘ Skipped: ${skipped} tables (no matching CSV)`);
  
  if (totalOk === 0 && totalErr === 0) {
    console.error("\n⚠️  No data imported.");
    console.error("\nThe script looks for CSV files named:");
    console.error("  - table_name.csv (e.g., articles.csv)");
    console.error("  - table_name_rows.csv (e.g., articles_rows.csv)");
    console.error(`\nFound ${csvFiles.length} CSV file(s), but none matched expected table names.`);
    console.error("\n💡 Tip: CSV files from Supabase exports often have '_rows' suffix.");
    console.error("   The script now handles both patterns automatically.");
    process.exit(1);
  }
  
  if (totalErr > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

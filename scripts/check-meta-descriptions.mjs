/**
 * Meta Description Length Check
 *
 * Validates that meta descriptions across the site do not exceed 160 chars.
 * Checks:
 *   1. The default meta description in dist/index.html
 *   2. The pre-JS articleDesc values in index.html
 *   3. The default description prop in src/components/SEO.tsx
 *
 * Usage:
 *   node scripts/check-meta-descriptions.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, "..");
const INDEX_HTML = path.join(PROJECT_ROOT, "index.html");
const SEO_TSX = path.join(PROJECT_ROOT, "src", "components", "SEO.tsx");
const DIST_INDEX = path.join(PROJECT_ROOT, "dist", "index.html");

const MAX_DESCRIPTION_LENGTH = 160;

function extractMetaDescription(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function extractArticleDescLengths(html) {
  const lengths = [];
  const re = /var\s+articleDesc\s*=\s*\{([\s\S]*?)\};/;
  const m = re.exec(html);
  if (!m) return lengths;
  const objBody = m[1];
  const entryRe = /["']([a-z0-9-]+)["']\s*:\s*["']([^"']*)["']/g;
  let entry;
  while ((entry = entryRe.exec(objBody)) !== null) {
    const key = entry[1];
    const val = entry[2];
    if (key && val && val.length > 0 && !key.includes(" ") && key !== "path") {
      lengths.push({ key, length: val.length, preview: val.substring(0, 60) });
    }
  }
  return lengths;
}

function extractSeoDefaultDescription(seoContent) {
  const m = seoContent.match(/description\s*=\s*['"`]([^'"`]+)['"`]/);
  return m ? m[1] : null;
}

function checkLength(label, text) {
  if (!text) return null;
  if (text.length > MAX_DESCRIPTION_LENGTH) {
    return { label, length: text.length, preview: text.substring(0, 80) };
  }
  return null;
}

async function main() {
  const issues = [];

  // 1. Check dist/index.html meta description
  if (fs.existsSync(DIST_INDEX)) {
    const html = fs.readFileSync(DIST_INDEX, "utf8");
    const desc = extractMetaDescription(html);
    const issue = checkLength("dist/index.html <meta name=\"description\">", desc);
    if (issue) issues.push(issue);
  }

  // 2. Check index.html pre-JS articleDesc values
  if (fs.existsSync(INDEX_HTML)) {
    const html = fs.readFileSync(INDEX_HTML, "utf8");
    const descLengths = extractArticleDescLengths(html);
    for (const entry of descLengths) {
      if (entry.length > MAX_DESCRIPTION_LENGTH) {
        issues.push({
          label: `index.html articleDesc["${entry.key}"]`,
          length: entry.length,
          preview: entry.preview,
        });
      }
    }
  }

  // 3. Check SEO.tsx default description
  if (fs.existsSync(SEO_TSX)) {
    const content = fs.readFileSync(SEO_TSX, "utf8");
    const desc = extractSeoDefaultDescription(content);
    const issue = checkLength("src/components/SEO.tsx default description", desc);
    if (issue) issues.push(issue);
  }

  console.log(`🔎 Checking meta descriptions (max ${MAX_DESCRIPTION_LENGTH} chars)...\n`);
  if (issues.length === 0) {
    console.log("✅ All meta descriptions are within the length limit.");
  } else {
    console.log(`❌ ${issues.length} meta description(s) exceed ${MAX_DESCRIPTION_LENGTH} chars:\n`);
    issues.forEach((i) => {
      console.error(`   [${i.length} chars] ${i.label}: "${i.preview}${i.length > 80 ? "..." : ""}"`);
    });
    console.error(`\n❌ Fix these descriptions before deploying.`);
    process.exit(1);
  }
}

main();

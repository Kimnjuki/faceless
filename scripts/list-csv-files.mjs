/**
 * List all CSV files in project root and show which tables they match.
 * Run: node scripts/list-csv-files.mjs
 */
import { readdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

const allFiles = readdirSync(root);
const csvFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".csv"));

console.log(`Found ${csvFiles.length} CSV file(s) in: ${root}\n`);

if (csvFiles.length === 0) {
  console.log("No CSV files found. Expected files like:");
  console.log("  - content_categories.csv");
  console.log("  - articles.csv");
  console.log("  - profiles.csv");
  console.log("  - etc.\n");
  console.log("To export from Supabase, run: node scripts/export-supabase.mjs");
  process.exit(0);
}

console.log("CSV files found:");
csvFiles.forEach((f) => {
  const lower = f.toLowerCase();
  const expected = lower.replace(/\.csv$/, "");
  console.log(`  ✓ ${f}`);
  console.log(`    → Matches table: ${expected}`);
});

console.log("\nExpected table names (for reference):");
const expectedTables = [
  "content_categories", "articles", "profiles", "learning_paths",
  "tools", "templates", "platform_guides", "niches", "products",
  "orders", "forum_posts", "courses", "webinars", "subscriptions",
  // ... add more if needed
];

expectedTables.forEach((t) => {
  const found = csvFiles.some((f) => f.toLowerCase() === `${t}.csv`);
  console.log(`  ${found ? "✓" : "✗"} ${t}.csv`);
});

console.log("\n💡 Tip: CSV files must match table names exactly (case-insensitive).");
console.log("   If your files have different names, rename them to match.");

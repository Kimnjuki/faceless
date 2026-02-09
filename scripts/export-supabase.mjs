/**
 * Phase 2: Export Supabase tables to JSON for Convex migration.
 * Run: node scripts/export-supabase.mjs
 * Requires: .env or .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * (For private tables use SUPABASE_SERVICE_ROLE_KEY instead of anon key.)
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load env from .env or .env.local (Node does not load Vite env automatically)
try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(root, '.env') });
  dotenv.config({ path: join(root, '.env.local') });
} catch (_) {
  // dotenv optional
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY in .env or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Tables in dependency order (export parent tables before child)
const TABLES = [
  'content_categories',
  'tool_categories',
  'niche_categories',
  'community_categories',
  'product_categories',
  'affiliate_programs',
  'lead_magnets',
  'email_sequences',
  'learning_paths',
  'learning_path_modules',
  'platform_content_templates',
  'niche_analysis',
  'niches',
  'profiles',
  'articles',
  'article_tags',
  'article_related',
  'forum_posts',
  'platform_guides',
  'products',
  'courses',
  'webinars',
  'support_tickets',
  'templates',
  'tools',
  'template_tools',
  'content_tools',
  'affiliate_links',
  'email_campaigns',
  'email_subscribers',
  'course_modules',
  'course_lessons',
  'learning_modules',
  'order_items',
  'digital_assets',
  'webinar_registrations',
  'subscriptions',
  'student_progress',
  'user_learning_progress',
  'post_replies',
  'post_upvotes',
  'affiliate_clicks',
  'affiliate_commissions',
  'user_affiliate_clicks',
  'conversions',
  'page_views',
  'user_events',
  'ticket_replies',
  'orders',
  'niche_case_studies',
  'niche_content_ideas',
];

function toMs(val) {
  if (val == null) return undefined;
  if (typeof val === 'number') return val;
  const n = Date.parse(val);
  return Number.isNaN(n) ? undefined : n;
}

function rowToConvexShape(row) {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (v === null) continue;
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
      const ms = toMs(v);
      if (ms !== undefined) out[camel] = ms;
      else out[camel] = v;
    } else {
      out[camel] = v;
    }
  }
  return out;
}

async function exportTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.warn(`  Skip ${tableName}: ${error.message}`);
    return { count: 0, skipped: true };
  }
  const rows = Array.isArray(data) ? data : [];
  const normalized = rows.map(rowToConvexShape);
  return { count: normalized.length, data: normalized };
}

const dateStr = new Date().toISOString().slice(0, 10);
const outDir = join(root, 'migration-data', dateStr);

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const manifest = { date: dateStr, tables: {} };

for (const table of TABLES) {
  process.stdout.write(`Exporting ${table}... `);
  const { count, data, skipped } = await exportTable(table);
  manifest.tables[table] = count;
  if (skipped) {
    console.log('skipped');
    continue;
  }
  if (data !== undefined) {
    const path = join(outDir, `${table}.json`);
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }
  console.log(`${count} rows`);
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`\nDone. Output: ${outDir}`);
console.log('Manifest:', manifest);

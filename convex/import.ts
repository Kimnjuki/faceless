/**
 * Migration import: insert one document into any table.
 * Used by scripts/import-all-from-csv.mjs to load CSV data in dependency order.
 */
import { mutation } from "./_generated/server";
import { v } from "convex/values";

const TABLE_NAMES = [
  "affiliate_clicks",
  "affiliate_commissions",
  "affiliate_links",
  "affiliate_programs",
  "article_related",
  "article_tags",
  "articles",
  "community_categories",
  "content_categories",
  "content_tools",
  "conversions",
  "course_lessons",
  "course_modules",
  "courses",
  "digital_assets",
  "email_campaigns",
  "email_sequences",
  "email_subscribers",
  "forum_posts",
  "lead_magnets",
  "learning_modules",
  "learning_path_modules",
  "learning_paths",
  "niche_analysis",
  "niche_case_studies",
  "niche_categories",
  "niche_content_ideas",
  "niches",
  "order_items",
  "orders",
  "page_views",
  "platform_content_templates",
  "platform_guides",
  "post_replies",
  "post_upvotes",
  "product_categories",
  "product_variants",
  "products",
  "profiles",
  "student_progress",
  "subscriptions",
  "support_tickets",
  "template_tools",
  "templates",
  "ticket_replies",
  "tool_categories",
  "tools",
  "user_affiliate_clicks",
  "user_events",
  "user_learning_progress",
  "webinar_registrations",
  "webinars",
] as const;

/**
 * Insert one document into the given table (for CSV import).
 * Returns the new document _id. Document must match the table schema.
 */
export const insertDocument = mutation({
  args: {
    table: v.union(...TABLE_NAMES.map((t) => v.literal(t))),
    doc: v.any(),
  },
  handler: async (ctx, { table, doc }) => {
    return await ctx.db.insert(table, doc);
  },
});

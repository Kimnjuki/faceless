/**
 * Generates longForm900.generated.ts — ~900 words per flagship niche (21 slugs).
 * Run: node scripts/generate-niche-longform.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/config/niches/longForm900.generated.ts");

const niches = [
  {
    slug: "personal-finance-tips-faceless",
    title: "Personal Finance Tips (Animated Explainers)",
    cat: "Finance & Wealth",
    kw: "budgeting, emergency fund, debt payoff, savings rate, animated finance, faceless YouTube finance",
  },
  {
    slug: "credit-card-reviews-faceless",
    title: "Credit Card Reviews & Comparisons",
    cat: "Finance & Wealth",
    kw: "cashback, travel rewards, APR, annual fee, affiliate disclosure, comparison tables",
  },
  {
    slug: "investing-for-beginners-faceless",
    title: "Investing for Beginners (Stocks, ETFs, Macro Updates)",
    cat: "Finance & Wealth",
    kw: "ETF, diversification, brokerage tutorial, index funds, market education, disclaimers",
  },
  {
    slug: "guided-meditations-faceless",
    title: "Guided Meditations & Sleep Audio",
    cat: "Health & Wellness",
    kw: "sleep sounds, anxiety relief, ambient audio, long-form uploads, retention",
  },
  {
    slug: "fitness-routines-faceless",
    title: "Fitness Routines & Home Workouts",
    cat: "Health & Wellness",
    kw: "HIIT, mobility, follow-along timers, stock footage, injury disclaimers",
  },
  {
    slug: "nutrition-advice-faceless",
    title: "Nutrition Advice & Meal Prep Visuals",
    cat: "Health & Wellness",
    kw: "meal prep, macros, overhead food footage, non-medical framing",
  },
  {
    slug: "software-tutorials-faceless",
    title: "Software Tutorials (Notion, Excel, Canva)",
    cat: "Tech & Productivity",
    kw: "screen recording, templates, SaaS affiliates, workflow education",
  },
  {
    slug: "gadget-reviews-faceless",
    title: "Gadget Reviews (Hands-Only & Spec Tables)",
    cat: "Tech & Productivity",
    kw: "unboxing, mic tests, affiliate retail, methodology transparency",
  },
  {
    slug: "coding-basics-faceless",
    title: "Coding Basics & Dev Tutorials",
    cat: "Tech & Productivity",
    kw: "IDE tutorials, JavaScript fundamentals, project series, bootcamp affiliates",
  },
  {
    slug: "motivational-stories-faceless",
    title: "Motivational Stories & Parables",
    cat: "Lifestyle & Entertainment",
    kw: "narration, stock footage, emotional hooks, original scripts",
  },
  {
    slug: "travel-hacks-faceless",
    title: "Travel Hacks & Budget Itineraries",
    cat: "Lifestyle & Entertainment",
    kw: "itineraries, maps, packing lists, seasonal SEO",
  },
  {
    slug: "mobile-game-reviews-faceless",
    title: "Mobile Game Reviews & Rankings",
    cat: "Lifestyle & Entertainment",
    kw: "gameplay capture, tier lists, patch-day cadence, mobile gaming CPM",
  },
  {
    slug: "side-hustle-ideas-faceless",
    title: "Side Hustle Ideas & Micro-Case Studies",
    cat: "Business & Marketing",
    kw: "freelancing, digital products, honest earnings bands, anti-MLM",
  },
  {
    slug: "email-marketing-guides-faceless",
    title: "Email Marketing & Funnel Guides",
    cat: "Business & Marketing",
    kw: "automations, deliverability, ESP trials, lead magnets",
  },
  {
    slug: "pinterest-strategies-faceless",
    title: "Pinterest Growth & Pin Design",
    cat: "Business & Marketing",
    kw: "keyworded descriptions, Canva templates, blog traffic, evergreen pins",
  },
  {
    slug: "book-summaries-faceless",
    title: "Book Summaries & Key Takeaways",
    cat: "Evergreen Education",
    kw: "nonfiction frameworks, action steps, fair-use commentary, audiobook affiliates",
  },
  {
    slug: "language-learning-faceless",
    title: "Language Learning Drills & Flashcards",
    cat: "Evergreen Education",
    kw: "audio loops, minimal pairs, spaced repetition, level playlists",
  },
  {
    slug: "diy-home-hacks-faceless",
    title: "DIY Home Hacks & Repairs",
    cat: "Evergreen Education",
    kw: "safety callouts, tool affiliates, Shorts + Pinterest synergy",
  },
  {
    slug: "niche-sports-highlights-faceless",
    title: "Niche Sports Highlights & Tips",
    cat: "Niche Hobbies",
    kw: "pickleball, climbing, technique analysis, licensed footage",
  },
  {
    slug: "asmr-relaxation-faceless",
    title: "ASMR & Relaxation Soundscapes",
    cat: "Niche Hobbies",
    kw: "triggers, long sessions, audio fidelity, membership upsells",
  },
  {
    slug: "viral-memes-explained-faceless",
    title: "Viral Memes Explained & Trend Breakdowns",
    cat: "Niche Hobbies",
    kw: "culture commentary, fast edits, transformative use, Shorts velocity",
  },
];

function section(title, paragraphs) {
  return `## ${title}\n\n${paragraphs.map((p) => p.trim()).join("\n\n")}`;
}

function buildNiche(n) {
  const blocks = [
    section("Executive summary", [
      `This guide covers **${n.title}** inside the **${n.cat}** lane for faceless creators in 2026. You will see how to position the channel, what formats compound fastest, and how to monetize without relying on a personal brand. The focus keywords for your metadata and descriptions include: **${n.kw}**. These terms mirror how audiences search on YouTube, TikTok, Instagram, and Pinterest—meet intent with clarity, not clickbait.`,
      `Faceless production favors systems: repeatable thumbnails, scripted hooks, and a publishing cadence you can sustain for twelve months. Treat each upload as a small product: promise one outcome, deliver proof or steps, and close with a single call-to-action—subscribe, save, download a template, or join an email list.`,
    ]),
    section("Audience, pain points, and search intent", [
      `Viewers in this niche are trying to solve a specific problem quickly—whether that is saving money, sleeping better, learning a tool, or understanding a trend. Your titles should reflect the exact language people type or say aloud. Mirror comment questions in follow-up videos; comments are a free research panel.`,
      `Because you are not on camera, trust comes from **clarity, structure, and consistency**. Use chapters, on-screen labels, and predictable series names so subscribers know what they will get. Avoid vague inspiration; lean into checklists, frameworks, and before/after style explanations where applicable.`,
    ]),
    section("Content system & 90-day roadmap (checklist)", [
      `**Days 1–30:** Pick one sub-angle inside ${n.title}, publish 8–12 core pieces, and test three thumbnail styles. Batch record voice in one session per week; separate editing days. **Days 31–60:** Double down on the top 20% of topics by watch time; add Shorts that isolate one insight from each long video. **Days 61–90:** Introduce a lead magnet that matches your best-performing promise; add a simple landing page and mention it consistently but ethically.`,
      `**Weekly checklist:** (1) Research 10 titles in autocomplete and comments. (2) Script hooks first—first 15 seconds decide survival. (3) Add pattern interrupts every 60–90 seconds for retention. (4) Export vertical cuts for Shorts/Reels. (5) Reply to comments in the first hour to seed the next video ideas.`,
    ]),
    section("Monetization stack (ads, affiliates, products)", [
      `Start with platform ads once eligible, but diversify early: **affiliate offers you truly use**, digital templates, micro-courses, or sponsorships with clear #ad labeling. Align sponsors with the problem your audience is already trying to solve—conversion stays higher when the product fits the tutorial.`,
      `For higher RPM verticals (finance, business, software), prioritize depth and accuracy. For relaxation or meme content, prioritize volume, session time, and memberships. Where applicable, add a lightweight newsletter so algorithm shifts do not erase your revenue overnight.`,
    ]),
    section("Growth, SEO, and distribution", [
      `Optimize titles for readability and specificity; descriptions should include semantic phrases related to ${n.kw}. Pin a comment with timestamps. Cross-post thoughtfully: a Pinterest pin or blog post can capture search traffic that Shorts cannot. Refresh top performers quarterly—titles, thumbnails, and links—before chasing brand-new topics.`,
      `Engagement signals matter: saves, shares, and comment quality. Ask one precise question at the end of each video to train the community tone you want. Avoid engagement bait that platforms penalize; ask for experiences, preferences, or “what should we cover next?” instead.`,
    ]),
    section("Risks, compliance, and sustainability", [
      `Use disclaimers where required (finance, health). Avoid guaranteed outcomes or medical diagnoses. For copyrighted clips or music, stick to licensed assets or transformative commentary. Moderate comments on sensitive topics and keep a pinned policy note when needed.`,
      `Sustainability is operational: protect sleep, batch work, and document SOPs so a future editor or VA can help. Track RPM, CTR, and average view duration monthly. When a format stops working, iterate packaging before abandoning the niche—often the idea is fine but the hook aged.`,
    ]),
    section("Keyword clusters to reuse", [
      `Weave these naturally across titles, descriptions, chapters, and pin copy where relevant: **${n.kw}**, plus “faceless channel,” “anonymous creator,” “step-by-step,” “for beginners,” and “2026 update.” Quality and clarity outperform stuffing; write for humans first, algorithms second.`,
    ]),
  ];
  return blocks.join("\n\n");
}

function countWords(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

const entries = niches.map((n) => {
  let body = buildNiche(n);
  let words = countWords(body);
  const pad =
    ` Additional depth for ${n.title}: emphasize proof, ethics, and repetition. Show your methodology on-screen when possible. Revisit analytics monthly, prune underperforming series, and reinvest time into packaging for winners. Build a swipe file of hooks from adjacent creators—not to copy, but to remix structures that fit your audience. Document what you learn in a simple content journal so you can train future help without losing your voice.`;
  while (words < 900) {
    body += pad;
    words = countWords(body);
    if (words > 1100) break;
  }
  return { slug: n.slug, body, words };
});

const header = `/* eslint-disable max-len */
/**
 * AUTO-GENERATED by scripts/generate-niche-longform.mjs
 * Comprehensive ~900+ word guides per flagship niche (SEO + checklist structure).
 * Regenerate: node scripts/generate-niche-longform.mjs
 */
`;

const record = entries
  .map(
    ({ slug, body }) =>
      `  ${JSON.stringify(slug)}: ${JSON.stringify(body)},\n`
  )
  .join("");

const kwRecord = niches
  .map((n) => `  ${JSON.stringify(n.slug)}: ${JSON.stringify(n.kw)},\n`)
  .join("");

const file = `${header}
export const SEO_KEYWORD_LINES: Record<string, string> = {
${kwRecord}};

export const LONG_FORM_900_GENERATED: Record<string, string> = {
${record}};
`;

fs.writeFileSync(outPath, file, "utf8");
console.log("Wrote", outPath);
entries.forEach((e) => console.log(e.slug, e.words));

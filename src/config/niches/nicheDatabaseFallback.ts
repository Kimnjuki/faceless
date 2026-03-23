import type { Niche } from "@/types";
import { FALLBACK_CORE_NICHES } from "./fallbackCore";
import { FALLBACK_BULK_NICHES } from "./fallbackBulk";
import type { FallbackNicheFull } from "./fallbackTypes";
import { LONG_FORM_900_GENERATED, SEO_KEYWORD_LINES } from "./longForm900.generated";

/** Core niches with 900+ word generated guides (see scripts/generate-niche-longform.mjs). */
const FALLBACK_CORE_WITH_LONG: FallbackNicheFull[] = FALLBACK_CORE_NICHES.map((n) => ({
  ...n,
  longFormContent: LONG_FORM_900_GENERATED[n.slug] ?? n.longFormContent,
  seoKeywordLine: SEO_KEYWORD_LINES[n.slug] ?? n.seoKeywordLine,
}));

export const ALL_FALLBACK_NICHES: FallbackNicheFull[] = [
  ...FALLBACK_CORE_WITH_LONG,
  ...FALLBACK_BULK_NICHES,
];

export function getFallbackNicheBySlug(slug: string): FallbackNicheFull | undefined {
  return ALL_FALLBACK_NICHES.find((n) => n.slug === slug);
}

/** Maps fallback record to list card shape used by NicheDatabase. */
export function fallbackToListNiche(n: FallbackNicheFull): Niche {
  return {
    id: n.slug,
    niche_name: n.nicheName,
    description: n.description,
    category: { name: n.categoryName },
    profitability_score: n.profitabilityScore,
    difficulty_level: n.difficultyLevel,
    trend_status: n.trendStatus,
    estimated_earnings_range: n.estimatedEarningsRange,
    avg_rpm: n.avgRpm,
    startup_cost: n.startupCost,
    competition_level: n.competitionLevel,
    best_ai_tools: n.bestAiTools,
  };
}

/** Detail page object aligned with NicheDetail expectations (camelCase). */
export function fallbackToDetailNiche(f: FallbackNicheFull) {
  return {
    nicheName: f.nicheName,
    description: f.description,
    category: { name: f.categoryName },
    trendStatus: f.trendStatus,
    profitabilityScore: f.profitabilityScore,
    difficultyLevel: f.difficultyLevel,
    competitionLevel: f.competitionLevel,
    estimatedEarningsRange: f.estimatedEarningsRange,
    avgRpm: f.avgRpm,
    evergreenScore: f.evergreenScore,
    targetAudience: f.targetAudience,
    primaryContentFocus: f.primaryContentFocus,
    startupCost: f.startupCost,
    timeToMonetization: f.timeToMonetization,
    monetizationStrategies: f.monetizationStrategies,
    risks: f.risks,
    requiredTools: f.requiredTools,
    bestAiTools: f.bestAiTools,
    caseStudies: f.caseStudies,
    contentIdeas: f.contentIdeas,
    longFormContent: f.longFormContent,
    seoKeywordLine: f.seoKeywordLine,
  };
}

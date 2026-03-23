/**
 * Client-side fallback niche database (used when Convex has no niches or for slug URLs).
 */

export interface FallbackContentIdea {
  _id?: string;
  contentTitle: string;
  contentFormat?: string;
  estimatedProductionTime?: string;
  requiredTools?: string[];
  seoPotential?: string;
}

export interface FallbackCaseStudy {
  _id?: string;
  channelName: string;
  contentStyle?: string;
  estimatedEarnings?: number;
  monthlyViews?: number;
  subscribersCount?: number;
  keySuccessFactors?: string[];
  toolsUsed?: string[];
}

export interface FallbackNicheFull {
  slug: string;
  nicheName: string;
  categoryName: string;
  description: string;
  profitabilityScore: number;
  difficultyLevel: "easy" | "medium" | "hard";
  competitionLevel: "low" | "medium" | "high";
  estimatedEarningsRange: string;
  avgRpm?: number;
  startupCost: string;
  timeToMonetization: string;
  evergreenScore: number;
  trendStatus: "rising" | "stable" | "declining";
  targetAudience: string;
  primaryContentFocus: string;
  monetizationStrategies: string[];
  risks: string[];
  requiredTools: string[];
  bestAiTools: string[];
  /** Long-form SEO copy for detail Overview tab */
  longFormContent?: string;
  contentIdeas: FallbackContentIdea[];
  caseStudies: FallbackCaseStudy[];
}

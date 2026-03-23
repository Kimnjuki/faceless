import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, TrendingDown, Minus, Star, DollarSign, Loader2, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useNiches } from "@/hooks/useNiches";
import { NICHE_DATABASE_INTRO_MARKDOWN } from "@/config/niches/fallbackIntro";

const TrendIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "rising":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "declining":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

export default function NicheDatabase() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"profitability" | "difficulty">("profitability");

  const { niches, loading, error, refetch, totalCount, usingFallback } = useNiches({
    category: categoryFilter,
    difficulty: difficultyFilter,
    searchQuery: searchQuery,
    sortBy: sortBy
  });

  return (
    <>
      <SEO
        title="Profitable Niche Database (100+ Faceless Niches) | ContentAnonymity"
        description="Explore 100+ proven faceless niches with profitability scores, difficulty levels, RPM context, and monetization stacks—finance, health, tech, business, education, and hobbies. Filter, search, and open full guides."
        keywords="profitable faceless niches 2026, niche database, high RPM topics, anonymous YouTube niches, AI voiceover channel ideas, faceless TikTok niches, affiliate niches, ContentAnonymity"
        url="https://contentanonymity.com/resources/niches"
        canonical="https://contentanonymity.com/resources/niches"
        type="website"
        breadcrumbItems={[
          { name: 'Resources', url: 'https://contentanonymity.com/resources/templates' },
          { name: 'Niche Database', url: 'https://contentanonymity.com/resources/niches' }
        ]}
      />
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Profitable Niche Database</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh niches"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Explore <strong>{totalCount}+</strong> researched faceless niches with profitability scores, difficulty, competition, RPM hints, and monetization paths—built for AI voiceover, stock footage, screen capture, and text-first formats.
                {usingFallback && (
                  <span className="block mt-2 text-sm">
                    Showing the full on-site database{hasConvex ? " (Convex list empty—using bundled data)" : ""}.
                  </span>
                )}
              </p>
            </div>

            <article className="mb-12 rounded-2xl border border-primary/10 bg-card/60 backdrop-blur-sm p-6 md:p-10 prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground">
              <ReactMarkdown>{NICHE_DATABASE_INTRO_MARKDOWN}</ReactMarkdown>
            </article>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="niche-search"
                    name="search"
                    placeholder="Search niches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Finance & Wealth">Finance & Wealth</SelectItem>
                    <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    <SelectItem value="Tech & Productivity">Tech & Productivity</SelectItem>
                    <SelectItem value="Lifestyle & Entertainment">Lifestyle & Entertainment</SelectItem>
                    <SelectItem value="Business & Marketing">Business & Marketing</SelectItem>
                    <SelectItem value="Evergreen Education">Evergreen Education</SelectItem>
                    <SelectItem value="Niche Hobbies">Niche Hobbies</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "profitability" | "difficulty")}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profitability">Profitability</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  If you use Convex, verify deployment and niche seed data—or browse the bundled database below.
                </p>
              </div>
            )}

            {/* Niches Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {niches.length > 0 ? (
                  niches.map((niche) => (
                <Card key={niche.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">
                            {typeof niche.category === 'string' 
                              ? niche.category 
                              : niche.category?.name || 'Uncategorized'}
                          </Badge>
                      <div className="flex items-center gap-1">
                        <TrendIcon status={niche.trend_status ?? 'stable'} />
                        <span className="text-xs text-muted-foreground capitalize">{niche.trend_status ?? 'stable'}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{niche.niche_name}</CardTitle>
                    <CardDescription>{niche.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">Profitability: {niche.profitability_score}/10</span>
                        </div>
                        <Badge variant="outline" className="capitalize">{niche.difficulty_level}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {niche.estimated_earnings_range && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">Revenue: </span>
                            <span className="font-medium">{niche.estimated_earnings_range}</span>
                          </div>
                        )}
                        {niche.avg_rpm && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">Avg RPM: </span>
                            <span className="font-medium">${niche.avg_rpm}</span>
                          </div>
                        )}
                        {niche.startup_cost && (
                          <div>
                            <span className="text-muted-foreground">Startup Cost: </span>
                            <span className="font-medium">{niche.startup_cost}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Competition: </span>
                          <span className="font-medium capitalize">{niche.competition_level}</span>
                        </div>
                      </div>

                                  {niche.best_ai_tools && niche.best_ai_tools.length > 0 && (
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-2">Best AI Tools:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {niche.best_ai_tools.map((tool: string, idx: number) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {tool}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                      <Button className="w-full" size="sm" asChild>
                        <Link to={`/niches/${niche.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No niches match your filters.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clear search or set category and difficulty to “All” to see the full list.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


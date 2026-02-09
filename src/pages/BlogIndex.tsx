import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, TrendingUp, Download, Loader2, Clock, Eye, RefreshCw, ArrowDownAZ, BarChart2, Share2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import SEO from "../components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLeads } from "@/hooks/useLeads";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";
import AdSenseDisplay from "@/components/AdSenseDisplay";
import ForeMediaAd from "@/components/ForeMediaAd";
import DataStateMessage from "@/components/DataStateMessage";

export default function BlogIndex() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"publishedAt" | "viewCount" | "shareCount" | "title">("publishedAt");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { createLead } = useLeads();
  
  // Debounce search query to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Memoize filters to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    searchQuery: debouncedSearchQuery || undefined,
    status: 'published' as const,
    sortBy,
    usePagination: true,
  }), [selectedCategory, debouncedSearchQuery, sortBy]);

  const { articles, categories, loading: articlesLoading, error, refetch, incrementViewCount, pagination } = useArticles(filters);

  const handleLeadMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createLead(email, 'blog-lead-magnet');
      toast.success("Success! Check your email for the Niche Finder Checklist.");
      setEmail("");
    } catch (error) {
      // Error already handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="50+ Faceless Content Strategies & Guides for 2026"
        description="Browse 50+ expert guides on faceless content creation, monetization & AI automation. Real strategies, real results. Start reading and building today."
        keywords="faceless YouTube channel ideas, faceless business blog, anonymous content guides, faceless content strategies 2025, content anonymity resources"
        url="https://contentanonymity.com/blog"
        canonical="https://contentanonymity.com/blog"
        type="website"
        breadcrumbItems={[{ name: 'Blog', url: 'https://contentanonymity.com/blog' }]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "ContentAnonymity Blog",
          "url": "https://contentanonymity.com/blog",
          "description": "Expert guides and resources for building profitable faceless content businesses",
          "publisher": {
            "@type": "Organization",
            "name": "ContentAnonymity",
            "logo": {
              "@type": "ImageObject",
              "url": "https://contentanonymity.com/logo-icon.svg"
            }
          }
        }}
      />
      <Header />
      <ExitIntentModal />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Faceless Business Resources
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  await refetch();
                  if (!articlesLoading) {
                    toast.success(`Refreshed! Found ${articles.length} article${articles.length !== 1 ? 's' : ''}`);
                  }
                }}
                disabled={articlesLoading}
                title="Refresh articles"
              >
                <RefreshCw className={`h-4 w-4 ${articlesLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Guides, strategies, and insights to build your anonymous content empire
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Internal links to tools & getting started (SEO + UX) */}
          <div className="flex flex-wrap gap-3 justify-center mb-8 text-sm">
            <span className="text-muted-foreground mr-2">Popular:</span>
            <Link to="/tools/niche-quiz" className="text-primary hover:underline font-medium">Take the free Niche Finder Quiz</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/tools/calculator" className="text-primary hover:underline font-medium">Estimate earnings with our Profitability Calculator</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/getting-started" className="text-primary hover:underline font-medium">Start with our 4-step Getting Started guide</Link>
          </div>

          {/* ForeMedia E1 - top content */}
          <div className="flex justify-center my-6">
            <ForeMediaAd slot="e1" className="min-h-[90px]" wrapperClassName="w-full max-w-[970px] mx-auto" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Data State Messages */}
          {(articlesLoading || error || articles.length === 0) && (
            <DataStateMessage
              loading={articlesLoading}
              error={error}
              empty={!articlesLoading && !error && articles.length === 0}
              emptyMessage={searchQuery 
                ? "No articles found matching your search. Try adjusting your filters."
                : selectedCategory !== "all"
                ? "No articles in this category yet."
                : "No articles found. Articles will appear here once they are published."}
              onRetry={refetch}
              type="articles"
            />
          )}

          {/* Articles Grid */}
          {!articlesLoading && !error && articles.length > 0 && (
            <>
              {/* Ad Banner (top of articles) */}
              <div className="mb-8 flex flex-col items-center gap-6">
                <AdSenseDisplay size="728x90" />
                <ForeMediaAd slot="c3" className="min-h-[250px]" wrapperClassName="w-full max-w-[336px]" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {articles.map((article, index) => (
                    <div key={article.id}>
                      {index === 3 && (
                        <div className="col-span-full mb-6">
                          <AdSenseDisplay size="728x90" />
                        </div>
                      )}
                      <Card
                    key={article.id} 
                    className="hover:border-primary transition-colors cursor-pointer group"
                    onClick={() => {
                      // Validate slug before navigation
                      if (!article.slug || article.slug.trim() === '') {
                        toast.error('Article slug is missing. Cannot navigate.');
                        console.error('Article missing slug:', article);
                        return;
                      }
                      
                      // Increment view count in background (don't wait for it)
                      incrementViewCount(article.slug ?? article.id ?? '').catch(err => {
                        console.warn('Failed to increment view count:', err);
                      });
                      
                      // Navigate immediately
                      try {
                        navigate(`/blog/${article.slug}`);
                      } catch (navError) {
                        console.error('Navigation error:', navError);
                        toast.error('Failed to navigate to article');
                      }
                    }}
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                      <ArticleImage
                        src={article.featured_image}
                        alt={`${article.title} - Featured image`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {article.category?.name && (
                          <Badge variant="secondary">{article.category.name}</Badge>
                        )}
                        {article.view_count && article.view_count > 100 && (
                          <Badge className="bg-primary/10 text-primary">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          {article.read_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {article.read_time} min
                            </span>
                          )}
                          {article.view_count !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article.view_count}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary group-hover:underline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            // Validate slug before navigation
                            if (!article.slug || article.slug.trim() === '') {
                              toast.error('Article slug is missing. Cannot navigate.');
                              console.error('Article missing slug:', article);
                              return;
                            }
                            
                            // Increment view count in background
                            incrementViewCount(article.slug ?? article.id ?? '').catch(err => {
                              console.warn('Failed to increment view count:', err);
                            });
                            
                            // Navigate immediately
                            try {
                              navigate(`/blog/${article.slug}`);
                            } catch (navError) {
                              console.error('Navigation error:', navError);
                              toast.error('Failed to navigate to article');
                            }
                          }}
                        >
                          Read More →
                        </Button>
                      </div>
                    </CardContent>
                    </Card>
                    </div>
                  ))}
              </div>
            {pagination?.canLoadMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => pagination.loadMore(12)}
                  disabled={pagination.status === "LoadingMore"}
                >
                  {pagination.status === "LoadingMore" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More Articles
                </Button>
              </div>
            )}
            </>
          )}

          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Niche Finder Checklist</h2>
              <p className="text-muted-foreground mb-6">
                Get our proven checklist with 100+ profitable niches, validation framework, and competition analysis
              </p>
              <form onSubmit={handleLeadMagnet} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="whitespace-nowrap">
                  Download Free
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam • Unsubscribe anytime
              </p>
            </CardContent>
          </Card>

          {/* Additional Resources Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Explore More Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Learning Paths</h3>
                  <p className="text-sm text-muted-foreground mb-4">Structured courses to master faceless content creation</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/learning-paths">Explore Paths →</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Platform Guides</h3>
                  <p className="text-sm text-muted-foreground mb-4">Step-by-step guides for YouTube, TikTok, Instagram</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/platform-guides">View Guides →</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Case Studies</h3>
                  <p className="text-sm text-muted-foreground mb-4">Real success stories from faceless creators</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/learning/case-studies">Read Stories →</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Tool Comparison</h3>
                  <p className="text-sm text-muted-foreground mb-4">Compare AI tools for faceless content creation</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/tools/all">Compare Tools →</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Templates Library</h3>
                  <p className="text-sm text-muted-foreground mb-4">Ready-to-use templates and scripts</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/resources/templates">Browse Templates →</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground mb-4">Your 4-step roadmap to faceless success</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/getting-started">Start Journey →</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

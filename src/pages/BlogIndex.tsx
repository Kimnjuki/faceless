import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Download, Loader2, Clock, Eye, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLeads } from "@/hooks/useLeads";
import { useArticles } from "@/hooks/useArticles";

export default function BlogIndex() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
  }), [selectedCategory, debouncedSearchQuery]);

  const { articles, categories, loading: articlesLoading, error, refetch, incrementViewCount } = useArticles(filters);

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

          {/* Loading State */}
          {articlesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !articlesLoading && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4 font-semibold">{error}</p>
              <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Missing Database Tables:</strong> The articles or content_categories tables don't exist in your Supabase database.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  To fix this:
                </p>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2 mb-4">
                  <li>Open your Supabase Dashboard</li>
                  <li>Go to SQL Editor</li>
                  <li>Run the SQL script from <code className="bg-background px-1 py-0.5 rounded">MISSING_TABLES_SETUP.sql</code></li>
                  <li>Refresh this page</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  See <code className="bg-background px-1 py-0.5 rounded">FIX_MISSING_TABLES.md</code> for detailed instructions.
                </p>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {!articlesLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.length > 0 ? (
                articles.map((article) => (
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
                      incrementViewCount(article.id).catch(err => {
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
                    {article.featured_image && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img 
                          src={article.featured_image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {article.category && (
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
                            incrementViewCount(article.id).catch(err => {
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">No articles found.</p>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or category filter.
                    </p>
                  )}
                  {!searchQuery && selectedCategory !== 'all' && (
                    <p className="text-sm text-muted-foreground">
                      No articles in this category yet.
                    </p>
                  )}
                </div>
              )}
            </div>
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
        </div>
      </main>
      <Footer />
    </>
  );
}

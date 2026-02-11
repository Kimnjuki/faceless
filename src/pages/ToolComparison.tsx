import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, X, ExternalLink, Star, Loader2, Search, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTools } from "@/hooks/useTools";
import type { Tool } from "@/types";

// Map URL category to database category name
const categoryMap: Record<string, string> = {
  'all': 'all',
  'video-editing': 'Video Editing',
  'ai-voiceover': 'AI Voiceover',
  'video-creation': 'Video Creation',
  'generative-video': 'Generative Video (AI)',
  'repurposing': 'Repurposing/Automation',
  'traditional-editing': 'Traditional Editing',
  'ai-scripting': 'AI Scripting/Writing',
  'scriptwriting': 'AI Scripting/Writing',
  'automation': 'Repurposing/Automation',
  'analytics': 'Analytics',
  'design': 'Design',
  'stock-resources': 'Stock Resources',
};

export default function ToolComparison() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'created_at'>('rating');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');

  const categoriesRaw = useQuery(api.tools.listCategories);
  const availableCategories = useMemo(
    () => (categoriesRaw ?? []).map((c: any) => c.name).filter(Boolean),
    [categoriesRaw]
  );

  useEffect(() => {
    if (category) setSelectedCategory(category);
  }, [category]);

  const dbCategory = selectedCategory ? categoryMap[selectedCategory] || selectedCategory : 'all';
  
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    if (newCategory === 'all') {
      navigate('/tools/all');
    } else {
      navigate(`/tools/${newCategory}`);
    }
  };
  
  const { tools, loading, error, refetch, trackClick } = useTools({
    category: dbCategory === 'all' ? undefined : dbCategory,
    searchQuery: searchQuery,
    sortBy: sortBy
  });

  const handleToolClick = async (tool: Tool) => {
    await trackClick(tool.id ?? tool._id ?? '');
    // Use affiliate link if available, otherwise website URL
    const url = tool.affiliate_url || tool.affiliate_link?.destination_url || tool.websiteUrl || tool.website_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const pageTitle = category && category !== 'all' 
    ? `Best ${category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Tools for Faceless Creators`
    : 'Content Creation Tools Comparison - Find Your Perfect Tool';
  const pageDescription = category && category !== 'all'
    ? `Compare the best ${category.replace(/-/g, " ")} tools for faceless content creators. Find features, pricing, and reviews to choose the perfect tool for your anonymous content business.`
    : 'Compare AI tools, video editors, voice generators, and more for faceless content creation. Find the perfect tools to build your anonymous content empire.';
  const canonicalUrl = category && category !== 'all'
    ? `https://contentanonymity.com/tools/${category}`
    : 'https://contentanonymity.com/tools/all';

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${category ? category.replace(/-/g, " ") + " " : ""}tools, faceless content tools, AI content creation tools, video editing tools, anonymous content creator tools`}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="website"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          ...(category && category !== 'all' ? [{ name: pageTitle, url: canonicalUrl }] : [])
        ].filter(Boolean) as Array<{ name: string; url: string }>}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {category && category !== 'all' 
                    ? `Best ${category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Tools`
                    : 'Content Creation Tools'
                  }
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh tools"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground mb-2">
                Compare features, pricing, and reviews to find the perfect tool for your faceless content creation needs
              </p>
              {!loading && !error && (
                <p className="text-sm text-muted-foreground">
                  {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
                </p>
              )}
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tool-search"
                    name="search"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {availableCategories.map((cat) => {
                      // Find URL-friendly key for this category
                      const urlKey = Object.keys(categoryMap).find(key => categoryMap[key] === cat) || cat.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <SelectItem key={cat} value={urlKey}>
                          {cat}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: 'rating' | 'name' | 'created_at') => setSortBy(value)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="created_at">Newest</SelectItem>
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
                <p className="text-destructive mb-4 font-semibold">Error Loading Tools</p>
                <p className="text-sm text-muted-foreground mb-2">{error}</p>
                <div className="text-xs text-muted-foreground space-y-1 mt-4">
                  <p>Possible issues:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tools table doesn't exist - Run SQL setup scripts</li>
                    <li>RLS policies blocking access - Check Supabase policies</li>
                    <li>Category relationship issue - Verify foreign keys</li>
                  </ul>
                  <p className="mt-4">Check browser console (F12) for detailed error messages.</p>
                </div>
              </div>
            )}

            {/* Tools Count Info */}
            {!loading && !error && tools.length > 0 && (
              <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {dbCategory !== 'all' && ` in ${category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && tools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg font-semibold mb-2">No tools found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery 
                    ? `No tools match "${searchQuery}"`
                    : dbCategory !== 'all'
                    ? `No tools in this category yet`
                    : 'No tools in database yet. Add tools via Supabase SQL Editor.'}
                </p>
                {!searchQuery && dbCategory === 'all' && (
                  <div className="text-xs text-muted-foreground space-y-1 mt-4">
                    <p>To add tools, run your SQL script in Supabase:</p>
                    <code className="block bg-muted p-2 rounded mt-2 text-left">
                      INSERT INTO tools (name, category_id, description, ...) VALUES (...)
                    </code>
                  </div>
                )}
              </div>
            )}

            {/* Tools Grid */}
            {!loading && !error && tools.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <Card key={tool.id} className="relative hover:border-primary transition-colors flex flex-col">
                    {(tool.affiliate_url || tool.affiliate_link) && (
                      <Badge className="absolute top-4 right-4 bg-green-500">Verified</Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">
                          {tool.category?.name || 'Uncategorized'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                      {tool.description && (
                        <CardDescription className="mt-2 line-clamp-2">{tool.description}</CardDescription>
                      )}
                      {tool.pricing && (
                        <div className="text-2xl font-bold text-primary mt-2">{tool.pricing}</div>
                      )}
                      {(tool.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{(tool.rating ?? 0).toFixed(1)}</span>
                          {(tool.rating_count ?? tool.ratingCount ?? 0) > 0 && (
                            <span className="text-sm text-muted-foreground">({tool.rating_count ?? tool.ratingCount ?? 0})</span>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {/* Pros */}
                      {tool.pros && tool.pros.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Pros:</h4>
                          <ul className="space-y-1">
                            {tool.pros.slice(0, 3).map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cons */}
                      {tool.cons && tool.cons.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Cons:</h4>
                          <ul className="space-y-1">
                            {tool.cons.slice(0, 2).map((con, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Best For */}
                      {tool.best_for && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">Best for:</span> {tool.best_for}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto space-y-2">
                        {(tool.tutorialUrl ?? tool.tutorial_url) && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open((tool.tutorialUrl ?? tool.tutorial_url)!, '_blank')}
                          >
                            View Tutorial
                          </Button>
                        )}
                        <Button 
                          className="w-full"
                          onClick={() => handleToolClick(tool)}
                        >
                          {tool.affiliate_url || tool.affiliate_link 
                            ? (tool.affiliate_link?.cta_text || 'Visit Site') 
                            : 'Learn More'} 
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

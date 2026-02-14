import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleImage from "@/components/ArticleImage";

/**
 * ArticleGrid – Enhanced with free live content creation themed images.
 * Bento-box grid, anonymized avatars (geometric shapes), scan-line texture on images,
 * prominent read time and view count badges, and diverse content creation imagery.
 */
export default function ArticleGrid() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const articles = useQuery(
    api.articles.getLatestArticles,
    hasConvex ? { limit: 24 } : "skip"
  );

  // Map article categories to image categories for better visual diversity
  const getImageCategory = (articleCategory?: string): 'writing' | 'faceless' | 'ai' | 'monetization' | 'social' | 'productivity' | 'privacy' | 'blogging' | 'multimedia' => {
    if (!articleCategory) return 'writing';
    
    const categoryMap: Record<string, 'writing' | 'faceless' | 'ai' | 'monetization' | 'social' | 'productivity' | 'privacy' | 'blogging' | 'multimedia'> = {
      'content-creation': 'writing',
      'faceless-content': 'faceless',
      'ai-automation': 'ai',
      'monetization': 'monetization',
      'social-media': 'social',
      'productivity': 'productivity',
      'privacy': 'privacy',
      'blogging': 'blogging',
      'multimedia': 'multimedia',
      'writing': 'writing',
      'anonymous': 'faceless',
      'automation': 'ai',
      'marketing': 'monetization',
      'community': 'social',
      'tools': 'productivity',
      'security': 'privacy'
    };
    
    return categoryMap[articleCategory.toLowerCase()] || 'writing';
  };

  if (articles === undefined) {
    return (
      <section className="py-16 px-4 bg-cyber-bg min-h-[400px] flex items-center justify-center">
        <div className="font-mono text-cyber-neon/60 text-sm">Loading articles...</div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 px-4 bg-cyber-bg"
      aria-labelledby="article-grid-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h2
            id="article-grid-heading"
            className="text-3xl md:text-4xl font-bold text-white font-sans tracking-tight"
          >
            Recently Added
          </h2>
          <Button variant="outline" asChild className="border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/10 hover:border-cyber-neon/60 w-fit">
            <Link to="/blog" className="inline-flex items-center gap-2">
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {articles.map((article, index) => {
            const isFeatured = index === 0;
            const gridClass = isFeatured
              ? "md:col-span-2 md:row-span-2"
              : "md:col-span-1 md:row-span-1";
            
            const imageCategory = getImageCategory(article.category?.name);

            return (
              <Link
                key={article._id}
                to={`/blog/${article.slug}`}
                className={`group block ${gridClass}`}
              >
                <article
                  className="h-full rounded-lg border border-cyber-neon/20 bg-[#0a0a0a] overflow-hidden hover:border-cyber-neon/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {/* Enhanced Image with scan-line overlay and themed content creation photos */}
                  <div className="relative aspect-video overflow-hidden bg-[#0d0d0d]">
                    <ArticleImage
                      src={article.featuredImage}
                      alt={article.title || "Article featured image"}
                      category={imageCategory}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 2}
                    />
                    {/* Scan-line texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)",
                      }}
                    />
                    {/* Noise overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    {/* Read time & view count badges */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2">
                      {article.readTime != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyber-bg/90 border border-cyber-neon/30 text-cyber-neon text-xs font-mono">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min
                        </span>
                      )}
                      {article.viewCount != null && article.viewCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyber-bg/90 border border-cyber-neon/30 text-cyber-neon/80 text-xs font-mono">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Anonymized author avatar – geometric shape instead of face */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-sm bg-cyber-neon/20 border border-cyber-neon/40 flex items-center justify-center"
                        aria-hidden
                      >
                        <div className="w-2 h-2 rounded-full bg-cyber-neon" />
                      </div>
                      <span className="text-xs font-mono text-cyber-neon/70 uppercase tracking-wider">
                        Anonymous Creator
                      </span>
                    </div>

                    {article.category?.name && (
                      <span className="text-xs font-mono text-cyber-neon/60 uppercase tracking-wider">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="mt-1 font-bold text-lg text-white group-hover:text-cyber-neon transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-white/70 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

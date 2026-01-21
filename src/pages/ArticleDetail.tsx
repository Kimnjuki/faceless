import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { ArticleContentRenderer } from "@/components/ArticleContentRenderer";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import { trackContentView } from "@/utils/analytics";
import AdSenseInArticle from "@/components/AdSenseInArticle";
import AdSenseDisplay from "@/components/AdSenseDisplay";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reading progress indicator
  useEffect(() => {
    const updateReadingProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      const progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress();

    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [article]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError("Article slug is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!slug || slug.trim() === '') {
          throw new Error('Invalid article slug');
        }

        let data: any = null;

        // 1) Try with joins and status=published
        const result = await supabase
          .from('articles')
          .select(`
            *,
            category:content_categories(id, name, slug, description),
            author:profiles(user_id, full_name, avatar_url),
            tags:article_tags(tag)
          `)
          .eq('slug', slug.trim())
          .eq('status', 'published')
          .single();

        if (result.error) {
          // 2) Try simple select with status=published
          const simpleQuery = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug.trim())
            .eq('status', 'published')
            .single();

          if (simpleQuery.error) {
            // 3) Try without status (for tables without status column or using published boolean)
            const noStatus = await supabase
              .from('articles')
              .select('*')
              .eq('slug', slug.trim())
              .maybeSingle();

            if (noStatus.error) throw noStatus.error;
            if (!noStatus.data) {
              setError("Article not found. Please check the URL or ensure the article is published.");
              setLoading(false);
              return;
            }
            if (noStatus.data.status === 'draft' || noStatus.data.status === 'archived' || noStatus.data.published === false) {
              setError("Article not found. Please check the URL or ensure the article is published.");
              setLoading(false);
              return;
            }
            data = noStatus.data;
          } else if (!simpleQuery.data) {
            setError("Article not found. Please check the URL or ensure the article is published.");
            setLoading(false);
            return;
          } else {
            data = simpleQuery.data;
          }
        } else if (!result.data) {
          setError("Article not found. Please check the URL or ensure the article is published.");
          setLoading(false);
          return;
        } else {
          data = result.data;
        }

        if (!data) {
          setError("Article not found. Please check the URL or ensure the article is published.");
          setLoading(false);
          return;
        }

        // Track content view
        trackContentView('article', data.id?.toString() || slug || 'unknown', data.title);

        // Transform tags - support array (from article_tags join), object array, or comma-separated string
        let tagsArray: string[] = [];
        if (data.tags && Array.isArray(data.tags)) {
          tagsArray = data.tags.map((t: any) =>
            typeof t === 'string' ? t : (t?.tag ?? t?.name ?? String(t ?? ''))
          ).filter((tag: string) => tag && tag.trim() !== '');
        } else if (typeof data.tags === 'string') {
          tagsArray = data.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        // Transform category - object from join or string column (simple select)
        let categoryData = null;
        if (data.category) {
          categoryData = typeof data.category === 'object' ? data.category : { name: String(data.category) };
        }

        // Transform author - object from profiles join or string column (simple select)
        let authorData = null;
        if (typeof data.author === 'string') {
          authorData = { full_name: data.author };
        } else if (data.author && typeof data.author === 'object') {
          authorData = data.author;
        }

        const articleData = {
          ...data,
          content: data.content ?? data.body ?? data.full_content ?? data.body_html ?? data.article_text ?? '',
          excerpt: data.excerpt ?? data.description ?? data.meta_description ?? '',
          featured_image: data.featured_image ?? data.image ?? data.image_url ?? undefined,
          published_at: data.published_at ?? data.created_at ?? data.updated_at,
          tags: tagsArray,
          category: categoryData,
          author: authorData,
        } as Article;

        setArticle(articleData);

        // Increment view count in background (don't block rendering)
        (async () => {
          try {
            await supabase.rpc('increment_article_views', {
              article_id: data.id,
            });
          } catch (viewError: any) {
            console.warn('RPC increment failed, trying manual update:', viewError);
            // Fallback: manual update
            try {
              const { data: current } = await supabase
                .from('articles')
                .select('view_count')
                .eq('id', data.id)
                .single();

              if (current) {
                await supabase
                  .from('articles')
                  .update({ view_count: (current.view_count || 0) + 1 })
                  .eq('id', data.id);
              }
            } catch (fallbackError) {
              console.warn('Failed to increment view count:', fallbackError);
              // Don't show error to user, view count is not critical
            }
          }
        })();
      } catch (err: any) {
        console.error('❌ Error fetching article:', err);
        const errorMessage = err.message || 'Failed to load article';
        setError(errorMessage);
        
        // Only show toast for unexpected errors
        if (err.code !== 'PGRST116') {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-center">
          <div>
            <p className="text-destructive text-lg mb-4">{error || "Article not found"}</p>
            <Button asChild>
              <Link to="/blog">Back to Articles</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const canonicalUrl = article.canonical_url || `https://contentanonymity.com/blog/${article.slug}`;
  const authorName = (article.author as any)?.full_name || 'ContentAnonymity Team';

  return (
    <>
      <SEO
        title={article.seo_title || article.title}
        description={(article.meta_description || article.excerpt || article.title || '').slice(0, 160)}
        image={article.featured_image || 'https://contentanonymity.com/og-image.jpg'}
        url={`https://contentanonymity.com/blog/${article.slug}`}
        canonical={canonicalUrl}
        type="article"
        author={authorName}
        publishedTime={article.published_at}
        modifiedTime={article.updated_at}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: (article.excerpt || article.meta_description || '').slice(0, 200),
          image: article.featured_image || 'https://contentanonymity.com/og-image.jpg',
          datePublished: article.published_at,
          dateModified: article.updated_at || article.published_at,
          author: { '@type': 'Person', name: authorName },
          publisher: { '@type': 'Organization', name: 'ContentAnonymity', logo: { '@type': 'ImageObject', url: 'https://contentanonymity.com/logo-icon.svg' } },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Featured Image */}
        {article.featured_image && (
          <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden bg-gradient-to-b from-muted/50 to-background">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="container mx-auto px-4 pb-8">
                <div className="max-w-4xl mx-auto">
                  <Button variant="ghost" asChild className="mb-6 text-foreground/80 hover:text-foreground">
                    <Link to="/blog">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {article.category && article.category.name && (
                      <Badge variant="secondary" className="text-xs font-medium">{String(article.category.name)}</Badge>
                    )}
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                      <>
                        {article.tags.slice(0, 3).map((tag: any, index: number) => {
                          const tagString = typeof tag === 'string' ? tag : (tag?.tag || tag?.name || String(tag || ''));
                          if (!tagString || tagString.trim() === '') return null;
                          return (
                            <Badge key={`tag-${index}-${tagString}`} variant="outline" className="text-xs">
                              {tagString}
                            </Badge>
                          );
                        })}
                      </>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1] text-foreground drop-shadow-lg">
                    {article.title}
                  </h1>
                  {article.excerpt && (
                    <p className="text-xl md:text-2xl text-foreground/90 mb-6 leading-relaxed font-light">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-foreground/80 flex-wrap">
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{article.author.full_name ? String(article.author.full_name) : "ContentAnonymity Team"}</span>
                      </div>
                    )}
                    {article.published_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(article.published_at), 'MMMM d, yyyy')}</span>
                      </div>
                    )}
                    {article.read_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.read_time} min read</span>
                      </div>
                    )}
                    {article.view_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.view_count} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Header (when no featured image) */}
        {!article.featured_image && (
          <>
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4">
                <Button variant="ghost" asChild className="mb-0">
                  <Link to="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                  </Link>
                </Button>
              </div>
            </div>
            <div className="border-b bg-gradient-to-b from-muted/30 to-background">
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {article.category && article.category.name && (
                      <Badge variant="secondary" className="text-xs font-medium">{String(article.category.name)}</Badge>
                    )}
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                      <>
                        {article.tags.slice(0, 3).map((tag: any, index: number) => {
                          const tagString = typeof tag === 'string' ? tag : (tag?.tag || tag?.name || String(tag || ''));
                          if (!tagString || tagString.trim() === '') return null;
                          return (
                            <Badge key={`tag-${index}-${tagString}`} variant="outline" className="text-xs">
                              {tagString}
                            </Badge>
                          );
                        })}
                      </>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                    {article.title}
                  </h1>
                  {article.excerpt && (
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                    {article.author && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{article.author.full_name ? String(article.author.full_name) : "ContentAnonymity Team"}</span>
                      </div>
                    )}
                    {article.published_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(article.published_at), 'MMMM d, yyyy')}</span>
                      </div>
                    )}
                    {article.read_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.read_time} min read</span>
                      </div>
                    )}
                    {article.view_count !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.view_count} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Article Content — World-Class Reading Experience */}
        <article className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Reading Progress Bar */}
              <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
                <div 
                  className="h-full bg-primary transition-all duration-150"
                  style={{ width: '0%' }}
                  id="reading-progress"
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
                            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-foreground
                            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
                            prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:mb-6
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-foreground prose-strong:font-semibold
                            prose-ul:my-6 prose-ul:space-y-2
                            prose-ol:my-6 prose-ol:space-y-2
                            prose-li:text-foreground/90 prose-li:leading-relaxed
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/80
                            prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg
                            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                            prose-hr:my-12 prose-hr:border-muted">
                <ArticleContentRenderer content={article.content} />
              </div>

              {/* In-Article Ad (after first paragraph) */}
              <AdSenseInArticle />

              {/* Display Ad (before footer) */}
              <AdSenseDisplay size="728x90" className="my-8" />

              {/* Article Footer */}
              <div className="mt-16 pt-8 border-t">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {article.category && article.category.name && (
                      <Badge variant="secondary">{String(article.category.name)}</Badge>
                    )}
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {article.tags.map((tag: any, index: number) => {
                          const tagString = typeof tag === 'string' ? tag : (tag?.tag || tag?.name || String(tag || ''));
                          if (!tagString || tagString.trim() === '') return null;
                          return (
                            <Badge key={`tag-footer-${index}-${tagString}`} variant="outline" className="text-xs">
                              {tagString}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/blog">
                      <ArrowLeft className="mr-2 h-4 w-4" /> More Articles
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles CTA */}
        <div className="border-t bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Want More Content Strategies?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore our complete library of faceless business resources, tools, and proven strategies to build your anonymous content empire.
              </p>
              <Button asChild size="lg">
                <Link to="/blog">Browse All Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


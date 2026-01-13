import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import { trackContentView } from "@/utils/analytics";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log('🔍 Fetching article with slug:', slug);
        
        // Validate slug
        if (!slug || slug.trim() === '') {
          throw new Error('Invalid article slug');
        }
        
        // First try with category join
        let { data, error: queryError } = await supabase
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

        // If that fails, try without joins
        if (queryError) {
          console.warn('Query with joins failed, trying simple query:', queryError);
          const simpleQuery = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug.trim())
            .eq('status', 'published')
            .single();
          
          if (simpleQuery.error) {
            console.error('Simple query also failed:', simpleQuery.error);
            throw simpleQuery.error;
          }
          
          if (!simpleQuery.data) {
            throw new Error(`Article with slug "${slug}" not found`);
          }
          
          data = simpleQuery.data;
          queryError = null;
        }

        if (queryError) {
          console.error('Supabase query error:', queryError);
          throw queryError;
        }

        if (!data) {
          setError("Article not found. Please check the URL or ensure the article is published.");
          setLoading(false);
          return;
        }

        console.log('✅ Article fetched successfully:', data.title);

        // Track content view
        trackContentView('article', data.id?.toString() || slug || 'unknown', data.title);

        // Transform tags array - handle both object and string formats
        let tagsArray: string[] = [];
        if (data.tags && Array.isArray(data.tags)) {
          tagsArray = data.tags.map((t: any) => {
            if (typeof t === 'string') {
              return t;
            } else if (t && typeof t === 'object') {
              // Handle object format from article_tags join
              return t.tag || t.name || String(t);
            } else {
              return String(t || '');
            }
          }).filter((tag: string) => tag && tag.trim() !== '');
        }

        // Transform category to ensure it's an object or null
        let categoryData = null;
        if (data.category) {
          if (typeof data.category === 'object') {
            categoryData = data.category;
          } else {
            // If category is just an ID, we'll skip it
            categoryData = null;
          }
        }

        // Transform author to ensure it's an object or null
        let authorData = null;
        if (data.author) {
          if (typeof data.author === 'object') {
            authorData = data.author;
          } else {
            authorData = null;
          }
        }

        const articleData = {
          ...data,
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
              </Link>
            </Button>

            {/* Article Header */}
            <Card className="mb-8">
              {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  {article.category && article.category.name && (
                    <Badge variant="secondary">{String(article.category.name)}</Badge>
                  )}
                  {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                    <>
                      {article.tags.slice(0, 3).map((tag: any, index: number) => {
                        // Ensure tag is always a string
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
                <CardTitle className="text-3xl md:text-4xl mb-4">{article.title}</CardTitle>
                {article.excerpt && (
                  <CardDescription className="text-lg">{article.excerpt}</CardDescription>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.author.full_name ? String(article.author.full_name) : "Anonymous"}</span>
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
              </CardHeader>
            </Card>

            {/* Article Content */}
            <Card>
              <CardContent className="p-8">
                {article.content ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Article content is not available yet.</p>
                    <p className="text-sm text-muted-foreground">
                      Please check back later or contact support if this issue persists.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Articles CTA */}
            <Card className="mt-8 bg-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Want More Content Strategies?</h3>
                <p className="mb-4 opacity-90">Explore our complete library of faceless business resources.</p>
                <Button asChild variant="secondary">
                  <Link to="/blog">Browse All Articles</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


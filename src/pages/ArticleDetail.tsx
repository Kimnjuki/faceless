import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import { ArticleContentRenderer } from "@/components/ArticleContentRenderer";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import RelatedContent from "@/components/RelatedContent";
import Breadcrumb from "@/components/Breadcrumb";
import ContributorCard from "@/components/ContributorCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import type { Article } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { trackContentView } from "@/utils/analytics";
import AdSenseInArticle from "@/components/AdSenseInArticle";
import AdSenseDisplay from "@/components/AdSenseDisplay";
import ForeMediaAd from "@/components/ForeMediaAd";
import ArticleImage from "@/components/ArticleImage";

export default function ArticleDetail() {
  const { slug } = useParams();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const raw = useQuery(
    api.articles.getBySlug,
    hasConvex && slug?.trim() ? { slug: slug.trim() } : "skip"
  );
  const incrementViews = useMutation(api.articles.incrementViews);

  const article = useMemo((): Article | null => {
    if (!raw || !slug?.trim()) return null;
    const d = raw;
    const publishedAt = d.publishedAt ?? d.createdAt ?? d.updatedAt;
    return {
      ...d,
      id: d._id ?? String(d._id),
      category_id: d.categoryId,
      author_id: d.author?.id ?? d.authorId,
      featured_image: d.featuredImage,
      published_at: publishedAt != null ? new Date(publishedAt).toISOString() : undefined,
      created_at: d.createdAt != null ? new Date(d.createdAt).toISOString() : undefined,
      updated_at: d.updatedAt != null ? new Date(d.updatedAt).toISOString() : undefined,
      view_count: d.viewCount,
      read_time: d.readTime,
      tags: d.tags ?? [],
      category: d.category ? { id: d.category.id, name: d.category.name, slug: d.category.slug, description: d.category.description } : null,
      author: d.author ? { id: d.author.id, user_id: d.author.user_id, full_name: d.author.full_name, avatar_url: d.author.avatar_url } : null,
    } as Article;
  }, [raw, slug]);

  const loading = hasConvex && slug != null && raw === undefined;
  const error = hasConvex && slug != null && raw === null 
    ? "Article not found. Please check the URL or ensure the article is published." 
    : !hasConvex && slug != null
    ? "Convex backend is not configured. Articles require VITE_CONVEX_URL to be set."
    : null;

  useEffect(() => {
    if (!article) return;
    trackContentView("article", article.id ?? slug ?? "unknown", article.title);
  }, [article, slug]);

  useEffect(() => {
    if (!article?.slug || !hasConvex) return;
    incrementViews({ slug: article.slug }).catch(() => {});
  }, [article?.slug, incrementViews, hasConvex]);

  // Reading progress indicator
  useEffect(() => {
    if (!article) return;
    const updateReadingProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      const progressBar = document.getElementById("reading-progress");
      if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };
    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress();
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, [article]);

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
  const authorName = article.author?.full_name ?? article.author?.fullName ?? 'ContentAnonymity Team';
  const uniqueTitle = article.seo_title || article.title || `${article.slug} - Article | ContentAnonymity`;

  return (
    <>
      <SEO
        title={uniqueTitle}
        description={(article.meta_description || article.excerpt || article.title || '').slice(0, 160)}
        image={article.featured_image || 'https://contentanonymity.com/og-image.jpg'}
        url={`https://contentanonymity.com/blog/${article.slug}`}
        canonical={canonicalUrl}
        type="article"
        author={authorName}
        publishedTime={article.published_at}
        modifiedTime={article.updated_at}
        breadcrumbItems={[
          { name: 'Blog', url: 'https://contentanonymity.com/blog' },
          { name: article.title, url: canonicalUrl }
        ]}
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
        {/* Breadcrumb Navigation */}
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-10" aria-label="Breadcrumb navigation">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb
              items={[
                { label: 'Blog', href: '/blog' },
                { label: article.title, href: `/blog/${article.slug}` }
              ]}
            />
          </div>
        </nav>
        {/* Hero Section with Featured Image */}
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden bg-gradient-to-b from-muted/50 to-background">
          <ArticleImage
            src={article.featured_image}
            alt={`${article.title} - Featured image`}
            loading="eager"
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
                    {(article.category?.name ?? (!article.category && "Uncategorized")) && (
                      <Badge variant="secondary" className="text-xs font-medium">{String(article.category?.name ?? "Uncategorized")}</Badge>
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

        {/* ForeMedia E1 - top of content */}
        <div className="flex justify-center py-6">
          <ForeMediaAd slot="e1" className="min-h-[90px]" wrapperClassName="w-full max-w-[970px] mx-auto" />
        </div>

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

              {/* ForeMedia C3 */}
              <div className="flex justify-center my-8">
                <ForeMediaAd slot="c3" className="min-h-[250px]" wrapperClassName="w-full max-w-[336px] mx-auto" />
              </div>

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

              {/* Contributor Card - E-E-A-T Signal */}
              {article.author_id && (
                <section className="mt-12 pt-8 border-t" aria-labelledby="author-heading">
                  <h2 id="author-heading" className="text-2xl font-bold mb-6">About the Author</h2>
                  <ContributorCard 
                    profileId={article.author_id} 
                    showFullBio={true}
                  />
                </section>
              )}

              {/* Related Content Section */}
              {article.id && (
                <div className="mt-16 pt-8 border-t">
                  <RelatedContent
                    currentId={article.id}
                    type="article"
                    slug={article.slug}
                    tags={article.tags?.map((tag: any) =>
                      typeof tag === "string" ? tag : (tag?.tag || tag?.name || String(tag || ""))
                    ).filter(Boolean) || []}
                    categoryId={article.category_id || article.category?.id}
                    title={article.title}
                  />
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Articles CTA */}
        <section className="border-t bg-gradient-to-b from-muted/30 to-background" aria-labelledby="related-articles-heading">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="related-articles-heading" className="text-3xl font-bold mb-4">Want More Content Strategies?</h2>
              <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                Explore our complete library of faceless business resources, tools, and proven strategies to build your anonymous content empire.
              </p>
              <Button asChild size="lg">
                <Link to="/blog">Browse All Articles</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


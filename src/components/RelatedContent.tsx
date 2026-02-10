/**
 * RelatedContent Component
 *
 * Fetches semantically related content from Convex:
 * - Shared tags (Priority 1)
 * - Same category (Priority 2)
 * - Related tools (Priority 3)
 *
 * Includes JSON-LD schema for AI knowledge graphing
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, FileText, Wrench } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface RelatedItem {
  id: string;
  type: "article" | "tool";
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  featured_image?: string;
  category?: string;
  url: string;
}

interface RelatedContentProps {
  currentId: string;
  type: "article" | "tool";
  slug?: string;
  tags?: string[];
  categoryId?: string;
  title?: string;
}

export default function RelatedContent({
  currentId,
  type,
  slug,
  tags = [],
  categoryId,
  title,
}: RelatedContentProps) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const relatedArticles = useQuery(
    api.articles.listRelated,
    hasConvex && type === "article" && slug ? { slug, tags, categoryId: categoryId as Id<"content_categories"> | undefined, limit: 4 } : "skip"
  );
  const toolsRaw = useQuery(
    api.tools.list,
    hasConvex ? {} : "skip"
  );

  const relatedItems: RelatedItem[] = useMemo(() => {
    const items: RelatedItem[] = [];
    if (type === "article" && relatedArticles) {
      relatedArticles.forEach((a: any) => {
        items.push({
          id: a._id ?? a.slug,
          type: "article",
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          featured_image: a.featuredImage,
          category: a.category?.name,
          url: `/blog/${a.slug}`,
        });
      });
    }
    if (items.length < 4 && toolsRaw && toolsRaw.length > 0) {
      toolsRaw.slice(0, 4 - items.length).forEach((t: any) => {
        items.push({
          id: t._id ?? t.name,
          type: "tool",
          title: t.name,
          slug: t.name,
          description: t.description,
          category: t.category?.name,
          url: "/tools/all",
        });
      });
    }
    return items.slice(0, 4);
  }, [type, relatedArticles, toolsRaw]);

  const loading = (type === "article" && slug && relatedArticles === undefined) || toolsRaw === undefined;

  const generateMentionsSchema = () => {
    if (relatedItems.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title || "Related Content",
      mentions: relatedItems.map((item) => ({
        "@type": item.type === "article" ? "Article" : "SoftwareApplication",
        name: item.title,
        url: `https://contentanonymity.com${item.url}`,
      })),
    };
  };

  const schema = generateMentionsSchema();

  if (relatedItems.length === 0 && !loading) return null;

  return (
    <>
      {schema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
      )}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Related Content</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading related content...</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedItems.map((item) => (
              <Link key={item.id} to={item.url}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {item.type === "article" ? (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                    {item.category && (
                      <CardDescription className="text-xs">{item.category}</CardDescription>
                    )}
                  </CardHeader>
                  {(item.excerpt || item.description) && (
                    <CardContent className="pt-0">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.excerpt ?? item.description}
                      </p>
                      <span className="mt-2 inline-flex items-center text-xs text-primary">
                        Read more <ExternalLink className="ml-1 h-3 w-3" />
                      </span>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

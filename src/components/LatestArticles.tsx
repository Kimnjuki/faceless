import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LatestArticles() {
  const { articles, loading } = useArticles({ status: "published", limit: 3 });

  if (loading || articles.length === 0) return null;

  return (
    <section className="py-16 px-4" aria-labelledby="latest-articles-heading">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 id="latest-articles-heading" className="text-3xl font-bold">
            Latest from the Blog
          </h2>
          <Button variant="outline" asChild>
            <Link to="/blog" className="inline-flex items-center gap-2">
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} to={`/blog/${article.slug}`}>
              <Card className="group h-full overflow-hidden hover:border-primary/50 transition-colors">
                {article.featured_image && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted" style={{ minHeight: '180px' }}>
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      loading="lazy"
                      width="640"
                      height="360"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {!article.featured_image && (
                  <div className="aspect-video w-full flex items-center justify-center rounded-t-lg bg-primary/5">
                    <FileText className="h-12 w-12 text-primary/40" aria-hidden />
                  </div>
                )}
                <CardHeader>
                  {article.category?.name && (
                    <span className="text-xs font-medium text-primary">{article.category.name}</span>
                  )}
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  {article.excerpt && (
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


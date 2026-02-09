import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Eye, Loader2, RefreshCw, Wrench, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { usePlatformGuides } from "@/hooks/usePlatformGuides";
// Using simple HTML rendering for now - can be enhanced with markdown later

export default function PlatformGuideDetail() {
  const { slug } = useParams();
  const { guides, loading, error, incrementViewCount, refetch } = usePlatformGuides({});

  const guide = guides.find((g) => g.slug === slug);

  useEffect(() => {
    if (guide) {
      incrementViewCount(guide.id ?? guide._id ?? '');
    }
  }, [guide, incrementViewCount]);

  if (loading) {
    return (
      <>
        <SEO
          title={slug ? `Loading: ${slug} - Platform Guide | ContentAnonymity` : "Loading Platform Guide | ContentAnonymity"}
          description="Loading platform guide..."
          url={`https://contentanonymity.com/platform-guides/${slug || ''}`}
          canonical={`https://contentanonymity.com/platform-guides/${slug || ''}`}
          noindex={true}
        />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !guide) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Guide not found'}</p>
            <Button asChild>
              <Link to="/platform-guides">Back to Platform Guides</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const pageTitle = guide ? `${guide.title} - Platform Guide | ContentAnonymity` : `Platform Guide ${slug || ''} | ContentAnonymity`;
  const pageDescription = guide
    ? `${guide.excerpt || `Learn how to master ${guide.platform} for faceless content creation. Step-by-step guide with proven strategies.`}`
    : 'Platform-specific guide for faceless content creators.';
  const canonicalUrl = `https://contentanonymity.com/platform-guides/${slug}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${guide?.platform || 'platform'} guide, faceless content strategy, ${guide?.platform || ''} automation, anonymous creator guide`}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="article"
        breadcrumbItems={[
          { name: 'Platform Guides', url: 'https://contentanonymity.com/platform-guides' },
          { name: guide?.title || 'Guide', url: canonicalUrl }
        ]}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Refresh */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" asChild>
                <Link to="/platform-guides">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Platform Guides
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
                title="Refresh guide"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Guide Header */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="capitalize">{guide.platform}</Badge>
                      {guide.category && (
                        <Badge variant="secondary" className="capitalize">
                          {guide.category}
                        </Badge>
                      )}
                      {guide.difficulty_level && (
                        <Badge variant="outline" className="capitalize">
                          {guide.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
                    {guide.excerpt && (
                      <p className="text-lg text-muted-foreground mb-4">{guide.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {guide.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {guide.read_time} min read
                        </span>
                      )}
                      {guide.view_count !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {guide.view_count} views
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tool Tags */}
            {guide.tool_tags && guide.tool_tags.length > 0 && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Recommended Tools</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guide.tool_tags.map((tool, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guide Content — full view, no truncation */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="article-body prose prose-slate prose-lg max-w-none dark:prose-invert overflow-visible">
                  {guide.content ? (
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br />') }}
                    />
                  ) : (
                    <p className="text-muted-foreground">Content coming soon...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Example Applications */}
            {guide.example_applications && guide.example_applications.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Example Applications</h2>
                  </div>
                  <div className="space-y-4">
                    {guide.example_applications.map((example, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-start gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {example.feature}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {example.application}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Eye, Loader2, RefreshCw, Wrench, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { usePlatformGuides } from "@/hooks/usePlatformGuides";

const PROSE = "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed";

/** Render exampleApplications object (faceless_formats, on_camera_formats, seo_tips, etc.) */
function ExampleApplicationsSection({ data }: { data: Record<string, unknown> }) {
  const labels: Record<string, string> = {
    faceless_formats: "Faceless Content Formats",
    on_camera_formats: "On-Camera Content Formats",
    seo_tips: "SEO Tips",
    pillar_to_derivative_example: "Pillar to Derivative Example",
    recommended_tools: "Recommended Tools",
  };
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => {
        const label = labels[key] ?? key.replace(/_/g, " ");
        if (Array.isArray(value)) {
          return (
            <div key={key} className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold mb-2 capitalize">{label}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {value.map((item, i) => (
                  <li key={i}>{String(item)}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return (
            <div key={key} className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold mb-2 capitalize">{label}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-medium text-foreground/80">{k.replace(/_/g, " ")}:</span> {String(v)}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

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

            {/* Guide Content — markdown */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className={`article-body ${PROSE} overflow-visible`}>
                  {guide.content ? (
                    <ReactMarkdown>{guide.content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">Content coming soon...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Example Applications */}
            {guide.example_applications && typeof guide.example_applications === "object" &&
              (Array.isArray(guide.example_applications) ? guide.example_applications.length > 0 : Object.keys(guide.example_applications).length > 0) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Quick Reference & Examples</h2>
                  </div>
                  {Array.isArray(guide.example_applications) ? (
                    <div className="space-y-4">
                      {(guide.example_applications as Array<{ feature?: string; application?: string }>).map((ex, i) => (
                        <div key={i} className="border-l-4 border-primary pl-4 py-2">
                          {ex.feature && <Badge variant="outline" className="text-xs mb-1">{ex.feature}</Badge>}
                          <p className="text-sm text-muted-foreground">{ex.application ?? String(ex)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ExampleApplicationsSection data={guide.example_applications as unknown as Record<string, unknown>} />
                  )}
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


import { Link, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { nicheNameToSlug } from "@/lib/nicheSlug";
import { ArrowRight, BookOpen, Lightbulb } from "lucide-react";

function titleCasePlatform(slug: string) {
  const s = slug.toLowerCase();
  if (s === "youtube") return "YouTube";
  if (s === "tiktok") return "TikTok";
  if (s === "instagram") return "Instagram";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default function NichePlatformLanding() {
  const { nicheSlug, platform: platformParam } = useParams<{
    nicheSlug: string;
    platform: string;
  }>();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const platform = platformParam ?? "youtube";

  const data = useQuery(
    api.creatorContent.getProgrammaticNichePlatform,
    hasConvex && nicheSlug
      ? { nicheSlug, platform }
      : "skip"
  );

  const loading = hasConvex && nicheSlug && data === undefined;
  const notFound = (hasConvex && data === null) || (!hasConvex && Boolean(nicheSlug));

  const nicheName = data?.niche.nicheName ?? "";
  const displayPlatform = titleCasePlatform(platform);
  const pageTitle = `${nicheName || "Faceless"} ${displayPlatform} — Without Showing Your Face | ContentAnonymity`;
  const canonicalPath =
    nicheSlug && platformParam
      ? `https://contentanonymity.com/niches/${nicheSlug}/${platformParam}`
      : "https://contentanonymity.com";

  const jsonLd = data
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle,
        description: `Faceless ${displayPlatform} strategy for ${nicheName}. Ideas, guides, and tools — stay anonymous.`,
        url: canonicalPath,
        isPartOf: { "@type": "WebSite", name: "ContentAnonymity", url: "https://contentanonymity.com" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://contentanonymity.com/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Niches",
              item: "https://contentanonymity.com/resources/niches",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: nicheName,
              item: `https://contentanonymity.com/niches/${nicheNameToSlug(nicheName)}`,
            },
            { "@type": "ListItem", position: 4, name: displayPlatform },
          ],
        },
      }
    : null;

  return (
    <>
      <SEO
        title={pageTitle}
        description={`Build a faceless ${displayPlatform} channel in ${nicheName || "your niche"}: content ideas, platform tips, and Creator Studio tools.`}
        url={canonicalPath}
        canonical={canonicalPath}
        structuredData={jsonLd ? [jsonLd] : undefined}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {loading && (
          <p className="text-muted-foreground animate-pulse">Loading niche & platform…</p>
        )}
        {notFound && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">
              {!hasConvex ? "Convex not configured" : "Page not found"}
            </h1>
            <p className="text-muted-foreground">
              {!hasConvex
                ? "Set VITE_CONVEX_URL to load programmatic niche pages."
                : "We could not match this niche slug. Try the niche database."}
            </p>
            <Button asChild variant="outline">
              <Link to="/resources/niches">Browse niches</Link>
            </Button>
          </div>
        )}
        {data && (
          <>
            <div className="mb-8">
              <Badge variant="secondary" className="mb-3">
                {displayPlatform} · Faceless playbook
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {data.niche.nicheName}{" "}
                <span className="text-primary">{displayPlatform}</span> — without showing your face
              </h1>
              {data.niche.description && (
                <p className="text-lg text-muted-foreground max-w-3xl">{data.niche.description}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button asChild>
                  <Link to="/creator-studio">
                    Open Creator Studio <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/niches/${data.niche._id}`}>Niche detail</Link>
                </Button>
              </div>
            </div>

            {data.contentIdeas.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Content ideas
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {data.contentIdeas.slice(0, 8).map((idea: Doc<"niche_content_ideas">) => (
                    <li key={idea._id}>
                      <Card className="h-full">
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">{idea.contentTitle}</CardTitle>
                          {(idea.contentFormat || idea.estimatedProductionTime) && (
                            <CardDescription>
                              {[idea.contentFormat, idea.estimatedProductionTime]
                                .filter(Boolean)
                                .join(" · ")}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.platformGuides.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Platform guides
                </h2>
                <div className="space-y-6">
                  {data.platformGuides.map((g: Doc<"platform_guides">) => (
                    <Card key={g._id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{g.title}</CardTitle>
                        <CardDescription>{g.excerpt ?? g.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{g.content.slice(0, 1200) + (g.content.length > 1200 ? "…" : "")}</ReactMarkdown>
                        {g.content.length > 1200 && (
                          <Button asChild variant="link" className="px-0 mt-2">
                            <Link to={`/platform-guides/${g.slug}`}>Read full guide</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {data.contentIdeas.length === 0 && data.platformGuides.length === 0 && (
              <p className="text-muted-foreground">
                More ideas and guides are being synced. Browse{" "}
                <Link className="text-primary underline" to="/platform-guides">
                  all platform guides
                </Link>
                .
              </p>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

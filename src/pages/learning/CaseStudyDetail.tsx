import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, DollarSign, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStudyBySlug } from "@/config/caseStudies/caseStudiesFallback";
import NotFound from "@/pages/NotFound";

const PROSE =
  "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-li:text-foreground/90";

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!study) {
    return <NotFound />;
  }

  const canonical = `https://contentanonymity.com/learning/case-studies/${study.slug}`;
  const audienceLabel =
    study.subscribers && study.followers
      ? "Audience"
      : study.platform.includes("Newsletter")
        ? "Reach"
        : study.subscribers
          ? "Subscribers / reach"
          : "Followers / reach";

  return (
    <>
      <SEO
        title={`${study.title} | ContentAnonymity Case Study`}
        description={study.excerpt}
        keywords={`${study.platform} case study, faceless creator, ${study.niche}, anonymous content business, ${study.strategy.slice(0, 80)}`}
        url={canonical}
        canonical={canonical}
        type="article"
      />
      <Header />
      <main className="min-h-screen bg-background py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 -ml-2 gap-2" asChild>
            <Link to="/learning/case-studies">
              <ArrowLeft className="h-4 w-4" />
              All case studies
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{study.niche}</Badge>
              <Badge variant="outline">{study.platform}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{study.title}</h1>
            <p className="text-muted-foreground">{study.creator}</p>
          </div>

          <Card className="mb-10 border-primary/15 shadow-modern">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">At a glance</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground">Revenue range (illustrative)</p>
                  <p className="font-semibold">{study.revenue}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground">Timeline</p>
                  <p className="font-semibold">{study.timeline}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <Users className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground">{audienceLabel}</p>
                  <p className="font-semibold">
                    {study.subscribers || study.followers || "—"}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground mb-1">Strategy summary</p>
                <p className="font-medium">{study.strategy}</p>
              </div>
            </CardContent>
          </Card>

          <article className={PROSE}>
            <ReactMarkdown>{study.content}</ReactMarkdown>
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/learning/case-studies">← Back to all case studies</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, DollarSign, Users, Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CASE_STUDIES_FALLBACK } from "@/config/caseStudies/caseStudiesFallback";

const LIST_CANONICAL = "https://contentanonymity.com/learning/case-studies";

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CASE_STUDIES_FALLBACK;
    return CASE_STUDIES_FALLBACK.filter(
      (study) =>
        study.title.toLowerCase().includes(q) ||
        study.niche.toLowerCase().includes(q) ||
        study.platform.toLowerCase().includes(q) ||
        study.strategy.toLowerCase().includes(q) ||
        study.excerpt.toLowerCase().includes(q) ||
        study.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      <SEO
        title="Success Case Studies - Real Faceless Creator Stories | ContentAnonymity"
        description="Real success patterns from faceless creators across YouTube, TikTok, Instagram, Pinterest, LinkedIn, newsletters, and Facebook. Detailed roadmaps, methods, growth, and how to sustain momentum—composite educational case studies."
        keywords="faceless creator success stories, case studies, anonymous creator earnings, faceless content case studies, YouTube faceless case study, TikTok productivity creator, Pinterest SEO affiliate"
        url={LIST_CANONICAL}
        canonical={LIST_CANONICAL}
        type="article"
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Success Case Studies</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Platform-by-platform breakdowns: methods, roadmaps for beginners, growth mechanics, and how to sustain results—without showing your face.
              </p>
            </div>

            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="case-study-search"
                  name="search"
                  placeholder="Search by title, niche, platform, strategy…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <Card key={study.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary">{study.niche}</Badge>
                      <Badge variant="outline">{study.platform}</Badge>
                    </div>
                    <CardTitle className="text-xl leading-snug">{study.title}</CardTitle>
                    <CardDescription>By {study.creator}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{study.excerpt}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Revenue (range)</p>
                        <p className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          {study.revenue}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Timeline</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {study.timeline}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Audience</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {study.subscribers || study.followers || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Growth</p>
                        <p className="font-semibold flex items-center gap-1 text-green-500">
                          <TrendingUp className="h-4 w-4" />
                          Active
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Strategy:</p>
                      <p className="text-sm text-muted-foreground">{study.strategy}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Key points:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {study.keyPoints.slice(0, 2).map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" variant="outline" asChild>
                      <Link to={`/learning/case-studies/${study.slug}`}>
                        Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudies.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No case studies match your search. Try a different keyword.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

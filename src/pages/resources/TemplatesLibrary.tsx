import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Search, Filter, FileText, Video, Image, Loader2, RefreshCw, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTemplates } from "@/hooks/useTemplates";
import { trackDownload } from "@/utils/analytics";
import type { Template } from "@/types";

const formatIcons = {
  pdf: FileText,
  notion: FileText,
  google_docs: FileText,
  canva: Image,
  video: Video,
};

const PROSE =
  "prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-semibold prose-p:text-foreground/90 max-h-[60vh] overflow-y-auto pr-2";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { templates, loading, error, refetch, incrementDownload } = useTemplates({
    platform: platformFilter,
    type: typeFilter,
    searchQuery: searchQuery,
  });

  const handleDownload = async (template: Template) => {
    trackDownload(template.title || "Template", template.type || "template", "templates-library");

    if (template.id && !String(template.id).startsWith("fallback-")) {
      await incrementDownload(template.id);
    }

    const body = template.content?.trim();
    if (body) {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(template.title || "template")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const url = template.download_url ?? template.downloadUrl;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <SEO
        title="Free Faceless Content Templates — Scripts, Hooks & Calendars | ContentAnonymity"
        description="Download SEO-friendly, human-written templates for faceless TikTok, YouTube, Instagram Reels, Shorts, carousels, hook banks, and brand voice. Each resource is 900+ words of actionable guidance."
        keywords="faceless content templates, TikTok script template, YouTube script outline, Instagram Reels template, YouTube Shorts batch scripting, carousel template, content calendar faceless creator, hook bank, brand voice framework"
        url="https://contentanonymity.com/resources/templates"
        canonical="https://contentanonymity.com/resources/templates"
        type="website"
        breadcrumbItems={[{ name: "Templates Library", url: "https://contentanonymity.com/resources/templates" }]}
        faqData={[
          {
            question: "Are these templates really free to use?",
            answer:
              "Yes. You can read each template on this page, download it as a .txt file, and adapt it for your niche. Always follow platform rules and disclose sponsorships or affiliate links where required.",
          },
          {
            question: "What makes these templates SEO-friendly?",
            answer:
              "They weave natural phrases people search—like faceless YouTube scripts, TikTok hooks, and Instagram Reels strategy—into human, conversational guidance so your captions, titles, and descriptions can rank without keyword stuffing.",
          },
          {
            question: "Do I need to show my face to use these templates?",
            answer:
              "No. Every outline is built for faceless and anonymous creators using voiceover, B-roll, screen recordings, and on-screen text.",
          },
        ]}
      />
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Content Templates Library</h1>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={loading} title="Refresh templates">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Ready-to-use, long-form templates for faceless creators on TikTok, YouTube, and Instagram. Each download
                includes 900+ words of structured scripts, outlines, hook banks, and workflows—written to sound human and
                rank for real search intent.
              </p>
            </div>

            {/* SEO intro */}
            <section className="mb-10 rounded-xl border border-primary/15 bg-muted/30 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Why creators save these templates
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Short-form and long-form algorithms change, but clarity never goes out of style. These resources help you
                batch scripts, tighten hooks, plan carousels, and keep a sustainable posting calendar—without guessing what
                to say next. Whether you are building a faceless YouTube channel, a TikTok theme page, or an Instagram
                education brand, you will find step-by-step language you can adapt to your niche: finance, productivity,
                AI tools, motivation, tech tutorials, and more.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Keywords like <strong>faceless content strategy</strong>, <strong>viral hook formula</strong>,{" "}
                <strong>YouTube Shorts scripting</strong>, and <strong>Instagram carousel SEO</strong> belong in your
                workflow naturally—when your teaching is specific, search traffic and suggested traffic both improve. Use the
                preview on each card to read the full guide, then download the .txt file to edit in Google Docs, Notion, or
                your favorite editor.
              </p>
            </section>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="template-search"
                    name="search"
                    placeholder="Search templates, tags, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="script">Script</SelectItem>
                    <SelectItem value="hook">Hook</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading && (
              <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
                Syncing with your library…
              </p>
            )}

            {error && templates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4 font-semibold">{error}</p>
                <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Convex:</strong> ensure <code className="bg-background px-1 py-0.5 rounded">VITE_CONVEX_URL</code>{" "}
                    is set. Offline fallback templates should load when bundled.
                  </p>
                </div>
              </div>
            )}

            {!error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.length > 0 ? (
                  templates.map((template) => {
                    const FormatIcon = formatIcons[template.file_format as keyof typeof formatIcons] || FileText;
                    return (
                      <Card key={template.id ?? template.slug ?? template.title} className="hover:shadow-lg transition-shadow flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="capitalize">
                              {template.platform}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {template.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{template.title}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {template.download_count || 0}
                              </span>
                              {(template.rating ?? 0) > 0 && <span>⭐ {(template.rating ?? 0).toFixed(1)}</span>}
                              {template.file_format && (
                                <span className="flex items-center gap-1">
                                  <FormatIcon className="h-4 w-4" />
                                  {template.file_format}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {template.content && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full" size="sm">
                                      Read full template
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                                    <DialogHeader>
                                      <DialogTitle>{template.title}</DialogTitle>
                                      <DialogDescription>{template.description}</DialogDescription>
                                    </DialogHeader>
                                    <div className={`${PROSE} text-left`}>
                                      <ReactMarkdown>{template.content}</ReactMarkdown>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button className="w-full" size="sm" onClick={() => handleDownload(template)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Template
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading templates…</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

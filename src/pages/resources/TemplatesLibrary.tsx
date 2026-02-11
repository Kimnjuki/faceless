import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, FileText, Video, Image, Loader2, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTemplates } from "@/hooks/useTemplates";
import type { Template } from "@/types";

const formatIcons = {
  pdf: FileText,
  notion: FileText,
  google_docs: FileText,
  canva: Image,
  video: Video
};

export default function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { templates, loading, error, refetch, incrementDownload } = useTemplates({
    platform: platformFilter,
    type: typeFilter,
    searchQuery: searchQuery
  });

  const handleDownload = async (template: Template) => {
    await incrementDownload(template.id ?? template._id ?? '');
    // Open download URL
    if (template.download_url) {
      window.open(template.download_url, '_blank');
    }
  };

  return (
    <>
      <SEO
        title="Content Templates Library - Free Templates for Faceless Creators | ContentAnonymity"
        description="Download free content templates, scripts, and resources for faceless creators. Scripts, calendars, and planning templates included."
        keywords="content templates, faceless content templates, free templates, content scripts, video templates, faceless creator resources"
        url="https://contentanonymity.com/resources/templates"
        canonical="https://contentanonymity.com/resources/templates"
        type="website"
        breadcrumbItems={[{ name: 'Templates Library', url: 'https://contentanonymity.com/resources/templates' }]}
      />
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Content Templates Library</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh templates"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground">
                Ready-to-use templates for TikTok, YouTube, Instagram, and more. Download, customize, and publish.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="template-search"
                    name="search"
                    placeholder="Search templates..."
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

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Make sure you've run the database setup SQL scripts in Supabase.
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4 font-semibold">{error}</p>
                <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto text-left">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Missing Database Tables:</strong> The templates table doesn't exist in your Supabase database.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    To fix this:
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2 mb-4">
                    <li>Open your Supabase Dashboard</li>
                    <li>Go to SQL Editor</li>
                    <li>Run the SQL script from <code className="bg-background px-1 py-0.5 rounded">MISSING_TABLES_SETUP.sql</code></li>
                    <li>Refresh this page</li>
                  </ol>
                  <p className="text-xs text-muted-foreground">
                    See <code className="bg-background px-1 py-0.5 rounded">FIX_MISSING_TABLES.md</code> for detailed instructions.
                  </p>
                </div>
              </div>
            )}

            {/* Templates Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.length > 0 ? (
                  templates.map((template) => {
                    const FormatIcon = formatIcons[template.file_format as keyof typeof formatIcons] || FileText;
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="capitalize">{template.platform}</Badge>
                        <Badge variant="outline" className="capitalize">{template.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-xl">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {template.download_count || 0}
                          </span>
                          {(template.rating ?? 0) > 0 && (
                            <span>⭐ {(template.rating ?? 0).toFixed(1)}</span>
                          )}
                          {template.file_format && (
                            <span className="flex items-center gap-1">
                              <FormatIcon className="h-4 w-4" />
                              {template.file_format}
                            </span>
                          )}
                        </div>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleDownload(template)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No templates found matching your filters.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add templates in your Supabase database to see them here.
                  </p>
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


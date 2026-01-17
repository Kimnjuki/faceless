import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Calendar, CheckSquare, TrendingUp, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const resources = [
  {
    id: "1",
    title: "Content Calendar Template",
    type: "Spreadsheet",
    category: "Planning",
    downloads: 1234,
    description: "Monthly content planning calendar with posting schedule",
    fileFormat: "Excel",
    icon: Calendar,
  },
  {
    id: "2",
    title: "Profitable Niches List",
    type: "PDF",
    category: "Research",
    downloads: 2156,
    description: "100+ profitable niches with competition analysis",
    fileFormat: "PDF",
    icon: TrendingUp,
  },
  {
    id: "3",
    title: "Video Script Template",
    type: "Document",
    category: "Content",
    downloads: 3456,
    description: "Ready-to-use script template for faceless videos",
    fileFormat: "Word",
    icon: FileText,
  },
  {
    id: "4",
    title: "SEO Checklist",
    type: "PDF",
    category: "Optimization",
    downloads: 1876,
    description: "Complete SEO checklist for YouTube optimization",
    fileFormat: "PDF",
    icon: CheckSquare,
  },
  {
    id: "5",
    title: "Niche Research Worksheet",
    type: "Spreadsheet",
    category: "Research",
    downloads: 987,
    description: "Interactive worksheet for niche validation",
    fileFormat: "Excel",
    icon: TrendingUp,
  },
  {
    id: "6",
    title: "Community Engagement Guide",
    type: "PDF",
    category: "Growth",
    downloads: 1456,
    description: "Strategies for building engaged communities",
    fileFormat: "PDF",
    icon: Users,
  },
];

export default function ResourceDownloads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(resources.map((r) => r.category)))];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Resource Downloads</h1>
              <p className="text-lg text-muted-foreground">
                Checklists, PDFs, spreadsheets, and templates to accelerate your success
              </p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{resource.fileFormat}</span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {resource.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resource
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}








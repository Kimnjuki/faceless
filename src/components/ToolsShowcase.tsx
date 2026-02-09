import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTools } from "@/hooks/useTools";

export default function ToolsShowcase() {
  const { tools, loading } = useTools({
    sortBy: 'rating',
  });

  // Show top 6 highest-rated tools
  const featuredTools = tools.slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading tools...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredTools.length === 0) {
    return null; // Don't show section if no tools
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4">Featured Tools</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top-Rated Content Creation Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the best AI-powered tools trusted by thousands of faceless creators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {tool.category?.name || 'Tool'}
                  </Badge>
                  {(tool.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{(tool.rating ?? 0).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                {tool.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {tool.description}
                  </CardDescription>
                )}
                {tool.pricing && (
                  <div className="text-lg font-semibold text-primary mt-2">
                    {tool.pricing}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <Button 
                  className="w-full" 
                  variant="outline"
                  asChild
                >
                  <Link to="/tools/all">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link to="/tools/all">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/learning-paths">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn How to Use Tools
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


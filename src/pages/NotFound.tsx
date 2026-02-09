import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Home, Search, ArrowLeft, BookOpen, TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 - Page Not Found | ContentAnonymity"
        description="The page you're looking for doesn't exist. Explore our faceless content strategies, tools, and resources to build your anonymous content empire."
        noindex={true}
        canonical="https://contentanonymity.com/404"
        url="https://contentanonymity.com/404"
      />
      <Header />
      <main className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="text-6xl font-bold text-primary mb-4">404</div>
              <CardTitle className="text-3xl mb-2">Page Not Found</CardTitle>
              <CardDescription className="text-lg">
                Oops! The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Don't worry, we've got plenty of resources to help you build your faceless content business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blog">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Articles
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Popular Resources</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/getting-started">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Getting Started Guide
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/blog">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Content Strategies
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/tools/calculator">
                      <Search className="mr-2 h-4 w-4" />
                      Profitability Calculator
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/tools/niche-quiz">
                      <Search className="mr-2 h-4 w-4" />
                      Niche Finder Quiz
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="link" 
                  onClick={() => window.history.back()}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}







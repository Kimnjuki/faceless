import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLeads } from "@/hooks/useLeads";
import { trackButtonClick } from "@/utils/analytics";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { createLead, loading } = useLeads();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createLead(email, 'header');
      toast.success("Success! Check your email for free tips.");
      setEmail("");
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b glass border-primary/10 shadow-modern">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-all group">
            <div className="flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md shadow-lg border border-primary/10 group-hover:shadow-xl group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
              <img 
                src="/logo-icon.svg" 
                alt="ContentAnonymity" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="hidden sm:block text-xl font-bold gradient-text">
              ContentAnonymity
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300" aria-hidden="true"></span>
            </Link>
            <Link to="/getting-started" className="text-sm font-semibold hover:text-primary transition-colors relative group">
              Getting Started
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300" aria-hidden="true"></span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Content Strategies <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/blog">All Strategies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pillar/youtube">YouTube Automation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pillar/tiktok">TikTok Growth</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pillar/instagram">Instagram Reels</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/products/all" className="text-sm font-medium hover:text-primary transition-colors">
              Monetization
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Tools & AI <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/tools/all">Tool Comparison</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/calculator">Profitability Calculator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/niche-quiz">Niche Finder Quiz</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/seo-audit">SEO Audit Tool</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/keyword-research">Keyword Research</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/backlink-checker">Backlink Checker</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/performance">Performance Monitor</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/dashboard/community" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Learning <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/learning-paths">Learning Paths</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/platform-guides">Platform Guides</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/getting-started">Start Here</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Resources <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/resources/templates">Templates Library</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/resources/niches">Niche Database</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools/all">Tool Comparison</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <form 
            onSubmit={handleEmailSubmit} 
            className="hidden md:flex items-center gap-2"
            aria-label="Email subscription form"
          >
            <label htmlFor="header-email" className="sr-only">
              Enter your email to get free tips
            </label>
            <Input
              id="header-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-48"
              required
              aria-required="true"
              aria-label="Email address"
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={loading} 
              aria-label="Subscribe to get free tips"
              onClick={() => trackButtonClick('get-free-tips', 'header')}
            >
              <Mail className="h-4 w-4 mr-1" aria-hidden="true" />
              Get Free Tips
            </Button>
          </form>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth/signup">Get Started</Link>
            </Button>
          </div>

          <button 
            className="lg:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden border-t bg-background p-4"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col gap-4" aria-label="Main navigation">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/getting-started" className="text-sm font-medium hover:text-primary transition-colors">
              Getting Started
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Content Strategies
            </Link>
            <Link to="/products/all" className="text-sm font-medium hover:text-primary transition-colors">
              Monetization
            </Link>
            <Link to="/tools/all" className="text-sm font-medium hover:text-primary transition-colors">
              Tools & AI
            </Link>
            <Link to="/dashboard/community" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog & Articles
            </Link>
            <Link to="/resources/templates" className="text-sm font-medium hover:text-primary transition-colors">
              Templates Library
            </Link>
            <Link to="/resources/niches" className="text-sm font-medium hover:text-primary transition-colors">
              Niche Database
            </Link>
            <form onSubmit={handleEmailSubmit} className="flex gap-2 pt-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="sm" disabled={loading}>
                Get Tips
              </Button>
            </form>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

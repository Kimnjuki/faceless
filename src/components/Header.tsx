import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ForeMediaAd from "@/components/ForeMediaAd";
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
                alt="" 
                className="h-8 w-8 object-contain"
                loading="eager"
                aria-hidden="true"
              />
            </div>
            <span className="hidden sm:block text-xl font-bold gradient-text">
              ContentAnonymity
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" role="navigation" aria-label="Main navigation">
            <Link
              to="/getting-started"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Getting Started
            </Link>
            <Link
              to="/blog"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Blog
            </Link>
            <Link
              to="/platform-guides"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Platform Guides
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
                  aria-label="Faceless content menu"
                >
                  Faceless Content <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[220px]">
                <DropdownMenuItem asChild>
                  <Link to="/faceless-content">Faceless Content Hub</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faceless-content/youtube">YouTube</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faceless-content/monetization">Monetization</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/tools/all"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Tools
            </Link>
            <Link
              to="/learning/case-studies"
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
            >
              Case Studies
            </Link>
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
              name="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
        {/* ForeMedia: C1 (Logo area), C2 (Menu area) */}
        <div className="hidden lg:flex items-center justify-center gap-4 py-2 border-t border-primary/5">
          <div className="min-h-[50px] flex-1 max-w-[728px] flex justify-center">
            <ForeMediaAd slot="c1" className="min-h-[50px]" />
          </div>
          <div className="min-h-[50px] w-[300px] shrink-0 flex justify-center">
            <ForeMediaAd slot="c2" className="min-h-[50px]" />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden border-t bg-background p-4"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col gap-2" role="navigation" aria-label="Mobile navigation menu">
            <Link to="/getting-started" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Getting Started</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/platform-guides" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Platform Guides</Link>
            <Link to="/faceless-content" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Faceless Content</Link>
            <Link to="/faceless-content/youtube" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10 pl-6" onClick={() => setMobileMenuOpen(false)}>YouTube</Link>
            <Link to="/faceless-content/monetization" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10 pl-6" onClick={() => setMobileMenuOpen(false)}>Monetization</Link>
            <Link to="/tools/all" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Tools</Link>
            <Link to="/learning/case-studies" className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>Case Studies</Link>
            <form onSubmit={handleEmailSubmit} className="flex gap-2 pt-2">
              <Input
                id="mobile-email"
                name="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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

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
import { supabaseApi } from "@/config/supabase";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabaseApi.createLead(email, 'header');
      toast.success("Success! Check your email for free tips.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-bold text-xl">FSH</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/getting-started" className="text-sm font-medium hover:text-primary transition-colors">
              Getting Started
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
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/dashboard/community" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
            
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
          </nav>

          <form onSubmit={handleEmailSubmit} className="hidden md:flex items-center gap-2">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-48"
              required
            />
            <Button type="submit" size="sm" disabled={loading}>
              <Mail className="h-4 w-4 mr-1" />
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

          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4">
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
              Resources
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

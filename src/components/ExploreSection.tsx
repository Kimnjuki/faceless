import { Link } from "react-router-dom";
import { BookOpen, BarChart3, Scale, FileText, Wrench, Target } from "lucide-react";

/** Indexable internal links only (Ahrefs P2 — no noindex stubs). */
const exploreLinks = [
  { label: "Getting Started", href: "/getting-started", icon: BookOpen },
  { label: "Blog & Strategies", href: "/blog", icon: BookOpen },
  { label: "Platform Guides", href: "/platform-guides", icon: BookOpen },
  { label: "Faceless Content Hub", href: "/faceless-content", icon: BookOpen },
  { label: "YouTube Hub", href: "/faceless-content/youtube", icon: BarChart3 },
  { label: "Monetization Hub", href: "/faceless-content/monetization", icon: BarChart3 },
  { label: "Case Studies", href: "/learning/case-studies", icon: BarChart3 },
  { label: "Niche Database", href: "/resources/niches", icon: Target },
  { label: "Creator Tools", href: "/tools/all", icon: Wrench },
  { label: "Niche Quiz", href: "/tools/niche-quiz", icon: Target },
  { label: "Calculator", href: "/tools/calculator", icon: BarChart3 },
  { label: "SEO Audit", href: "/tools/seo-audit", icon: Wrench },
  { label: "Keyword Research", href: "/tools/keyword-research", icon: Target },
  { label: "Backlink Checker", href: "/tools/backlink-checker", icon: Wrench },
  { label: "Performance", href: "/tools/performance", icon: BarChart3 },
  { label: "Starter Kit", href: "/starter-kit", icon: FileText },
  { label: "About", href: "/about", icon: FileText },
  { label: "Privacy Policy", href: "/privacy-policy", icon: FileText },
  { label: "Terms of Service", href: "/terms", icon: Scale },
];

export default function ExploreSection() {
  return (
    <section className="py-16 border-t border-primary/10" aria-labelledby="explore-heading">
      <div className="container mx-auto px-4">
        <p id="explore-heading" className="text-2xl md:text-3xl font-bold text-center mb-10">
          Explore ContentAnonymity
        </p>
        <nav className="flex flex-wrap justify-center gap-3" aria-label="Explore site pages">
          {exploreLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-primary/10 text-sm font-medium transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

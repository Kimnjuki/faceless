import { Link } from "react-router-dom";
import { BookOpen, LayoutTemplate, BarChart3, Users, FileText, Scale } from "lucide-react";

/**
 * Explore section: internal links to key pages so crawlers and users can reach them (fixes "No inbound links").
 */
/** Internal links to fix orphan pages (Ahrefs: "Orphan page has no incoming internal links") */
const exploreLinks = [
  { label: "Blog & Strategies", href: "/blog", icon: BookOpen },
  { label: "Learning Paths", href: "/learning-paths", icon: BookOpen },
  { label: "Platform Guides", href: "/platform-guides", icon: BookOpen },
  { label: "Case Studies", href: "/learning/case-studies", icon: BarChart3 },
  { label: "Live Workshops", href: "/learning/workshops", icon: BookOpen },
  { label: "Resource Downloads", href: "/learning/resources", icon: FileText },
  { label: "LiveWire News", href: "/news", icon: FileText },
  { label: "Templates Library", href: "/resources/templates", icon: LayoutTemplate },
  { label: "Niche Database", href: "/resources/niches", icon: BarChart3 },
  { label: "Tool Comparison", href: "/tools/all", icon: BarChart3 },
  { label: "Niche Quiz", href: "/tools/niche-quiz", icon: BarChart3 },
  { label: "Calculator", href: "/tools/calculator", icon: BarChart3 },
  { label: "SEO Audit Tool", href: "/tools/seo-audit", icon: BarChart3 },
  { label: "Keyword Research", href: "/tools/keyword-research", icon: BarChart3 },
  { label: "Backlink Checker", href: "/tools/backlink-checker", icon: BarChart3 },
  { label: "Performance Monitor", href: "/tools/performance", icon: BarChart3 },
  { label: "YouTube Automation", href: "/pillar/youtube", icon: BarChart3 },
  { label: "TikTok Growth", href: "/pillar/tiktok", icon: BarChart3 },
  { label: "Instagram Reels", href: "/pillar/instagram", icon: BarChart3 },
  { label: "Member Directory", href: "/community/members", icon: Users },
  { label: "Community Events", href: "/community/events", icon: Users },
  { label: "Challenges", href: "/community/challenges", icon: Users },
  { label: "Privacy Policy", href: "/privacy-policy", icon: FileText },
  { label: "Terms of Service", href: "/terms-of-service", icon: Scale },
];

export default function ExploreSection() {
  return (
    <section className="py-16 border-t border-primary/10" aria-labelledby="explore-heading">
      <div className="container mx-auto px-4">
        <h2 id="explore-heading" className="text-2xl md:text-3xl font-bold text-center mb-10">
          Explore ContentAnonymity
        </h2>
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

import { Link } from "react-router-dom";
import ForeMediaAd from "@/components/ForeMediaAd";

/** Indexable destinations only — no noindex stubs (Ahrefs health P2). */
const footerSections = [
  {
    title: "Get Started",
    links: [
      { label: "Getting Started", href: "/getting-started" },
      { label: "Faceless Content Hub", href: "/faceless-content" },
      { label: "YouTube Hub", href: "/faceless-content/youtube" },
      { label: "Monetization Hub", href: "/faceless-content/monetization" },
      { label: "Creator Tools", href: "/tools/all" },
      { label: "Profitability Calculator", href: "/tools/calculator" },
      { label: "Niche Finder Quiz", href: "/tools/niche-quiz" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Platform Guides", href: "/platform-guides" },
      { label: "Case Studies", href: "/learning/case-studies" },
      { label: "YouTube Faceless Strategy", href: "/platform-guides/youtube-faceless-strategy" },
      { label: "TikTok Faceless Virality", href: "/platform-guides/tiktok-faceless-virality" },
      { label: "Instagram Faceless Aesthetic", href: "/platform-guides/instagram-faceless-aesthetic" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Niche Database", href: "/resources/niches" },
      { label: "Starter Kit", href: "/starter-kit" },
      { label: "Trust & Safety", href: "/trust-and-safety" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 glass bg-muted/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-all group">
              <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md shadow-lg border border-primary/10 group-hover:shadow-xl group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                <img
                  src="/logo-icon.svg"
                  alt=""
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold gradient-text">ContentAnonymity</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Privacy-first guides and tools for building profitable faceless content businesses.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <nav
              key={section.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-labelledby={`footer-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <p
                id={`footer-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-bold text-base mb-5 gradient-text"
              >
                {section.title}
              </p>
              <ul className="space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex justify-center my-8">
          <ForeMediaAd slot="footer" className="min-h-[90px]" wrapperClassName="w-full max-w-[970px] mx-auto" />
        </div>

        <div className="border-t border-primary/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="font-medium">
            © 2026{" "}
            <Link to="/" className="gradient-text font-bold hover:underline">
              ContentAnonymity
            </Link>
            . All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              LinkedIn
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

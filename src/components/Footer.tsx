import { Link } from "react-router-dom";
import ForeMediaAd from "@/components/ForeMediaAd";

const footerSections = [
  {
    title: "Get Started",
    links: [
      { label: "Getting Started", href: "/getting-started" },
      { label: "All Products", href: "/products/all" },
      { label: "Tool Comparison", href: "/tools/all" },
      { label: "YouTube Automation", href: "/pillar/youtube" },
      { label: "TikTok Growth", href: "/pillar/tiktok" },
      { label: "SEO Audit Tool", href: "/tools/seo-audit" },
      { label: "Keyword Research", href: "/tools/keyword-research" },
      { label: "Backlink Checker", href: "/tools/backlink-checker" },
      { label: "Performance Monitor", href: "/tools/performance" }
    ]
  },
  {
    title: "Learning",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Learning Paths", href: "/learning-paths" },
      { label: "Platform Guides", href: "/platform-guides" },
      { label: "Case Studies", href: "/learning/case-studies" },
      { label: "Live Workshops", href: "/learning/workshops" },
      { label: "Resource Downloads", href: "/learning/resources" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "LiveWire News", href: "/news" },
      { label: "Templates Library", href: "/resources/templates" },
      { label: "Niche Database", href: "/resources/niches" },
      { label: "Niche Quiz", href: "/tools/niche-quiz" },
      { label: "Calculator", href: "/tools/calculator" },
      { label: "Member Directory", href: "/community/members" },
      { label: "Community Events", href: "/community/events" },
      { label: "Challenges", href: "/community/challenges" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 glass bg-muted/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
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
              <span className="text-xl font-bold gradient-text">
                ContentAnonymity
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering faceless creators to build profitable digital businesses with complete anonymity and AI-powered automation.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <nav key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }} aria-labelledby={`footer-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <h3 id={`footer-${section.title.toLowerCase().replace(/\s+/g, '-')}`} className="font-bold text-base mb-5 gradient-text">{section.title}</h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link, i) => (
                  <li key={i}>
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

        {/* ForeMedia FOOTER banner */}
        <div className="flex justify-center my-8">
          <ForeMediaAd slot="footer" className="min-h-[90px]" wrapperClassName="w-full max-w-[970px] mx-auto" />
        </div>
        
        <div className="border-t border-primary/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="font-medium">© 2025 <span className="gradient-text font-bold">ContentAnonymity</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium hover:scale-110 transform duration-300">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium hover:scale-110 transform duration-300">LinkedIn</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium hover:scale-110 transform duration-300">YouTube</a>
          </div>
        </div>
      </div>
      {/* ForeMedia FOOTER_FLOAT - sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none [&>div]:pointer-events-auto">
        <ForeMediaAd slot="footer_float" className="min-h-[50px]" />
      </div>
    </footer>
  );
}

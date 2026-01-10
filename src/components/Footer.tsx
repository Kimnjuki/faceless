import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Products",
    links: [
      { label: "Getting Started", href: "/getting-started" },
      { label: "Courses", href: "/dashboard/courses" },
      { label: "Tools", href: "/tools/all" },
      { label: "Community", href: "/dashboard/community" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Niche Quiz", href: "/tools/niche-quiz" },
      { label: "Calculator", href: "/tools/calculator" },
      { label: "Success Stories", href: "/blog" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" }
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
                  alt="ContentAnonymity" 
                  className="h-10 w-10 object-contain"
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
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="font-bold text-base mb-5 gradient-text">{section.title}</h3>
              <ul className="space-y-3">
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
            </div>
          ))}
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
    </footer>
  );
}

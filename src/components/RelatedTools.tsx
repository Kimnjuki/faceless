import { Link } from "react-router-dom";

const TOOLS = [
  { href: "/tools/calculator", label: "Profitability Calculator" },
  { href: "/tools/niche-quiz", label: "Niche Finder Quiz" },
  { href: "/tools/seo-audit", label: "SEO Audit" },
  { href: "/tools/keyword-research", label: "Keyword Research" },
  { href: "/tools/backlink-checker", label: "Backlink Checker" },
  { href: "/tools/performance", label: "Performance Monitor" },
  { href: "/tools/all", label: "All Creator Tools" },
];

export default function RelatedTools({ currentPath }: { currentPath: string }) {
  const others = TOOLS.filter((t) => t.href !== currentPath);
  return (
    <section className="mt-12 border-t border-primary/10 pt-8" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-xl font-bold mb-4">
        Related creator tools
      </h2>
      <ul className="flex flex-wrap gap-3">
        {others.map((t) => (
          <li key={t.href}>
            <Link
              to={t.href}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        Also see the{" "}
        <Link to="/resources/niches" className="text-primary hover:underline">
          niche database
        </Link>
        ,{" "}
        <Link to="/blog" className="text-primary hover:underline">
          faceless blog
        </Link>
        , and{" "}
        <Link to="/getting-started" className="text-primary hover:underline">
          getting started guide
        </Link>
        .
      </p>
    </section>
  );
}

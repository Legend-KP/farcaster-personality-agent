import Link from "next/link";

const LINKS = [
  { href: "/#studio", label: "Studio" },
  { href: "/#craft", label: "Craft" },
  { href: "/#work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <p className="punch">The next session should be better than the last.</p>
      <nav aria-label="Footer">
        {LINKS.map((link) =>
          link.href.startsWith("/") ? (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ) : (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ),
        )}
      </nav>
      <p className="legal">Emris · Independent game studio · We create games.</p>
    </footer>
  );
}

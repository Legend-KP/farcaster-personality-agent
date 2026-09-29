import Link from "next/link";

export function SiteNav({ variant = "home" }: { variant?: "home" | "page" }) {
  return (
    <header className={`nav nav-${variant}`}>
      <Link href="/" className="nav-brand" aria-label="Emris home">
        <span className="nav-mark" aria-hidden />
        <span className="nav-name">Emris</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {variant === "page" ? (
          <Link href="/" className="nav-cta nav-back">
            ← Back
          </Link>
        ) : (
          <Link href="/contact" className="nav-cta">
            Start a project
          </Link>
        )}
      </nav>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#engine", label: "How it works" },
  { href: "#archetypes", label: "Archetypes" },
  { href: "#trust", label: "Trust & privacy" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/90 backdrop-blur border-b border-line py-4"
          : "border-b border-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-content px-6 sm:px-8 flex items-center justify-between">
        <a href="#top" className="font-display italic text-xl text-paper">
          Kernel
        </a>

        <nav
          className={`
            sm:static sm:flex sm:items-center sm:gap-9 sm:opacity-100 sm:pointer-events-auto sm:translate-y-0 sm:bg-transparent sm:p-0
            fixed inset-x-0 top-[64px] bottom-0 bg-ink flex flex-col items-start gap-6 p-8
            transition-all duration-300
            ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto"}
          `}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted hover:text-paper transition-colors sm:text-[14.5px]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#get-access"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-amber px-[18px] py-[9px] text-sm font-semibold text-ink"
          >
            Get early access
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden text-2xl text-paper"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

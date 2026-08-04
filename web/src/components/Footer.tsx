const FOOT_LINKS = [
  { href: "#engine", label: "How it works" },
  { href: "#archetypes", label: "Archetypes" },
  { href: "#trust", label: "Trust & privacy" },
  { href: "#get-access", label: "Get early access" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-10 sm:py-[50px]">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <a href="#top" className="mb-2.5 block font-display italic text-xl">
              Emris
            </a>
            <p className="max-w-[34ch] text-[13.5px] text-muted">
              A companion with an actual personality — in your messages, not
              another app.
            </p>
          </div>
          <ul className="flex flex-wrap gap-6">
            {FOOT_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13.5px] text-muted transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[34px] border-t border-line pt-[22px] text-[12.5px] text-muted">
          © 2026 Emris. Not affiliated with any messaging platform mentioned.
        </div>
      </div>
    </footer>
  );
}

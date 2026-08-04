import Reveal from "./Reveal";

const MEMORY_CHIPS = [
  { label: "Sister's birthday", detail: "the 14th" },
  { label: "Mornings", detail: "not a fan, keep it light before 9am" },
  { label: "Quitting vaping", detail: "day 12, don't make it a big deal" },
  { label: "Told Priya", detail: "you'd send the draft by Friday" },
];

export default function Memory() {
  return (
    <section id="memory" className="border-t border-line py-20 sm:py-[110px]">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 sm:px-8 md:grid-cols-2 md:gap-[70px]">
        <Reveal className="flex flex-col gap-3">
          {MEMORY_CHIPS.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-3.5 rounded-xl border border-line bg-surface px-5 py-4 text-[14.5px]"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
              <span>
                <b className="font-semibold text-paper">{c.label}</b>{" "}
                <span className="text-muted">— {c.detail}</span>
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal>
          <div className="eyebrow">What it keeps</div>
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">
            Tell it once.
          </h2>
          <p className="mt-[18px] max-w-[46ch] text-[16.5px] leading-[1.65] text-muted">
            Kernel remembers the things you&rsquo;d otherwise repeat, and lets
            its personality decide what to do with them — not just when to
            remind you, but whether to bring it up at all.
          </p>
          <a
            href="#trust"
            className="mt-5 inline-block border-b border-line-strong pb-0.5 text-[14.5px] text-muted transition-colors hover:border-paper hover:text-paper"
          >
            See everything it remembers →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

const TIERS = [
  {
    num: "TIER 0",
    title: "Always on",
    body: "Talk, remember, and suggest. No approval needed, nothing leaves the conversation.",
  },
  {
    num: "TIER 1",
    title: "Needs your OK",
    body: "Sending a message, booking something, posting on your behalf — drafted and held until you approve it.",
  },
  {
    num: "TIER 2",
    title: "Earned",
    body: "Once you've approved the same kind of action enough times, Emris does it without asking.",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="border-t border-line py-20 sm:py-[110px]">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <Reveal className="mb-14 max-w-[640px]">
          <div className="eyebrow">Control</div>
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">
            It earns the rest.
          </h2>
          <p className="mt-[18px] text-[16.5px] leading-[1.65] text-muted">
            Every Emris starts cautious. As you approve the same kind of
            action enough times, it starts handling that kind on its own —
            one action at a time, never all at once.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.num} className="bg-surface p-[32px_26px]">
                <div className="mb-4 font-mono text-xs tracking-[0.06em] text-amber">
                  {t.num}
                </div>
                <h3 className="mb-2.5 font-display text-lg font-medium">
                  {t.title}
                </h3>
                <p className="text-sm leading-[1.6] text-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-7 max-w-[60ch] text-[14.5px] italic text-muted">
          Even after it&rsquo;s earned Tier 2, a cautious personality may keep
          asking anyway. That&rsquo;s not a limit on it — that&rsquo;s just
          who it is.
        </Reveal>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";
import { archetypes } from "@/data/archetypes";

export default function Archetypes() {
  return (
    <section id="archetypes" className="border-t border-line py-20 sm:py-[110px]">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <Reveal className="mb-14 max-w-[640px]">
          <div className="eyebrow">Starting points</div>
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">
            Five ways to begin
          </h2>
          <p className="mt-[18px] text-[16.5px] leading-[1.65] text-muted">
            Pick a starting personality, or set all ten traits yourself.
            Either way, it&rsquo;s yours to adjust from here.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-5">
            {archetypes.map((a) => (
              <div
                key={a.name}
                className="rounded-[14px] border border-line bg-surface p-[26px_22px] transition-all hover:-translate-y-1 hover:border-line-strong"
              >
                <h3 className="font-display text-[21px] font-medium">
                  {a.name}
                </h3>
                <p className="mt-2 min-h-[42px] text-sm leading-[1.5] text-muted">
                  {a.vibe}
                </p>
                <div className="mt-[18px] flex flex-wrap gap-1.5">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-peri/30 bg-peri/[0.08] px-[9px] py-1 font-mono text-[10.5px] text-peri"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

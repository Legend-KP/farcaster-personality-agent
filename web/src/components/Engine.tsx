import Reveal from "./Reveal";
import TraitWheel from "./TraitWheel";
import { traits } from "@/data/traits";

export default function Engine() {
  return (
    <section id="engine" className="border-t border-line py-20 sm:py-[110px]">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-14 px-6 sm:px-8 md:grid-cols-2 md:gap-[70px]">
        <Reveal>
          <div className="eyebrow">The engine</div>
          <h2 className="font-display text-[28px] font-medium sm:text-[36px]">
            Personality, not prompts
          </h2>
          <p className="mt-[18px] max-w-[46ch] text-[16.5px] leading-[1.65] text-muted">
            Most assistants fake a personality with a tone of voice. Emris
            runs on ten weighted values — the same framework psychologists
            use to describe real people — and those weights decide what it
            does, not just how it sounds.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-x-7 gap-y-3.5 sm:grid-cols-2">
            {traits.map((t) => (
              <div
                key={t.label}
                className="flex justify-between border-b border-line pb-2.5 text-[14.5px]"
              >
                <dt className="text-paper">{t.label}</dt>
                <dd className="text-right font-mono text-[11.5px] text-muted">
                  {t.influence}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="flex justify-center">
          <TraitWheel />
        </Reveal>
      </div>
    </section>
  );
}

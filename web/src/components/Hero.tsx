import MessageDemo from "./MessageDemo";

export default function Hero() {
  return (
    <section className="pt-[150px] pb-24 sm:pt-[190px] sm:pb-[120px]">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 sm:gap-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="max-w-[11.5ch] font-display text-[38px] font-medium leading-[1.1] sm:text-[52px] lg:text-[60px]">
            A companion with <em className="text-amber italic">an actual</em> personality.
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-[1.65] text-muted">
            Emris lives in your texts, remembers what you tell it once, and
            reaches out on its own — the way it does that depends on who it
            is, not a mood you set.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <a
              href="#get-access"
              className="rounded-full bg-amber px-[26px] py-[14px] text-[15px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Get early access
            </a>
            <a
              href="#engine"
              className="border-b border-line-strong pb-0.5 text-[14.5px] text-muted transition-colors hover:border-paper hover:text-paper"
            >
              See how it decides ↓
            </a>
          </div>
        </div>

        <MessageDemo />
      </div>
    </section>
  );
}

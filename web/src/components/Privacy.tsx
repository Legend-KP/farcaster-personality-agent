import Reveal from "./Reveal";

export default function Privacy() {
  return (
    <section className="border-t border-line py-20 sm:py-[110px]">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <Reveal className="flex flex-wrap items-center justify-between gap-10">
          <p className="max-w-[52ch] text-base text-muted">
            <b className="font-semibold text-paper">
              Nothing you tell Kernel is sold, shared, or used to train models
              for anyone else.
            </b>{" "}
            Disconnect and delete everything, any time.
          </p>
          <a
            href="#"
            className="border-b border-line-strong pb-0.5 text-[14.5px] text-muted transition-colors hover:border-paper hover:text-paper"
          >
            Read the privacy commitment →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

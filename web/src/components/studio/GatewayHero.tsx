import Link from "next/link";
import { Reveal } from "./Reveal";

export function GatewayHero() {
  return (
    <section className="gateway" id="gateway">
      <Reveal className="gateway-inner" threshold={0.28}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="gateway-hero"
          src="/gateway/mark.webp"
          alt="An arc, a circle, a blue portal, and a gold gate"
          width={1920}
          height={540}
        />

        <h1 className="gateway-line">
          <span className="rule" aria-hidden />
          <span>We make games</span>
          <span className="rule" aria-hidden />
        </h1>

        <p className="gateway-sub">
          Original worlds, built to be played. <strong>10+ years</strong> in the craft.
        </p>

        <div className="gateway-cta">
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <a href="#craft" className="btn btn-ghost">
            See the craft
          </a>
        </div>
      </Reveal>
    </section>
  );
}

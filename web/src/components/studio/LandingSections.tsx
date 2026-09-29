import type { ReactNode } from "react";
import Link from "next/link";
import {
  CAPABILITIES,
  EXPERTISE,
  FAQ,
  PRACTICE,
  PROCESS,
  STUDIO_FACTS,
} from "@/data/studio";
import { Reveal } from "./Reveal";

function World({
  id,
  bg,
  children,
  className = "",
}: {
  id?: string;
  bg: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`world ${className}`.trim()}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="world-veil" />
      <div className="world-inner">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function LandingSections() {
  return (
    <>
      <World id="studio" bg="/worlds/lunar.webp">
        <Reveal>
          <Kicker>The studio</Kicker>
          <h2>Every game is a world.</h2>
          <div className="prose">
            <p>A rule becomes a loop.</p>
            <p>A loop becomes a session.</p>
            <p>A session becomes a place people come back to.</p>
            <p>
              Emris creates games. We design them, build them, and stay with
              them until strangers can play without us in the room.
            </p>
            <p>
              <strong>Ten years</strong> of that work is why the studio exists.
            </p>
          </div>
        </Reveal>
      </World>

      <World id="craft" bg="/worlds/desert.webp">
        <Reveal>
          <Kicker>Expertise</Kicker>
          <h2>Ten years in the work.</h2>
          <div className="prose">
            <p>
              We have spent more than a decade on the parts of a game that
              have to hold up: the feel, the look, the systems, and the build
              that ships.
            </p>
          </div>
          <dl className="facts">
            {STUDIO_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="subhead">Where the years went</h3>
          <ul className="points">
            {EXPERTISE.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </World>

      <World id="work" bg="/worlds/neon-city.webp">
        <Reveal>
          <Kicker>What we make</Kicker>
          <h2>Games people finish.</h2>
          <div className="prose">
            <p>
              Emris takes on original games and joins teams that already have
              one in production. The job is the same either way: something a
              player can start, understand, and want to play again.
            </p>
          </div>
          <ul className="points">
            {CAPABILITIES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn btn-ghost">
            Start a project
          </Link>
        </Reveal>
      </World>

      <World id="practice" bg="/worlds/ancient-temple.webp">
        <Reveal>
          <Kicker>The practice</Kicker>
          <h2>Built by Emris.</h2>
          <div className="prose">
            <p>
              A small studio that keeps design, engineering, and art in the
              same conversation. We have spent 10+ years learning which ideas
              survive contact with a real player.
            </p>
            <p>
              We do not collect genres for a slide. We take a game from the
              sentence that describes it to a session someone can lose an
              evening to.
            </p>
          </div>
          <ul className="stat-strip">
            {PRACTICE.map((item) => (
              <li key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="punch">We build. We ship. We play.</p>
        </Reveal>
      </World>

      <World id="process" bg="/worlds/volcanic.webp">
        <Reveal>
          <Kicker>How a game gets made</Kicker>
          <h2>From a sentence to a session.</h2>
          <div className="prose">
            <p>The order does not change because the calendar is loud.</p>
          </div>
          <ul className="cards">
            {PROCESS.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <span>{step.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </World>

      <World id="faq" bg="/worlds/underwater.webp" className="world-faq">
        <Reveal>
          <Kicker>Questions</Kicker>
          <h2>FAQ</h2>
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </World>
    </>
  );
}

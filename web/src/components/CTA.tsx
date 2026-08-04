"use client";

import { FormEvent, useState } from "react";
import Reveal from "./Reveal";

export default function CTA() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "joined">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.trim().length < 3) return;

    // TODO: wire to the real waitlist endpoint / email provider.
    setStatus("joined");
    setValue("");
  }

  return (
    <section id="get-access" className="border-t border-line py-20 sm:py-[110px]">
      <Reveal className="mx-auto max-w-content px-6 text-center sm:px-8">
        <h2 className="mx-auto max-w-[16ch] font-display text-[30px] font-medium sm:text-[46px]">
          Meet the version of Emris that&rsquo;s actually yours.
        </h2>
        <p className="mx-auto mt-[18px] max-w-[44ch] text-[16.5px] text-muted">
          Early access is rolling out slowly, on purpose. Leave your details
          and we&rsquo;ll text you when it&rsquo;s your turn.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 flex max-w-[420px] flex-wrap justify-center gap-2.5"
        >
          <label htmlFor="waitlistInput" className="sr-only">
            Phone or email
          </label>
          <input
            id="waitlistInput"
            type="text"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Phone number or email"
            className="min-w-[220px] flex-1 rounded-full border border-line-strong bg-surface px-[18px] py-[13px] text-[14.5px] text-paper placeholder:text-muted"
          />
          <button
            type="submit"
            className="rounded-full bg-amber px-6 py-[13px] text-[14.5px] font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Join the list
          </button>
        </form>

        <p className="mt-4 text-[13px] text-muted" role="status">
          {status === "joined"
            ? "You're on the list — we'll text you soon."
            : "No spam. One text when it's ready, that's it."}
        </p>
      </Reveal>
    </section>
  );
}

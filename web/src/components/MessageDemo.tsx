"use client";

import { useEffect, useRef, useState } from "react";
import { demoMessages } from "@/data/demoMessages";

const ROTATE_MS = 4200;

export default function MessageDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setVisible(false);
    window.setTimeout(() => {
      setActiveIndex(index);
      setVisible(true);
    }, 120);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % demoMessages.length;
        goTo(next);
        return prev;
      });
    }, ROTATE_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = demoMessages[activeIndex];

  return (
    <div className="rounded-[20px] border border-line bg-surface p-6 pb-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          Same day. Different Emris.
        </span>
      </div>

      <p className="text-[12.5px] italic text-muted">
        Context: it&rsquo;s the night before your big presentation.
      </p>

      <div className="mt-4 flex min-h-[132px] items-end">
        <div
          className={`max-w-[92%] rounded-2xl rounded-bl-[4px] border border-line bg-surface-2 px-[18px] py-4 text-[15.5px] leading-[1.55] text-paper transition-all duration-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
          }`}
        >
          {active?.message}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {demoMessages.map((d, i) => (
          <button
            key={d.archetype}
            type="button"
            aria-label={`Show ${d.archetype} message`}
            onClick={() => {
              goTo(i);
              resetTimer();
            }}
            className={`rounded-full border px-[13px] py-2 font-mono text-xs transition-colors ${
              i === activeIndex
                ? "border-amber-dim bg-amber/10 text-amber"
                : "border-line text-muted hover:border-line-strong hover:text-paper"
            }`}
          >
            {d.archetype}
          </button>
        ))}
      </div>
    </div>
  );
}

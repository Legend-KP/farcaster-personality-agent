"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  threshold = 0.18,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={`rise ${className}`.trim()}>
      {children}
    </Tag>
  );
}

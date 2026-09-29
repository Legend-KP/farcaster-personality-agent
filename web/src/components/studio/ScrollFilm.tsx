"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-scrubbed intro.
 * 360 WebP frames in public/frames. A sticky canvas draws the frame that
 * matches progress through a tall section, so scroll-down flies in and
 * scroll-up flies back out. The drawn frame eases toward the scroll target.
 */
const FRAME_COUNT = 360;
const CONTAIN_UNTIL = 108;
const COVER_FROM = 132;
const SOURCE_W = 4;
const SOURCE_H = 3;
const FILM_VH = 760;
const READY_FRAMES = 36;

type FrameSet = "lg" | "sm";

function frameUrl(set: FrameSet, index: number) {
  return `/frames/${set}/${String(index + 1).padStart(4, "0")}.webp`;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function loadOrder(): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (i: number) => {
    if (i >= 0 && i < FRAME_COUNT && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  for (let i = 0; i < 12; i++) push(i);
  for (const step of [24, 12, 6, 3]) {
    for (let i = 0; i < FRAME_COUNT; i += step) push(i);
  }
  for (let i = 0; i < FRAME_COUNT; i++) push(i);
  return order;
}

export function ScrollFilm() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedPct, setLoadedPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const set: FrameSet =
      window.innerWidth * dpr > 1100 || window.innerHeight * dpr > 1100 ? "lg" : "sm";

    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let loadedCount = 0;
    let disposed = false;
    let dirty = true;
    let target = 0;
    let current = 0;
    let lastDrawn = -1;
    let readyFlagged = false;

    const queue = loadOrder();
    let inFlight = 0;
    const CONCURRENCY = 6;

    function pump() {
      while (inFlight < CONCURRENCY && queue.length && !disposed) {
        const idx = queue.shift()!;
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          inFlight--;
          if (disposed) return;
          images[idx] = img;
          loadedCount++;
          dirty = true;
          if (loadedCount % 6 === 0 || loadedCount === FRAME_COUNT) {
            setLoadedPct(Math.round((loadedCount / FRAME_COUNT) * 100));
          }
          if (!readyFlagged && loadedCount >= READY_FRAMES) {
            readyFlagged = true;
            setReady(true);
          }
          pump();
        };
        img.onerror = () => {
          inFlight--;
          pump();
        };
        img.src = frameUrl(set, idx);
      }
    }
    pump();

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      dirty = true;
      lastDrawn = -1;
    }
    resize();

    function onScroll() {
      const rect = wrap!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      target = p * (FRAME_COUNT - 1);
      wrap!.style.setProperty("--film-progress", p.toFixed(4));
      if (p > 0.01) setStarted(true);
    }
    onScroll();

    function nearestLoaded(i: number): number {
      if (images[i]) return i;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (i - d >= 0 && images[i - d]) return i - d;
        if (i + d < FRAME_COUNT && images[i + d]) return i + d;
      }
      return -1;
    }

    function draw(frame: number) {
      const idx = nearestLoaded(frame);
      const cw = canvas!.width;
      const ch = canvas!.height;
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, cw, ch);
      if (idx < 0) return;
      const img = images[idx]!;
      const containScale = Math.min(cw / SOURCE_W, ch / SOURCE_H);
      const coverScale = Math.max(cw / SOURCE_W, ch / SOURCE_H);
      const t = smoothstep(CONTAIN_UNTIL, COVER_FROM, frame);
      const scale = containScale + (coverScale - containScale) * t;
      const dw = SOURCE_W * scale;
      const dh = SOURCE_H * scale;
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    let raf = 0;
    function loop() {
      if (disposed) return;
      const diff = target - current;
      if (Math.abs(diff) < 0.05) current = target;
      else current += diff * 0.22;
      const frame = Math.round(current);
      if (dirty || frame !== lastDrawn) {
        draw(frame);
        lastDrawn = frame;
        dirty = false;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("resize", onScroll);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className={`film${ready ? " is-ready" : ""}${started ? " is-started" : ""}`}
      style={{ height: `${FILM_VH}vh` }}
      aria-label="Emris intro. Scroll to travel through the gate."
    >
      <div className="film-sticky">
        <canvas ref={canvasRef} className="film-canvas" />
        <a className="skip" href="#gateway">
          Skip the intro
        </a>

        <div className="film-loader" role="status" aria-live="polite">
          <span className="film-loader-label">Opening the gate</span>
          <span className="film-loader-bar">
            <span style={{ width: `${loadedPct}%` }} />
          </span>
          <span className="film-loader-pct">{loadedPct}%</span>
        </div>

        <div className="film-hint" aria-hidden>
          <span className="film-hint-text">Scroll to enter</span>
          <span className="film-hint-arrow" />
        </div>

        <div className="film-progress" aria-hidden>
          <span />
        </div>
      </div>
    </section>
  );
}

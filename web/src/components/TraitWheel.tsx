"use client";

import { useEffect, useRef } from "react";
import { traits } from "@/data/traits";

const SIZE = 380;
const CENTER = SIZE / 2;
const R_MAX = 130;
const R_LABEL = 158;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointAt(angleDeg: number, r: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
}

export default function TraitWheel() {
  const polyRef = useRef<SVGPolygonElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const n = traits.length;
  const shapePoints = traits.map((t, i) => pointAt((360 / n) * i, R_MAX * t.value));
  const pointsAttr = shapePoints.map((p) => p.join(",")).join(" ");

  useEffect(() => {
    const poly = polyRef.current;
    const svg = svgRef.current;
    if (!poly || !svg) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const len = poly.getTotalLength();
    poly.style.strokeDasharray = `${len}`;
    poly.style.strokeDashoffset = `${len}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            poly.style.transition = "stroke-dashoffset 1.4s ease";
            poly.style.strokeDashoffset = "0";
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label="Radial chart of ten personality trait weights"
    >
      {RINGS.map((f) => (
        <circle
          key={f}
          cx={CENTER}
          cy={CENTER}
          r={R_MAX * f}
          fill="none"
          stroke="rgba(243,239,231,0.08)"
          strokeWidth={1}
        />
      ))}

      {traits.map((t, i) => {
        const angle = (360 / n) * i;
        const [x2, y2] = pointAt(angle, R_MAX);
        const [lx, ly] = pointAt(angle, R_LABEL);
        const anchor =
          Math.abs(lx - CENTER) < 4 ? "middle" : lx > CENTER ? "start" : "end";
        return (
          <g key={t.label}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x2}
              y2={y2}
              stroke="rgba(243,239,231,0.1)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-muted font-mono text-[9.5px] uppercase tracking-[0.04em]"
            >
              {t.label}
            </text>
          </g>
        );
      })}

      <polygon
        ref={polyRef}
        points={pointsAttr}
        fill="rgba(124,140,245,0.14)"
        stroke="#7c8cf5"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {shapePoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.2} fill="#7c8cf5" />
      ))}
    </svg>
  );
}

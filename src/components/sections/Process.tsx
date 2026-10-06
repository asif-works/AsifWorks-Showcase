"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { PROCESS } from "@/lib/data";

const INK = "#08080a";
const IV = "#ece7dd";
const AC = "#3d4dff";

function StepVisual({ i }: { i: number }) {
  const common = { viewBox: "0 0 400 500", className: "h-full w-full", "aria-hidden": true } as const;
  switch (i) {
    case 0:
      return (
        <svg {...common}>
          {[40, 80, 120, 160].map((r) => (
            <circle key={r} cx="200" cy="250" r={r} fill="none" stroke={IV} strokeOpacity="0.2" />
          ))}
          <path d="M200 250 L200 90 A160 160 0 0 1 338 170 Z" fill={AC} fillOpacity="0.35" className="art-spin" style={{ transformOrigin: "200px 250px", transformBox: "view-box" }} />
          {[
            [250, 180],
            [140, 300],
            [290, 320],
            [170, 150],
          ].map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r="5" fill={k === 0 ? AC : IV} />
          ))}
        </svg>
      );
    case 1: {
      const pts = [
        [80, 120], [160, 90], [240, 160], [320, 110], [300, 250], [200, 300], [110, 260], [150, 400], [280, 390],
      ];
      return (
        <svg {...common}>
          <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={IV} strokeOpacity="0.3" />
          <line x1="80" y1="120" x2="200" y2="300" stroke={IV} strokeOpacity="0.15" />
          <line x1="240" y1="160" x2="110" y2="260" stroke={IV} strokeOpacity="0.15" />
          {pts.map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r={k % 3 === 0 ? 7 : 4} fill={k % 3 === 0 ? AC : IV} />
          ))}
          <text x="200" y="470" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="42" fill={IV}>
            what if…
          </text>
        </svg>
      );
    }
    case 2:
      return (
        <svg {...common}>
          <rect x="40" y="60" width="320" height="380" fill="none" stroke={IV} strokeOpacity="0.3" />
          <rect x="60" y="80" width="280" height="40" fill={IV} fillOpacity="0.12" />
          <rect x="60" y="140" width="170" height="170" fill={AC} />
          <rect x="245" y="140" width="95" height="80" fill={IV} fillOpacity="0.2" />
          <rect x="245" y="230" width="95" height="80" fill={IV} fillOpacity="0.1" />
          {[330, 350, 370].map((y, k) => (
            <rect key={y} x="60" y={y} width={280 - k * 60} height="8" fill={IV} fillOpacity="0.25" />
          ))}
          <rect x="60" y="395" width="110" height="28" rx="14" fill={IV} />
        </svg>
      );
    case 3:
      return (
        <svg {...common}>
          <rect x="30" y="70" width="340" height="360" rx="8" fill={INK} stroke={IV} strokeOpacity="0.2" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={52 + k * 16} cy="92" r="4" fill={IV} fillOpacity="0.25" />
          ))}
          {[
            [60, 150, 0.9, AC],
            [80, 120, 0.6, IV],
            [80, 180, 0.4, IV],
            [100, 140, 0.6, IV],
            [80, 90, 0.4, IV],
            [60, 60, 0.9, AC],
            [60, 200, 0.3, IV],
          ].map(([x, w, o, c], k) => (
            <rect key={k} x={x as number} y={135 + k * 32} width={w as number} height="10" rx="3" fill={c as string} fillOpacity={o as number} />
          ))}
          <text x="340" y="410" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="44" fill={AC}>
            {"</>"}
          </text>
        </svg>
      );
    case 4:
      return (
        <svg {...common}>
          <path d="M50 400 C 140 400, 150 100, 350 100" fill="none" stroke={IV} strokeWidth="3" />
          <line x1="50" y1="400" x2="140" y2="400" stroke={AC} />
          <line x1="350" y1="100" x2="150" y2="100" stroke={AC} />
          <circle cx="140" cy="400" r="7" fill={INK} stroke={AC} strokeWidth="2" />
          <circle cx="150" cy="100" r="7" fill={INK} stroke={AC} strokeWidth="2" />
          <circle cx="50" cy="400" r="6" fill={IV} />
          <circle cx="350" cy="100" r="6" fill={IV} />
          <text x="350" y="460" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="16" fill={IV} fillOpacity="0.6">
            60 FPS · 16.6ms
          </text>
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M40 440 Q 200 420, 340 80" fill="none" stroke={IV} strokeOpacity="0.3" strokeDasharray="6 8" className="art-dash" />
          <circle cx="340" cy="80" r="16" fill={AC} />
          <circle cx="340" cy="80" r="34" fill="none" stroke={AC} strokeOpacity="0.4" />
          <circle cx="340" cy="80" r="56" fill="none" stroke={AC} strokeOpacity="0.15" />
          <text x="40" y="120" fontFamily="Inter Tight Variable, sans-serif" fontWeight="700" fontSize="64" fill={IV} letterSpacing="-3">
            LIVE
          </text>
          <circle cx="200" cy="100" r="7" fill="#c6ff3d" className="animate-pulse" />
        </svg>
      );
  }
}

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      gsap.fromTo(
        "[data-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 55%", end: "bottom 55%", scrub: reduce ? false : 0.4 },
        },
      );
      if (!reduce) {
        gsap.from("[data-proc-head] .mask-inner", {
          yPercent: 110,
          stagger: 0.08,
          duration: 1.4,
          scrollTrigger: { trigger: "[data-proc-head]", start: "top 80%" },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: root },
  );

  // Swap the sticky visual with a vertical wipe
  useEffect(() => {
    const visuals = root.current?.querySelectorAll<HTMLElement>("[data-pvisual]");
    if (!visuals) return;
    const reduce = prefersReducedMotion();
    visuals.forEach((v, i) => {
      gsap.to(v, {
        clipPath: i === active ? "inset(0% 0% 0% 0%)" : i < active ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
        duration: reduce ? 0 : 1,
        ease: EASE.wipe,
      });
      const inner = v.firstElementChild;
      if (inner && !reduce) {
        gsap.to(inner, { scale: i === active ? 1 : 1.15, rotate: i === active ? 0 : i < active ? -4 : 4, duration: 1.2, ease: EASE.reveal });
      }
    });
  }, [active]);

  return (
    <section ref={root} aria-labelledby="proc-title" className="gutter relative z-[1] py-[16vh]">
      <div data-proc-head className="mb-16 md:mb-24">
        <p className="label mb-6 flex items-center gap-3">
          <span className="text-accent-soft">(08)</span> Process
        </p>
        <h2 id="proc-title" className="display text-[clamp(3rem,11vw,10rem)]">
          <span className="mask">
            <span className="mask-inner">From idea</span>
          </span>
          <br />
          <span className="mask">
            <span className="mask-inner">
              to <span className="serif italic normal-case text-accent-soft">impact</span>
            </span>
          </span>
        </h2>
      </div>

      <div className="grid gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
        {/* sticky visual */}
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-[14vh] h-[72vh] overflow-hidden border border-[var(--line)] bg-ink-2">
            {PROCESS.map((p, i) => (
              <div
                key={p.n}
                data-pvisual
                className="absolute inset-0 flex items-center justify-center p-10"
                style={{ clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
              >
                <div className="h-full w-full">
                  <StepVisual i={i} />
                </div>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="display text-[5rem] leading-none text-ivory/90 tabular-nums">{PROCESS[active].n}</span>
              <span className="label">{PROCESS[active].meta}</span>
            </div>
          </div>
        </div>

        {/* timeline */}
        <ol data-steps className="relative md:col-span-6 md:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-[0.45rem] top-0 w-px bg-[var(--line)]" />
          <span
            data-fill
            aria-hidden="true"
            className="absolute bottom-0 left-[0.45rem] top-0 w-px origin-top bg-accent"
            style={{ transform: "scaleY(0)" }}
          />
          {PROCESS.map((p, i) => {
            const on = i === active;
            return (
              <li
                key={p.n}
                data-step
                aria-current={on ? "step" : undefined}
                className="relative flex min-h-[38vh] flex-col justify-center pl-10 md:min-h-[44vh] md:pl-14"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-[0.9rem] w-[0.9rem] -translate-y-1/2 rounded-full border transition-all duration-700 ${
                    on ? "scale-100 border-accent bg-accent" : i < active ? "scale-75 border-accent bg-ink" : "scale-75 border-[var(--line-strong)] bg-ink"
                  }`}
                />
                <span className={`label mb-2 transition-colors duration-700 ${on ? "!text-accent-soft" : ""}`}>
                  {p.n} — {p.meta}
                </span>
                <h3
                  className={`display origin-left text-[clamp(2.8rem,9vw,7.5rem)] transition-all duration-1000 ease-[var(--ease-expo)] md:text-[clamp(3rem,6vw,7rem)] ${
                    on ? "scale-100 opacity-100" : "scale-[0.72] opacity-25"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`body-copy mt-4 max-w-[30rem] transition-all duration-1000 ease-[var(--ease-expo)] ${
                    on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {p.text}
                </p>
                <div className="mt-6 aspect-[4/3] w-full max-w-[22rem] overflow-hidden border border-[var(--line)] bg-ink-2 p-4 md:hidden">
                  <StepVisual i={i} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { STATS } from "@/lib/data";

function Infinity8() {
  return (
    <svg viewBox="0 0 200 100" className="h-[0.7em] w-[1.4em]" aria-hidden="true">
      <path
        data-infinity
        d="M100 50 C 70 10, 20 10, 20 50 C 20 90, 70 90, 100 50 C 130 10, 180 10, 180 50 C 180 90, 130 90, 100 50 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
      />
    </svg>
  );
}

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const items = gsap.utils.toArray<HTMLElement>("[data-stat]");

      items.forEach((item, i) => {
        const num = item.querySelector<HTMLElement>("[data-num]");
        const stat = STATS[i];
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 85%" } });

        if (!reduce) {
          tl.from(item.querySelector("[data-stat-line]"), { scaleX: 0, duration: 1.4, ease: EASE.wipe }, 0).from(
            item.querySelectorAll("[data-stat-fade]"),
            { opacity: 0, y: 16, duration: 1, stagger: 0.08 },
            0.3,
          );
        }

        if (num && Number.isFinite(stat.value)) {
          const counter = { v: 0 };
          const render = () => {
            num.textContent = String(Math.round(counter.v)).padStart(stat.pad, "0");
          };
          if (reduce) {
            counter.v = stat.value;
            render();
          } else {
            render();
            tl.to(counter, { v: stat.value, duration: 2, ease: "power3.out", onUpdate: render }, 0.1);
          }
        } else if (!reduce) {
          tl.fromTo(
            item.querySelector("[data-infinity]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" },
            0.1,
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="gutter relative z-[1] py-[14vh]">
      <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
        <p className="label flex items-center gap-3">
          <span className="text-accent-soft">(07)</span> Impact
        </p>
        <h2 id="stats-title" className="serif max-w-[36rem] text-[clamp(1.8rem,3.4vw,3.2rem)] italic leading-[1.05] md:text-right">
          Numbers that describe a mindset, not a headcount.
        </h2>
      </div>

      <dl className="grid grid-cols-2 gap-x-[var(--gutter)] gap-y-14 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} data-stat className="relative flex flex-col pt-6">
            <span data-stat-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--line-strong)]" />
            <dt className="order-2 mt-4">
              <span data-stat-fade className="block text-[0.95rem] font-medium uppercase tracking-[-0.01em] text-ivory">
                {s.label}
              </span>
              <span data-stat-fade className="label mt-1 block">
                {s.note}
              </span>
            </dt>
            <dd className="display order-1 flex items-baseline text-[clamp(3.6rem,15vw,7rem)] tabular-nums md:text-[7.4vw]">
              {Number.isFinite(s.value) ? (
                <>
                  <span data-num>{String(s.value).padStart(s.pad, "0")}</span>
                  {s.suffix && <span className="text-[0.45em] text-accent-soft">{s.suffix}</span>}
                </>
              ) : (
                <span className="flex h-[0.86em] items-center text-accent-soft" aria-label="Infinite">
                  <Infinity8 />
                </span>
              )}
            </dd>
            <span aria-hidden="true" className="label absolute right-0 top-2">
              0{i + 1}
            </span>
          </div>
        ))}
      </dl>
    </section>
  );
}

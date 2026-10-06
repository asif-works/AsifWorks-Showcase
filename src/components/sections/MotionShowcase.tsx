"use client";

import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import Marquee from "@/components/ui/Marquee";

const ROWS = [
  { word: "Design", dir: -1 },
  { word: "Motion", dir: 1 },
  { word: "Code", dir: -1 },
  { word: "Experience", dir: 1 },
];

function Star() {
  return (
    <svg viewBox="0 0 40 40" className="mx-[0.25em] inline-block h-[0.42em] w-[0.42em] shrink-0" aria-hidden="true">
      <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Built for screen recordings: giant words sweep across in opposite
 * directions, skewing with scroll velocity, threaded with speed lines and
 * closed by an infinite, velocity-reactive marquee.
 */
export default function MotionShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-mrow]");

      rows.forEach((row, i) => {
        const dir = ROWS[i].dir;
        gsap.fromTo(
          row,
          { xPercent: dir === 1 ? -30 : 0 },
          {
            xPercent: dir === 1 ? 0 : -30,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.4 },
          },
        );
      });

      // Velocity skew shared by every row
      const skewTo = rows.map((r) => gsap.quickTo(r, "skewX", { duration: 0.6, ease: "power3.out" }));
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const s = gsap.utils.clamp(-14, 14, self.getVelocity() / -260);
          skewTo.forEach((fn, i) => fn(s * ROWS[i].dir));
        },
      });

      gsap.from("[data-speed]", {
        scaleX: 0,
        transformOrigin: (i: number) => (i % 2 ? "100% 50%" : "0% 50%"),
        duration: 1.6,
        ease: "expo.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="motion-title" className="relative z-[1] overflow-hidden py-[14vh]">
      <div className="gutter mb-12 flex items-end justify-between gap-6">
        <p className="label flex items-center gap-3">
          <span className="text-accent-soft">(06)</span> Motion
        </p>
        <h2 id="motion-title" className="label text-right">
          Design · Motion · Code · Experience
        </h2>
      </div>

      <div className="flex flex-col gap-[2.2vh]">
        {ROWS.map((row, i) => (
          <Fragment key={row.word}>
            <div
              data-speed
              className={`speed-line ${i % 2 ? "reverse" : ""} ${i === 1 ? "accent" : ""}`}
              style={{ ["--speed" as string]: `${5 + i * 2}s`, ["--dash" as string]: `${80 + i * 40}px`, ["--gap" as string]: `${200 + i * 60}px` }}
              aria-hidden="true"
            />
            <div aria-hidden="true" className="overflow-visible">
              <div data-mrow className="display flex w-max items-center whitespace-nowrap text-[clamp(4rem,17vw,17rem)] will-change-transform">
                {Array.from({ length: 6 }, (_, k) => (
                  <span key={k} className="flex items-center">
                    <span
                      className={
                        k % 2 === 0
                          ? i === 1
                            ? "serif italic normal-case text-accent-soft"
                            : ""
                          : "outline-text"
                      }
                    >
                      {row.word}
                    </span>
                    <Star />
                  </span>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
        <div data-speed className="speed-line reverse" style={{ ["--speed" as string]: "9s" }} aria-hidden="true" />
      </div>

      <div className="-mx-[4vw] mt-[10vh] -rotate-2 border-y border-[var(--line-strong)] bg-accent py-4 md:py-6">
        <Marquee duration={22}>
          {["Design", "Build", "Animate", "Interact", "Impress"].map((w) => (
            <span key={w} className="display flex items-center text-[clamp(2.4rem,7vw,6.5rem)]">
              <span className="px-[0.35em]">{w}</span>
              <span className="text-ink">•</span>
            </span>
          ))}
        </Marquee>
      </div>
      <div className="-mx-[4vw] mt-[-1.2rem] rotate-1 border-y border-[var(--line)] bg-ink-2 py-3">
        <Marquee duration={30} reverse>
          {Array.from({ length: 4 }, (_, k) => (
            <span key={k} className="label flex items-center gap-8 px-4 !text-ivory">
              <span>Available for select projects — 2026</span>
              <span className="text-accent-soft">✶</span>
              <span>Based in Doha, working worldwide</span>
              <span className="text-accent-soft">✶</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

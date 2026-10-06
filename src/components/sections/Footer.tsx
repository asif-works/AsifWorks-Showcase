"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { SITE } from "@/lib/data";
import { useApp } from "@/components/providers/AppProvider";
import LocalTime from "@/components/ui/LocalTime";

/**
 * Curtain footer: it tucks beneath the rounded contact section and its
 * content drifts up from below (a parallax "curtain") while the giant
 * wordmark rises letter by letter.
 */
export default function Footer() {
  const { lenis } = useApp();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-fw]",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "bottom bottom", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        "[data-footer-inner]",
        { yPercent: -45, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <footer ref={root} className="relative z-[1] -mt-[3rem] overflow-hidden bg-ink-2 pt-[calc(3rem+8vh)]">
      <div data-footer-inner className="gutter flex flex-col">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--line)] pb-6">
          <p className="serif max-w-[24rem] text-[clamp(1.4rem,2.4vw,2rem)] italic leading-[1.1]">{SITE.tagline}</p>
          <div className="flex items-center gap-8">
            <LocalTime className="label" />
            <button type="button" onClick={toTop} className="roll-host label flex items-center gap-2 !text-ivory" data-cursor="open">
              <span className="roll">
                <span>Back to top</span>
                <span aria-hidden="true">Back to top</span>
              </span>
              ↑
            </button>
          </div>
        </div>

        <p
          aria-label={SITE.name}
          className="display flex justify-center overflow-hidden pt-4 text-[17.6vw] leading-[0.82] tracking-[-0.065em]"
        >
          {SITE.name.split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
              <span data-fw className="inline-block">
                {c}
              </span>
            </span>
          ))}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-5">
          <span className="label">© {new Date().getFullYear()} {SITE.name}</span>
          <span className="label">{SITE.location}</span>
          <span className="label">Designed &amp; built in-house</span>
        </div>
      </div>
    </footer>
  );
}

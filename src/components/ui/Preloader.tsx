"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useApp } from "@/components/providers/AppProvider";
import Logo from "@/components/ui/Logo";

const STEPS = [0, 25, 48, 76, 100];

/**
 * Opening sequence (≈4s):
 *  00–01  black, the mark appears
 *  01–02  counter 00 → 25 → 48 → 76 → 100
 *  02–03  a hairline expands across the viewport
 *  03–04  the screen splits open onto the hero
 */
export default function Preloader() {
  const { introDone, completeIntro, setScrollLocked } = useApp();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (introDone) return;
      setScrollLocked(true);
      window.scrollTo(0, 0);

      const finish = () => {
        setScrollLocked(false);
        completeIntro();
      };

      if (prefersReducedMotion()) {
        gsap.to(root.current, { opacity: 0, duration: 0.5, delay: 0.6, onComplete: finish });
        return;
      }

      const digits = gsap.utils.toArray<HTMLElement>("[data-digit-col]");
      const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

      tl.from("[data-pl-mark]", { scale: 0.4, opacity: 0, rotate: -90, duration: 1.1 }, 0.15)
        .from("[data-pl-word] > span", { yPercent: 110, duration: 1, stagger: 0.04 }, 0.35)
        .from("[data-pl-meta]", { opacity: 0, duration: 0.6, stagger: 0.1 }, 0.5)
        .from("[data-pl-counter]", { yPercent: 100, duration: 0.8 }, 0.8);

      // Counter: each step rolls the two digit columns to the new value
      STEPS.slice(1).forEach((value, i) => {
        const at = 1.0 + i * 0.26;
        const str = value === 100 ? "99" : String(value).padStart(2, "0");
        tl.to(digits[0], { yPercent: -Number(str[0]) * 10, duration: 0.5, ease: "power3.inOut" }, at);
        tl.to(digits[1], { yPercent: -Number(str[1]) * 10, duration: 0.5, ease: "power3.inOut" }, at);
        tl.to("[data-pl-bar]", { scaleX: value / 100, duration: 0.5, ease: "power3.inOut" }, at);
      });
      tl.set("[data-pl-hundred]", { opacity: 1 }, 2.1).set("[data-pl-counter]", { opacity: 0 }, 2.1);

      // Line expands across the viewport
      tl.to("[data-pl-content]", { opacity: 0, y: -12, duration: 0.45, ease: "power2.in" }, 2.3)
        .to("[data-pl-hundred]", { opacity: 0, duration: 0.3 }, 2.3)
        .fromTo(
          "[data-pl-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: EASE.wipe },
          2.35,
        )
        // Split
        .to("[data-pl-top]", { yPercent: -100, duration: 1.1, ease: EASE.wipe }, 3.25)
        .to("[data-pl-bottom]", { yPercent: 100, duration: 1.1, ease: EASE.wipe }, 3.25)
        .to("[data-pl-line]", { scaleY: 40, opacity: 0, duration: 0.6, ease: "power2.in" }, 3.2)
        .call(finish, [], 3.45)
        .set(root.current, { display: "none" });
    },
    { scope: root },
  );

  if (introDone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[95]" role="status" aria-label="Loading ASIFWORKS">
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-[#050506]" />
      <div data-pl-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050506]" />

      <div
        data-pl-line
        className="absolute left-0 top-[calc(50%-0.5px)] h-px w-full origin-center bg-ivory"
        style={{ transform: "scaleX(0)" }}
      />

      <div data-pl-content className="gutter absolute inset-0 flex flex-col justify-between py-8">
        <div className="flex items-start justify-between">
          <span data-pl-meta className="label">
            Independent Digital Studio
          </span>
          <span data-pl-meta className="label">
            Showcase — 2026
          </span>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div data-pl-mark>
            <Logo className="h-10 w-10 text-ivory" />
          </div>
          <div data-pl-word className="flex overflow-hidden text-sm font-semibold tracking-[0.35em]">
            {"ASIFWORKS".split("").map((c, i) => (
              <span key={i} className="inline-block">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="w-full max-w-xs">
            <span data-pl-meta className="label mb-2 block">
              Loading experience
            </span>
            <div className="h-px w-full bg-[var(--line)]">
              <div data-pl-bar className="h-px w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          <div className="relative leading-none">
            <div className="overflow-hidden">
            <div data-pl-counter className="display flex text-[clamp(4.5rem,14vw,11rem)] tabular-nums">
              {[0, 1].map((col) => (
                <span key={col} className="relative block h-[0.86em] overflow-hidden">
                  <span data-digit-col className="block">
                    {Array.from({ length: 10 }, (_, n) => (
                      <span key={n} className="block h-[0.86em] text-center">
                        {n}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </div>
            </div>
            <div
              data-pl-hundred
              className="display absolute bottom-0 right-0 text-[clamp(4.5rem,14vw,11rem)] text-accent-soft opacity-0"
            >
              100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

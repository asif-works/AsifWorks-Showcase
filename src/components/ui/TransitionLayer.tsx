"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

export type TransitionHandle = {
  /** Wipe the screen closed and show a typographic label. */
  cover: (label: string) => Promise<void>;
  /** Wipe the screen open again. */
  reveal: () => Promise<void>;
};

/**
 * Two stacked panels (cobalt, then ink) sweep up across the viewport with a
 * kinetic label in between — the site's single "page change" gesture.
 */
const TransitionLayer = forwardRef<TransitionHandle>(function TransitionLayer(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const accent = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const meta = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    cover(label) {
      return new Promise((resolve) => {
        if (!root.current || !word.current) return resolve();
        word.current.textContent = label;
        const reduce = prefersReducedMotion();
        gsap.set(root.current, { visibility: "visible", pointerEvents: "auto" });

        if (reduce) {
          gsap.set([accent.current], { yPercent: 0, opacity: 0 });
          gsap.fromTo(
            panel.current,
            { yPercent: 0, opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "none", onComplete: resolve },
          );
          gsap.set(word.current, { yPercent: 0 });
          return;
        }

        gsap
          .timeline({ onComplete: resolve })
          .set([accent.current, panel.current], { yPercent: 100, opacity: 1 })
          .set(word.current, { yPercent: 110 })
          .set(meta.current, { opacity: 0 })
          .to(accent.current, { yPercent: 0, duration: 0.7, ease: EASE.wipe })
          .to(panel.current, { yPercent: 0, duration: 0.7, ease: EASE.wipe }, 0.1)
          .to(word.current, { yPercent: 0, duration: 0.8, ease: EASE.reveal }, 0.5)
          .to(meta.current, { opacity: 1, duration: 0.4 }, 0.6)
          .to({}, { duration: 0.15 });
      });
    },
    reveal() {
      return new Promise((resolve) => {
        if (!root.current) return resolve();
        const done = () => {
          gsap.set(root.current, { visibility: "hidden", pointerEvents: "none" });
          resolve();
        };
        if (prefersReducedMotion()) {
          gsap.to(panel.current, { opacity: 0, duration: 0.3, ease: "none", onComplete: done });
          return;
        }
        gsap
          .timeline({ onComplete: done })
          .to(word.current, { yPercent: -110, duration: 0.6, ease: "power3.in" })
          .to(meta.current, { opacity: 0, duration: 0.3 }, 0)
          .to(panel.current, { yPercent: -100, duration: 0.85, ease: EASE.wipe }, 0.35)
          .to(accent.current, { yPercent: -100, duration: 0.85, ease: EASE.wipe }, 0.45);
      });
    },
  }));

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
      style={{ visibility: "hidden" }}
    >
      <div ref={accent} className="absolute inset-0 bg-accent" />
      <div
        ref={panel}
        className="absolute inset-0 flex flex-col items-center justify-center bg-ink-2"
      >
        <span className="mask">
          <span
            ref={word}
            className="mask-inner display text-[clamp(3rem,13vw,13rem)] text-ivory"
          />
        </span>
        <span ref={meta} className="label mt-6 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          ASIFWORKS — Loading scene
        </span>
      </div>
    </div>
  );
});

export default TransitionLayer;

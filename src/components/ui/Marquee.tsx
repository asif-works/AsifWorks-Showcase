"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Seconds per loop at rest. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Scroll velocity speeds the loop up and flips its direction. */
  reactive?: boolean;
};

/** Seamless infinite loop: the content is rendered twice and shifted -50%. */
export default function Marquee({ children, duration = 24, reverse = false, className = "", reactive = true }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector("[data-track]");
      const dir = reverse ? -1 : 1;
      const loop = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
      );

      // Only spend frames while on screen
      const vis = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });

      if (!reactive) return () => vis.kill();

      let base = 1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          base = self.direction === 1 ? 1 : -1;
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 400);
          gsap.to(loop, { timeScale: base * boost * dir * dir, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: base, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });
      return () => {
        st.kill();
        vis.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div data-track className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

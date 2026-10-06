"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { useApp } from "@/components/providers/AppProvider";

const HeroObject = dynamic(() => import("./HeroObject"), { ssr: false });

function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-hidden="true">
      {Array.from(text).map((c, i) => (
        <span key={i} className="mask">
          <span data-char className="mask-inner">
            {c === " " ? " " : c}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { introDone } = useApp();
  const root = useRef<HTMLElement>(null);

  /* Kinetic entrance — each word arrives from a different direction */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (!introDone) {
        gsap.set(q("[data-l1] [data-char]"), { yPercent: 115 });
        gsap.set(q("[data-l2] .mask-inner"), { xPercent: -104 });
        gsap.set(q("[data-l3a] .mask-inner"), { yPercent: -115 });
        gsap.set(q("[data-l3b] [data-char]"), { yPercent: 120, rotate: 8 });
        gsap.set(q("[data-l4] .mask-inner"), { xPercent: 104 });
        gsap.set(q("[data-hero-rule]"), { scaleX: 0 });
        gsap.set(q("[data-hero-fade]"), { opacity: 0, y: 14 });
        return;
      }
      if (prefersReducedMotion()) {
        gsap.set(q("[data-char], .mask-inner"), { xPercent: 0, yPercent: 0, rotate: 0 });
        gsap.set(q("[data-hero-rule]"), { scaleX: 1 });
        gsap.to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 0.6 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: EASE.reveal, duration: 1.5 }, delay: 0.05 })
        .to(q("[data-l1] [data-char]"), { yPercent: 0, stagger: 0.045 }, 0)
        .to(q("[data-l2] .mask-inner"), { xPercent: 0, duration: 1.7 }, 0.12)
        .to(q("[data-hero-rule]"), { scaleX: 1, duration: 1.8, ease: EASE.wipe }, 0.2)
        .to(q("[data-l3a] .mask-inner"), { yPercent: 0 }, 0.28)
        .to(q("[data-l3b] [data-char]"), { yPercent: 0, rotate: 0, stagger: { each: 0.04, from: "center" } }, 0.36)
        .to(q("[data-l4] .mask-inner"), { xPercent: 0, duration: 1.7 }, 0.46)
        .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.75);
    },
    { scope: root, dependencies: [introDone] },
  );

  /* Scroll depth — layers drift at different speeds */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        defaults: { ease: "none" },
      });
      tl.to("[data-scroll-depth='1']", { yPercent: -60 }, 0)
        .to("[data-scroll-depth='2']", { yPercent: -110 }, 0)
        .to("[data-scroll-depth='3']", { yPercent: -170 }, 0)
        .to("[data-scroll-depth='4']", { yPercent: -240 }, 0)
        .to("[data-hero-object]", { yPercent: 30, scale: 0.75, opacity: 0.35 }, 0)
        .to("[data-hero-meta]", { opacity: 0, y: -40 }, 0);
    },
    { scope: root },
  );

  /* Mouse depth */
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion() || !root.current) return;
    const layers = gsap.utils.toArray<HTMLElement>("[data-mouse-depth]", root.current).map((el) => {
      const d = Number(el.dataset.mouseDepth);
      return {
        d,
        x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
      };
    });
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.d);
        l.y(ny * l.d * 0.5);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const size = "text-[clamp(3rem,13.4vw,6rem)] md:text-[min(10.4vw,15.5vh)]";

  return (
    <section
      ref={root}
      id="index"
      aria-labelledby="hero-title"
      className="relative flex h-[100svh] min-h-[560px] flex-col overflow-hidden"
    >
      {/* Atmosphere local to the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="perspective-grid opacity-60" />
      </div>

      <div
        data-hero-object
        className="pointer-events-none absolute left-1/2 top-[34%] aspect-square w-[118vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-[-6vw] md:top-1/2 md:w-[min(60vw,96vh)] md:max-w-none md:translate-x-0"
      >
        <div data-mouse-depth="-40" className="h-full w-full">
          <HeroObject active={introDone} className="relative h-full w-full" />
        </div>
      </div>

      {/* Corner ticks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[calc(var(--gutter)*0.6)] hidden md:block">
        {["left-0 top-[var(--nav-h)]", "right-0 top-[var(--nav-h)] rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map(
          (pos) => (
            <span key={pos} data-hero-fade className={`absolute h-3 w-3 border-l border-t border-[var(--line-strong)] ${pos}`} />
          ),
        )}
      </div>

      {/* Meta row */}
      <div data-hero-meta className="gutter relative z-[2] mt-[calc(var(--nav-h)+1.25rem)] flex items-start justify-between gap-6">
        <p data-hero-fade className="label leading-relaxed">
          <span className="text-ivory">Independent digital studio</span>
          <br />
          Doha / Worldwide
        </p>
        <p data-hero-fade className="label hidden text-right leading-relaxed sm:block">
          (N°&nbsp;001) Showcase
          <br />
          25.28° N — 51.53° E
        </p>
      </div>

      {/* Headline */}
      <h1
        id="hero-title"
        aria-label="Digital experiences made impossible to ignore."
        className={`display gutter relative z-[2] mt-auto mb-[clamp(5.5rem,13vh,9rem)] ${size}`}
      >
        <span data-scroll-depth="1" className="block">
          <span data-mouse-depth="18" className="block" data-l1>
            <Chars text="DIGITAL" />
          </span>
        </span>
        <span data-scroll-depth="2" className="block md:pl-[11vw]">
          <span data-mouse-depth="32" className="relative block" data-l2>
            <span className="mask" aria-hidden="true">
              <span className="mask-inner">EXPERIENCES</span>
            </span>
            <span
              data-hero-rule
              aria-hidden="true"
              className="absolute -bottom-[0.06em] left-0 hidden h-px w-[calc(100%+20vw)] origin-left bg-ivory/40 md:block"
            />
          </span>
        </span>
        <span data-scroll-depth="3" className="block">
          <span data-mouse-depth="48" className="flex flex-wrap items-baseline gap-x-[0.22em]">
            <span data-l3a className="mask" aria-hidden="true">
              <span className="mask-inner">MADE</span>
            </span>
            <span data-l3b className="serif italic normal-case text-[1.06em] leading-[0.8] tracking-[-0.03em]">
              <Chars text="impossible" />
            </span>
          </span>
        </span>
        <span data-scroll-depth="4" className="block md:pl-[30vw]">
          <span data-mouse-depth="64" className="flex items-baseline gap-4" data-l4>
            <span className="mask" aria-hidden="true">
              <span className="mask-inner">TO IGNORE.</span>
            </span>
          </span>
        </span>
      </h1>

      {/* Bottom row */}
      <div data-hero-meta className="gutter absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-6 pb-6 md:pb-8">
        <a href="#manifesto" data-hero-fade className="group flex items-center gap-3" aria-label="Scroll to explore">
          <span className="relative block h-10 w-px overflow-hidden bg-[var(--line)]">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.76,0,.24,1)_infinite] bg-ivory" />
          </span>
          <span className="label !text-ivory">Scroll to explore ↓</span>
        </a>
        <p data-hero-fade className="body-copy hidden max-w-[19rem] text-right text-[0.9rem] md:block">
          We design and engineer immersive websites for brands that would rather be remembered than merely seen.
        </p>
        <p data-hero-fade className="label md:hidden">Est. 2026</p>
      </div>
    </section>
  );
}

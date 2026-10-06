"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

function Letters({ text, masked, className = "", attr }: { text: string; masked?: boolean; className?: string; attr: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap ${className}`} aria-hidden="true">
      {Array.from(text).map((c, i) =>
        masked ? (
          <span key={i} className="mask">
            <span className="mask-inner" {...{ [attr]: "" }}>
              {c}
            </span>
          </span>
        ) : (
          <span key={i} className="inline-block" {...{ [attr]: "" }}>
            {c}
          </span>
        ),
      )}
    </span>
  );
}

const STAGES = ["Boring", "Forgettable", "Memorable"];

/**
 * Pinned, scroll-scrubbed sentence. BORING is struck out and shatters,
 * FORGETTABLE fades from memory, DON'T is crossed out, and MEMORABLE rises —
 * leaving "We build memorable websites."
 */
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const boring = q("[data-b]");
      const forget = q("[data-f]");
      const memo = q("[data-m]");

      if (prefersReducedMotion()) {
        gsap.set([boring, forget], { opacity: 0 });
        gsap.set(q("[data-dont-strike]"), { scaleX: 1 });
        gsap.set(q("[data-dont]"), { opacity: 0.35 });
        gsap.set(memo, { yPercent: 0 });
        gsap.set(q("[data-stage-dot]"), { x: 0 });
        return;
      }

      gsap.set(forget, { yPercent: 110 });
      gsap.set(memo, { yPercent: 115, rotate: 6 });
      gsap.set(q("[data-strike]"), { scaleX: 0 });
      gsap.set(q("[data-dont-strike]"), { scaleX: 0 });
      gsap.set(q("[data-glow]"), { opacity: 0, scale: 0.6 });

      // Entrance before the pin engages
      gsap.from(q("[data-intro]"), {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.from(q("[data-intro-free]"), {
        y: 80,
        opacity: 0,
        duration: 1.4,
        delay: 0.15,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });

      const stageLabels = q("[data-stage]");
      const setStage = (i: number) =>
        stageLabels.forEach((el, j) => el.classList.toggle("is-active", j === i));

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => setStage(self.progress < 0.36 ? 0 : self.progress < 0.68 ? 1 : 2),
        },
      });

      tl.to({}, { duration: 0.4 })
        // 1 — strike BORING
        .to(q("[data-strike]"), { scaleX: 1, duration: 1 })
        // 2 — BORING shatters
        .to(
          boring,
          {
            yPercent: () => gsap.utils.random(-160, 160),
            xPercent: () => gsap.utils.random(-40, 40),
            rotate: () => gsap.utils.random(-50, 50),
            opacity: 0,
            duration: 1.2,
            stagger: { each: 0.05, from: "random" },
            ease: "power2.in",
          },
          "+=0.2",
        )
        .to(q("[data-strike]"), { opacity: 0, duration: 0.4 }, "<0.4")
        // 3 — FORGETTABLE arrives
        .to(forget, { yPercent: 0, duration: 1.1, stagger: 0.04, ease: "expo.out" }, "-=0.4")
        .to({}, { duration: 0.5 })
        // 4 — FORGETTABLE fades from memory
        .to(forget, {
          opacity: 0,
          filter: "blur(14px)",
          yPercent: -20,
          duration: 1.3,
          stagger: { each: 0.06, from: "random" },
          ease: "power1.in",
        })
        // 5 — cross out DON'T
        .to(q("[data-dont-strike]"), { scaleX: 1, duration: 0.8 }, "-=0.6")
        .to(q("[data-dont]"), { opacity: 0.3, duration: 0.6 }, "<")
        // 6 — MEMORABLE rises
        .to(memo, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.05, ease: "expo.out" }, "-=0.2")
        .to(q("[data-glow]"), { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, "<")
        .to(q("[data-burst]"), { scaleX: 1, opacity: 1, duration: 1, stagger: 0.05, ease: "expo.out" }, "<0.3")
        .to({}, { duration: 0.8 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative z-[1] flex h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(61,77,255,0.45) 0%, rgba(122,92,255,0.12) 40%, transparent 68%)" }}
      />
      {/* burst lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[9vh]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            data-burst
            className={`block h-px ${i % 2 ? "origin-right self-end bg-gradient-to-l" : "origin-left bg-gradient-to-r"} from-accent-soft/50 to-transparent`}
            style={{ width: `${30 + i * 12}%`, transform: "scaleX(0)", opacity: 0 }}
          />
        ))}
      </div>

      <h2 className="sr-only">We don&apos;t build boring websites. We build memorable websites.</h2>
      <p className="label absolute left-[var(--gutter)] top-[calc(var(--nav-h)+1.5rem)]">
        <span className="text-accent-soft">(02)</span> Statement
      </p>

      <div className="display gutter relative w-full text-center text-[clamp(2.6rem,12.4vw,6rem)] md:text-[min(9.4vw,17vh)]" aria-hidden="true">
        <div className="flex flex-wrap items-baseline justify-center gap-x-[0.25em]">
          <span className="mask">
            <span data-intro className="mask-inner">We</span>
          </span>
          <span className="relative">
            <span className="mask">
              <span data-intro className="mask-inner">
                <span data-dont className="inline-block">
                  Don&apos;t
                </span>
              </span>
            </span>
            <span
              data-dont-strike
              className="absolute left-[-4%] top-[48%] h-[0.07em] w-[108%] origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="mask">
            <span data-intro className="mask-inner">Build</span>
          </span>
        </div>

        {/* the word slot — three words stacked in one grid cell */}
        <div className="relative my-[0.04em] grid place-items-center">
          <span className="relative [grid-area:1/1]">
            <span data-intro-free className="inline-block">
              <Letters text="BORING" attr="data-b" />
            </span>
            <span
              data-strike
              className="absolute left-[-3%] top-[46%] h-[0.08em] w-[106%] origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="[grid-area:1/1] text-ivory-dim">
            <Letters text="FORGETTABLE" masked attr="data-f" />
          </span>
          <span className="serif italic [grid-area:1/1] text-[1.12em] normal-case text-accent-soft">
            <Letters text="memorable" masked attr="data-m" />
          </span>
        </div>

        <div className="mask">
          <span data-intro className="mask-inner">Websites.</span>
        </div>
      </div>

      <ol className="gutter absolute inset-x-0 bottom-8 flex items-center justify-center gap-6 md:gap-10">
        {STAGES.map((s, i) => (
          <li key={s} data-stage className={`stage label flex items-center gap-2 ${i === 0 ? "is-active" : ""}`}>
            <span className="stage-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {s}
          </li>
        ))}
      </ol>
    </section>
  );
}

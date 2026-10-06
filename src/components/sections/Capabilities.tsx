"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { SERVICES } from "@/lib/data";
import ServiceVisual from "@/components/art/ServiceVisual";

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const fine = useRef(false);

  /* Entrance */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-cap-head] .mask-inner", {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.4,
        scrollTrigger: { trigger: "[data-cap-head]", start: "top 80%" },
      });
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%" } })
          .from(row.querySelector("[data-row-line]"), { scaleX: 0, duration: 1.4, ease: EASE.wipe })
          .from(row.querySelector("[data-row-title]"), { yPercent: 105, duration: 1.3 }, 0.15)
          .from(row.querySelectorAll("[data-row-fade]"), { opacity: 0, x: -14, duration: 1, stagger: 0.06 }, 0.3);
      });
    },
    { scope: root },
  );

  /* Floating preview follows the cursor */
  useEffect(() => {
    fine.current = hasFinePointer();
    const el = preview.current;
    const section = root.current;
    if (!el || !section || !fine.current) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3.out" });
    let last = 0;
    const move = (e: PointerEvent) => {
      const b = section.getBoundingClientRect();
      xTo(e.clientX - b.left);
      yTo(e.clientY - b.top);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - last) * 0.6));
      last = e.clientX;
    };
    section.addEventListener("pointermove", move);
    return () => section.removeEventListener("pointermove", move);
  }, []);

  /* Show / hide preview + swap visual with a clip wipe */
  useEffect(() => {
    const el = preview.current;
    if (!el || !fine.current) return;
    gsap.to(el, {
      scale: hovered === null ? 0 : 1,
      opacity: hovered === null ? 0 : 1,
      duration: 0.7,
      ease: EASE.reveal,
    });
    if (hovered === null) return;
    el.querySelectorAll<HTMLElement>("[data-visual]").forEach((v, i) => {
      gsap.to(v, {
        clipPath: i === hovered ? "inset(0% 0% 0% 0%)" : i < hovered ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
        duration: 0.8,
        ease: EASE.wipe,
      });
    });
  }, [hovered]);

  /* Accordion details */
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-detail]").forEach((d, i) => {
        gsap.to(d, {
          height: open === i ? "auto" : 0,
          opacity: open === i ? 1 : 0,
          duration: prefersReducedMotion() ? 0 : 0.8,
          ease: EASE.wipe,
        });
      });
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <section
      ref={root}
      id="capabilities"
      aria-labelledby="cap-title"
      className="gutter relative z-[1] py-[16vh]"
      onPointerLeave={() => setHovered(null)}
    >
      {/* giant background index */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden pr-[var(--gutter)]">
        <span
          key={hovered ?? "x"}
          className="display outline-text text-[38vw] leading-none opacity-30 transition-opacity duration-700 [animation:cap-in_0.9s_var(--ease-expo)]"
        >
          {hovered === null ? "" : SERVICES[hovered].n}
        </span>
      </div>

      <div data-cap-head className="relative mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="label mb-6 flex items-center gap-3">
            <span className="text-accent-soft">(05)</span> Capabilities
          </p>
          <h2 id="cap-title" className="display text-[clamp(3rem,11vw,10rem)]">
            <span className="mask">
              <span className="mask-inner">What we</span>
            </span>
            <br />
            <span className="mask">
              <span className="mask-inner serif italic normal-case text-accent-soft">obsess</span>
            </span>{" "}
            <span className="mask">
              <span className="mask-inner">over</span>
            </span>
          </h2>
        </div>
        <p className="body-copy max-w-[22rem]">
          Six disciplines, one team, one motion language. Hover to preview — tap or press to read more.
        </p>
      </div>

      <ul className="relative">
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          const isHover = hovered === i;
          return (
            <li key={s.n} data-row className="relative">
              <span data-row-line aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-[var(--line-strong)]" />
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`cap-detail-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onFocus={() => fine.current && setHovered(i)}
                data-cursor="open"
                className="group relative grid w-full grid-cols-[2.2rem_1fr_auto] items-center gap-x-3 py-5 text-left md:grid-cols-[5rem_1fr_18rem_4rem] md:gap-x-6 md:py-7"
              >
                {/* hover fill */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 -z-0 origin-bottom bg-ivory/[0.035] transition-transform duration-700 ease-[var(--ease-expo)] ${
                    isHover || isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span data-row-fade className="label relative">
                  {s.n}
                </span>
                <span
                  className={`mask relative transition-transform duration-700 ease-[var(--ease-expo)] ${
                    isHover ? "md:translate-x-[2vw]" : ""
                  }`}
                >
                  <span
                    data-row-title
                    className="mask-inner display block text-[clamp(1.75rem,6.6vw,5.6rem)] md:text-[clamp(2rem,5.2vw,5.6rem)]"
                  >
                    <span className={`roll ${isHover ? "is-on" : ""}`}>
                      <span>{s.title}</span>
                      <span aria-hidden="true" className="serif italic normal-case text-accent-soft">
                        {s.title}
                      </span>
                    </span>
                  </span>
                </span>
                <span data-row-fade className="body-copy relative hidden text-[0.9rem] md:block">
                  {s.short}
                </span>
                <span
                  data-row-fade
                  aria-hidden="true"
                  className={`relative flex h-10 w-10 items-center justify-center justify-self-end rounded-full border transition-all duration-700 ease-[var(--ease-expo)] md:h-14 md:w-14 ${
                    isHover || isOpen ? "border-accent bg-accent" : "border-[var(--line-strong)]"
                  }`}
                >
                  <span
                    className={`text-lg transition-transform duration-700 ease-[var(--ease-expo)] ${
                      isOpen ? "rotate-90" : isHover ? "rotate-0" : "-rotate-45"
                    }`}
                  >
                    →
                  </span>
                </span>
              </button>

              <div id={`cap-detail-${i}`} data-detail className="h-0 overflow-hidden opacity-0" role="region" aria-label={s.title}>
                <div className="grid gap-6 pb-8 pt-2 md:grid-cols-[5rem_1fr_18rem_4rem] md:gap-x-6">
                  <div className="aspect-[4/3] w-full overflow-hidden md:hidden">
                    <ServiceVisual index={i} />
                  </div>
                  <p className="body-copy max-w-[36rem] md:col-start-2">{s.text}</p>
                  <ul className="flex flex-wrap gap-2 md:col-start-3">
                    {s.tags.map((t) => (
                      <li key={t} className="label rounded-full border border-[var(--line-strong)] px-3 py-1">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
        <li aria-hidden="true" className="h-px bg-[var(--line-strong)]" />
      </ul>

      {/* Floating cursor preview (desktop) */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[3] hidden aspect-[4/3] w-[22rem] overflow-hidden rounded-[6px] opacity-0 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ transform: "scale(0)" }}
      >
        {SERVICES.map((s, i) => (
          <div key={s.n} data-visual className="absolute inset-0" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
            <ServiceVisual index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { SplitWords } from "@/components/ui/Split";
import { NoirArt } from "@/components/art/ProjectArt";

const TEXT = "We create digital experiences for brands that refuse to blend in.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word] .mask-inner", root.current);
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      // Words light up one by one as you scroll
      gsap.fromTo(
        words,
        { opacity: 0.1, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-manifesto-text]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      // Starts small, grows into the reader
      gsap.fromTo(
        "[data-manifesto-text]",
        { scale: 0.86, transformOrigin: "0% 50%" },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
        },
      );
      // Figure: mask reveal + slow rotation
      gsap.fromTo(
        "[data-fig]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-fig]", start: "top 85%" },
        },
      );
      gsap.fromTo(
        "[data-fig-inner]",
        { scale: 1.4, rotate: -6 },
        {
          scale: 1.05,
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-fig]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.from("[data-manifesto-fade]", {
        opacity: 0,
        y: 24,
        duration: 1.2,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-title" className="gutter relative z-[1] pb-[14vh] pt-[18vh] md:pb-[20vh] md:pt-[26vh]">
      <div className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-12">
        <div className="col-span-12 flex flex-col gap-10 md:col-span-3">
          <p data-manifesto-fade className="label flex items-center gap-3">
            <span className="text-accent-soft">(01)</span> Manifesto
          </p>
          <figure className="hidden md:block">
            <div data-fig className="relative aspect-[3/4] w-full max-w-[15rem] overflow-hidden" data-cursor="explore">
              <div data-fig-inner className="absolute inset-0">
                <NoirArt className="h-full w-full" focus="xMaxYMid" />
              </div>
            </div>
            <figcaption className="label mt-3">Fig. 02 — Texture study</figcaption>
          </figure>
        </div>

        <div className="col-span-12 md:col-span-9">
          <h2 id="manifesto-title" className="sr-only">
            Manifesto
          </h2>
          <div data-manifesto-text className="will-change-transform">
            <SplitWords
              as="p"
              text={TEXT}
              serif={["refuse"]}
              accent={["blend", "in"]}
              className="display text-[clamp(2.3rem,7.4vw,7.2rem)] !font-medium !leading-[0.95] md:text-[clamp(2rem,5.6vw,6.4rem)]"
            />
          </div>

          <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-9">
            <p data-manifesto-fade className="body-copy md:col-span-4 md:col-start-1">
              Templates make the web look the same. We start from a blank canvas every time — strategy, art direction, motion and
              engineering, shaped around one obsession: making you impossible to scroll past.
            </p>
            <div data-manifesto-fade className="flex flex-col gap-3 md:col-span-3 md:col-start-6">
              <span className="label">Principles</span>
              <ul className="flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {["Craft over templates", "Motion with meaning", "Performance is design"].map((p, i) => (
                  <li key={p} className="flex items-center justify-between py-3 text-[0.95rem]">
                    {p}
                    <span className="label">0{i + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

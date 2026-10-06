"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, Draggable, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { SplitWords } from "@/components/ui/Split";
import { ProjectArt } from "@/components/art/ProjectArt";
import type { ProjectSlug } from "@/lib/data";

const STATEMENT =
  "ASIFWORKS is an independent digital studio creating bold, high-performance experiences at the intersection of design, motion and technology.";

const FOCUS = [
  { k: "Web Design", t: "Art-directed interfaces and editorial systems with a distinct point of view." },
  { k: "Development", t: "Next.js, React and TypeScript builds — fast, accessible, maintainable." },
  { k: "Motion", t: "GSAP-powered storytelling, kinetic type and tactile interaction." },
  { k: "SEO", t: "Technical SEO and Core Web Vitals designed in, not bolted on." },
  { k: "AI", t: "Intelligent features that feel native to the experience." },
];

const ARCHIVE: { slug: ProjectSlug; focus: string; label: string }[] = [
  { slug: "aether", focus: "xMidYMid", label: "Spatial study" },
  { slug: "noir", focus: "xMinYMid", label: "Silk motion" },
  { slug: "pulse", focus: "xMaxYMid", label: "Live rings" },
  { slug: "veyro", focus: "xMinYMid", label: "Editorial grid" },
  { slug: "noir", focus: "xMaxYMid", label: "Portal" },
  { slug: "aether", focus: "xMaxYMid", label: "Wireframe" },
  { slug: "pulse", focus: "xMinYMid", label: "Heart rate" },
];

export default function Studio() {
  const root = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const words = gsap.utils.toArray<HTMLElement>("[data-statement] [data-word]");
      const inners = words.map((w) => w.querySelector(".mask-inner") as HTMLElement);

      if (!reduce) {
        gsap.set(inners, { yPercent: 110, rotate: 4 });
        ScrollTrigger.create({
          trigger: "[data-statement]",
          start: "top 78%",
          once: true,
          onEnter: () => {
            // Group words into their rendered lines, then reveal line by line
            const tops: number[] = [];
            const lineOf = words.map((w) => {
              const top = Math.round(w.offsetTop);
              let idx = tops.findIndex((t) => Math.abs(t - top) < 8);
              if (idx === -1) {
                tops.push(top);
                idx = tops.length - 1;
              }
              return idx;
            });
            inners.forEach((el, i) =>
              gsap.to(el, { yPercent: 0, rotate: 0, duration: 1.5, ease: EASE.reveal, delay: lineOf[i] * 0.14 }),
            );
          },
        });

        gsap.from("[data-focus]", {
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-focus-grid]", start: "top 85%" },
        });
        gsap.from("[data-focus-line]", {
          scaleX: 0,
          duration: 1.4,
          ease: EASE.wipe,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-focus-grid]", start: "top 85%" },
        });
      }

      // Draggable archive with inertia
      const s = strip.current;
      if (!s) return;
      const parent = s.parentElement!;
      const [drag] = Draggable.create(s, {
        type: "x",
        inertia: true,
        bounds: parent,
        edgeResistance: 0.85,
        zIndexBoost: false,
        onPress() {
          gsap.to(s.querySelectorAll("[data-card]"), { scale: 0.96, duration: 0.5, ease: EASE.snap });
        },
        onRelease() {
          gsap.to(s.querySelectorAll("[data-card]"), { scale: 1, duration: 0.8, ease: EASE.elastic });
        },
        onDrag() {
          gsap.to(s.querySelectorAll("[data-card]"), {
            rotate: gsap.utils.clamp(-6, 6, this.deltaX * -0.3),
            duration: 0.5,
            overwrite: "auto",
          });
        },
        onThrowComplete() {
          gsap.to(s.querySelectorAll("[data-card]"), { rotate: 0, duration: 0.8 });
        },
      });
      const onResize = () => drag.applyBounds(parent);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        drag.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" aria-labelledby="studio-title" className="relative z-[1] py-[16vh]">
      <div className="gutter">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-accent-soft">(09)</span> Studio
        </p>
        <h2 id="studio-title" className="sr-only">
          About the studio
        </h2>
        <div data-statement>
          <SplitWords
            as="p"
            text={STATEMENT}
            serif={["bold", "intersection"]}
            accent={["design", "motion", "technology"]}
            className="display max-w-[88rem] text-[clamp(2rem,6.4vw,6rem)] !font-medium !leading-[0.98] md:text-[clamp(2rem,5vw,6rem)]"
          />
        </div>

        <div data-focus-grid className="mt-20 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-8 sm:grid-cols-2 md:mt-28 lg:grid-cols-5">
          {FOCUS.map((f, i) => (
            <div key={f.k} className="relative pt-5">
              <span data-focus-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--line-strong)]" />
              <div data-focus>
                <span className="label text-accent-soft">0{i + 1}</span>
                <h3 className="mt-3 text-[1.35rem] font-medium tracking-[-0.03em]">{f.k}</h3>
                <p className="body-copy mt-2 text-[0.92rem]">{f.t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draggable archive */}
      <div className="mt-24 md:mt-32">
        <div className="gutter mb-6 flex items-end justify-between">
          <span className="label !text-ivory">Studio archive</span>
          <span className="label flex items-center gap-2">
            <span aria-hidden="true">←</span> Drag to explore <span aria-hidden="true">→</span>
          </span>
        </div>
        <div className="relative overflow-hidden" data-cursor="drag">
          <div ref={strip} className="flex w-max gap-4 px-[var(--gutter)] md:gap-6" aria-label="Studio archive — draggable gallery">
              {ARCHIVE.map((a, i) => (
                <figure
                  key={i}
                  data-card
                  className={`relative shrink-0 select-none overflow-hidden ${
                    i % 3 === 0 ? "h-[52vw] w-[70vw] md:h-[26vw] md:w-[34vw]" : i % 3 === 1 ? "h-[62vw] w-[46vw] md:h-[30vw] md:w-[22vw]" : "h-[48vw] w-[58vw] md:h-[22vw] md:w-[28vw]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <ProjectArt slug={a.slug} focus={a.focus} className="h-full w-full" />
                  </div>
                  <figcaption className="label absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 !text-ivory backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")} — {a.label}
                  </figcaption>
                </figure>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

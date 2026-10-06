"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { PROJECTS, type Project } from "@/lib/data";
import { ProjectArt } from "@/components/art/ProjectArt";
import { useApp } from "@/components/providers/AppProvider";

function ProjectPanel({ project, index, total }: { project: Project; index: number; total: number }) {
  const { navigate } = useApp();
  const art = useRef<HTMLAnchorElement>(null);
  const href = `/work/${project.slug}`;

  // Mouse-driven inner parallax on the artwork (desktop only)
  useEffect(() => {
    const el = art.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const inner = el.querySelector<HTMLElement>("[data-art-hover]");
    if (!inner) return;
    const xTo = gsap.quickTo(inner, "x", { duration: 1, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 1, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      xTo(((e.clientX - b.left) / b.width - 0.5) * -30);
      yTo(((e.clientY - b.top) / b.height - 0.5) * -30);
    };
    const enter = () => gsap.to(inner, { scale: 1.06, duration: 1.2, ease: EASE.reveal });
    const leave = () => {
      gsap.to(inner, { scale: 1, x: 0, y: 0, duration: 1.2, ease: EASE.reveal });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <article
      data-panel
      aria-labelledby={`p-${project.slug}`}
      className="sticky top-0 h-[100svh] overflow-hidden"
    >
      <div data-panel-inner className="relative h-full w-full origin-top overflow-hidden bg-ink-2 will-change-transform">
        {/* giant ghost number */}
        <span
          data-ghost
          aria-hidden="true"
          className="display outline-text pointer-events-none absolute -right-[2vw] top-[8vh] hidden text-[22vw] leading-none opacity-40 md:block"
          style={{ zIndex: 0 }}
        >
          {project.number}
        </span>

        {/* artwork */}
        <a
          ref={art}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            navigate(href, project.title);
          }}
          data-cursor="view"
          aria-label={`View ${project.title} case study`}
          className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[calc(var(--nav-h)+1rem)] h-[44%] overflow-hidden md:bottom-[9vh] md:left-[34vw] md:top-[15vh] md:h-auto"
        >
          <div data-art-clip className="absolute inset-0 overflow-hidden">
            <div data-art-scale className="absolute inset-0 will-change-transform">
              <div data-art-hover className="absolute -inset-[3%]">
                <ProjectArt slug={project.slug} className="h-full w-full" />
              </div>
            </div>
          </div>
          <span className="label absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1 !text-ivory backdrop-blur-sm">
            {project.year}
          </span>
        </a>

        {/* copy */}
        <div className="gutter pointer-events-none absolute inset-x-0 bottom-0 top-[calc(var(--nav-h)+1rem+44%+1.5rem)] flex flex-col md:top-[15vh] md:w-[40vw] md:pb-[9vh]">
          <div className="flex items-center gap-4">
            <span className="label text-accent-soft">
              {project.number} / {String(total).padStart(2, "0")}
            </span>
            <span className="hairline w-10" />
            <span className="label">{project.industry}</span>
          </div>

          <h3
            id={`p-${project.slug}`}
            className="display relative z-[2] mt-3 text-[clamp(3.6rem,20vw,7rem)] mix-blend-difference md:mt-auto md:text-[min(13vw,24vh)]"
          >
            <span className="flex" aria-label={project.title}>
              {Array.from(project.title).map((c, i) => (
                <span key={i} className="mask" aria-hidden="true">
                  <span data-title-char className="mask-inner">
                    {c}
                  </span>
                </span>
              ))}
            </span>
          </h3>
          <p className="serif mt-2 text-[clamp(1.35rem,2.2vw,2rem)] italic text-ivory">{project.kind}</p>
          <p className="body-copy mt-3 max-w-[26rem] text-[0.95rem]">{project.description}</p>

          <div className="pointer-events-auto mt-5 flex items-center gap-6 md:mt-8">
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault();
                navigate(href, project.title);
              }}
              data-cursor="open"
              className="roll-host arrow-host inline-flex items-center gap-2 border-b border-ivory/40 pb-1 text-[0.9rem]"
            >
              <span className="roll">
                <span>View case study</span>
                <span aria-hidden="true">View case study</span>
              </span>
              <span className="arrow">↗</span>
            </a>
            <span className="label hidden sm:inline">{project.role.slice(0, 2).join(" · ")}</span>
          </div>
        </div>

        <div data-panel-shade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        <span className="sr-only">Project {index + 1}</span>
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);

      // Header
      gsap.from("[data-work-head] .mask-inner", {
        yPercent: 110,
        duration: 1.5,
        stagger: 0.08,
        ease: EASE.reveal,
        scrollTrigger: { trigger: "[data-work-head]", start: "top 80%" },
      });
      gsap.from("[data-work-fade]", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-work-head]", start: "top 75%" },
      });

      panels.forEach((panel, i) => {
        const inner = panel.querySelector("[data-panel-inner]");
        const shade = panel.querySelector("[data-panel-shade]");
        const chars = panel.querySelectorAll("[data-title-char]");
        const clip = panel.querySelector("[data-art-clip]");
        const scale = panel.querySelector("[data-art-scale]");
        const ghost = panel.querySelector("[data-ghost]");

        if (reduce) return;

        // Title letters rise when the panel arrives
        gsap.fromTo(
          chars,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.3,
            stagger: 0.05,
            ease: EASE.reveal,
            scrollTrigger: { trigger: panel, start: "top 45%", toggleActions: "play none none reverse" },
          },
        );

        // Artwork: mask opens + image settles from a zoom
        gsap.fromTo(
          clip,
          { clipPath: i === 0 ? "inset(12% 0% 12% 0%)" : "inset(35% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top 90%", end: "top top", scrub: true },
          },
        );
        gsap.fromTo(
          scale,
          { scale: 1.35 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true } },
        );
        gsap.fromTo(
          ghost,
          { yPercent: 40 },
          { yPercent: -20, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } },
        );

        // The panel recedes as the next one slides over it
        const next = panels[i + 1];
        if (next) {
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
            .to(inner, { scale: 0.88, yPercent: -4, borderRadius: 18, ease: "none" }, 0)
            .to(shade, { opacity: 0.75, ease: "none" }, 0);
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative z-[1]">
      <header data-work-head className="gutter flex flex-col gap-8 pb-[10vh] pt-[16vh] md:flex-row md:items-end md:justify-between">
        <div>
          <p data-work-fade className="label mb-6 flex items-center gap-3">
            <span className="text-accent-soft">(03)</span> Selected work
          </p>
          <h2 id="work-title" className="display text-[clamp(3.4rem,15vw,15rem)]">
            <span className="mask">
              <span className="mask-inner">Selected</span>
            </span>
            <br />
            <span className="mask">
              <span className="mask-inner serif italic normal-case">work</span>
            </span>
            <span className="mask align-top">
              <span className="mask-inner ml-3 align-top font-mono text-[0.16em] font-normal tracking-normal text-accent-soft">
                (04)
              </span>
            </span>
          </h2>
        </div>
        <div data-work-fade className="flex max-w-[22rem] flex-col gap-4 md:pb-4">
          <p className="body-copy">
            Four fictional brands, four distinct worlds — each built to prove that a website can be the most memorable part of a
            brand.
          </p>
          <span className="label">2025 — 2026 · Concept work</span>
        </div>
      </header>

      <div className="relative">
        {PROJECTS.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}

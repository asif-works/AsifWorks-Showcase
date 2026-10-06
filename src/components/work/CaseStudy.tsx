"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Project } from "@/lib/data";
import { ProjectArt } from "@/components/art/ProjectArt";
import { BrowserFrame, PhoneFrame } from "@/components/art/Frames";
import { useApp } from "@/components/providers/AppProvider";

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const { navigate } = useApp();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Entrance — timed to land as the transition wipe opens
      gsap
        .timeline({ delay: 0.55, defaults: { ease: EASE.reveal } })
        .from(q("[data-cs-char]"), { yPercent: 115, duration: 1.6, stagger: 0.06 })
        .from(q("[data-cs-fade]"), { opacity: 0, y: 20, duration: 1.1, stagger: 0.06 }, 0.3)
        .from(q("[data-cs-rule]"), { scaleX: 0, duration: 1.6, ease: EASE.wipe }, 0.2);

      gsap.fromTo(
        q("[data-cs-cover]"),
        { clipPath: "inset(18% 8% 18% 8%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: q("[data-cs-cover]")[0], start: "top 95%", end: "top 15%", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-cs-cover-inner]"),
        { scale: 1.3 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-cs-cover]")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      q("[data-cs-reveal]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 1.3, scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      q("[data-cs-par]").forEach((el) => {
        const speed = Number(el.getAttribute("data-cs-par"));
        gsap.fromTo(
          el,
          { yPercent: speed },
          { yPercent: -speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      gsap.from(q("[data-next-char]"), {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.05,
        scrollTrigger: { trigger: "#next-project", start: "top 70%" },
      });
    },
    { scope: root, dependencies: [project.slug] },
  );

  const { palette } = project;

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="gutter relative z-[1] flex min-h-[100svh] flex-col pb-10 pt-[calc(var(--nav-h)+2rem)]">
        <div className="flex items-center justify-between">
          <Link
            data-cs-fade
            href="/#work"
            onClick={(e) => {
              e.preventDefault();
              navigate("/#work", "Work");
            }}
            className="roll-host label flex items-center gap-2 !text-ivory"
          >
            ←{" "}
            <span className="roll">
              <span>All work</span>
              <span aria-hidden="true">All work</span>
            </span>
          </Link>
          <span data-cs-fade className="label">
            {project.number} / 04 — Case study
          </span>
        </div>

        <h1 className="display mt-auto text-[clamp(4.5rem,26vw,24rem)] leading-[0.8]" aria-label={project.title}>
          <span className="flex" aria-hidden="true">
            {Array.from(project.title).map((c, i) => (
              <span key={i} className="mask">
                <span data-cs-char className="mask-inner">
                  {c}
                </span>
              </span>
            ))}
          </span>
        </h1>
        <div data-cs-rule className="hairline mt-6 origin-left" />
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-12">
          <p data-cs-fade className="serif col-span-2 text-[clamp(1.6rem,3vw,2.6rem)] italic leading-[1.05] md:col-span-5">
            {project.kind}
          </p>
          <dl className="col-span-2 grid grid-cols-2 gap-6 md:col-span-7 md:grid-cols-4">
            {[
              ["Client", project.title.charAt(0) + project.title.slice(1).toLowerCase()],
              ["Industry", project.industry],
              ["Year", project.year],
              ["Role", project.role.join(", ")],
            ].map(([k, v]) => (
              <div key={k} data-cs-fade className="flex flex-col gap-1">
                <dt className="label">{k}</dt>
                <dd className="text-[0.95rem] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Cover */}
      <section className="relative z-[1]" aria-label={`${project.title} key visual`}>
        <div data-cs-cover className="relative h-[70svh] overflow-hidden md:h-[100svh]" data-cursor="explore">
          <div data-cs-cover-inner className="absolute inset-0">
            <ProjectArt slug={project.slug} className="h-full w-full" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="gutter relative z-[1] grid gap-14 py-[16vh] md:grid-cols-12">
        <p data-cs-reveal className="label md:col-span-3">
          <span className="text-accent-soft">(01)</span> The brief
        </p>
        <div className="flex flex-col gap-14 md:col-span-9">
          <p data-cs-reveal className="display text-[clamp(1.9rem,4.4vw,4.4rem)] !font-medium !leading-[1]">
            {project.challenge}
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            <div data-cs-reveal>
              <span className="label mb-3 block">Approach</span>
              <p className="body-copy">{project.approach}</p>
            </div>
            <div data-cs-reveal>
              <span className="label mb-3 block">Description</span>
              <p className="body-copy">{project.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mockups */}
      <section
        className="relative z-[1] overflow-hidden py-[14vh]"
        style={{ background: `linear-gradient(180deg, transparent, ${palette.accent}14 50%, transparent)` }}
        aria-label="Interface mockups"
      >
        <div className="gutter grid items-center gap-10 md:grid-cols-12">
          <div data-cs-par="8" className="md:col-span-8">
            <BrowserFrame url={`${project.slug}.studio/home`} className="aspect-[16/10] w-full">
              <ProjectArt slug={project.slug} className="h-full w-full" />
            </BrowserFrame>
          </div>
          <div data-cs-par="-14" className="mx-auto w-[60%] md:col-span-4 md:w-[80%]">
            <PhoneFrame className="aspect-[9/19] w-full">
              <ProjectArt slug={project.slug} className="h-full w-full" focus="xMinYMid" />
            </PhoneFrame>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="gutter relative z-[1] py-[14vh]" aria-labelledby="results-title">
        <h2 id="results-title" className="label mb-12">
          <span className="text-accent-soft">(02)</span> Outcome
        </h2>
        <dl className="grid gap-10 md:grid-cols-3">
          {project.results.map((r) => (
            <div key={r.label} data-cs-reveal className="border-t border-[var(--line-strong)] pt-6">
              <dd className="display text-[clamp(3rem,7vw,6.5rem)]">{r.value}</dd>
              <dt className="label mt-3">{r.label}</dt>
            </div>
          ))}
        </dl>
        <p className="label mt-12 max-w-[30rem] normal-case tracking-normal">
          * Concept project created for the ASIFWORKS showcase. Figures are illustrative.
        </p>
      </section>

      {/* Next */}
      <section id="next-project" className="relative z-[2] overflow-hidden rounded-b-[2rem] bg-ink md:rounded-b-[3rem]">
        <Link
          href={`/work/${next.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/work/${next.slug}`, next.title);
          }}
          data-cursor="view"
          className="group gutter relative flex min-h-[80svh] flex-col justify-center py-[12vh]"
        >
          <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-40" aria-hidden="true">
            <ProjectArt slug={next.slug} className="h-full w-full scale-110 transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-100" />
          </div>
          <span className="label relative mb-6">Next project — {next.number}</span>
          <span className="display relative flex text-[clamp(4.5rem,22vw,20rem)] leading-[0.8]" aria-label={next.title}>
            {Array.from(next.title).map((c, i) => (
              <span key={i} className="mask" aria-hidden="true">
                <span data-next-char className="mask-inner">
                  {c}
                </span>
              </span>
            ))}
          </span>
          <span className="serif relative mt-4 text-[clamp(1.4rem,2.4vw,2.2rem)] italic">
            {next.kind} <span className="inline-block transition-transform duration-700 group-hover:translate-x-3">→</span>
          </span>
        </Link>
      </section>
    </div>
  );
}

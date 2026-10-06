"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { ProjectArt } from "@/components/art/ProjectArt";
import { BrowserFrame, PhoneFrame } from "@/components/art/Frames";
import { useApp } from "@/components/providers/AppProvider";

function Frame({
  children,
  caption,
  index,
  className = "",
  offset = "",
}: {
  children: ReactNode;
  caption: string;
  index: string;
  className?: string;
  offset?: string;
}) {
  return (
    <figure data-frame className={`relative flex shrink-0 flex-col ${offset}`} data-cursor="explore">
      <div data-frame-clip className={`relative overflow-hidden ${className}`}>
        {children}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className="label !text-ivory">{caption}</span>
        <span className="label">{index}</span>
      </figcaption>
    </figure>
  );
}

/** Parallax-wrapped artwork — the inner layer drifts against the scroll. */
function Drift({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div data-drift className="absolute inset-y-0 -left-[12%] -right-[12%]">
        {children}
      </div>
    </div>
  );
}

/**
 * "In detail" — a horizontal reel of mockups and studies, driven by vertical
 * scroll. The section pins while the track translates sideways.
 */
export default function Gallery() {
  const { navigate } = useApp();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const t = track.current!;
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", t);

      if (prefersReducedMotion()) return;

      const distance = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to("[data-gallery-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      frames.forEach((f) => {
        const drift = f.querySelector("[data-drift]");
        const clip = f.querySelector("[data-frame-clip]");
        if (drift) {
          gsap.fromTo(
            drift,
            { xPercent: 8 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        }
        gsap.fromTo(
          clip,
          { clipPath: "inset(0% 0% 0% 100%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: f, containerAnimation: tween, start: "left 100%", end: "left 55%", scrub: true },
          },
        );
        gsap.fromTo(
          f,
          { rotate: 2.5, y: 30 },
          {
            rotate: -1.5,
            y: -10,
            ease: "none",
            scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });

      gsap.from("[data-gallery-intro] .mask-inner", {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="gallery-title"
      className="relative z-[1] overflow-hidden bg-ink motion-reduce:overflow-x-auto"
    >
      <div className="flex h-[100svh] items-center">
        <div ref={track} className="flex items-center gap-[6vw] pl-[var(--gutter)] pr-[12vw] will-change-transform md:gap-[4vw]">
          {/* Intro card */}
          <div data-gallery-intro className="flex w-[78vw] shrink-0 flex-col justify-center gap-6 md:w-[34vw]">
            <p className="label flex items-center gap-3">
              <span className="text-accent-soft">(04)</span> In detail
            </p>
            <h2 id="gallery-title" className="display text-[clamp(3rem,13vw,9rem)] md:text-[7.4vw]">
              <span className="mask">
                <span className="mask-inner">Frames</span>
              </span>
              <br />
              <span className="mask">
                <span className="mask-inner serif italic normal-case text-accent-soft">in motion</span>
              </span>
            </h2>
            <p className="body-copy max-w-[22rem]">
              Interfaces, studies and screens from the work — keep scrolling, the reel moves sideways.
            </p>
            <span className="label flex items-center gap-3">
              Scroll <span className="inline-block h-px w-12 bg-ivory/40" /> →
            </span>
          </div>

          <Frame caption="NOIR — Lookbook, desktop" index="F.01" className="h-[46vh] w-[82vw] md:h-[62vh] md:w-[50vw]">
            <BrowserFrame url="noir.maison/collection-07" className="h-full w-full">
              <Drift>
                <ProjectArt slug="noir" className="h-full w-full" />
              </Drift>
            </BrowserFrame>
          </Frame>

          <Frame caption="PULSE — Live session" index="F.02" offset="md:-translate-y-[8vh]" className="h-[56vh] w-[64vw] max-w-[300px] md:h-[64vh] md:w-[16vw] md:max-w-none">
            <PhoneFrame className="h-full w-full">
              <Drift>
                <ProjectArt slug="pulse" className="h-full w-full" focus="xMinYMid" />
              </Drift>
            </PhoneFrame>
          </Frame>

          <Frame caption="AETHER — Form study 12" index="F.03" offset="md:translate-y-[6vh]" className="h-[50vh] w-[76vw] md:h-[72vh] md:w-[38vw]">
            <Drift>
              <ProjectArt slug="aether" className="h-full w-full" />
            </Drift>
          </Frame>

          <Frame caption="VEYRO — Storefront" index="F.04" offset="md:-translate-y-[4vh]" className="h-[42vh] w-[84vw] md:h-[56vh] md:w-[46vw]">
            <BrowserFrame url="veyro.store/new-season" className="h-full w-full">
              <Drift>
                <ProjectArt slug="veyro" className="h-full w-full" />
              </Drift>
            </BrowserFrame>
          </Frame>

          {/* Type & colour specimen */}
          <Frame caption="System — Type & colour" index="F.05" offset="md:translate-y-[8vh]" className="h-[48vh] w-[74vw] md:h-[58vh] md:w-[26vw]">
            <div className="flex h-full flex-col justify-between bg-ivory p-6 text-ink">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Specimen 02</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Aa — Zz</span>
              </div>
              <div>
                <span className="serif block text-[clamp(5rem,10vw,9rem)] italic leading-[0.8]">Aa</span>
                <span className="display mt-2 block text-[clamp(1.6rem,2.6vw,2.4rem)]">Inter Tight</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {["#08080a", "#3d4dff", "#7a5cff", "#c6ff3d"].map((c) => (
                  <span key={c} className="flex aspect-square flex-col justify-end p-1.5" style={{ background: c }}>
                    <span className="font-mono text-[0.5rem] uppercase text-white mix-blend-difference">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          </Frame>

          <Frame caption="NOIR — Mobile drop" index="F.06" offset="md:-translate-y-[6vh]" className="h-[56vh] w-[64vw] max-w-[300px] md:h-[66vh] md:w-[16vw] md:max-w-none">
            <PhoneFrame className="h-full w-full">
              <Drift>
                <ProjectArt slug="noir" className="h-full w-full" focus="xMinYMid" />
              </Drift>
            </PhoneFrame>
          </Frame>

          <Frame caption="PULSE — Dashboard" index="F.07" offset="md:translate-y-[4vh]" className="h-[42vh] w-[84vw] md:h-[56vh] md:w-[46vw]">
            <BrowserFrame url="app.pulse.fit/session/live" className="h-full w-full">
              <Drift>
                <ProjectArt slug="pulse" className="h-full w-full" />
              </Drift>
            </BrowserFrame>
          </Frame>

          {/* End card */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              navigate("#contact", "Contact");
            }}
            data-cursor="open"
            className="group flex h-[48vh] w-[72vw] shrink-0 flex-col justify-between border border-[var(--line-strong)] p-6 transition-colors duration-700 hover:bg-accent md:h-[60vh] md:w-[28vw]"
          >
            <span className="label !text-ivory">F.08 — Next</span>
            <span className="display text-[clamp(2.6rem,5vw,4.6rem)]">
              Your
              <br />
              project
              <br />
              <span className="serif italic normal-case">here</span>
              <span className="ml-3 inline-block transition-transform duration-700 group-hover:translate-x-3">→</span>
            </span>
          </a>
        </div>
      </div>

      <div className="gutter absolute inset-x-0 bottom-8 flex items-center gap-4">
        <span className="label">01</span>
        <div className="h-px flex-1 bg-[var(--line)]">
          <div data-gallery-progress className="h-px origin-left bg-ivory" style={{ transform: "scaleX(0)" }} />
        </div>
        <span className="label">08</span>
      </div>
    </section>
  );
}

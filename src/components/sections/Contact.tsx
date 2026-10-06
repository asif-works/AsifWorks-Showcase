"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { SITE, SOCIALS } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.from(q("[data-idea] .mask-inner"), {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.035,
        ease: EASE.reveal,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });

      // The finale lines are scrubbed to the scroll — the reveal is the story
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q("[data-finale]")[0], start: "top 85%", end: "bottom 60%", scrub: 0.8 },
        defaults: { ease: "none" },
      });
      tl.from(q("[data-fl='1']"), { yPercent: 110 })
        .from(q("[data-fl='2']"), { yPercent: 110, letterSpacing: "0.25em" }, 0.25)
        .from(q("[data-fl='3']"), { yPercent: 110 }, 0.5)
        .from(q("[data-finale-glow]"), { scale: 0.3, opacity: 0 }, 0.2);

      gsap.from(q("[data-cta]"), {
        scale: 0,
        rotate: -90,
        duration: 1.6,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: { trigger: q("[data-cta]")[0], start: "top 90%" },
      });
      gsap.from(q("[data-contact-fade]"), {
        opacity: 0,
        y: 20,
        duration: 1.1,
        stagger: 0.07,
        scrollTrigger: { trigger: q("[data-contact-info]")[0], start: "top 90%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-[2] overflow-hidden rounded-b-[2rem] bg-ink pb-[12vh] pt-[18vh] md:rounded-b-[3rem]"
    >
      <div
        data-finale-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(61,77,255,0.35) 0%, rgba(122,92,255,0.1) 40%, transparent 68%)" }}
      />

      <div className="gutter relative">
        <p className="label mb-10 flex items-center gap-3">
          <span className="text-accent-soft">(11)</span> Contact
        </p>

        <h2 id="contact-title" className="sr-only">
          Have an idea? Let&apos;s make it impossible to ignore.
        </h2>

        <p data-idea aria-hidden="true" className="display flex flex-wrap text-[clamp(2.4rem,8vw,7rem)] text-ivory-dim">
          {"HAVE AN IDEA?".split("").map((c, i) => (
            <span key={i} className="mask">
              <span className="mask-inner">{c === " " ? " " : c}</span>
            </span>
          ))}
        </p>

        <div data-finale aria-hidden="true" className="display mt-[8vh] text-[clamp(3rem,13.5vw,15rem)]">
          <div className="mask block">
            <span data-fl="1" className="mask-inner">
              Let&apos;s make it
            </span>
          </div>
          <div className="mask block md:pl-[8vw]">
            <span data-fl="2" className="mask-inner serif italic normal-case text-[1.08em] text-accent-soft">
              impossible
            </span>
          </div>
          <div className="mask block text-right">
            <span data-fl="3" className="mask-inner">
              to ignore.
            </span>
          </div>
        </div>

        <div className="mt-[10vh] flex flex-col items-start gap-14 md:flex-row md:items-center md:justify-between">
          <div data-cta>
            <Magnetic strength={0.45} innerStrength={0.2}>
              <a
                href={`mailto:${SITE.email}?subject=New%20project%20with%20ASIFWORKS`}
                data-cursor="open"
                className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-accent text-ivory md:h-60 md:w-60"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full rounded-[50%] bg-ivory transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                />
                <span data-magnetic-inner className="relative flex flex-col items-center gap-1 text-center transition-colors duration-500 group-hover:text-ink">
                  <span className="text-[1rem] font-semibold uppercase tracking-[-0.01em] md:text-[1.2rem]">
                    Start a project
                  </span>
                  <span className="text-2xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">→</span>
                </span>
              </a>
            </Magnetic>
          </div>

          <div data-contact-info className="flex w-full flex-col gap-10 md:w-auto md:items-end">
            <a
              data-contact-fade
              href={`mailto:${SITE.email}`}
              className="roll-host group relative text-[clamp(1.4rem,3.2vw,3rem)] font-medium tracking-[-0.04em]"
            >
              <span className="roll">
                <span>{SITE.email}</span>
                <span aria-hidden="true" className="serif italic">
                  {SITE.email}
                </span>
              </span>
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-ivory/40 transition-transform duration-700 group-hover:origin-left" />
            </a>
            <div className="grid w-full grid-cols-2 gap-8 md:w-auto md:grid-cols-[auto_auto] md:gap-16">
              <div data-contact-fade className="flex flex-col gap-2">
                <span className="label">Studio</span>
                <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">{SITE.name}</span>
                <span className="body-copy text-[0.95rem]">{SITE.location}</span>
              </div>
              <ul data-contact-fade className="flex flex-col gap-2" aria-label="Social links">
                <li className="label">Social</li>
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roll-host arrow-host inline-flex items-center gap-2 text-[1rem]"
                    >
                      <span className="roll">
                        <span>{s.label}</span>
                        <span aria-hidden="true">{s.label}</span>
                      </span>
                      <span className="arrow text-ivory-dim">↗</span>
                    </a>
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

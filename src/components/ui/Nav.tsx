"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { NAV, SITE, SOCIALS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/motion";
import { useApp } from "@/components/providers/AppProvider";
import Logo from "@/components/ui/Logo";
import Magnetic from "@/components/ui/Magnetic";
import LocalTime from "@/components/ui/LocalTime";

export default function Nav() {
  const { introDone, navigate, setScrollLocked } = useApp();
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("index");
  const [open, setOpen] = useState(false);
  const holdUntil = useRef(0);
  const isHome = pathname === "/";
  const current = isHome ? active : "work";

  /* Entrance once the intro is done */
  useGSAP(
    () => {
      if (!introDone) {
        gsap.set("[data-nav-item]", { yPercent: -140, opacity: 0 });
        return;
      }
      gsap.to("[data-nav-item]", {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.07,
        ease: EASE.reveal,
        delay: isHome ? 0.9 : 0.2,
      });
    },
    { scope: root, dependencies: [introDone] },
  );

  /* Hide on scroll down, reveal on scroll up */
  useEffect(() => {
    if (!bar.current) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // Keep the bar visible right after a nav-triggered jump
        const hide = self.direction === 1 && self.scroll() > 240 && performance.now() > holdUntil.current;
        gsap.to(bar.current, { yPercent: hide ? -130 : 0, duration: 0.7, ease: EASE.snap, overwrite: "auto" });
      },
    });
    return () => st.kill();
  }, [pathname]);

  /* Track the section in view (home only) */
  useEffect(() => {
    if (!isHome) return;
    const triggers = NAV.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, [isHome]);

  /* Slide the indicator under the active link */
  useEffect(() => {
    const list = linksRef.current;
    const dot = indicator.current;
    if (!list || !dot) return;
    const place = () => {
      const target = list.querySelector<HTMLElement>(`[data-id="${current}"]`);
      if (!target) return;
      const x = target.offsetLeft + target.offsetWidth / 2 - 3;
      gsap.to(dot, { x, duration: 0.9, ease: EASE.reveal });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [current]);

  /* Mobile menu open / close */
  useGSAP(
    () => {
      const m = menu.current;
      if (!m) return;
      const reduce = prefersReducedMotion();
      if (open) {
        setScrollLocked(true);
        gsap.set(m, { visibility: "visible" });
        const tl = gsap.timeline();
        if (reduce) {
          tl.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          tl.set("[data-menu-link], [data-menu-meta]", { yPercent: 0, rotate: 0, opacity: 1 });
          return;
        }
        tl.fromTo(
          m,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.wipe },
        )
          .fromTo(
            "[data-menu-link]",
            { yPercent: 120, rotate: 7 },
            { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.08, ease: EASE.reveal },
            0.35,
          )
          .fromTo(
            "[data-menu-meta]",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 },
            0.7,
          );
      } else if (m.style.visibility === "visible") {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(m, { visibility: "hidden" });
            },
          })
          .to("[data-menu-link]", { yPercent: -120, duration: 0.5, stagger: 0.04, ease: "power3.in" })
          .to(m, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.7, ease: EASE.wipe }, 0.2);
        setScrollLocked(false);
      }
    },
    { scope: root, dependencies: [open] },
  );

  // Close the menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string, label: string) => {
    setOpen(false);
    holdUntil.current = performance.now() + 3200;
    navigate(isHome ? `#${id}` : `/#${id}`, label);
  };

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div ref={bar} className="gutter relative z-[2] flex h-[var(--nav-h)] items-center justify-between">
        <div data-nav-item className="relative z-[2]">
          <Link
            href="/"
            aria-label="ASIFWORKS — home"
            onClick={(e) => {
              e.preventDefault();
              go("index", "Index");
            }}
            className="group flex items-center gap-2.5"
          >
            <Logo className="h-6 w-6 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-90" />
            <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">{SITE.name}</span>
          </Link>
        </div>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul
            ref={linksRef}
            className="relative flex items-center gap-1 rounded-full border border-[var(--line)] bg-ink/40 px-2 py-1.5 backdrop-blur-md"
            data-nav-item
          >
            {NAV.map((item) => (
              <li key={item.id} data-id={item.id}>
                <Link
                  href={`/#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id, item.label);
                  }}
                  aria-current={current === item.id ? "true" : undefined}
                  className={`roll-host block px-3.5 py-1.5 text-[0.82rem] tracking-[-0.01em] transition-colors duration-500 ${
                    current === item.id ? "text-ivory" : "text-ivory-dim hover:text-ivory"
                  }`}
                >
                  <span className="roll">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </Link>
              </li>
            ))}
            <span
              ref={indicator}
              aria-hidden="true"
              className="absolute bottom-[3px] left-0 h-[5px] w-[5px] rounded-full bg-accent"
            />
          </ul>
        </nav>

        <div className="hidden items-center gap-6 md:flex" data-nav-item>
          <LocalTime className="label hidden lg:block" />
          <Magnetic strength={0.4}>
            <Link
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact", "Contact");
              }}
              data-cursor="open"
              className="roll-host arrow-host flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-[0.82rem] font-medium text-ink"
            >
              <span className="roll">
                <span>Let&apos;s talk</span>
                <span aria-hidden="true">Let&apos;s talk</span>
              </span>
              <span className="arrow">↗</span>
            </Link>
          </Magnetic>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          data-nav-item
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative z-[2] flex h-11 items-center gap-3 rounded-full border border-[var(--line-strong)] bg-ink/50 pl-4 pr-3 backdrop-blur-md md:hidden"
        >
          <span className="label !text-ivory">{open ? "Close" : "Menu"}</span>
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-500 ${
                open ? "top-1.5 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-5 bg-ivory transition-transform duration-500 ${
                open ? "top-1.5 -rotate-45" : "top-2.5"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        ref={menu}
        id="mobile-menu"
        className="gutter fixed inset-0 z-[1] flex flex-col justify-between bg-ink-2 pb-8 pt-28 md:hidden"
        style={{ visibility: "hidden" }}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-1/3 top-1/4 h-[80vw] w-[80vw] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #3d4dff 0%, transparent 65%)" }}
          />
        </div>
        <nav aria-label="Mobile">
          <ul className="relative">
            {NAV.map((item, i) => (
              <li key={item.id} className="border-b border-[var(--line)]">
                <Link
                  href={`/#${item.id}`}
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id, item.label);
                  }}
                  className="flex items-baseline justify-between py-3"
                >
                  <span className="mask">
                    <span data-menu-link className="mask-inner display block text-[clamp(2.8rem,14vw,5rem)]">
                      {item.label}
                    </span>
                  </span>
                  <span data-menu-meta className="label">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative flex flex-col gap-5">
          <a data-menu-meta href={`mailto:${SITE.email}`} tabIndex={open ? 0 : -1} className="text-lg">
            {SITE.email}
          </a>
          <div data-menu-meta className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="label !text-ivory"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p data-menu-meta className="label">
            {SITE.location}
          </p>
        </div>
      </div>
    </header>
  );
}

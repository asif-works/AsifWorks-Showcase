"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { ProjectArt } from "@/components/art/ProjectArt";
import type { ProjectSlug } from "@/lib/data";

const GRADIENTS = [
  "radial-gradient(circle at 30% 30%, #ece7dd 0%, #8a96ff 30%, #3d4dff 60%, #08080a 100%)",
  "conic-gradient(from 200deg at 50% 60%, #08080a, #3d4dff, #7a5cff, #ece7dd, #08080a)",
  "linear-gradient(160deg, #c6ff3d 0%, #0a0b08 70%)",
  "repeating-linear-gradient(90deg, #ece7dd 0 2px, #08080a 2px 14px)",
  "radial-gradient(circle at 50% 120%, #d4532b 0%, #efe6da 60%)",
  "linear-gradient(0deg, #3d4dff 0 50%, #ece7dd 50% 100%)",
  "radial-gradient(circle at 70% 20%, #7a5cff 0%, transparent 50%), radial-gradient(circle at 20% 80%, #3d4dff 0%, transparent 55%), #0f0f12",
  "repeating-radial-gradient(circle at 50% 50%, #ece7dd 0 1px, #08080a 1px 12px)",
];
const ARTS: ProjectSlug[] = ["noir", "aether", "veyro", "pulse"];
const POOL = 16;

/**
 * Experimental: an image trail that paints the section as you move, plus
 * elastic letters that stretch toward the cursor. Idles into an autopilot
 * so the effect also performs in screen recordings and on touch screens.
 */
export default function Playground() {
  const root = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduce = prefersReducedMotion();
    const fine = hasFinePointer();
    const tiles = Array.from(section.querySelectorAll<HTMLElement>("[data-tile]"));
    const chars = Array.from(section.querySelectorAll<HTMLElement>("[data-elastic]"));
    if (reduce) return;

    gsap.set(tiles, { xPercent: -50, yPercent: -50, opacity: 0 });

    let idx = 0;
    let z = 1;
    let made = 0;
    let lastX = 0;
    let lastY = 0;
    let lastMove = 0;
    let inView = false;
    const threshold = fine ? 90 : 60;

    const spawn = (x: number, y: number) => {
      const tile = tiles[idx];
      idx = (idx + 1) % tiles.length;
      made += 1;
      if (count.current) count.current.textContent = String(made).padStart(4, "0");
      gsap.killTweensOf(tile);
      gsap.set(tile, { x, y, zIndex: z++, rotate: gsap.utils.random(-14, 14), scale: 0.3, opacity: 1 });
      gsap
        .timeline()
        .to(tile, { scale: 1, rotate: 0, duration: 0.9, ease: "expo.out" })
        .to(tile, { opacity: 0, scale: 0.6, y: y + 60, duration: 0.9, ease: "power2.in" }, 0.65);
    };

    // Elastic letters
    const stretch = chars.map((c) => ({
      el: c,
      sy: gsap.quickTo(c, "scaleY", { duration: 0.8, ease: "elastic.out(1, 0.4)" }),
      y: gsap.quickTo(c, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" }),
    }));
    const deform = (cx: number, cy: number) => {
      stretch.forEach((s) => {
        const b = s.el.getBoundingClientRect();
        const dx = cx - (b.left + b.width / 2);
        const dy = cy - (b.top + b.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 1 - d / 380);
        s.sy(1 + f * 0.7);
        s.y(-f * 20);
      });
    };

    const onMove = (e: PointerEvent) => {
      const b = section.getBoundingClientRect();
      const x = e.clientX - b.left;
      const y = e.clientY - b.top;
      lastMove = performance.now();
      if (Math.hypot(x - lastX, y - lastY) > threshold) {
        spawn(x, y);
        lastX = x;
        lastY = y;
      }
      if (fine) deform(e.clientX, e.clientY);
    };
    const onLeave = () => stretch.forEach((s) => (s.sy(1), s.y(0)));

    // Autopilot — traces a Lissajous curve while the visitor is idle
    let t = 0;
    let lastAuto = 0;
    const auto = (time: number) => {
      if (!inView || performance.now() - lastMove < 2200) return;
      t += 0.012;
      if (time - lastAuto < 0.11) return;
      lastAuto = time;
      const w = section.clientWidth;
      const h = section.clientHeight;
      const x = w / 2 + Math.sin(t * 3) * w * 0.36;
      const y = h / 2 + Math.sin(t * 4 + 0.6) * h * 0.3;
      spawn(x, y);
    };
    gsap.ticker.add(auto);

    const vis = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => (inView = self.isActive),
    });

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      gsap.ticker.remove(auto);
      vis.kill();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(tiles);
    };
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="play-title"
      className="relative z-[1] flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden border-y border-[var(--line)] bg-ink-2/60"
      data-cursor="explore"
    >
      <p className="label absolute left-[var(--gutter)] top-8 flex items-center gap-3">
        <span className="text-accent-soft">(10)</span> Playground
      </p>
      <p className="label absolute right-[var(--gutter)] top-8">
        Frames <span ref={count}>0000</span>
      </p>

      {/* trail pool */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: POOL }, (_, i) => (
          <div
            key={i}
            data-tile
            className="absolute left-0 top-0 aspect-[3/4] w-[34vw] overflow-hidden rounded-[3px] opacity-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] md:w-[13vw]"
            style={i % 3 === 0 ? undefined : { background: GRADIENTS[i % GRADIENTS.length] }}
          >
            {i % 3 === 0 && <ProjectArt slug={ARTS[(i / 3) % ARTS.length]} className="h-full w-full" focus="xMidYMid" />}
          </div>
        ))}
      </div>

      <div className="pointer-events-none relative z-[1] text-center mix-blend-difference">
        <h2 id="play-title" className="display text-[clamp(4rem,21vw,15rem)] md:text-[min(16vw,30vh)] leading-[0.8]" aria-label="Make it move">
          <span className="flex justify-center" aria-hidden="true">
            {"MAKE".split("").map((c, i) => (
              <span key={i} data-elastic className="inline-block origin-bottom">
                {c}
              </span>
            ))}
          </span>
          <span className="flex items-baseline justify-center gap-[0.2em]" aria-hidden="true">
            <span className="serif text-[0.9em] italic normal-case">it</span>
            {"MOVE".split("").map((c, i) => (
              <span key={i} data-elastic className="inline-block origin-bottom">
                {c}
              </span>
            ))}
          </span>
        </h2>
        <p className="label mt-8 !text-ivory">
          <span className="hidden [@media(hover:hover)]:inline">Move your cursor</span>
          <span className="[@media(hover:hover)]:hidden">Touch &amp; drag</span> — every frame is generated
        </p>
      </div>
    </section>
  );
}

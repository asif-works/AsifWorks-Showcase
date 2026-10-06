"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, isLowPowerDevice, prefersReducedMotion } from "@/lib/motion";

/**
 * The living backdrop: drifting atmospheric light, a cursor-reactive glow,
 * slow flowing lines, a sparse dust field and film grain. Everything runs on
 * transforms / a single small canvas so it never competes with content.
 */
export default function Background() {
  const field = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // Atmospheric light + mouse reaction
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>("[data-blob]").forEach((b, i) => {
          gsap.to(b, {
            xPercent: gsap.utils.random(-25, 25),
            yPercent: gsap.utils.random(-20, 20),
            scale: gsap.utils.random(0.85, 1.2),
            duration: 14 + i * 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }
    }, field);

    if (reduce || !hasFinePointer()) return () => ctx.revert();

    const fx = gsap.quickTo(field.current, "x", { duration: 2.4, ease: "power2.out" });
    const fy = gsap.quickTo(field.current, "y", { duration: 2.4, ease: "power2.out" });
    const sx = gsap.quickTo(spot.current, "x", { duration: 1.1, ease: "power3.out" });
    const sy = gsap.quickTo(spot.current, "y", { duration: 1.1, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      fx(nx * -60);
      fy(ny * -40);
      sx(e.clientX);
      sy(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  // Dust particle field (single 2D canvas, paused when tab hidden)
  useEffect(() => {
    const c = canvas.current;
    if (!c || prefersReducedMotion()) return;
    const g = c.getContext("2d");
    if (!g) return;
    const low = isLowPowerDevice();
    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
    const count = low ? 28 : 70;
    let w = 0;
    let h = 0;
    let raf = 0;
    let mx = -9999;
    let my = -9999;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const ps: P[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.04 - Math.random() * 0.12,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.45 + 0.1,
      });
    }

    const draw = () => {
      g.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const f = (1 - d2 / 22000) * 0.6;
          p.x += (dx / Math.sqrt(d2 + 1)) * f;
          p.y += (dy / Math.sqrt(d2 + 1)) * f;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        g.globalAlpha = p.a;
        g.fillStyle = "#ece7dd";
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={field} className="absolute -inset-[10%]">
        <div
          data-blob
          className="absolute left-[55%] top-[-10%] h-[70vmax] w-[70vmax] rounded-full opacity-[0.32]"
          style={{ background: "radial-gradient(circle at center, #3d4dff 0%, rgba(61,77,255,0.25) 30%, transparent 62%)" }}
        />
        <div
          data-blob
          className="absolute left-[-20%] top-[35%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.22]"
          style={{ background: "radial-gradient(circle at center, #7a5cff 0%, rgba(122,92,255,0.2) 30%, transparent 62%)" }}
        />
        <div
          data-blob
          className="absolute left-[30%] top-[70%] h-[50vmax] w-[50vmax] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle at center, #ece7dd 0%, transparent 60%)" }}
        />
      </div>

      {/* Flowing lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 1440 900" preserveAspectRatio="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M-100 ${620 + i * 38} C 300 ${380 + i * 60}, 700 ${980 - i * 40}, 1600 ${260 + i * 70}`}
            fill="none"
            stroke="url(#bg-line)"
            strokeWidth="1"
            strokeDasharray="6 14"
            className="bg-flow"
            style={{ animationDuration: `${40 + i * 9}s` }}
          />
        ))}
        <defs>
          <linearGradient id="bg-line" x1="0" x2="1">
            <stop offset="0" stopColor="#ece7dd" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8a96ff" />
            <stop offset="1" stopColor="#ece7dd" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <canvas ref={canvas} className="absolute inset-0" />

      {/* Cursor light */}
      <div
        ref={spot}
        className="absolute left-0 top-0 h-[44rem] w-[44rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(138,150,255,0.10) 0%, rgba(61,77,255,0.04) 35%, transparent 65%)",
          marginLeft: "-22rem",
          marginTop: "-22rem",
          transform: "translate(50vw, 40vh)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(8,8,10,0.85) 100%)" }}
      />
      <div className="grain" />
    </div>
  );
}

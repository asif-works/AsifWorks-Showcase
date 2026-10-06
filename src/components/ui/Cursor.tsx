"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { hasFinePointer } from "@/lib/motion";

const LABELS: Record<string, string> = {
  view: "View",
  open: "Open",
  drag: "Drag",
  explore: "Explore",
};

/**
 * Dot + trailing ring. Elements opt into a contextual state with
 * `data-cursor="view|open|drag|explore"`; links & buttons get a soft hover
 * state automatically. `data-cursor-stick` pulls the ring toward the
 * element's centre (magnetic attraction).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    if (!hasFinePointer()) return;
    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    document.documentElement.classList.add("has-cursor");

    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });

    let stick: HTMLElement | null = null;
    let state = "";
    let visible = false;

    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      const text = LABELS[next];
      if (text) {
        l.textContent = text;
        gsap.to(r, { scale: 1, backgroundColor: "rgba(61,77,255,1)", borderColor: "rgba(61,77,255,0)", duration: 0.5, ease: "expo.out" });
        gsap.to(l, { opacity: 1, scale: 1, duration: 0.4, delay: 0.05 });
        gsap.to(d, { scale: 0, duration: 0.3 });
      } else if (next === "hover") {
        gsap.to(r, { scale: 0.62, backgroundColor: "rgba(236,231,221,0.08)", borderColor: "rgba(236,231,221,0.7)", duration: 0.5, ease: "expo.out" });
        gsap.to(l, { opacity: 0, scale: 0.6, duration: 0.2 });
        gsap.to(d, { scale: 0.6, duration: 0.3 });
      } else {
        gsap.to(r, { scale: 0.4, backgroundColor: "rgba(236,231,221,0)", borderColor: "rgba(236,231,221,0.45)", duration: 0.5, ease: "expo.out" });
        gsap.to(l, { opacity: 0, scale: 0.6, duration: 0.2 });
        gsap.to(d, { scale: 1, duration: 0.3 });
      }
    };
    reset.current = () => {
      stick = null;
      setState("");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      if (stick) {
        const b = stick.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        rx(cx + (e.clientX - cx) * 0.35);
        ry(cy + (e.clientY - cy) * 0.35);
      } else {
        rx(e.clientX);
        ry(e.clientY);
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      const ctx = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest<HTMLElement>("a, button, [role='button'], input, textarea, label");
      stick = t.closest<HTMLElement>("[data-cursor-stick]");
      if (ctx) setState(ctx.dataset.cursor ?? "");
      else if (interactive) setState("hover");
      else setState("");
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(r, { scale: "-=0.08", duration: 0.2 });
    const onUp = () => {
      const s = state;
      state = "__";
      setState(s);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    setState("");

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Route changes swap the DOM under the cursor — reset contextual state.
  useEffect(() => {
    reset.current();
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div
        ref={ring}
        className="fixed left-0 top-0 flex h-24 w-24 items-center justify-center rounded-full border opacity-0"
        style={{ borderColor: "rgba(236,231,221,0.45)", transform: "scale(0.4)" }}
      >
        <span
          ref={label}
          className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ivory opacity-0"
        />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-ivory opacity-0 mix-blend-difference" />
    </div>
  );
}

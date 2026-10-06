"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** 0–1: how far the element follows the pointer. */
  strength?: number;
  /** Optional parallax for an inner label (data-magnetic-inner). */
  innerStrength?: number;
  className?: string;
};

/** Pulls its child toward the pointer, then springs back elastically. */
export default function Magnetic({ children, strength = 0.35, innerStrength = 0.18, className }: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !hasFinePointer() || prefersReducedMotion()) return;
    const inner = node.querySelector<HTMLElement>("[data-magnetic-inner]");
    const xTo = gsap.quickTo(node, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.6, ease: "power3.out" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" }) : null;

    const move = (e: PointerEvent) => {
      const b = node.getBoundingClientRect();
      const x = e.clientX - (b.left + b.width / 2);
      const y = e.clientY - (b.top + b.height / 2);
      xTo(x * strength);
      yTo(y * strength);
      ixTo?.(x * innerStrength);
      iyTo?.(y * innerStrength);
    };
    const leave = () => {
      gsap.to(node, { x: 0, y: 0, duration: 1.1, ease: EASE.elastic });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.1, ease: EASE.elastic });
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }, [strength, innerStrength]);

  return (
    <span ref={el} className={`inline-block will-change-transform ${className ?? ""}`} data-cursor-stick>
      {children}
    </span>
  );
}

"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "expo.out", duration: 1.2 });

  // House easing vocabulary — every animation pulls from this small set so
  // the motion language stays coherent.
  gsap.registerEase("aw.out", (p) => 1 - Math.pow(1 - p, 4));
}

export const EASE = {
  /** Default reveal — fast attack, long luxurious settle. */
  reveal: "expo.out",
  /** Wipes & overlays — symmetric, cinematic. */
  wipe: "power4.inOut",
  /** Interaction feedback. */
  snap: "power3.out",
  /** Elastic return for magnetic elements. */
  elastic: "elastic.out(1, 0.35)",
} as const;

export { gsap, ScrollTrigger, Draggable, useGSAP };

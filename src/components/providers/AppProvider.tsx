"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import TransitionLayer, { type TransitionHandle } from "@/components/ui/TransitionLayer";

type AppContextValue = {
  /** Lenis instance (null on reduced motion or before mount). */
  lenis: Lenis | null;
  /** True once the opening sequence has finished (or was skipped). */
  introDone: boolean;
  completeIntro: () => void;
  /** Cinematic navigation to a "#section" or a route. */
  navigate: (href: string, label?: string) => void;
  /** Lock / unlock page scrolling (used by preloader + mobile menu). */
  setScrollLocked: (locked: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

// Survives client-side navigations: the opening sequence plays once per load.
let introPlayed = false;

export default function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [introDone, setIntroDone] = useState(() => introPlayed || pathname !== "/");
  const transitionRef = useRef<TransitionHandle>(null);
  const pendingRoute = useRef<{ resolve: () => void; hash?: string } | null>(null);
  const busy = useRef(false);

  /* ---------------------------------------------------------------- Lenis */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists client-side
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  /* -------------------------------------------- refresh once fonts settle */
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const setScrollLocked = useCallback(
    (locked: boolean) => {
      if (lenis) {
        if (locked) lenis.stop();
        else lenis.start();
      }
      document.documentElement.style.overflow = locked ? "hidden" : "";
    },
    [lenis],
  );

  const completeIntro = useCallback(() => {
    introPlayed = true;
    setIntroDone(true);
  }, []);

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        // The new route may be taller than the last one — refresh Lenis' limits first.
        lenis.resize();
        lenis.scrollTo(el, { immediate: true, force: true });
      }
      else el.scrollIntoView({ behavior: "auto" });
      ScrollTrigger.update();
    },
    [lenis],
  );

  /* ---------------------------------- finish route transitions on arrival */
  useEffect(() => {
    const pending = pendingRoute.current;
    if (!pending) return;
    pendingRoute.current = null;
    // Give the new route a frame to mount its ScrollTriggers.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (pending.hash) {
        ScrollTrigger.refresh();
        scrollToId(pending.hash);
      } else {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      }
      pending.resolve();
    }));
  }, [pathname, lenis, scrollToId]);

  const navigate = useCallback(
    async (href: string, label?: string) => {
      if (busy.current) return;
      const layer = transitionRef.current;
      const isHash = href.startsWith("#") || href.startsWith("/#");
      const hash = isHash ? href.split("#")[1] : undefined;
      const sameRoute = isHash ? pathname === "/" : href === pathname;

      busy.current = true;
      const text = label ?? (hash ? hash : "ASIFWORKS");

      if (!layer) {
        if (isHash && sameRoute && hash) scrollToId(hash);
        else router.push(href);
        busy.current = false;
        return;
      }

      await layer.cover(text);

      if (isHash && sameRoute && hash) {
        scrollToId(hash);
      } else if (sameRoute) {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      } else {
        await new Promise<void>((resolve) => {
          pendingRoute.current = { resolve, hash };
          router.push(isHash ? "/" : href, { scroll: false });
        });
      }

      await layer.reveal();
      busy.current = false;
    },
    [pathname, router, scrollToId, lenis],
  );

  const value = useMemo<AppContextValue>(
    () => ({ lenis, introDone, completeIntro, navigate, setScrollLocked }),
    [lenis, introDone, completeIntro, navigate, setScrollLocked],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <TransitionLayer ref={transitionRef} />
    </AppContext.Provider>
  );
}

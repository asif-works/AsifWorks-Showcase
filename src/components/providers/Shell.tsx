"use client";

import type { ReactNode } from "react";
import AppProvider from "@/components/providers/AppProvider";
import Background from "@/components/ui/Background";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/ui/Nav";
import Preloader from "@/components/ui/Preloader";

/** Global chrome shared by every route. */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Background />
      <Nav />
      <main id="main" className="relative">
        {children}
      </main>
      <Cursor />
      <Preloader />
    </AppProvider>
  );
}

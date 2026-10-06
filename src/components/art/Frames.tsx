import type { ReactNode } from "react";

/** Minimal browser chrome around any visual. */
export function BrowserFrame({ children, url, className = "" }: { children: ReactNode; url: string; className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[10px] border border-[var(--line-strong)] bg-ink-3 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-[var(--line)] px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-ivory/20" />
          <span className="h-2 w-2 rounded-full bg-ivory/20" />
          <span className="h-2 w-2 rounded-full bg-ivory/20" />
        </span>
        <span className="mx-auto truncate rounded-full bg-ivory/[0.06] px-4 py-0.5 font-mono text-[0.62rem] text-ivory-dim">{url}</span>
        <span className="w-8" aria-hidden="true" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** Phone mockup — a rounded device with a notch. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[2.2rem] border border-[var(--line-strong)] bg-ink-3 p-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.7rem]">
        {children}
        <span aria-hidden="true" className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

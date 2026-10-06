"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Qatar",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

/** Live Doha clock — a small editorial detail. */
export default function LocalTime({ className, prefix = "DOH" }: { className?: string; prefix?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(fmt());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={className} suppressHydrationWarning>
      {prefix} {time ?? "--:--:--"} <span className="text-accent-soft">GMT+3</span>
    </span>
  );
}

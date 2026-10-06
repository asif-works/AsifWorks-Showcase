import { useId } from "react";
import type { ProjectSlug } from "@/lib/data";

/**
 * Generated, license-free artwork for each fictional project. Pure SVG, so it
 * is razor sharp at any size, weighs a few KB and can be swapped for real
 * imagery later. `slice` crops like `object-fit: cover`.
 */

type ArtProps = {
  className?: string;
  /** preserveAspectRatio alignment, e.g. "xMidYMid" or "xMinYMid". */
  focus?: string;
};

// Deterministic pseudo-random so server and client render identically.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------- */
/* 01 — NOIR : luxury fashion, silk & couture serif                           */
/* -------------------------------------------------------------------------- */

export function NoirArt({ className, focus = "xMidYMid" }: ArtProps) {
  const id = useId().replace(/:/g, "");
  const lines = Array.from({ length: 64 }, (_, i) => {
    const pts: string[] = [];
    for (let x = -100; x <= 1700; x += 50) {
      const y =
        330 +
        i * 7.5 +
        Math.sin(x * 0.0042 + i * 0.07) * (140 - i * 0.6) +
        Math.cos(x * 0.0019 - i * 0.045) * 90 +
        Math.sin(x * 0.011 + i * 0.2) * 6;
      pts.push(`${x},${r2(y)}`);
    }
    return { d: `M${pts.join(" L")}`, o: 0.06 + Math.pow(Math.sin((i / 64) * Math.PI), 2) * 0.55 };
  });

  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio={`${focus} slice`} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.62" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#3a2f22" />
          <stop offset="0.55" stopColor="#14110d" />
          <stop offset="1" stopColor="#0b0a09" />
        </radialGradient>
        <linearGradient id={`${id}-silk`} x1="0" x2="1">
          <stop offset="0" stopColor="#efe6d6" stopOpacity="0" />
          <stop offset="0.35" stopColor="#efe6d6" />
          <stop offset="0.7" stopColor="#c9a96a" />
          <stop offset="1" stopColor="#c9a96a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-arch`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe6d6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#efe6d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-glow)`} />
      <path d="M980 1000 V360 a210 210 0 0 1 420 0 V1000 Z" fill={`url(#${id}-arch)`} />
      <path d="M980 1000 V360 a210 210 0 0 1 420 0 V1000" fill="none" stroke="#efe6d6" strokeOpacity="0.25" />
      <text x="1190" y="760" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="560" fill="#efe6d6" fillOpacity="0.07">
        N
      </text>
      <g fill="none" stroke={`url(#${id}-silk)`} strokeWidth="1.1">
        {lines.map((l, i) => (
          <path key={i} d={l.d} strokeOpacity={r2(l.o)} />
        ))}
      </g>
      <text x="240" y="910" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="190" fill="#efe6d6" letterSpacing="-6">
        Noir
      </text>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="17" fill="#efe6d6" fillOpacity="0.6" letterSpacing="2">
        <text x="250" y="110">MAISON NOIR</text>
        <text x="250" y="140" fillOpacity="0.35">COLLECTION 07 — AW26</text>
        <text x="1350" y="110" textAnchor="end">PARIS · DOHA · TOKYO</text>
        <text x="1350" y="930" textAnchor="end" fill="#c9a96a" fillOpacity="0.9">DISCOVER THE COLLECTION →</text>
      </g>
      <line x1="250" y1="170" x2="1350" y2="170" stroke="#efe6d6" strokeOpacity="0.12" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — AETHER : architecture, layered planes & light                         */
/* -------------------------------------------------------------------------- */

function box(x: number, y: number, w: number, d: number, h: number) {
  // Isometric box: (x,y) = front-bottom corner on screen
  const c = 0.5;
  const top = `${x},${y - h} ${x + w},${y - h - w * c} ${x + w + d},${y - h - w * c + d * c} ${x + d},${y - h + d * c}`;
  const left = `${x},${y - h} ${x + d},${y - h + d * c} ${x + d},${y + d * c} ${x},${y}`;
  const right = `${x + d},${y - h + d * c} ${x + w + d},${y - h - w * c + d * c} ${x + w + d},${y - w * c + d * c} ${x + d},${y + d * c}`;
  return { top, left, right };
}

export function AetherArt({ className, focus = "xMidYMid" }: ArtProps) {
  const id = useId().replace(/:/g, "");
  const slabs = [
    { x: 560, y: 820, w: 300, d: 260, h: 60, o: 1 },
    { x: 600, y: 760, w: 240, d: 300, h: 50, o: 0.9 },
    { x: 520, y: 708, w: 360, d: 200, h: 46, o: 0.85 },
    { x: 640, y: 660, w: 200, d: 240, h: 44, o: 0.8 },
    { x: 590, y: 614, w: 300, d: 180, h: 40, o: 0.75 },
    { x: 700, y: 572, w: 140, d: 160, h: 230, o: 0.95 },
    { x: 760, y: 340, w: 60, d: 60, h: 160, o: 1 },
  ];
  const floor: string[] = [];
  for (let i = -12; i <= 12; i++) floor.push(`M800 560 L${800 + i * 140} 1000`);
  for (let j = 0; j < 9; j++) {
    const y = 600 + Math.pow(j / 8, 1.8) * 400;
    floor.push(`M0 ${r2(y)} L1600 ${r2(y)}`);
  }

  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio={`${focus} slice`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1030" />
          <stop offset="0.6" stopColor="#070b18" />
          <stop offset="1" stopColor="#05070f" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa0ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b74ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7ecff" />
          <stop offset="1" stopColor="#9fb0ff" />
        </linearGradient>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#5b74ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5b74ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />
      <circle cx="800" cy="480" r="520" fill={`url(#${id}-halo)`} />
      <path d={floor.join(" ")} stroke="#e7ecff" strokeOpacity="0.08" fill="none" />
      <polygon points="700,0 980,0 900,820 660,820" fill={`url(#${id}-beam)`} opacity="0.5" />
      <text
        x="800"
        y="330"
        textAnchor="middle"
        fontFamily="Inter Tight Variable, Inter Tight, sans-serif"
        fontWeight="700"
        fontSize="300"
        letterSpacing="-14"
        fill="none"
        stroke="#e7ecff"
        strokeOpacity="0.16"
      >
        AETHER
      </text>
      {slabs.map((s, i) => {
        const b = box(s.x, s.y, s.w, s.d, s.h);
        return (
          <g key={i} opacity={s.o}>
            <polygon points={b.left} fill="#1a2466" />
            <polygon points={b.right} fill="#2a3aa8" />
            <polygon points={b.top} fill={`url(#${id}-top)`} />
            <polygon points={b.top} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
          </g>
        );
      })}
      {/* wireframe ghost volume */}
      {(() => {
        const b = box(980, 760, 220, 200, 320);
        return (
          <g fill="none" stroke="#8fa0ff" strokeOpacity="0.5" strokeDasharray="4 6">
            <polygon points={b.top} />
            <polygon points={b.left} />
            <polygon points={b.right} />
          </g>
        );
      })()}
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="16" fill="#e7ecff" letterSpacing="2">
        <line x1="790" y1="300" x2="1040" y2="235" stroke="#e7ecff" strokeOpacity="0.4" />
        <circle cx="790" cy="300" r="5" fill="#5b74ff" />
        <text x="1050" y="230" fillOpacity="0.8">TOWER L-07 / +128.0m</text>
        <line x1="560" y1="770" x2="420" y2="690" stroke="#e7ecff" strokeOpacity="0.4" />
        <circle cx="560" cy="770" r="5" fill="#5b74ff" />
        <text x="250" y="664" fillOpacity="0.8">PODIUM / CANTILEVER 18m</text>
        <text x="250" y="110" fillOpacity="0.6">AETHER STUDIO — FORM STUDY 12</text>
        <text x="1350" y="110" textAnchor="end" fillOpacity="0.6">SECTION A–A&apos; 1:500</text>
        <text x="1350" y="930" textAnchor="end" fill="#8fa0ff">EXPLORE THE MODEL →</text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 — VEYRO : editorial fashion commerce UI                                 */
/* -------------------------------------------------------------------------- */

export function VeyroArt({ className, focus = "xMidYMid" }: ArtProps) {
  const id = useId().replace(/:/g, "");
  const products = [
    { x: 830, c1: "#d4532b", c2: "#8c2c12", name: "Drape Coat", price: "€ 640" },
    { x: 1010, c1: "#2b2a26", c2: "#5a564c", name: "Fold Trouser", price: "€ 290" },
    { x: 1190, c1: "#c9b79c", c2: "#9b8566", name: "Arc Knit", price: "€ 210" },
  ];
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio={`${focus} slice`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-hero`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e5784f" />
          <stop offset="1" stopColor="#a8361a" />
        </linearGradient>
        <radialGradient id={`${id}-orb`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f6d9c4" />
          <stop offset="0.5" stopColor="#d4532b" />
          <stop offset="1" stopColor="#5e1b08" />
        </radialGradient>
        {products.map((p, i) => (
          <linearGradient key={i} id={`${id}-p${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.c1} />
            <stop offset="1" stopColor={p.c2} />
          </linearGradient>
        ))}
      </defs>
      <rect width="1600" height="1000" fill="#efe6da" />
      {/* top bar */}
      <g fontFamily="Inter Tight Variable, Inter Tight, sans-serif" fill="#16130f">
        <text x="220" y="92" fontWeight="700" fontSize="34" letterSpacing="6">VEYRO</text>
        <g fontSize="17" fillOpacity="0.7">
          <text x="600" y="88">Women</text>
          <text x="700" y="88">Men</text>
          <text x="780" y="88">Objects</text>
          <text x="890" y="88">Journal</text>
        </g>
        <text x="1380" y="88" textAnchor="end" fontSize="17">Bag (2)</text>
      </g>
      <line x1="220" y1="128" x2="1380" y2="128" stroke="#16130f" strokeOpacity="0.15" />
      {/* hero panel */}
      <rect x="220" y="170" width="560" height="760" fill={`url(#${id}-hero)`} />
      <circle cx="500" cy="470" r="170" fill={`url(#${id}-orb)`} />
      <path d="M330 930 C 380 660, 620 660, 670 930 Z" fill="#16130f" fillOpacity="0.85" />
      <path d="M420 930 C 450 780, 570 780, 600 930 Z" fill="#efe6da" fillOpacity="0.12" />
      <text x="250" y="230" fontFamily="JetBrains Mono Variable, monospace" fontSize="15" fill="#efe6da" letterSpacing="3">
        SS27 — FORM &amp; FABRIC
      </text>
      <text x="830" y="290" fontFamily="Instrument Serif, serif" fontSize="96" fill="#16130f" letterSpacing="-3">
        New season,
      </text>
      <text x="830" y="380" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="96" fill="#d4532b" letterSpacing="-3">
        new silhouette.
      </text>
      <rect x="830" y="425" width="190" height="52" rx="26" fill="#16130f" />
      <text x="925" y="457" textAnchor="middle" fontFamily="Inter Tight Variable, Inter Tight, sans-serif" fontSize="17" fill="#efe6da">
        Shop now →
      </text>
      {products.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y="560" width="170" height="270" fill={`url(#${id}-p${i})`} />
          <rect x={p.x + 45} y="605" width="80" height="180" rx="40" fill="#efe6da" fillOpacity="0.16" />
          <text x={p.x} y="866" fontFamily="Inter Tight Variable, Inter Tight, sans-serif" fontSize="17" fill="#16130f">
            {p.name}
          </text>
          <text x={p.x + 170} y="896" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="14" fill="#16130f" fillOpacity="0.6">
            {p.price}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — PULSE : fitness data in motion                                        */
/* -------------------------------------------------------------------------- */

export function PulseArt({ className, focus = "xMidYMid" }: ArtProps) {
  const id = useId().replace(/:/g, "");
  const rand = rng(7);
  const bars = Array.from({ length: 34 }, () => 30 + rand() * 150);
  // ECG-like waveform
  const wave: string[] = [];
  for (let x = 0; x <= 1600; x += 8) {
    const beat = x % 320;
    let y = 520 + Math.sin(x * 0.02) * 6;
    if (beat > 140 && beat < 150) y -= 60;
    else if (beat >= 150 && beat < 160) y += 150;
    else if (beat >= 160 && beat < 172) y -= 210;
    else if (beat >= 172 && beat < 184) y += 70;
    wave.push(`${x},${r2(y)}`);
  }
  const ring = (r: number, pct: number, color: string, w: number, cls: string) => {
    const c = 2 * Math.PI * r;
    return (
      <g className={cls}>
        <circle cx="1130" cy="430" r={r} fill="none" stroke={color} strokeOpacity="0.14" strokeWidth={w} />
        <circle
          cx="1130"
          cy="430"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={`${r2(c * pct)} ${r2(c)}`}
          transform="rotate(-90 1130 430)"
        />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio={`${focus} slice`} className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.7" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#1b2410" />
          <stop offset="1" stopColor="#0a0b08" />
        </radialGradient>
        <linearGradient id={`${id}-wave`} x1="0" x2="1">
          <stop offset="0" stopColor="#c6ff3d" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c6ff3d" />
          <stop offset="1" stopColor="#c6ff3d" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-bg)`} />
      <g stroke="#eef5e4" strokeOpacity="0.05">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} />
        ))}
      </g>
      {ring(250, 0.78, "#c6ff3d", 30, "art-spin")}
      {ring(200, 0.56, "#eef5e4", 30, "art-spin-rev")}
      {ring(150, 0.88, "#7b8cff", 30, "art-spin")}
      <text x="1130" y="440" textAnchor="middle" fontFamily="Inter Tight Variable, Inter Tight, sans-serif" fontWeight="700" fontSize="90" fill="#eef5e4" letterSpacing="-4">
        87%
      </text>
      <text x="1130" y="480" textAnchor="middle" fontFamily="JetBrains Mono Variable, monospace" fontSize="15" fill="#eef5e4" fillOpacity="0.6" letterSpacing="3">
        DAILY GOAL
      </text>
      <polyline points={wave.join(" ")} fill="none" stroke={`url(#${id}-wave)`} strokeWidth="3" strokeLinejoin="round" />
      <text x="240" y="300" fontFamily="Inter Tight Variable, Inter Tight, sans-serif" fontWeight="700" fontSize="230" fill="#eef5e4" letterSpacing="-12">
        142
      </text>
      <text x="250" y="350" fontFamily="JetBrains Mono Variable, monospace" fontSize="18" fill="#c6ff3d" letterSpacing="3">
        BPM — ZONE 4 · THRESHOLD
      </text>
      <g>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={250 + i * 22}
            y={r2(930 - h)}
            width="12"
            height={r2(h)}
            fill={i > 26 ? "#c6ff3d" : "#eef5e4"}
            fillOpacity={i > 26 ? 1 : 0.22}
          />
        ))}
      </g>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="17" fill="#eef5e4" letterSpacing="2">
        <text x="250" y="110" fillOpacity="0.6">PULSE / LIVE SESSION</text>
        <text x="1350" y="110" textAnchor="end" fillOpacity="0.6">07:42 /KM · 12.4 KM</text>
        <text x="1350" y="930" textAnchor="end" fill="#c6ff3d">START TRAINING →</text>
      </g>
    </svg>
  );
}

export function ProjectArt({ slug, ...props }: ArtProps & { slug: ProjectSlug }) {
  switch (slug) {
    case "noir":
      return <NoirArt {...props} />;
    case "aether":
      return <AetherArt {...props} />;
    case "veyro":
      return <VeyroArt {...props} />;
    case "pulse":
      return <PulseArt {...props} />;
  }
}

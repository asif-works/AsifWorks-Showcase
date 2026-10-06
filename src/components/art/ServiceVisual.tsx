/** Small generated visuals that preview each capability. */
export default function ServiceVisual({ index }: { index: number }) {
  switch (index) {
    case 0: // Creative Web Design — layout grid + golden spiral
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="300" fill="#ece7dd" />
          <g stroke="#08080a" strokeOpacity="0.15">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={20 + i * 33} y1="0" x2={20 + i * 33} y2="300" />
            ))}
          </g>
          <rect x="20" y="40" width="200" height="160" fill="#3d4dff" />
          <circle cx="290" cy="120" r="70" fill="none" stroke="#08080a" strokeWidth="1.5" />
          <text x="24" y="270" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="64" fill="#08080a">
            Aa
          </text>
          <text x="380" y="270" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="11" fill="#08080a">
            GRID 12 / 24px
          </text>
        </svg>
      );
    case 1: // Frontend Development — code
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="300" fill="#0f0f12" />
          <g fontFamily="JetBrains Mono Variable, monospace" fontSize="13">
            {[
              ["#7a5cff", "export default", "#ece7dd", " function Hero() {"],
              ["#a9a49b", "  useGSAP(() => {", "", ""],
              ["#8a96ff", "    gsap.from", "#ece7dd", "(lines, {"],
              ["#ece7dd", "      yPercent: ", "#c6ff3d", "110,"],
              ["#ece7dd", "      stagger: ", "#c6ff3d", "0.06,"],
              ["#ece7dd", "      ease: ", "#c6ff3d", "\"expo.out\""],
              ["#ece7dd", "    });", "", ""],
              ["#a9a49b", "  });", "", ""],
              ["#ece7dd", "}", "", ""],
            ].map(([c1, t1, c2, t2], i) => (
              <text key={i} x="28" y={50 + i * 25}>
                <tspan fill={c1}>{t1}</tspan>
                <tspan fill={c2 || c1}>{t2}</tspan>
              </text>
            ))}
          </g>
          <rect x="28" y="262" width="8" height="15" fill="#3d4dff" className="animate-pulse" />
        </svg>
      );
    case 2: // Motion — easing curves
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="300" fill="#3d4dff" />
          <g stroke="#ece7dd" strokeOpacity="0.25">
            <line x1="40" y1="260" x2="360" y2="260" />
            <line x1="40" y1="40" x2="40" y2="260" />
          </g>
          <path d="M40 260 C 120 260, 130 40, 360 40" fill="none" stroke="#ece7dd" strokeWidth="3" />
          <path d="M40 260 C 200 260, 200 40, 360 40" fill="none" stroke="#08080a" strokeWidth="1.5" strokeDasharray="5 6" />
          <circle cx="40" cy="260" r="6" fill="#ece7dd" />
          <circle cx="360" cy="40" r="6" fill="#ece7dd" />
          <line x1="40" y1="260" x2="120" y2="260" stroke="#ece7dd" strokeOpacity="0.6" />
          <circle cx="120" cy="260" r="4" fill="#08080a" stroke="#ece7dd" />
          <line x1="360" y1="40" x2="130" y2="40" stroke="#ece7dd" strokeOpacity="0.6" />
          <circle cx="130" cy="40" r="4" fill="#08080a" stroke="#ece7dd" />
          <text x="360" y="285" textAnchor="end" fontFamily="JetBrains Mono Variable, monospace" fontSize="11" fill="#ece7dd">
            expo.out — 1.2s
          </text>
        </svg>
      );
    case 3: // Digital Experiences — orb + rings
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="sv-orb" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ece7dd" />
              <stop offset="0.35" stopColor="#8a96ff" />
              <stop offset="0.75" stopColor="#1a1f66" />
              <stop offset="1" stopColor="#08080a" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="#08080a" />
          <ellipse cx="200" cy="150" rx="170" ry="40" fill="none" stroke="#ece7dd" strokeOpacity="0.25" className="art-spin" />
          <circle cx="200" cy="150" r="90" fill="url(#sv-orb)" />
          <ellipse cx="200" cy="150" rx="140" ry="110" fill="none" stroke="#7a5cff" strokeOpacity="0.5" transform="rotate(-25 200 150)" />
        </svg>
      );
    case 4: // SEO & Performance — score gauge
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="300" fill="#0f0f12" />
          {[
            { x: 80, l: "Perf" },
            { x: 200, l: "A11y" },
            { x: 320, l: "SEO" },
          ].map((g) => (
            <g key={g.l}>
              <circle cx={g.x} cy="140" r="46" fill="none" stroke="#c6ff3d" strokeOpacity="0.15" strokeWidth="6" />
              <circle cx={g.x} cy="140" r="46" fill="none" stroke="#c6ff3d" strokeWidth="6" strokeDasharray="289 289" transform={`rotate(-90 ${g.x} 140)`} />
              <text x={g.x} y="152" textAnchor="middle" fontFamily="Inter Tight Variable, sans-serif" fontWeight="700" fontSize="34" fill="#ece7dd">
                100
              </text>
              <text x={g.x} y="225" textAnchor="middle" fontFamily="JetBrains Mono Variable, monospace" fontSize="12" fill="#a9a49b">
                {g.l.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      );
    default: // AI — neural constellation
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
          <rect width="400" height="300" fill="#ece7dd" />
          {(() => {
            const layers = [3, 5, 5, 2];
            const nodes = layers.flatMap((n, li) =>
              Array.from({ length: n }, (_, i) => ({ x: 60 + li * 93, y: 150 + (i - (n - 1) / 2) * 48, li })),
            );
            const edges: [number, number, number, number][] = [];
            nodes.forEach((a) =>
              nodes.forEach((b) => {
                if (b.li === a.li + 1) edges.push([a.x, a.y, b.x, b.y]);
              }),
            );
            return (
              <>
                {edges.map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#08080a" strokeOpacity="0.18" />
                ))}
                {nodes.map((n, i) => (
                  <circle key={i} cx={n.x} cy={n.y} r={n.li === 3 ? 10 : 7} fill={n.li === 3 ? "#3d4dff" : "#08080a"} />
                ))}
              </>
            );
          })()}
        </svg>
      );
  }
}

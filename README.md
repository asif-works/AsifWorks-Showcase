# ASIFWORKS — Showcase

> Digital experiences made impossible to ignore.

An immersive, motion-driven showcase site for **ASIFWORKS**, an independent digital studio (Doha / Worldwide). It is built for screen recordings: the first few seconds (preloader → kinetic hero → liquid-chrome object) should feel expensive and memorable.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4**, design tokens in `app/globals.css`
- **GSAP 3** with ScrollTrigger, Draggable and InertiaPlugin (all free plugins), plus `@gsap/react` (`useGSAP`) for automatic cleanup
- **Lenis** for smooth scrolling, synced to the GSAP ticker
- **Three.js** for one lazy-loaded shader object (the hero's liquid chrome)
- Self-hosted fonts through Fontsource: Inter Tight (display), Instrument Serif (editorial italic), JetBrains Mono (labels)

The site uses no images or video. All artwork is generated SVG/CSS, so it's sharp at any size, weighs a few KB and is free to use.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server              |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint (Next core-web-vitals)   |
| `npm run typecheck` | `tsc --noEmit`                  |

Requires Node 20.9+ (tested with Node 22).

## Structure

```
app/
  layout.tsx            Metadata, fonts, global shell
  page.tsx              The home experience (section order lives here)
  work/[slug]/page.tsx  Statically generated case studies
  opengraph-image.tsx   Generated OG image
  icon.svg              Favicon
  globals.css           Tokens, type primitives, atmosphere, reduced-motion rules
src/
  lib/
    data.ts             All copy: site info, nav, socials, projects, services, process, stats
    gsap.ts             Plugin registration + the house easing vocabulary
    motion.ts           reduced-motion / pointer / low-power helpers
  components/
    providers/          AppProvider (Lenis, intro state, cinematic navigate()), Shell
    ui/                 Preloader, Nav + mobile menu, Cursor, Magnetic, Background,
                        TransitionLayer, Marquee, Split text helpers, Logo, LocalTime
    sections/           Hero (+ HeroObject shader), Manifesto, Statement, Work, Gallery,
                        Capabilities, MotionShowcase, Stats, Process, Studio,
                        Playground, Contact, Footer
    art/                Generated project artwork, device/browser frames, service visuals
    work/CaseStudy.tsx  Case-study template
```

## The experience

1. **Preloader.** A roughly 4-second sequence: the mark appears, a rolling 00→100 counter runs, a hairline expands across the screen, and the screen splits open.
2. **Hero.** The headline enters word by word from different directions through masks, with mouse and scroll depth on each layer. Behind it sits a noise-displaced liquid-chrome shader that follows the cursor.
3. **Manifesto.** Words light up one by one as you scroll, next to a masked figure.
4. **Statement (pinned).** In *We don't build ___ websites*, BORING is struck out and shatters, FORGETTABLE blurs away, DON'T is crossed out, and *memorable* rises.
5. **Selected work.** Four full-screen project panels stack over each other (sticky). Each has a clip-path reveal, a zoom that settles, and title letters that rise.
6. **In detail.** A horizontal reel of browser and phone mockups, driven by vertical scroll, with inner parallax.
7. **Capabilities.** Oversized rows. On hover the title swaps to the serif, the arrow turns, and a preview follows the cursor. Each row also works as an accordion for touch and keyboard.
8. **Motion.** Giant words move in opposite directions and skew with scroll velocity. Speed lines and an infinite marquee react to scroll speed.
9. **Impact.** Counters, plus an SVG infinity sign that draws itself.
10. **Process.** A vertical timeline: the line fills, the active step grows, and a sticky visual swaps with a wipe.
11. **Studio.** The statement is revealed line by line (lines are measured at runtime), followed by a draggable inertia archive.
12. **Playground.** A generated image trail plus elastic letters. When nobody is moving the mouse it runs on autopilot, so it still looks good in recordings and on touch devices.
13. **Contact finale and footer.** The finale lines are scrubbed to scroll, the CTA is magnetic, and the footer wordmark rises letter by letter.

Navigation uses a two-panel wipe with a typographic label for both section jumps and route changes.

## Performance and accessibility

- Animation only touches `transform`, `opacity` and `clip-path`. `will-change` is used only on actively animated layers.
- Three.js is code-split and loaded on the client only. Its render loop pauses when the hero is off screen or the tab is hidden, and DPR and mesh detail drop on low-power or touch devices. If WebGL fails, a CSS fallback is shown.
- Marquees pause when off screen. The dust canvas pauses when the tab is hidden.
- The custom cursor, magnetic effects and mouse parallax turn on only for fine pointers (`hover: hover`).
- With **`prefers-reduced-motion`**: Lenis is off, scrubbed and pinned choreography is skipped (content appears in its final state), CSS loops stop, and transitions become short fades.
- Semantic landmarks and headings, a skip link, `aria-label`s on split text, a keyboard-operable accordion, Escape to close the mobile menu, and visible focus states.

## Customising

- **Copy, projects, services, socials, email:** `src/lib/data.ts`. The email and social URLs are placeholders, so replace them before launch.
- **Colours and fonts:** the `@theme` block in `app/globals.css`.
- **Project artwork:** swap the SVG components in `src/components/art/ProjectArt.tsx` for real imagery (for example `next/image`) when it's ready.
- **Canonical / OG base URL:** set `NEXT_PUBLIC_SITE_URL` (it defaults to `https://asifworks.online`).

No secrets or API keys are needed.

## Deployment

**Vercel (recommended):** import the repository and keep the defaults (framework: Next.js, build command `next build`). Add `NEXT_PUBLIC_SITE_URL` with your production domain.

**Any Node host:**

```bash
npm ci
npm run build
npm run start      # PORT=3000 by default
```

Every route is static (`/`, `/work/noir`, `/work/aether`, `/work/veyro`, `/work/pulse`), so the site works well behind a CDN.

## Recording tips

Use a 1440×900 or 1920×1080 window at 60 fps and start the recording before you load the page so the preloader is captured. Scroll with a trackpad or mouse wheel so Lenis keeps the motion smooth. The pinned Statement section and the Playground autopilot are the strongest moments to capture.

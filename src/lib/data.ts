export const SITE = {
  name: "ASIFWORKS",
  title: "AsifWorks — Interactive Digital Experiences",
  description:
    "AsifWorks creates bold digital experiences combining creative web design, motion, technology and high-performance development.",
  tagline: "Digital experiences made impossible to ignore.",
  location: "Doha / Worldwide",
  // Placeholder contact address — replace with the real inbox before launch.
  email: "hello@asifworks.online",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://asifworks.online",
} as const;

export const NAV = [
  { id: "index", label: "Index" },
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "studio", label: "Studio" },
  { id: "contact", label: "Contact" },
] as const;

// Social placeholders — swap in real profile URLs.
export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Behance", href: "https://www.behance.net/" },
  { label: "GitHub", href: "https://github.com/" },
] as const;

export type ProjectSlug = "noir" | "aether" | "veyro" | "pulse";

export type Project = {
  slug: ProjectSlug;
  number: string;
  title: string;
  industry: string;
  kind: string;
  year: string;
  description: string;
  role: string[];
  palette: { bg: string; fg: string; accent: string };
  challenge: string;
  approach: string;
  results: { value: string; label: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "noir",
    number: "01",
    title: "NOIR",
    industry: "Luxury Fashion",
    kind: "Luxury Fashion Experience",
    year: "2026",
    description:
      "A monochrome digital flagship where silk-like motion and couture typography turn every collection drop into an event.",
    role: ["Art Direction", "Web Design", "WebGL", "Motion"],
    palette: { bg: "#0b0a09", fg: "#efe6d6", accent: "#c9a96a" },
    challenge:
      "NOIR needed a flagship that felt as considered as the garments — quiet, tactile and unmistakably premium — while still selling.",
    approach:
      "We built a cinematic, editorial storefront around fluid fabric motion, oversized serif typography and slow, deliberate transitions that reward attention.",
    results: [
      { value: "+184%", label: "Avg. session time" },
      { value: "3.2×", label: "Lookbook engagement" },
      { value: "0.9s", label: "Largest contentful paint" },
    ],
  },
  {
    slug: "aether",
    number: "02",
    title: "AETHER",
    industry: "Architecture",
    kind: "Future Architecture Studio",
    year: "2025",
    description:
      "A spatial portfolio for a visionary architecture studio — layered planes, light studies and structures you can almost walk through.",
    role: ["Brand Platform", "3D Direction", "Frontend", "CMS"],
    palette: { bg: "#070b18", fg: "#e7ecff", accent: "#5b74ff" },
    challenge:
      "AETHER's work lives in three dimensions. Flat case-study pages flattened the ambition of the buildings themselves.",
    approach:
      "We designed a depth-driven interface where projects assemble as architectural layers, with scroll acting as a camera moving through each model.",
    results: [
      { value: "+240%", label: "Inbound briefs" },
      { value: "Awwwards", label: "Site of the Day" },
      { value: "98", label: "Lighthouse performance" },
    ],
  },
  {
    slug: "veyro",
    number: "03",
    title: "VEYRO",
    industry: "Fashion Commerce",
    kind: "Modern Fashion Commerce",
    year: "2025",
    description:
      "Editorial e-commerce for a modern label — magazine-grade storytelling fused with a frictionless, lightning-fast checkout.",
    role: ["E-commerce UX", "Design System", "Headless Build", "SEO"],
    palette: { bg: "#efe6da", fg: "#16130f", accent: "#d4532b" },
    challenge:
      "VEYRO's previous store looked like everyone else's. Conversion was fine; brand memory was zero.",
    approach:
      "We merged lookbook and storefront into one editorial flow, with tactile product interactions and a headless stack tuned for speed.",
    results: [
      { value: "+62%", label: "Conversion rate" },
      { value: "−48%", label: "Bounce rate" },
      { value: "1.1s", label: "Time to interactive" },
    ],
  },
  {
    slug: "pulse",
    number: "04",
    title: "PULSE",
    industry: "Health & Fitness",
    kind: "Digital Fitness Platform",
    year: "2026",
    description:
      "A high-energy training platform where live data becomes motion — every heartbeat, rep and personal best rendered in real time.",
    role: ["Product Design", "Data Viz", "Motion System", "App"],
    palette: { bg: "#0a0b08", fg: "#eef5e4", accent: "#c6ff3d" },
    challenge:
      "Fitness apps drown users in numbers. PULSE wanted data that felt like adrenaline, not a spreadsheet.",
    approach:
      "We turned metrics into kinetic visuals — reactive rings, live waveforms and bold numerals — wrapped in a motion system tuned to effort.",
    results: [
      { value: "+310%", label: "Daily active users" },
      { value: "4.9★", label: "App store rating" },
      { value: "60fps", label: "Live data rendering" },
    ],
  },
];

export const SERVICES = [
  {
    n: "01",
    title: "Creative Web Design",
    short: "Art direction, UI & editorial layout systems",
    text: "Distinctive interfaces with a point of view — art-directed layouts, typographic systems and design languages built to be remembered.",
    tags: ["Art Direction", "UI Systems", "Prototyping"],
  },
  {
    n: "02",
    title: "Frontend Development",
    short: "Next.js, React, TypeScript, headless",
    text: "Pixel-faithful, accessible and lightning-fast builds on modern stacks — engineered to scale and a pleasure to maintain.",
    tags: ["Next.js", "TypeScript", "Headless CMS"],
  },
  {
    n: "03",
    title: "Motion & Interaction",
    short: "GSAP, scroll storytelling, micro-interactions",
    text: "A coherent motion language — scroll-driven narratives, kinetic type and tactile micro-interactions that guide attention.",
    tags: ["GSAP", "Scroll", "Micro-interactions"],
  },
  {
    n: "04",
    title: "Digital Experiences",
    short: "WebGL, 3D & immersive campaigns",
    text: "Immersive launches, interactive campaigns and real-time 3D that turn a website into an event people share.",
    tags: ["WebGL", "Three.js", "Campaigns"],
  },
  {
    n: "05",
    title: "SEO & Performance",
    short: "Core Web Vitals, technical SEO, analytics",
    text: "Beautiful and fast are not opposites. Technical SEO, Core Web Vitals and performance budgets are designed in from day one.",
    tags: ["Core Web Vitals", "Technical SEO", "Analytics"],
  },
  {
    n: "06",
    title: "AI-Powered Solutions",
    short: "Assistants, automation & intelligent UX",
    text: "Practical AI woven into the product — intelligent search, assistants and automations that feel native, not bolted on.",
    tags: ["LLM Integration", "Automation", "Smart UX"],
  },
] as const;

export const PROCESS = [
  {
    n: "01",
    title: "Discover",
    text: "We listen, audit and research — your audience, your competitors, your ambition — until the real problem is clear.",
    meta: "Workshops · Audit · Research",
  },
  {
    n: "02",
    title: "Imagine",
    text: "Concepts, moodboards and motion studies. We explore wide before committing to the idea worth building.",
    meta: "Concepts · Moodboards · Story",
  },
  {
    n: "03",
    title: "Design",
    text: "Art direction becomes a system — typography, layout, interaction and motion designed together, never in isolation.",
    meta: "UI · Design System · Prototypes",
  },
  {
    n: "04",
    title: "Develop",
    text: "Engineering with craft: performant, accessible, animated builds on a modern, maintainable stack.",
    meta: "Next.js · GSAP · WebGL",
  },
  {
    n: "05",
    title: "Refine",
    text: "We obsess over timing curves, spacing and frame rates. The last 10% is where premium is made.",
    meta: "QA · Motion Polish · Performance",
  },
  {
    n: "06",
    title: "Launch",
    text: "A considered release, measured results and an ongoing partnership to keep the experience sharp.",
    meta: "Deploy · SEO · Iterate",
  },
] as const;

export const STATS = [
  { value: 4, pad: 2, suffix: "", label: "Disciplines", note: "Design · Motion · Code · Strategy" },
  { value: Infinity, pad: 0, suffix: "", label: "Possibilities", note: "No templates. Ever." },
  { value: 100, pad: 0, suffix: "%", label: "Obsession with detail", note: "Every pixel, every frame" },
  { value: 1, pad: 2, suffix: "", label: "Goal — be memorable", note: "Everything else follows" },
] as const;

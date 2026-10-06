import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gutter relative z-[1] flex min-h-[100svh] flex-col items-start justify-center gap-8">
      <p className="label">Error 404</p>
      <h1 className="display text-[clamp(4rem,18vw,16rem)]">
        Lost in
        <br />
        <span className="serif italic normal-case text-accent-soft">space</span>
      </h1>
      <Link href="/" className="arrow-host inline-flex items-center gap-2 border-b border-ivory/40 pb-1">
        Back to the experience <span className="arrow">↗</span>
      </Link>
    </section>
  );
}

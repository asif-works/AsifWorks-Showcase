/** The ASIFWORKS mark — an "A" cut from a square, with an accent node. */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 25 L16 7 L24 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      <path d="M11.5 18.5 H20.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="7" r="2.6" fill="#3d4dff" />
    </svg>
  );
}

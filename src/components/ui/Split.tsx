import { Fragment, type ElementType, type ReactNode } from "react";

/**
 * Lightweight, dependency-free text splitting. Each word (or character) is
 * wrapped in an overflow mask so GSAP can slide it in from outside the mask.
 * Screen readers get the original sentence via aria-label.
 */

type WordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  innerClassName?: string;
  as?: ElementType;
  /** Words (lower-case, punctuation stripped) to render in the serif italic. */
  serif?: string[];
  accent?: string[];
};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

export function SplitWords({
  text,
  className,
  wordClassName = "",
  innerClassName = "",
  as: Tag = "span",
  serif = [],
  accent = [],
}: WordsProps) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => {
        const key = clean(w);
        const isSerif = serif.includes(key);
        const isAccent = accent.includes(key);
        return (
          <Fragment key={i}>
            <span className={`mask ${wordClassName}`} aria-hidden="true" data-word>
              <span
                className={`mask-inner ${innerClassName} ${isSerif ? "serif italic" : ""} ${
                  isAccent ? "text-accent-soft" : ""
                }`}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}

type CharsProps = {
  text: string;
  className?: string;
  charClassName?: string;
  as?: ElementType;
  /** Wrap each char in its own mask (true) or leave chars free (false). */
  masked?: boolean;
};

export function SplitChars({ text, className, charClassName = "", as: Tag = "span", masked = true }: CharsProps) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="word" aria-hidden="true">
            {Array.from(w).map((c, ci) =>
              masked ? (
                <span key={ci} className="mask">
                  <span className={`mask-inner ${charClassName}`} data-char>
                    {c}
                  </span>
                </span>
              ) : (
                <span key={ci} className={`inline-block ${charClassName}`} data-char>
                  {c}
                </span>
              ),
            )}
          </span>
          {wi < words.length - 1 ? <span aria-hidden="true"> </span> : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** A single masked line — the inner span is the animated element. */
export function MaskLine({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <span className={`mask ${className}`}>
      <span className={`mask-inner ${innerClassName}`} data-line>
        {children}
      </span>
    </span>
  );
}

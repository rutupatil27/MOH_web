import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * A photo slot that fills itself in.
 *
 * At build time this checks whether the file actually exists in /public. If it
 * does, you get a real optimised <Image>. If it doesn't, you get a composed
 * dark placeholder panel that states what belongs there — so the layout is
 * always honest and never shows a broken frame.
 *
 * To replace a placeholder: drop a file at the given path. Nothing else changes.
 */
type Props = {
  /** public-relative path, e.g. "/img/transformation-practice.jpg" */
  src: string;
  alt: string;
  /** what this frame is for — shown on the placeholder only */
  label: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

function exists(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  } catch {
    return false;
  }
}

export default function Photo({
  src,
  alt,
  label,
  width = 1400,
  height = 1750,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 92vw, 46vw",
}: Props) {
  if (exists(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-black-warm ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 60% at 50% 42%, rgba(232,187,112,0.13) 0%, rgba(141,106,62,0.06) 45%, rgba(5,5,5,0) 78%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(245,241,232,0.5) 0 1px, transparent 1px 22px)",
        }}
      />
      <p className="eyebrow relative max-w-[16ch] text-center leading-[2.2] text-muted/70">
        {label}
      </p>
      <span
        aria-hidden
        className="absolute inset-4 border border-[var(--line)] opacity-40"
      />
    </div>
  );
}

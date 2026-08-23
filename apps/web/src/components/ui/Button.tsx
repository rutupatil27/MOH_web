import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "ghost";
type Size = "sm" | "md";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans uppercase tracking-[0.18em] transition-colors duration-500 ease-out-expo";

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.625rem]",
  md: "px-7 py-3.5 text-[0.6875rem]",
};

const variants: Record<Variant, string> = {
  gold: "border border-gold/45 text-gold hover:text-black",
  ghost: "border border-[var(--line-soft)] text-ivory/75 hover:text-ivory",
};

/** Gold sweep that fills the pill from the bottom on hover / focus. */
function Sweep({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={[
        "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-out-expo",
        "group-hover:scale-y-100 group-focus-visible:scale-y-100",
        variant === "gold"
          ? "bg-linear-to-t from-gold-deep to-gold"
          : "bg-white/8",
      ].join(" ")}
    />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "gold",
  size = "md",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <Sweep variant={variant} />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

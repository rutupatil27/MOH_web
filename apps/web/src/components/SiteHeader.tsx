"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { cta, nav, site } from "@/lib/site";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock the page, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out-expo",
        scrolled
          ? "border-b border-[var(--line)] bg-black/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "container-site flex items-center justify-between transition-all duration-700 ease-out-expo",
          scrolled ? "h-[68px]" : "h-[var(--header-h)]",
        ].join(" ")}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-baseline gap-2.5 leading-none"
          aria-label={`${site.legalName} — home`}
        >
          <span aria-hidden className="text-[0.7rem] text-gold">
            ✦
          </span>
          <span className="font-display text-[0.95rem] tracking-[0.26em] text-ivory uppercase sm:text-[1.05rem]">
            The Music of Heart
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-2 font-sans text-[0.6875rem] tracking-[0.2em] text-muted uppercase transition-colors duration-400 hover:text-ivory"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold/60 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={cta.primary.href} size="sm">
            {cta.primary.label}
          </ButtonLink>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span
            aria-hidden
            className={[
              "h-px w-5 bg-ivory transition-transform duration-400 ease-out-expo",
              menuOpen ? "translate-y-[3px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            aria-hidden
            className={[
              "h-px w-5 bg-ivory transition-transform duration-400 ease-out-expo",
              menuOpen ? "-translate-y-[3px] -rotate-45" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 top-0 z-40 bg-black/97 backdrop-blur-xl lg:hidden"
      >
        <nav
          aria-label="Mobile"
          className="container-site flex h-full flex-col justify-center gap-2 pb-24"
        >
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[2.25rem] leading-tight text-ivory/90 transition-colors duration-300 hover:text-gold"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-10">
            <ButtonLink href={cta.primary.href} onClick={() => setMenuOpen(false)}>
              {cta.primary.label}
            </ButtonLink>
          </div>
          <p className="eyebrow mt-12">
            {site.credentials.iso} · {site.credentials.affiliation}
          </p>
        </nav>
      </div>
    </header>
  );
}

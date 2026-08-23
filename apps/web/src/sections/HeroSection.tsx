"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import HeroScene from "@/scenes/HeroScene/HeroScene";
import { ButtonLink } from "@/components/ui/Button";
import { heroIntro, heroScrollOut } from "@/animations/heroAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { courses, cta, site } from "@/lib/site";

export default function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(section);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!section.current || !content.current) return;
    if (reduced) {
      gsap.set(section.current.querySelectorAll("[data-reveal]"), { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      heroIntro(section.current!);
      heroScrollOut(section.current!, content.current!);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      id="hero"
      aria-labelledby="hero-title"
      className="grain relative min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* Atmosphere. Pure CSS, so the hero still looks composed if the
          canvas never starts (no 2D context, JS disabled, old device). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 68% 52%, rgba(232,187,112,0.10) 0%, rgba(141,106,62,0.05) 38%, rgba(5,5,5,0) 72%), radial-gradient(120% 90% at 50% 120%, rgba(18,16,13,0.9) 0%, rgba(5,5,5,0) 60%)",
        }}
      />

      {/* The scene */}
      <div className="absolute inset-0">
        <HeroScene progress={progress} />
      </div>

      {/* Legibility scrim — light on the right, ink on the left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.55) 38%, rgba(5,5,5,0) 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black to-transparent"
      />

      {/* Copy */}
      <div
        ref={content}
        className="container-site relative z-10 flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)] pb-32 sm:pb-36"
      >
        <div className="max-w-[46rem]">
          <p
            data-reveal
            data-hero-eyebrow
            className="eyebrow flex items-center gap-4"
          >
            <span aria-hidden className="h-px w-10 bg-gold/45" />
            {site.tagline} · {site.place.city}
          </p>

          <h1
            id="hero-title"
            className="font-display mt-7 text-display text-ivory sm:mt-9"
          >
            <span
              data-hero-line
              className="block overflow-hidden pb-[0.06em] -mb-[0.06em]"
            >
              <span data-reveal className="block">
                Unleash the
              </span>
            </span>
            <span
              data-hero-line
              className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
            >
              <span data-reveal className="text-gold-gradient block italic">
                music within.
              </span>
            </span>
          </h1>

          <p
            data-reveal
            data-hero-copy
            className="mt-8 max-w-[34rem] text-[0.95rem] leading-relaxed text-muted sm:mt-10 sm:text-base"
          >
            {site.idea} We teach guitar, keyboard, drums and vocals — and the
            confidence to be heard.
          </p>

          <div
            data-hero-actions
            className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12 sm:gap-5"
          >
            <span data-reveal className="inline-block">
              <ButtonLink href={cta.primary.href}>{cta.primary.label}</ButtonLink>
            </span>
            <span data-reveal className="inline-block">
              <ButtonLink href={cta.secondary.href} variant="ghost">
                {cta.secondary.label}
              </ButtonLink>
            </span>
          </div>
        </div>

        {/* Foot rail: quiet credentials, scroll cue, disciplines */}
        <div
          data-hero-foot
          className="container-site absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-8 sm:pb-10"
        >
          <p
            data-reveal
            className="eyebrow max-w-[9rem] leading-[1.9] sm:max-w-none"
          >
            {site.credentials.iso}
            <span aria-hidden className="mx-2 hidden text-gold/50 sm:inline">
              ·
            </span>
            <span className="block sm:inline">{site.credentials.affiliation}</span>
          </p>

          <a
            data-reveal
            href="#our-story"
            className="group absolute left-1/2 bottom-8 hidden -translate-x-1/2 flex-col items-center gap-3 sm:bottom-10 sm:flex"
            aria-label="Scroll to continue"
          >
            <span className="eyebrow text-[0.6rem] transition-colors group-hover:text-ivory">
              Scroll
            </span>
            <span
              aria-hidden
              className="relative block h-14 w-px overflow-hidden bg-[var(--line-soft)]"
            >
              <span className="scroll-cue absolute inset-x-0 top-0 block h-5 bg-linear-to-b from-transparent to-gold" />
            </span>
          </a>

          <ul
            data-reveal
            className="eyebrow hidden items-center gap-4 text-right sm:flex"
          >
            {courses.map((c, i) => (
              <li key={c.slug} className="flex items-center gap-4">
                {i > 0 && (
                  <span aria-hidden className="text-gold/40">
                    ·
                  </span>
                )}
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

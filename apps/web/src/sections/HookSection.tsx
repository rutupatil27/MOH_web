"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { hookTimeline } from "@/animations/hookAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINES = [
  "Music doesn't just change the way you sound.",
  "It changes the way you see yourself.",
  "The way you express yourself.",
  "The way you walk onto a stage.",
];

export default function HookSection() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const lines = useRef<(HTMLParagraphElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const els = lines.current.filter(Boolean) as HTMLElement[];
    const ctx = gsap.context(() => {
      hookTimeline(root.current!, els, rail.current);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Without motion the statements simply stack and read as a paragraph block.
  if (reduced) {
    return (
      <section
        id="our-story"
        aria-labelledby="hook-title"
        className="relative bg-black py-32"
      >
        <div className="container-site">
          <h2 id="hook-title" className="eyebrow mb-16">
            02 — Why music
          </h2>
          <div className="flex max-w-[24ch] flex-col gap-10">
            {LINES.map((line) => (
              <p
                key={line}
                className="font-display text-[clamp(1.9rem,4.6vw,3.6rem)] text-ivory"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="our-story"
      aria-labelledby="hook-title"
      className="relative h-[420vh] bg-black"
    >
      <div
        ref={stage}
        className="sticky top-0 flex h-screen w-full items-center overflow-hidden"
      >
        {/* a single low glow so the black has depth behind the type */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 48% at 28% 52%, rgba(232,187,112,0.06) 0%, rgba(5,5,5,0) 70%)",
          }}
        />

        <div className="container-site relative flex w-full items-start gap-8 sm:gap-14">
          {/* progress rail */}
          <div className="hidden shrink-0 flex-col items-center gap-5 pt-4 sm:flex">
            <span className="eyebrow text-[0.6rem]">02</span>
            <span className="relative block h-40 w-px bg-[var(--line-soft)]">
              <span
                ref={rail}
                className="absolute inset-x-0 top-0 block h-full origin-top bg-gold/70"
              />
            </span>
          </div>

          <div className="relative min-h-[9em] flex-1 sm:min-h-[7em]">
            <h2 id="hook-title" className="sr-only">
              Why music changes people
            </h2>
            {LINES.map((line, i) => (
              <p
                key={line}
                ref={(el) => {
                  lines.current[i] = el;
                }}
                className="font-display absolute inset-x-0 top-0 max-w-[22ch] text-[clamp(2rem,5.4vw,4.8rem)] leading-[1.06] text-ivory"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {i === LINES.length - 1 ? (
                  <>
                    The way you{" "}
                    <span className="text-gold-gradient italic">
                      walk onto a stage.
                    </span>
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

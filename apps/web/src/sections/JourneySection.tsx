"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { journeyTimeline } from "@/animations/journeyAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STEPS = [
  {
    title: "Discover",
    copy: "Your first sound, on the first day. No experience required.",
  },
  {
    title: "Learn",
    copy: "Technique, timing, and the language underneath the music.",
  },
  {
    title: "Practice",
    copy: "The quiet, unglamorous work where everything actually changes.",
  },
  {
    title: "Express",
    copy: "Playing what you feel, not only what is written on the page.",
  },
  {
    title: "Perform",
    copy: "The moment you stop hiding, and let the room hear you.",
  },
] as const;

export default function JourneySection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const stepEls = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current || !track.current) return;
    const ctx = gsap.context(() => {
      journeyTimeline(
        root.current!,
        track.current!,
        rail.current,
        stepEls.current.filter(Boolean) as HTMLElement[]
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const heading = (
    <>
      <p className="eyebrow">05 — The Journey</p>
      <h2 className="font-display mt-6 max-w-[18ch] text-[clamp(1.8rem,3.8vw,3.1rem)] leading-[1.06] text-ivory">
        From the first note to{" "}
        <span className="text-gold-gradient italic">finding your voice.</span>
      </h2>
    </>
  );

  const step = (s: (typeof STEPS)[number], i: number) => (
    <>
      <span
        aria-hidden
        className="font-display block text-[clamp(3.5rem,7vw,6rem)] leading-none text-gold/15"
      >
        {String(i + 1).padStart(2, "0")}
      </span>
      <h3 className="font-display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] text-ivory">
        {s.title}
      </h3>
      <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-muted sm:text-[0.95rem]">
        {s.copy}
      </p>
    </>
  );

  // ---- reduced motion: the same five steps, read downward ---------------
  if (reduced) {
    return (
      <section id="journey" aria-labelledby="journey-title" className="bg-black py-28">
        <div className="container-site">
          <div id="journey-title">{heading}</div>
          <ol className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title}>{step(s, i)}</li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="journey"
      aria-labelledby="journey-title"
      className="relative h-[440vh] bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 46% at 50% 86%, rgba(232,187,112,0.07) 0%, rgba(5,5,5,0) 72%)",
          }}
        />

        <div
          id="journey-title"
          className="container-site relative pt-[calc(var(--header-h)+2.5rem)]"
        >
          {heading}
        </div>

        {/* the track: vertical scroll moves it sideways */}
        <div className="relative flex-1">
          <ol
            ref={track}
            className="absolute top-0 left-0 flex h-full w-max items-center pl-[clamp(1.25rem,5vw,4.5rem)] will-change-transform"
          >
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => {
                  stepEls.current[i] = el;
                }}
                className="relative w-[clamp(18rem,42vw,30rem)] shrink-0 pr-10 sm:pr-16"
              >
                {/* the line the whole journey sits on */}
                <span
                  aria-hidden
                  className="absolute top-[7.2rem] -left-px h-px w-full bg-[var(--line-soft)]"
                />
                <span
                  aria-hidden
                  className="absolute top-[6.9rem] left-0 block size-[7px] rotate-45 border border-gold/60 bg-black"
                />
                <div className="pt-40">{step(s, i)}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* how far through the journey you are */}
        <div className="container-site relative pb-10 sm:pb-14">
          <span className="block h-px w-full bg-[var(--line-soft)]">
            <span
              ref={rail}
              className="block h-px w-full origin-left bg-gold/70"
            />
          </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

import { transformationTimeline } from "@/animations/transformationAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STAGES = [
  { label: "Hesitation", copy: "It starts with a little hesitation." },
  { label: "Curiosity", copy: "Then curiosity takes over." },
  { label: "Practice", copy: "Practice becomes progress." },
  { label: "Expression", copy: "Progress becomes confidence." },
  {
    label: "Confidence",
    copy: "And eventually, you stop being afraid to be heard.",
  },
] as const;

type Props = {
  /** Server-rendered <Photo> slots, passed in so this can stay a client file. */
  earlyPhoto: ReactNode;
  latePhoto: ReactNode;
};

export default function TransformationSection({ earlyPhoto, latePhoto }: Props) {
  const root = useRef<HTMLElement>(null);
  const early = useRef<HTMLDivElement>(null);
  const late = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const stageEls = useRef<(HTMLParagraphElement | null)[]>([]);
  const markerEls = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (
      reduced ||
      !root.current ||
      !early.current ||
      !late.current ||
      !glow.current ||
      !frame.current
    )
      return;

    const ctx = gsap.context(() => {
      transformationTimeline({
        root: root.current!,
        photoEarly: early.current!,
        photoLate: late.current!,
        glow: glow.current!,
        frame: frame.current!,
        stages: stageEls.current.filter(Boolean) as HTMLElement[],
        markers: markerEls.current.filter(Boolean) as HTMLElement[],
        rail: rail.current,
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const heading = (
    <>
      <p className="eyebrow">03 — Transformation</p>
      <h2 className="font-display mt-6 max-w-[15ch] text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-ivory">
        The transformation begins{" "}
        <span className="text-gold-gradient italic">quietly.</span>
      </h2>
    </>
  );

  // ---- reduced motion: the same story, told as a list -------------------
  if (reduced) {
    return (
      <section
        id="transformation"
        aria-labelledby="transformation-title"
        className="relative bg-black py-28"
      >
        <div className="container-site" id="transformation-title">
          {heading}
          <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_22rem]">
            <ol className="flex flex-col gap-10">
              {STAGES.map((s, i) => (
                <li key={s.label} className="flex gap-6">
                  <span className="eyebrow pt-2 text-gold/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="eyebrow mb-2">{s.label}</p>
                    <p className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] text-ivory">
                      {s.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="relative aspect-3/4 overflow-hidden">{latePhoto}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="transformation"
      aria-labelledby="transformation-title"
      className="relative h-[520vh] bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* the room warming up */}
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-center"
          style={{
            background:
              "radial-gradient(52% 52% at 68% 50%, rgba(232,187,112,0.16) 0%, rgba(141,106,62,0.07) 42%, rgba(5,5,5,0) 74%)",
          }}
        />

        <div className="container-site relative flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-20">
          {/* copy */}
          <div className="order-2 flex-1 lg:order-1">
            <div id="transformation-title">{heading}</div>

            <div className="relative mt-8 min-h-[5.5em] sm:min-h-[4.5em] lg:mt-14">
              {STAGES.map((s, i) => (
                <p
                  key={s.label}
                  ref={(el) => {
                    stageEls.current[i] = el;
                  }}
                  className="font-display absolute inset-x-0 top-0 max-w-[20ch] text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.12] text-ivory"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {s.copy}
                </p>
              ))}
            </div>

            {/* the five steps, and how far along you are */}
            <div className="mt-10 lg:mt-16">
              <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {STAGES.map((s, i) => (
                  <li
                    key={s.label}
                    ref={(el) => {
                      markerEls.current[i] = el;
                    }}
                    className="eyebrow text-[0.6rem] text-ivory"
                    style={{ opacity: i === 0 ? 1 : 0.28 }}
                  >
                    {s.label}
                  </li>
                ))}
              </ol>
              <span className="mt-5 block h-px w-full max-w-md bg-[var(--line-soft)]">
                <span
                  ref={rail}
                  className="block h-px w-full origin-left bg-gold/70"
                />
              </span>
            </div>
          </div>

          {/* the frame */}
          <div className="order-1 lg:order-2 lg:w-[38%]">
            <div
              ref={frame}
              className="relative aspect-4/5 w-full overflow-hidden sm:aspect-3/4 lg:aspect-4/5"
            >
              <div ref={early} className="absolute inset-0">
                {earlyPhoto}
              </div>
              <div ref={late} className="absolute inset-0" style={{ opacity: 0 }}>
                {latePhoto}
              </div>
              {/* keeps the rectangle from feeling pasted onto the dark */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0) 42%), linear-gradient(to right, rgba(5,5,5,0.5) 0%, rgba(5,5,5,0) 30%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

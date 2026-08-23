"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

import { courseTimeline } from "@/animations/courseAnimations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { courses } from "@/lib/site";
import { hasWebGL, isLowPowerDevice } from "@/lib/webgl";

const CourseScene = dynamic(() => import("@/scenes/CourseScene/CourseScene"), {
  ssr: false,
});

export default function CoursesSection() {
  const root = useRef<HTMLElement>(null);
  const blockEls = useRef<(HTMLDivElement | null)[]>([]);
  const markerEls = useRef<(HTMLLIElement | null)[]>([]);
  const progress = useScrollProgress(root, { start: "top top", end: "bottom bottom" });
  const reduced = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(hasWebGL() && !isLowPowerDevice());
  }, []);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      courseTimeline(
        root.current!,
        blockEls.current.filter(Boolean) as HTMLElement[],
        markerEls.current.filter(Boolean) as HTMLElement[]
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const heading = (
    <>
      <p className="eyebrow">04 — Courses</p>
      <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(1.8rem,3.8vw,3.1rem)] leading-[1.06] text-ivory">
        Find your instrument.{" "}
        <span className="text-gold-gradient italic">Find your rhythm.</span>
      </h2>
    </>
  );

  // ---- reduced motion / no WebGL: four honest blocks ---------------------
  if (reduced) {
    return (
      <section id="courses" aria-labelledby="courses-title" className="bg-black py-28">
        <div className="container-site">
          <div id="courses-title">{heading}</div>
          <ol className="mt-16 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {courses.map((c, i) => (
              <li key={c.slug} className="bg-black p-8 sm:p-10">
                <p className="eyebrow text-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] text-ivory">
                  {c.name}
                </h3>
                <p className="eyebrow mt-3">{c.tagline}</p>
                <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
                  {c.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      id="courses"
      aria-labelledby="courses-title"
      className="relative h-[420vh] bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(54% 54% at 68% 50%, rgba(232,187,112,0.12) 0%, rgba(5,5,5,0) 72%)",
          }}
        />

        {/* the rail of instruments */}
        {use3D && <CourseScene progress={progress} />}

        {/* legibility scrim over the left half */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0) 66%)",
          }}
        />

        <div className="container-site pointer-events-none relative w-full">
          <div className="pointer-events-auto max-w-[34rem]">
            <div id="courses-title">{heading}</div>

            {/* one block per course, stacked and handed over by the timeline */}
            <div className="relative mt-10 min-h-[16rem] lg:mt-14">
              {courses.map((c, i) => (
                <div
                  key={c.slug}
                  ref={(el) => {
                    blockEls.current[i] = el;
                  }}
                  className="absolute inset-x-0 top-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <h3 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-ivory uppercase">
                    {c.name}
                  </h3>
                  <p className="text-gold-gradient font-display mt-3 text-[clamp(1.1rem,2vw,1.6rem)] italic">
                    {c.tagline}
                  </p>
                  <ul className="mt-7 flex flex-col gap-2.5">
                    {c.lines.map((l) => (
                      <li
                        key={l}
                        data-course-line
                        className="flex items-center gap-3 text-sm text-muted"
                      >
                        <span aria-hidden className="h-px w-5 bg-gold/40" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* index */}
            <ol className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 lg:mt-12">
              {courses.map((c, i) => (
                <li
                  key={c.slug}
                  ref={(el) => {
                    markerEls.current[i] = el;
                  }}
                  className="eyebrow text-[0.6rem] text-ivory"
                  style={{ opacity: i === 0 ? 1 : 0.3 }}
                >
                  {String(i + 1).padStart(2, "0")} {c.name}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Crawlable, always-present list — the 3D rail is decoration, not content */}
      <div className="sr-only">
        <h3>Courses offered</h3>
        <ul>
          {courses.map((c) => (
            <li key={c.slug}>
              {c.name} — {c.tagline}. {c.lines.join(" ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

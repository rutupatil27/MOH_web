import HeroSection from "@/sections/HeroSection";
import HookSection from "@/sections/HookSection";
import TransformationSection from "@/sections/TransformationSection";
import CoursesSection from "@/sections/CoursesSection";
import Photo from "@/components/ui/Photo";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HookSection />

      <TransformationSection
        earlyPhoto={
          <Photo
            src="/img/transformation-practice.jpg"
            alt="A student practising at The Music of Heart"
            label="Photo — a student practising, close on the hands"
          />
        }
        latePhoto={
          <Photo
            src="/img/transformation-perform.jpg"
            alt="A student performing on stage"
            label="Photo — a student performing, lit from the front"
          />
        }
      />

      <CoursesSection />

      {/*
        PHASE 2 CONTINUES — Journey, Confidence, About, Credentials,
        Final CTA, Contact and Footer are next.
      */}
      <section
        id="journey"
        aria-label="More of the story is coming"
        className="relative flex min-h-[60svh] items-center bg-black"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black to-transparent"
        />
        <div className="container-site">
          <p className="eyebrow mb-8">05 — The Journey</p>
          <p className="font-display max-w-[20ch] text-display-sm text-ivory/85">
            From the first note to finding your voice.
          </p>
          <p className="mt-10 text-sm text-muted/70">Next phase.</p>
        </div>
      </section>
    </>
  );
}

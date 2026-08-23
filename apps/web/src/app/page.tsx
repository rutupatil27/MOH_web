import HeroSection from "@/sections/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/*
        PHASE 2 PLACEHOLDER — "The Hook" and everything below it is not built
        yet. This block exists only so the hero has somewhere to scroll to and
        its exit animation can be judged in context.
      */}
      <section
        id="our-story"
        aria-label="The story continues"
        className="relative flex min-h-[70svh] items-center bg-black"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black to-transparent"
        />
        <div className="container-site">
          <p className="eyebrow mb-8">02 — The Hook</p>
          <p className="font-display max-w-[24ch] text-display-sm text-ivory/85">
            Music doesn&rsquo;t just change the way you sound.
          </p>
          <p className="mt-10 text-sm text-muted/70">
            Next phase: the rest of the story.
          </p>
        </div>
      </section>
    </>
  );
}

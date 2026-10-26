import { SiteImage, hasSiteImage } from "../components/media/SiteImage.jsx";
import { Button } from "../components/ui/Button.jsx";

const STATS = [
  { value: "4+", label: "Years Age Group" },
  { value: "1:1", label: "Personal Guidance" },
  { value: "Practical", label: "Performance Training" },
  { value: "Certified", label: "Suro Bharati & ISO" },
];

/** The hero image is the owner's instrument collage; until it is added, a course photo stands in. */
const HERO_IMAGE = ["hero-instruments", "course-guitar"];

export function HomeHero() {
  const heroAlt = hasSiteImage("hero-instruments") ? "Guitar, keyboard, snare drum and microphone" : "Acoustic guitar";
  return (
    <section data-surface="dark" className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Full-height image on the right, feathered into the black behind the copy — the same treatment as the About hero. */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full lg:inset-y-[7%] lg:w-[56%]">
        <SiteImage
          name={HERO_IMAGE}
          alt={heroAlt}
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="hero-media h-full w-full"
          imgClassName="object-[50%_50%]"
          aspectRatio="auto"
        />
        <div className="absolute inset-0 bg-black/60 lg:hidden" />
      </div>
      <div className="container-site flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center gap-10 py-14 lg:py-16">
        <div className="max-w-xl">
          <span className="kicker text-accent">Music classes in Nashik</span>
          <h1 id="hero-title" className="mt-5 font-display text-[clamp(2.6rem,1rem+4.4vw,5.4rem)] leading-[0.98] uppercase">
            <span className="block sm:whitespace-nowrap">Let music</span>
            <span className="block sm:whitespace-nowrap">be a part of</span>
            <span className="block text-accent sm:whitespace-nowrap">your story</span>
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 text-lead">
            {["Learn", "Create", "Perform", "Grow"].map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i ? <span aria-hidden="true" className="text-accent">•</span> : null}
                {w}
              </span>
            ))}
          </p>
          <p className="mt-5 max-w-[48ch] text-muted">
            The Music of Heart Music Academy offers guitar, keyboard, vocals and drums training for all age groups (4+
            years) with practical learning and performance-based training.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/enquire" arrow>
              Enquire Now
            </Button>
            <Button to="/courses" variant="secondary">
              Explore Courses
            </Button>
          </div>
        </div>

        <dl className="grid max-w-xl grid-cols-2 gap-y-6 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.value} className={`pr-4 ${i ? "sm:border-l sm:border-line sm:pl-5" : ""}`}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(1.35rem,1rem+0.9vw,1.75rem)] leading-tight text-accent">{s.value}</span>
                <span className="mt-1 block text-small text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

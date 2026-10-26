import { SiteImage } from "../../components/media/SiteImage.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Icon } from "../../components/ui/Icon.jsx";

/** Short gold brush stroke under a heading, as in the owner's reference. */
function Underline({ className = "" }) {
  return (
    <svg viewBox="0 0 120 8" className={`h-2 w-28 text-accent ${className}`} aria-hidden="true" focusable="false">
      <path d="M2 5.5C30 2.5 70 2 118 4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function AboutHero() {
  return (
    <section data-surface="dark" className="relative isolate overflow-hidden" aria-labelledby="page-title">
      <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[64%]">
        <SiteImage name="about-hero" alt="" priority sizes="(min-width: 1024px) 64vw, 100vw" className="hero-media h-full w-full" aspectRatio="auto" />
        <div className="absolute inset-0 bg-black/55 lg:hidden" />
      </div>
      <p
        aria-hidden="true"
        className="script photo-caption absolute top-12 right-[5%] hidden max-w-[6ch] text-right text-[clamp(2.6rem,1.6rem+2vw,4rem)] leading-[0.95] text-gold lg:block"
      >
        Music People Better Humans
      </p>
      <div className="container-site py-[clamp(4rem,9vw,8rem)]">
        <div className="max-w-xl">
          <span className="kicker text-accent">About us</span>
          <h1 id="page-title" className="mt-4 font-display text-h1">
            Where
            <br />
            Music Creates
            <br />
            Better Humans
          </h1>
          <Underline className="mt-6" />
          <p className="mt-6 max-w-[46ch] text-fg/85">
            The Music of Heart Music Academy is more than a music school — it is a space where passion meets guidance,
            and every learner finds a rhythm of their own. We believe music has the power to build confidence, inspire
            creativity and bring people closer.
          </p>
          <Button href="#our-goal" arrow className="mt-8">
            Our Vision
          </Button>
        </div>
      </div>
    </section>
  );
}

const MILESTONES = [
  { icon: "sprout", title: "The Beginning", line: "A small initiative with a big dream to spread the joy of music." },
  { icon: "users", title: "Growing Together", line: "A community of passionate learners, guided one-to-one." },
  { icon: "star", title: "Today", line: "A music academy helping people explore, learn and live music." },
];

export function OurStory() {
  return (
    <section data-surface="light" className="py-(--space-block)" aria-labelledby="story-title">
      <div className="container-site grid items-center gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="kicker">Our story</span>
          <h2 id="story-title" className="mt-3 font-display text-h2">
            A Melody That Grew Into a Movement
          </h2>
          <Underline className="mt-5" />
          <p className="mt-5 text-small text-muted">
            What started as a small dream to make quality music education accessible to all has grown into The Music
            of Heart Music Academy. Founded with a simple idea — to nurture talent and make music a part of everyday
            life — we continue to create a welcoming and encouraging space for learners of all ages.
          </p>
        </div>
        <ol className="relative space-y-9 lg:col-span-4">
          <span aria-hidden="true" className="absolute top-6 bottom-6 left-6 w-px bg-accent/50" />
          {MILESTONES.map((m) => (
            <li key={m.title} className="relative flex gap-5">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-bg text-accent ring-1 ring-accent/40">
                <Icon name={m.icon} size={24} />
              </span>
              <span>
                <span className="block font-semibold">{m.title}</span>
                <span className="mt-1 block max-w-[30ch] text-small text-muted">{m.line}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="lg:col-span-4">
          <div className="print-frame rotate-[3deg]">
            <SiteImage
              name="about-good-music"
              alt="A sign reading “Good music, brighter days” on a sunlit windowsill"
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="w-full"
              aspectRatio="1 / 1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Confirmed facts only — no invented student counts or years. */
const NUMBERS = [
  { icon: "gradcap", value: "4+", label: "Years age group" },
  { icon: "users", value: "1:1", label: "Personal guidance" },
  { icon: "note", value: "4", label: "Instruments offered" },
  { icon: "award", value: "Certified", label: "Suro Bharati Sangeet Kala Kendra (ISO Certified)" },
];

export function MusicInNumbers() {
  return (
    <section data-surface="dark" className="py-(--space-block)" aria-labelledby="numbers-title">
      <div className="container-site grid items-center gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <span className="kicker text-accent">Our impact</span>
          <h2 id="numbers-title" className="mt-3 font-display text-h2">
            Music in Numbers
          </h2>
          <Underline className="mt-5" />
        </div>
        <dl className="grid grid-cols-2 gap-y-10 lg:col-span-9 lg:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <div key={n.label} className={`flex flex-col items-center px-4 text-center ${i ? "lg:border-l lg:border-line" : ""} ${i % 2 ? "max-lg:border-l max-lg:border-line" : ""}`}>
              <dt className="sr-only">{n.label}</dt>
              <dd className="flex flex-col items-center">
                <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-charcoal text-accent">
                  <Icon name={n.icon} size={28} />
                </span>
                <span className="block font-display text-h3 text-accent">{n.value}</span>
                <span className="mt-1 block max-w-[18ch] text-small text-fg/80">{n.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const VALUES = [
  { icon: "heart", title: "Passion", line: "We do what we love and inspire the same in others." },
  { icon: "users", title: "Inclusivity", line: "Music is for everyone — all ages, all backgrounds." },
  { icon: "leaf", title: "Growth", line: "We keep learning, exploring and creating new opportunities." },
];

export function WhatDrivesUs() {
  return (
    <section data-surface="light" className="py-(--space-block)" aria-labelledby="values-title">
      <div className="container-site grid items-center gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <span className="kicker">Our values</span>
          <h2 id="values-title" className="mt-3 font-display text-h2">
            What Drives Us
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title} className="value-blob flex gap-4 p-6">
                <Icon name={v.icon} size={32} strokeWidth={1.4} className="text-accent" />
                <span>
                  <span className="block text-h4 font-semibold">{v.title}</span>
                  <span className="mt-1 block text-small text-muted">{v.line}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <blockquote className="relative lg:col-span-3">
          <Icon name="quote" size={40} className="text-accent" />
          <p className="script mt-2 leading-[1]">Because music brings out the best in people.</p>
        </blockquote>
      </div>
    </section>
  );
}

export function OurGoal() {
  return (
    <section id="our-goal" data-surface="dark" className="relative isolate overflow-hidden scroll-mt-24" aria-labelledby="goal-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[18rem] lg:min-h-[26rem]">
          <SiteImage
            name="about-goal-hands"
            alt="Hands playing an acoustic guitar"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_left,transparent,#000_30%)]"
            aspectRatio="auto"
          />
        </div>
        <div className="container-site flex flex-col justify-center py-(--space-block) lg:max-w-xl lg:pl-4">
          <span className="kicker text-accent">Our goal</span>
          <h2 id="goal-title" className="mt-3 font-display text-h2">
            To Make Music a Part of Everyday Life
          </h2>
          <Underline className="mt-5" />
          <p className="mt-5 max-w-[48ch] text-fg/85">
            We aim to nurture talent, build confidence and create a supportive environment where music becomes a
            lifelong companion.
          </p>
        </div>
      </div>
    </section>
  );
}

import { Button } from "../components/ui/Button.jsx";
import { Icon } from "../components/ui/Icon.jsx";

/** Confirmed teaching approach and credentials (docs/01-class-data.md). */
const REASONS = [
  { icon: "users", label: "One-to-One Guidance" },
  { icon: "hand", label: "Practical Learning" },
  { icon: "mic", label: "Performance Training" },
  { icon: "book", label: "Music Theory & Concept Building" },
  { icon: "award", label: "ISO Certified Academy" },
  { icon: "family", label: "All Age Groups (4+ Years)" },
];

export function WhyChoose({ showLink = true }) {
  return (
    <section data-surface="dark" className="section" aria-labelledby="why-title">
      <div className="container-site grid items-center gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="why-title" className="font-display text-h2">
            Why Choose
            <br />
            <span className="text-accent">The Music of Heart?</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-muted">
            We focus on more than just lessons. Our goal is to build confidence, creativity and a lifelong love for
            music.
          </p>
          {showLink ? (
            <Button to="/about" arrow className="mt-8">
              Learn More
            </Button>
          ) : null}
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-7">
          {REASONS.map((r, i) => (
            <li
              key={r.label}
              className={`flex flex-col items-center px-4 py-8 text-center ${i % 3 ? "sm:border-l sm:border-line" : ""} ${i >= 3 ? "sm:border-t sm:border-line" : ""} ${i % 2 ? "max-sm:border-l max-sm:border-line" : ""} ${i >= 2 ? "max-sm:border-t max-sm:border-line" : ""}`}
            >
              <span className="icon-ring">
                <Icon name={r.icon} size={24} />
              </span>
              <span className="mt-4 max-w-[16ch] text-small font-medium">{r.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

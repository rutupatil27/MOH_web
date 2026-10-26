import { Button } from "../components/ui/Button.jsx";
import { InstrumentCardRow } from "./InstrumentCards.jsx";

export function ChooseInstrument({ courses }) {
  return (
    <section data-surface="light" className="section" aria-labelledby="choose-title">
      <div className="container-site">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <span className="kicker">Explore our</span>
            <h2 id="choose-title" className="mt-3 font-display text-h2">
              Explore Our
              <br />
              Music Classes
            </h2>
            <p className="mt-5 max-w-[42ch] text-muted">
              Discover your sound with one-to-one guidance and structured learning programs.
            </p>
          </div>
          <div className="flex items-end justify-between gap-6 lg:col-span-5 lg:col-start-8">
            <p aria-hidden="true" className="script max-w-[5ch] leading-[0.9]">
              Find Your Sound
            </p>
            <Button to="/courses" variant="secondary" arrow className="shrink-0">
              View All Courses
            </Button>
          </div>
        </div>
        <div className="mt-12">
          <InstrumentCardRow courses={courses} />
        </div>
      </div>
    </section>
  );
}

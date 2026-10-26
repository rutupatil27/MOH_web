import { SiteImage } from "../components/media/SiteImage.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Icon } from "../components/ui/Icon.jsx";

const VALUES = [
  { icon: "smile", title: "Confidence", line: "Through Music" },
  { icon: "bulb", title: "Creativity", line: "In Every Lesson" },
  { icon: "family", title: "Discipline", line: "For a Better Tomorrow" },
  { icon: "heart", title: "A Supportive", line: "Music Community" },
];

export function FirstNoteStage({ showLink = true, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <section data-surface="light" className="section overflow-hidden" aria-labelledby="first-note-title">
      <div className="container-site">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="kicker">A journey through music</span>
            <Heading id="first-note-title" className="mt-3 font-display text-h2">
              From First Note
              <br />
              to Stage
            </Heading>
            <p className="mt-6 max-w-[46ch] text-muted">
              Whether you’re picking up an instrument for the first time or looking to advance your skills, we’re here
              to guide you at every step. Learn with passion, practice with purpose and experience the joy of music.
            </p>
            {showLink ? (
              <Button to="/about" arrow className="mt-8">
                Our Story
              </Button>
            ) : null}
          </div>
          <div className="relative lg:col-span-7">
            <p aria-hidden="true" className="script absolute -top-4 left-0 z-10 max-w-[5ch] leading-[0.9] lg:-left-10">
              Small Steps Big Melodies
            </p>
            <div className="print-frame ml-auto max-w-xl">
              <SiteImage name="about-story" alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="w-full" aspectRatio="4 / 3" />
            </div>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 lg:grid-cols-4">
          {VALUES.map((v) => (
            <li key={v.title} className="flex items-center gap-4">
              <Icon name={v.icon} size={34} strokeWidth={1.3} className="text-accent" />
              <span>
                <span className="block font-semibold">{v.title}</span>
                <span className="block text-small text-muted">{v.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { Link } from "react-router";

import { SiteImage } from "../components/media/SiteImage.jsx";
import { Icon } from "../components/ui/Icon.jsx";

/** Arch-topped photo cards, one per course. Scrolls sideways on small screens. */
/** `priority` loads the photos immediately — use it where the cards sit in the first viewport. */
export function InstrumentCardRow({ courses, headingLevel = 3, priority = false }) {
  const rowRef = useRef(null);
  const Heading = `h${headingLevel}`;
  const scroll = (dir) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * (row.firstElementChild?.getBoundingClientRect().width ?? 300), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2 lg:hidden">
        <button type="button" onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line-strong" aria-label="Previous course">
          <Icon name="arrowLeft" size={18} />
        </button>
        <button type="button" onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line-strong" aria-label="Next course">
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
      <ul
        ref={rowRef}
        className="card-scroller -mx-(--gutter) flex gap-4 overflow-x-auto px-(--gutter) pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {courses.map((course, i) => (
          <li key={course.slug} className="w-[72%] shrink-0 sm:w-[44%] lg:w-auto">
            <Link to={`/courses/${course.slug}`} className="arch-card group relative block aspect-[3/4] overflow-hidden no-underline">
              <SiteImage
                name={`course-${course.slug}`}
                alt=""
                priority={priority && i < 2}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 72vw"
                className="absolute inset-0 h-full w-full"
                aspectRatio="auto"
              />
              <span className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                <Heading className="font-sans text-h4 font-semibold">{course.name}</Heading>
                <span className="mt-1 block text-small text-stone">Beginner to Advanced</span>
                <span className="arch-arrow mt-4 grid h-9 w-9 place-items-center rounded-full border border-warm-white/70 text-warm-white">
                  <Icon name="arrowRight" size={16} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

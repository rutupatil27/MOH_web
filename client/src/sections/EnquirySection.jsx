import { EnquiryForm } from "../components/forms/EnquiryForm.jsx";
import { phoneOf } from "../lib/site.js";

/** The closing call on every page that sells: a working enquiry form, plus the phone. */
export function EnquirySection({
  courses,
  settings,
  defaultCourse,
  title = "Let’s make music together.",
  intro = "Tell us who the lessons are for. The academy will call you back to talk about classes, levels and timings.",
}) {
  const phone = phoneOf(settings);
  return (
    <section data-surface="dark" className="section border-t border-line" aria-labelledby="enquiry-title" id="enquire">
      <div className="container-site relative grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="enquiry-title" className="font-display text-h1">
            {title}
          </h2>
          <p className="mt-6 max-w-[40ch] text-muted">{intro}</p>
          {phone ? (
            <p className="mt-10 text-muted">
              Or call the academy
              <a href={phone.href} className="mt-1 block w-fit font-display text-h3 text-fg no-underline hover:text-accent tabular">
                {phone.display}
              </a>
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <EnquiryForm courses={courses} defaultCourse={defaultCourse} compact phone={phone} />
        </div>
      </div>
    </section>
  );
}

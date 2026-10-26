import { useLoaderData, useRouteLoaderData } from "react-router";

import { courses } from "../lib/data.server.js";
import { breadcrumbJsonLd, pageMeta } from "../lib/seo.js";
import { InstrumentCardRow } from "../sections/InstrumentCards.jsx";
import { EnquirySection } from "../sections/EnquirySection.jsx";
import { PageHeader } from "../sections/PageHeader.jsx";

export async function loader() {
  return { courses: await courses.listPublishedCourses() };
}

export function meta({ matches }) {
  const root = matches.find((m) => m?.id === "root");
  const siteUrl = (root?.loaderData ?? root?.data)?.siteUrl ?? "";
  return pageMeta({
    matches,
    title: "Guitar, Keyboard, Vocals & Drums Courses",
    description:
      "Offline guitar, keyboard, vocals and drums courses in Nashik Road, Nashik. Every course has Beginner and Advanced levels, for students aged 4 and up.",
    path: "/courses",
    jsonLd: breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
    ]),
  });
}

const LEVEL_NOTES = [
  {
    level: "Beginner",
    text: "For students starting from the very beginning — no experience needed. Structured lessons build the foundations step by step.",
  },
  {
    level: "Advanced",
    text: "For students who already play or sing and want to go further, with deeper theory and stage and performance training.",
  },
];

export default function Courses() {
  const { courses: list } = useLoaderData();
  const { settings } = useRouteLoaderData("root");

  return (
    <>
      <PageHeader
        title="Courses"
        intro="Four instruments, each taught in person at the academy in Nashik Road, at Beginner and Advanced levels."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
        ]}
      />

      <section data-surface="light" className="section" aria-label="All courses">
        <div className="container-site">
          <InstrumentCardRow courses={list} headingLevel={2} priority />
        </div>
      </section>

      <section data-surface="light" className="pb-(--space-section)" aria-labelledby="levels-title">
        <div className="container-site grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="levels-title" className="font-display text-h2">
              Two levels in every course
            </h2>
            <p className="mt-6 max-w-[40ch] text-muted">
              Students from age 4 upward join at the level that fits them. Not sure which? Ask in your enquiry — the
              academy will help you choose.
            </p>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            {LEVEL_NOTES.map((note) => (
              <div key={note.level} className="border-t border-line py-8 first:border-t-line-strong">
                <dt className="font-display text-h3">{note.level}</dt>
                <dd className="mt-3 max-w-[52ch] text-muted">{note.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <EnquirySection courses={list} settings={settings} title="Not sure where to start?" />
    </>
  );
}

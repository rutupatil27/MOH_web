import { Link, data, useLoaderData, useRouteLoaderData } from "react-router";

import { Picture } from "../components/media/Picture.jsx";
import { SiteImage } from "../components/media/SiteImage.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { courses } from "../lib/data.server.js";
import { breadcrumbJsonLd, courseJsonLd, pageMeta } from "../lib/seo.js";
import { classesLabel, phoneOf } from "../lib/site.js";
import { EnquirySection } from "../sections/EnquirySection.jsx";

export async function loader({ params }) {
  const [course, all] = await Promise.all([courses.getPublishedCourse(params.slug), courses.listPublishedCourses()]);
  if (!course) throw data("Course not found", { status: 404 });
  return { course, courses: all };
}

export function meta({ matches, loaderData }) {
  if (!loaderData?.course) return [{ title: "Course not found | The Music of Heart" }];
  const { course } = loaderData;
  const root = matches.find((m) => m?.id === "root");
  const rootData = root?.loaderData ?? root?.data ?? {};
  const siteUrl = rootData.siteUrl ?? "";
  return pageMeta({
    matches,
    title: `${classesLabel(course).replace(/^./, (c) => c.toUpperCase()).replace(" classes", " Classes")} in Nashik Road, Nashik`,
    description: `${course.shortDescription} Beginner and Advanced levels, ages 4+, at The Music of Heart Music Academy.`,
    path: `/courses/${course.slug}`,
    jsonLd: [
      courseJsonLd({ siteUrl, settings: rootData.settings, course }),
      breadcrumbJsonLd(siteUrl, [
        { name: "Home", path: "/" },
        { name: "Courses", path: "/courses" },
        { name: course.name, path: `/courses/${course.slug}` },
      ]),
    ],
  });
}

const LEVEL_LABEL = { beginner: "Beginner", advanced: "Advanced" };

export default function Course() {
  const { course, courses: all } = useLoaderData();
  const { settings } = useRouteLoaderData("root");
  const phone = phoneOf(settings);
  const others = all.filter((c) => c.slug !== course.slug);

  return (
    <>
      <section data-surface="dark" className="border-b border-line" aria-labelledby="page-title">
        <div className="container-site grid items-center gap-x-12 gap-y-12 py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-small text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="no-underline hover:text-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/courses" className="no-underline hover:text-accent">
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-fg">
                  {course.name}
                </li>
              </ol>
            </nav>
            <h1 id="page-title" className="mt-10 font-display text-display uppercase">
              {course.name}
              <span className="sr-only"> classes</span>
            </h1>
            <p className="mt-6 max-w-[44ch] text-lead text-muted">{course.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={`/enquire?course=${course.slug}`} arrow>
                Enquire about {course.name.toLowerCase()}
              </Button>
              {phone ? (
                <Button href={phone.href} variant="secondary" icon="phone" className="tabular">
                  {phone.display}
                </Button>
              ) : null}
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="arch-card relative mx-auto aspect-[3/4] max-w-sm overflow-hidden">
              <SiteImage
                name={[`course-${course.slug}`]}
                alt=""
                priority
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="absolute inset-0 h-full w-full"
                aspectRatio="auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section data-surface="light" className="section" aria-labelledby="about-course-title">
        <div className="container-site grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="about-course-title" className="font-display text-h2">
              About the course
            </h2>
            <p className="mt-8 border-t border-line-strong pt-5 font-display text-h4">
              Taught in person at the academy · Ages 4 and up
            </p>
          </div>
          <div className="prose-body lg:col-span-6 lg:col-start-7">
            {course.description
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className={i === 0 ? "text-lead" : "text-muted"}>
                  {para}
                </p>
              ))}
            {course.image ? (
              <Picture media={course.image} alt={`${course.name} at The Music of Heart`} sizes="(min-width: 1024px) 45vw, 100vw" className="mt-10" />
            ) : null}
          </div>
        </div>

        <div className="container-site mt-(--space-section)">
          <h2 className="font-display text-h2">Levels</h2>
          <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
            {course.levels.map((level) => (
              <article key={level.level} className="border-t-2 border-fg pt-6" aria-labelledby={`level-${level.level}`}>
                <h3 id={`level-${level.level}`} className="font-display text-h3">
                  {LEVEL_LABEL[level.level]}
                </h3>
                {level.summary ? <p className="mt-4 max-w-[48ch] text-muted">{level.summary}</p> : null}
                {level.points?.length ? (
                  <ul className="mt-6">
                    {level.points.map((point) => (
                      <li key={point} className="flex gap-4 border-t border-line py-4">
                        <Icon name="check" size={18} className="mt-1 text-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection
        courses={all}
        settings={settings}
        defaultCourse={course.slug}
        title={`Start ${course.name.toLowerCase()} at the academy.`}
      />

      {others.length ? (
        <nav data-surface="dark" aria-label="Other courses" className="border-t border-line">
          <ul className="container-site grid sm:grid-cols-3">
            {others.map((c, i) => (
              <li key={c.slug} className={i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-6" : "sm:pr-6"}>
                <Link to={`/courses/${c.slug}`} className="group flex items-center justify-between gap-4 py-8 no-underline">
                  <span className="font-display text-h3 transition-colors duration-(--dur-slow) group-hover:text-accent">
                    {c.name}
                  </span>
                  <Icon name="arrowRight" size={20} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}

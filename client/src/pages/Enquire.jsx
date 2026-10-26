import { data, useLoaderData, useRouteLoaderData } from "react-router";

import { EnquiryForm } from "../components/forms/EnquiryForm.jsx";
import { courses, enquiries } from "../lib/data.server.js";
import { breadcrumbJsonLd, pageMeta } from "../lib/seo.js";
import { addressLines, phoneOf } from "../lib/site.js";
import { PageHeader } from "../sections/PageHeader.jsx";

export async function loader({ request }) {
  const list = await courses.listPublishedCourses();
  const requested = new URL(request.url).searchParams.get("course") ?? "";
  const defaultCourse = list.some((c) => c.slug === requested) ? requested : "";
  return { courses: list, defaultCourse };
}

/** The page the visitor sent the form from (home, a course page, /enquire). */
function sourcePage(request) {
  try {
    const referer = new URL(request.headers.get("referer") ?? "");
    if (referer.host === new URL(request.url).host) return referer.pathname;
  } catch {
    // no or malformed referer
  }
  return "/enquire";
}

export async function action({ request }) {
  const form = await request.formData();
  const values = Object.fromEntries(form);

  if (request.headers.get("x-moh-limited")) {
    return data(
      {
        ok: false,
        formError: "You have sent several enquiries already. Please call the academy instead, or try again in an hour.",
        values,
      },
      { status: 429 },
    );
  }

  try {
    await enquiries.submitEnquiry(values, { source: sourcePage(request) });
    return { ok: true, name: String(values.name ?? "").trim(), phone: String(values.phone ?? "") };
  } catch (error) {
    if (error?.status === 422) {
      return data({ ok: false, errors: error.details?.fields ?? {}, values }, { status: 422 });
    }
    console.error("[enquire] submission failed", error);
    return data(
      { ok: false, formError: "We could not send your enquiry just now. Please try again, or call the academy.", values },
      { status: 500 },
    );
  }
}

export function meta({ matches }) {
  const root = matches.find((m) => m?.id === "root");
  const siteUrl = (root?.loaderData ?? root?.data)?.siteUrl ?? "";
  return pageMeta({
    matches,
    title: "Enquire about Classes",
    description:
      "Send an enquiry to The Music of Heart Music Academy, Nashik Road. Tell us the course and level, and the academy will call you back.",
    path: "/enquire",
    jsonLd: breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Enquire", path: "/enquire" },
    ]),
  });
}

export default function Enquire() {
  const { courses: list, defaultCourse } = useLoaderData();
  const { settings } = useRouteLoaderData("root");
  const phone = phoneOf(settings);

  return (
    <>
      <PageHeader
        title="Enquire"
        intro="Tell us who the lessons are for. The academy will contact you to talk about classes and levels."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Enquire", path: "/enquire" },
        ]}
      />
      <section data-surface="light" className="section" aria-labelledby="form-title">
        <div className="container-site grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div id="enquiry-form" className="scroll-mt-28 lg:col-span-7">
            <h2 id="form-title" className="sr-only">
              Enquiry form
            </h2>
            <EnquiryForm courses={list} defaultCourse={defaultCourse} phone={phone} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Other ways to reach us">
            <div className="border-t border-line-strong pt-6">
              <h2 className="font-display text-h3">Rather talk now?</h2>
              {phone ? (
                <a href={phone.href} className="mt-4 inline-block font-display text-h3 text-accent no-underline tabular">
                  {phone.display}
                </a>
              ) : null}
            </div>
            <div className="mt-10 border-t border-line pt-6">
              <h2 className="label text-muted">The academy</h2>
              <address className="mt-3 not-italic text-small leading-relaxed">
                {addressLines(settings).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <p className="mt-10 border-t border-line pt-6 text-small text-muted">
              Classes are offline, at the academy. There is no online payment or admission — the academy will talk you
              through everything when they call.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

import { useLoaderData, useRouteLoaderData } from "react-router";

import { courses } from "../lib/data.server.js";
import { breadcrumbJsonLd, pageMeta } from "../lib/seo.js";
import { EnquirySection } from "../sections/EnquirySection.jsx";
import { PageHeader } from "../sections/PageHeader.jsx";
import { VisitDetails } from "../sections/FounderVisit.jsx";

export async function loader() {
  return { courses: await courses.listPublishedCourses() };
}

export function meta({ matches }) {
  const root = matches.find((m) => m?.id === "root");
  const siteUrl = (root?.loaderData ?? root?.data)?.siteUrl ?? "";
  return pageMeta({
    matches,
    title: "Contact & Directions",
    description:
      "Call 8552829977 or visit The Music of Heart Music Academy at Rajan Complex, Datta Mandir Road, Nashik Road, Nashik 422101.",
    path: "/contact",
    jsonLd: breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  });
}

export default function Contact() {
  const { courses: list } = useLoaderData();
  const { settings } = useRouteLoaderData("root");
  return (
    <>
      <PageHeader
        title="Contact"
        intro="Call the academy, visit us in Nashik Road, or send an enquiry and we will call you back."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <section data-surface="light" className="section" aria-labelledby="find-title">
        <div className="container-site max-w-3xl">
          <VisitDetails settings={settings} title="Find the academy" id="find-title" />
        </div>
      </section>
      <EnquirySection courses={list} settings={settings} title="Send an enquiry" />
    </>
  );
}

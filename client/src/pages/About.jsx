import { useLoaderData, useRouteLoaderData } from "react-router";

import { BLACK, IVORY, Wave } from "../components/ui/Wave.jsx";
import { courses } from "../lib/data.server.js";
import { breadcrumbJsonLd, pageMeta } from "../lib/seo.js";
import { AboutHero, MusicInNumbers, OurGoal, OurStory, WhatDrivesUs } from "../sections/about/AboutSections.jsx";
import { EnquirySection } from "../sections/EnquirySection.jsx";
import { FounderSection } from "../sections/FounderVisit.jsx";

export async function loader() {
  return { courses: await courses.listPublishedCourses() };
}

export function meta({ matches }) {
  const root = matches.find((m) => m?.id === "root");
  const siteUrl = (root?.loaderData ?? root?.data)?.siteUrl ?? "";
  return pageMeta({
    matches,
    title: "About the Academy",
    description:
      "Founded by Mr. Aryan Tisawar in Nashik Road. Affiliated with Suro Bharati Sangeet Kala Kendra and ISO certified, with practical, one-to-one music lessons.",
    path: "/about",
    jsonLd: breadcrumbJsonLd(siteUrl, [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  });
}

export default function About() {
  const { courses: list } = useLoaderData();
  const { settings } = useRouteLoaderData("root");

  return (
    <>
      <AboutHero />
      <Wave from={BLACK} to={IVORY} />
      <OurStory />
      <Wave from={IVORY} to={BLACK} variant={1} />
      <MusicInNumbers />
      <Wave from={BLACK} to={IVORY} />
      <WhatDrivesUs />
      <Wave from={IVORY} to={BLACK} variant={1} />
      <OurGoal />
      <FounderSection settings={settings} showLink={false} />
      <EnquirySection courses={list} settings={settings} />
    </>
  );
}

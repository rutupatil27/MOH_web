import { useLoaderData, useRouteLoaderData } from "react-router";

import { courses, gallery } from "../lib/data.server.js";
import { musicSchoolJsonLd, pageMeta } from "../lib/seo.js";
import { ChooseInstrument } from "../sections/ChooseInstrument.jsx";
import { FirstNoteStage } from "../sections/FirstNoteStage.jsx";
import { AffiliatedBand, FounderSection, VisitSection } from "../sections/FounderVisit.jsx";
import { GalleryMoments } from "../sections/GalleryMoments.jsx";
import { HomeHero } from "../sections/HomeHero.jsx";
import { WhyChoose } from "../sections/WhyChoose.jsx";

export async function loader() {
  const [published, photos] = await Promise.all([courses.listPublishedCourses(), gallery.listPublishedGallery({ limit: 24 })]);
  return { courses: published, photos };
}

export function meta({ matches, loaderData }) {
  const root = matches.find((m) => m?.id === "root");
  const rootData = root?.loaderData ?? root?.data;
  return pageMeta({
    matches,
    path: "/",
    description:
      "Guitar, keyboard, vocals and drums classes in Nashik Road, Nashik, for ages 4+. Beginner and Advanced levels. ISO certified, affiliated with Suro Bharati.",
    jsonLd: musicSchoolJsonLd({ siteUrl: rootData?.siteUrl ?? "", settings: rootData?.settings, courses: loaderData?.courses }),
  });
}

export default function Home() {
  const { courses: list, photos } = useLoaderData();
  const { settings } = useRouteLoaderData("root");

  return (
    <>
      <HomeHero />
      <ChooseInstrument courses={list} />
      <WhyChoose />
      <FirstNoteStage />
      <GalleryMoments photos={photos} settings={settings} />
      <FounderSection settings={settings} />
      <AffiliatedBand />
      <VisitSection settings={settings} />
    </>
  );
}

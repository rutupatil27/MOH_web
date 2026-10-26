import { LEGAL_NAME, SITE_NAME, addressLines, classesLabel } from "./site.js";

function rootData(matches) {
  const root = matches?.find((m) => m?.id === "root");
  return root?.loaderData ?? root?.data ?? {};
}

/**
 * Builds the meta descriptors for a page: unique title and description,
 * canonical URL, Open Graph and Twitter cards. Titles get " | The Music of Heart".
 */
export function pageMeta({ matches, title, description, path = "/", image = "/og-image.png", noindex = false, jsonLd }) {
  const { siteUrl = "", settings } = rootData(matches);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : settings?.seo?.title || `${SITE_NAME} | Music Academy in Nashik Road, Nashik`;
  const desc =
    description ||
    settings?.seo?.description ||
    "Offline guitar, keyboard, vocals and drums classes in Nashik Road, Nashik, for ages 4+, at Beginner and Advanced levels.";
  const url = `${siteUrl}${path === "/" ? "/" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const tags = [
    { title: fullTitle },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: LEGAL_NAME },
    { property: "og:locale", content: "en_IN" },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${LEGAL_NAME} logo` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: desc },
    { name: "twitter:image", content: imageUrl },
  ];
  if (noindex) tags.push({ name: "robots", content: "noindex, nofollow" });
  for (const entry of [].concat(jsonLd ?? [])) tags.push({ "script:ld+json": entry });
  return tags;
}

/** MusicSchool structured data — only confirmed facts, no ratings or reviews. */
export function musicSchoolJsonLd({ siteUrl, settings, courses = [] }) {
  if (!settings) return null;
  const a = settings.address ?? {};
  const sameAs = [settings.instagramUrl, settings.youtubeUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    "@id": `${siteUrl}/#academy`,
    name: settings.academyName || LEGAL_NAME,
    alternateName: SITE_NAME,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/brand/logo-mark-square.png`,
    image: `${siteUrl}/og-image.png`,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.founderName ? { founder: { "@type": "Person", name: settings.founderName } } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: [a.line1, a.line2].filter(Boolean).join(", "),
      addressLocality: [a.locality, a.city].filter(Boolean).join(", "),
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Place", name: "Nashik Road" },
      { "@type": "City", name: "Nashik" },
    ],
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.mapsUrl ? { hasMap: settings.mapsUrl } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Music courses",
      itemListElement: courses.map((course) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: classesLabel(course),
          url: `${siteUrl}/courses/${course.slug}`,
        },
      })),
    },
  };
}

export function courseJsonLd({ siteUrl, settings, course }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: classesLabel(course),
    description: course.shortDescription,
    url: `${siteUrl}/courses/${course.slug}`,
    educationalLevel: course.levels.map((l) => (l.level === "beginner" ? "Beginner" : "Advanced")).join(", "),
    provider: {
      "@type": "MusicSchool",
      "@id": `${siteUrl}/#academy`,
      name: settings?.academyName || LEGAL_NAME,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: settings?.academyName || LEGAL_NAME,
        address: addressLines(settings).join(", "),
      },
    },
  };
}

export function breadcrumbJsonLd(siteUrl, crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.path}`,
    })),
  };
}

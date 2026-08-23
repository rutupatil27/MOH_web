import { courses, site } from "@/lib/site";

/**
 * MusicSchool structured data.
 * Only properties we actually know are emitted — address, telephone, sameAs
 * and foundingDate join once the academy supplies them (see PENDING).
 */
export function musicSchoolJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    slogan: site.idea,
    // City is confirmed; street address stays out until a human verifies it.
    address: {
      "@type": "PostalAddress",
      addressLocality: site.place.city,
      addressRegion: site.place.region,
      addressCountry: "IN",
    },
    areaServed: { "@type": "City", name: site.place.city },
    hasCredential: [site.credentials.iso, site.credentials.affiliation],
    makesOffer: courses.map((c) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Course",
        name: `${c.name} Lessons`,
        description: c.tagline,
        provider: { "@type": "MusicSchool", name: site.legalName },
      },
    })),
  };
}

import { formatIndianMobile, telHref } from "@moh/shared/phone";

export const SITE_NAME = "The Music of Heart";
export const LEGAL_NAME = "The Music of Heart Music Academy";

/** "Guitar classes", "Vocal classes" — how a course reads in titles and search results. */
export function classesLabel(course) {
  const name = course.slug === "vocals" ? "Vocal" : course.name;
  return `${name} classes`;
}

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

/** Confirmed credentials — text only, no badge artwork until the real marks are supplied. */
export const CREDENTIALS = {
  affiliation: "Affiliated with Suro Bharati Sangeet Kala Kendra",
  iso: "ISO certified",
};

export function phoneOf(settings) {
  if (!settings?.phone) return null;
  return { display: formatIndianMobile(settings.phone), href: telHref(settings.phone) };
}

export function addressLines(settings) {
  const a = settings?.address ?? {};
  const cityLine = [a.city, a.region].filter(Boolean).join(", ") + (a.postalCode ? ` ${a.postalCode}` : "");
  return [a.line1, a.line2, a.locality, cityLine.trim()].filter(Boolean);
}

/** Directions: the admin's Maps link when set, otherwise a Maps search for the confirmed address. */
export function directionsUrl(settings) {
  if (settings?.mapsUrl) return settings.mapsUrl;
  const lines = addressLines(settings);
  if (!lines.length) return null;
  const query = encodeURIComponent(`${settings.academyName}, ${lines.join(", ")}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function instagramHandle(url) {
  const match = /instagram\.com\/([^/?#]+)/i.exec(url ?? "");
  return match ? `@${match[1]}` : null;
}

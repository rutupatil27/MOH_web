import { courses, gallery } from "../../lib/data.server.js";

const STATIC = [
  { path: "/", priority: "1.0" },
  { path: "/courses", priority: "0.9" },
  { path: "/about", priority: "0.7" },
  { path: "/gallery", priority: "0.6" },
  { path: "/contact", priority: "0.8" },
  { path: "/enquire", priority: "0.8" },
];

export async function loader() {
  const siteUrl = (process.env.SITE_URL || "https://themusicofheart.com").replace(/\/+$/, "");
  const [list, photos] = await Promise.all([courses.listPublishedCourses(), gallery.listPublishedGallery({ limit: 1 })]);
  const latest = (items) => items.map((i) => i.updatedAt).filter(Boolean).sort().at(-1);

  const urls = [
    ...STATIC.map((s) => ({ ...s, lastmod: s.path === "/gallery" ? latest(photos) : undefined })),
    ...list.map((c) => ({ path: `/courses/${c.slug}`, priority: "0.9", lastmod: c.updatedAt })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${siteUrl}${u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}<priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}

import * as services from "../services/index.js";
import { notFound } from "../utils/errors.js";

export async function listCourses(_req, res) {
  res.json({ courses: await services.courses.listPublishedCourses() });
}

export async function getCourse(req, res) {
  const course = await services.courses.getPublishedCourse(req.params.slug);
  if (!course) throw notFound("Course");
  res.json({ course });
}

export async function listGallery(req, res) {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 0, 0), 100) || undefined;
  res.json({ items: await services.gallery.listPublishedGallery({ limit }) });
}

export async function getSiteSettings(_req, res) {
  const { id, updatedAt, createdAt, ...settings } = await services.settings.getSettings();
  res.json({ settings });
}

export async function createEnquiry(req, res) {
  await services.enquiries.submitEnquiry(req.body, { source: req.get("referer") ?? "api" });
  res.status(201).json({ ok: true, message: "Thank you — the academy will contact you soon." });
}

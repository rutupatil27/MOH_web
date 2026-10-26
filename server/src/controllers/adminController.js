import { reorderSchema } from "@moh/shared";

import { clearSessionCookie, setSessionCookie } from "../middleware/auth.js";
import * as services from "../services/index.js";
import { parseOrThrow } from "../utils/validation.js";

/* ---------- Session ---------- */

export async function login(req, res) {
  const { token, admin } = await services.auth.login(req.body);
  setSessionCookie(res, token);
  res.json({ admin });
}

export function logout(_req, res) {
  clearSessionCookie(res);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ admin: req.admin });
}

export async function dashboard(_req, res) {
  const [summary, latest] = await Promise.all([
    services.dashboardSummary(),
    services.enquiries.listEnquiries({ status: "new", pageSize: 5 }),
  ]);
  res.json({ ...summary, latestNew: latest.items });
}

/* ---------- Enquiries ---------- */

export async function listEnquiries(req, res) {
  const { status, q, page } = req.query;
  res.json(await services.enquiries.listEnquiries({ status, q, page }));
}

export async function getEnquiry(req, res) {
  res.json({ enquiry: await services.enquiries.getEnquiry(req.params.id) });
}

export async function updateEnquiry(req, res) {
  res.json({ enquiry: await services.enquiries.updateEnquiry(req.params.id, req.body) });
}

/* ---------- Courses ---------- */

export async function listCourses(_req, res) {
  res.json({ courses: await services.courses.listAllCourses() });
}

export async function getCourse(req, res) {
  res.json({ course: await services.courses.getCourse(req.params.id) });
}

export async function createCourse(req, res) {
  res.status(201).json({ course: await services.courses.createCourse(req.body) });
}

export async function updateCourse(req, res) {
  res.json({ course: await services.courses.updateCourse(req.params.id, req.body) });
}

export async function deleteCourse(req, res) {
  await services.courses.deleteCourse(req.params.id);
  res.status(204).end();
}

export async function reorderCourses(req, res) {
  const { ids } = parseOrThrow(reorderSchema, req.body);
  res.json({ courses: await services.courses.reorderCourses(ids) });
}

export async function uploadCourseImage(req, res) {
  res.json({ course: await services.courses.setCourseImage(req.params.id, req.file.buffer) });
}

export async function deleteCourseImage(req, res) {
  res.json({ course: await services.courses.removeCourseImage(req.params.id) });
}

/* ---------- Gallery ---------- */

export async function listGallery(_req, res) {
  res.json({ items: await services.gallery.listAllGallery() });
}

export async function uploadGalleryItem(req, res) {
  res.status(201).json({ item: await services.gallery.createGalleryItem(req.file.buffer, req.body) });
}

export async function updateGalleryItem(req, res) {
  res.json({ item: await services.gallery.updateGalleryItem(req.params.id, req.body) });
}

export async function deleteGalleryItem(req, res) {
  await services.gallery.deleteGalleryItem(req.params.id);
  res.status(204).end();
}

export async function reorderGallery(req, res) {
  const { ids } = parseOrThrow(reorderSchema, req.body);
  res.json({ items: await services.gallery.reorderGallery(ids) });
}

/* ---------- Settings ---------- */

export async function getSettings(_req, res) {
  res.json({ settings: await services.settings.getSettings() });
}

export async function updateSettings(req, res) {
  res.json({ settings: await services.settings.updateSettings(req.body) });
}

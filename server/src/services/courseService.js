import { courseSchema } from "@moh/shared";

import { Course } from "../models/index.js";
import { HttpError, notFound } from "../utils/errors.js";
import { clean, publicMedia } from "../utils/serialize.js";
import { assertObjectId, parseOrThrow } from "../utils/validation.js";
import { processImage, removeImage } from "./mediaService.js";

const LEVEL_ORDER = { beginner: 0, advanced: 1 };

function present(doc) {
  if (!doc) return null;
  const course = clean(doc);
  course.image = publicMedia(doc.image);
  course.levels = [...(course.levels ?? [])].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  return course;
}

/* ---------- Public ---------- */

export async function listPublishedCourses() {
  const docs = await Course.find({ published: true }).sort({ sortOrder: 1, name: 1 }).lean();
  return docs.map(present);
}

export async function getPublishedCourse(slug) {
  if (typeof slug !== "string") return null;
  return present(await Course.findOne({ slug: slug.toLowerCase(), published: true }).lean());
}

/* ---------- Admin ---------- */

export async function listAllCourses() {
  const docs = await Course.find().sort({ sortOrder: 1, name: 1 }).lean();
  return docs.map(present);
}

export async function getCourse(id) {
  assertObjectId(id, "Course");
  const doc = await Course.findById(id).lean();
  if (!doc) throw notFound("Course");
  return present(doc);
}

async function assertSlugFree(slug, exceptId) {
  const clash = await Course.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) });
  if (clash) throw new HttpError(422, "Please correct the highlighted fields.", { fields: { slug: "Another course already uses this slug." } });
}

export async function createCourse(input) {
  const data = parseOrThrow(courseSchema, input);
  await assertSlugFree(data.slug);
  if (input?.sortOrder === undefined) {
    const last = await Course.findOne().sort({ sortOrder: -1 }).lean();
    data.sortOrder = (last?.sortOrder ?? -1) + 1;
  }
  const doc = await Course.create(data);
  return present(doc.toObject());
}

export async function updateCourse(id, input) {
  assertObjectId(id, "Course");
  const data = parseOrThrow(courseSchema, input);
  await assertSlugFree(data.slug, id);
  const doc = await Course.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true }).lean();
  if (!doc) throw notFound("Course");
  return present(doc);
}

export async function deleteCourse(id) {
  assertObjectId(id, "Course");
  const doc = await Course.findByIdAndDelete(id).lean();
  if (!doc) throw notFound("Course");
  await removeImage(doc.image);
}

export async function reorderCourses(ids) {
  await Course.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { sortOrder: index } } })));
  return listAllCourses();
}

export async function setCourseImage(id, buffer) {
  assertObjectId(id, "Course");
  const existing = await Course.findById(id).lean();
  if (!existing) throw notFound("Course");
  const image = await processImage(buffer, "courses");
  const doc = await Course.findByIdAndUpdate(id, { $set: { image } }, { returnDocument: "after" }).lean();
  await removeImage(existing.image);
  return present(doc);
}

export async function removeCourseImage(id) {
  assertObjectId(id, "Course");
  const existing = await Course.findById(id).lean();
  if (!existing) throw notFound("Course");
  await removeImage(existing.image);
  const doc = await Course.findByIdAndUpdate(id, { $set: { image: null } }, { returnDocument: "after" }).lean();
  return present(doc);
}

export const countCourses = () => Course.countDocuments();

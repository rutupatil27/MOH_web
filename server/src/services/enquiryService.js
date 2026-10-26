import { ENQUIRY_STATUS_VALUES, UNDECIDED, enquirySchema, enquiryUpdateSchema } from "@moh/shared";

import { Course, Enquiry } from "../models/index.js";
import { HttpError, notFound } from "../utils/errors.js";
import { clean } from "../utils/serialize.js";
import { assertObjectId, parseOrThrow } from "../utils/validation.js";

/**
 * Validates and stores a public enquiry. Returns { ok: true }.
 * A filled honeypot is accepted silently and discarded, so bots learn nothing.
 */
export async function submitEnquiry(input, { source = "" } = {}) {
  const data = parseOrThrow(enquirySchema, input);
  if (data.website) return { ok: true };

  let courseName = "";
  if (data.course !== UNDECIDED) {
    const course = await Course.findOne({ slug: data.course, published: true }).lean();
    if (!course) {
      throw new HttpError(422, "Please correct the highlighted fields.", { fields: { course: "Choose a course from the list." } });
    }
    courseName = course.name;
  }

  const { website, ...record } = data;
  await Enquiry.create({ ...record, courseName, source: String(source).slice(0, 200) });
  return { ok: true };
}

export async function listEnquiries({ status, q, page = 1, pageSize = 25 } = {}) {
  const filter = {};
  if (status && ENQUIRY_STATUS_VALUES.includes(status)) filter.status = status;
  if (q && typeof q === "string" && q.trim()) {
    const escaped = q.trim().slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(escaped, "i");
    filter.$or = [{ name: pattern }, { phone: pattern }, { courseName: pattern }, { message: pattern }];
  }
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const [items, total] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);
  return { items: items.map(clean), total, page: safePage, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getEnquiry(id) {
  assertObjectId(id, "Enquiry");
  const doc = await Enquiry.findById(id).lean();
  if (!doc) throw notFound("Enquiry");
  return clean(doc);
}

export async function updateEnquiry(id, input) {
  assertObjectId(id, "Enquiry");
  const data = parseOrThrow(enquiryUpdateSchema, input);
  const doc = await Enquiry.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true }).lean();
  if (!doc) throw notFound("Enquiry");
  return clean(doc);
}

export async function enquiryCounts() {
  const rows = await Enquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const counts = Object.fromEntries(ENQUIRY_STATUS_VALUES.map((s) => [s, 0]));
  for (const row of rows) counts[row._id] = row.count;
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
  return counts;
}

import { galleryItemSchema } from "@moh/shared";

import { GalleryItem } from "../models/index.js";
import { notFound } from "../utils/errors.js";
import { clean, publicMedia } from "../utils/serialize.js";
import { assertObjectId, parseOrThrow } from "../utils/validation.js";
import { processImage, removeImage } from "./mediaService.js";

function present(doc) {
  if (!doc) return null;
  const item = clean(doc);
  item.image = publicMedia(doc.image);
  return item;
}

const ORDER = { sortOrder: 1, createdAt: -1 };

export async function listPublishedGallery({ limit } = {}) {
  let query = GalleryItem.find({ published: true }).sort(ORDER);
  if (limit) query = query.limit(limit);
  return (await query.lean()).map(present);
}

export async function listAllGallery() {
  return (await GalleryItem.find().sort(ORDER).lean()).map(present);
}

export async function createGalleryItem(buffer, input) {
  const data = parseOrThrow(galleryItemSchema, input);
  const image = await processImage(buffer, "gallery");
  try {
    if (input?.sortOrder === undefined) {
      const first = await GalleryItem.findOne().sort({ sortOrder: 1 }).lean();
      data.sortOrder = Math.max((first?.sortOrder ?? 1) - 1, 0);
    }
    const doc = await GalleryItem.create({ ...data, image });
    return present(doc.toObject());
  } catch (error) {
    await removeImage(image);
    throw error;
  }
}

export async function updateGalleryItem(id, input) {
  assertObjectId(id, "Photo");
  const data = parseOrThrow(galleryItemSchema, input);
  const doc = await GalleryItem.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true }).lean();
  if (!doc) throw notFound("Photo");
  return present(doc);
}

export async function deleteGalleryItem(id) {
  assertObjectId(id, "Photo");
  const doc = await GalleryItem.findByIdAndDelete(id).lean();
  if (!doc) throw notFound("Photo");
  await removeImage(doc.image);
}

export async function reorderGallery(ids) {
  await GalleryItem.bulkWrite(
    ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { sortOrder: index } } })),
  );
  return listAllGallery();
}

export const countGallery = () => GalleryItem.countDocuments();

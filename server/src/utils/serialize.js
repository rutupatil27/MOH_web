/** Lean Mongo documents → plain JSON-safe objects with `id` instead of `_id`. */
export function clean(doc) {
  if (!doc) return null;
  const { _id, __v, passwordHash, key, ...rest } = doc;
  const out = { id: String(_id), ...rest };
  for (const field of ["createdAt", "updatedAt", "lastLoginAt"]) {
    if (out[field] instanceof Date) out[field] = out[field].toISOString();
  }
  return out;
}

export const cleanAll = (docs) => docs.map(clean);

/** Strip storage internals from media before it leaves the server. */
export function publicMedia(media) {
  if (!media) return null;
  const { key, ...rest } = media;
  return rest;
}

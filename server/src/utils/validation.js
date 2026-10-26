import mongoose from "mongoose";

import { fieldErrors } from "@moh/shared";

import { HttpError, notFound } from "./errors.js";

export const fieldErrorsOf = fieldErrors;

export function assertObjectId(id, what = "Item") {
  if (!mongoose.isValidObjectId(id)) throw notFound(what);
}

/** Parse with a Zod schema or throw a 422 carrying per-field messages. */
export function parseOrThrow(schema, input) {
  const parsed = schema.safeParse(input ?? {});
  if (!parsed.success) {
    throw new HttpError(422, "Please correct the highlighted fields.", { fields: fieldErrors(parsed.error) });
  }
  return parsed.data;
}

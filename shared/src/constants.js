/**
 * Business constants shared by client and server.
 * Source of truth: docs/01-class-data.md. Piano is not offered — never add it here.
 */

export const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "advanced", label: "Advanced" },
];
export const LEVEL_VALUES = LEVELS.map((l) => l.value);

/** Enquiry-only choices for visitors who have not decided yet. */
export const UNDECIDED = "undecided";
export const ENQUIRY_LEVELS = [...LEVELS, { value: UNDECIDED, label: "Not sure yet" }];

export const CONTACT_METHODS = [
  { value: "call", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp message" },
];
export const CONTACT_METHOD_VALUES = CONTACT_METHODS.map((m) => m.value);

export const ENQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];
export const ENQUIRY_STATUS_VALUES = ENQUIRY_STATUSES.map((s) => s.value);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Shortest side, in pixels, below which a photo looks soft in a gallery tile on most screens.
 * Such photos are still accepted; the admin is warned and they never get the large feature tile.
 */
export const PHOTO_SHARP_MIN_EDGE = 600;

/** Alt text used when a gallery photo is saved without its own description. */
export const DEFAULT_PHOTO_ALT = "Photo from The Music of Heart Music Academy, Nashik Road";

export const LIMITS = {
  name: 80,
  message: 1000,
  adminNote: 2000,
  shortText: 160,
  longText: 4000,
  uploadBytes: 12 * 1024 * 1024,
};

export function labelFor(list, value) {
  return list.find((item) => item.value === value)?.label ?? value;
}

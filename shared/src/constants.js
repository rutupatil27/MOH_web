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

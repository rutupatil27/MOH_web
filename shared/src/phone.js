/**
 * Indian mobile numbers: 10 digits starting 6–9, optionally prefixed by
 * +91, 91 or 0, with spaces, dashes, dots or brackets anywhere.
 */
export function normalizeIndianMobile(input) {
  if (typeof input !== "string") return null;
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

/** "+918552829977" or "8552829977" → "+91 85528 29977" */
export function formatIndianMobile(input) {
  const normalized = normalizeIndianMobile(input);
  if (!normalized) return input ?? "";
  const d = normalized.slice(3);
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

/** Value for a tel: link. */
export function telHref(input) {
  const normalized = normalizeIndianMobile(input);
  return normalized ? `tel:${normalized}` : null;
}

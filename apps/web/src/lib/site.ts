/**
 * Single source of truth for academy facts.
 *
 * RULE: nothing in here is invented. Anything the academy has not confirmed
 * yet lives in `PENDING` below and is NOT rendered anywhere on the site until
 * the real value arrives.
 */

export const site = {
  name: "The Music of Heart",
  legalName: "The Music of Heart Music Academy",
  shortName: "The Music of Heart",
  tagline: "Music Academy",
  idea: "Music is a way of discovering yourself.",
  description:
    "The Music of Heart is an ISO Certified music academy affiliated with SBSKK, teaching guitar, keyboard, drums and vocals — and helping students find the confidence to be heard.",
  url: "https://themusicofheart.com", // TODO: confirm production domain with client
  credentials: {
    iso: "ISO Certified",
    affiliation: "Affiliated with SBSKK",
  },
} as const;

export const nav = [
  { label: "Our Story", href: "/#our-story" },
  { label: "Courses", href: "/#courses" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const cta = {
  primary: { label: "Start Your Journey", href: "/#contact" },
  secondary: { label: "Explore the courses", href: "/#courses" },
} as const;

export const courses = [
  { slug: "guitar", name: "Guitar", tagline: "Strings to Success" },
  { slug: "keyboard", name: "Keyboard", tagline: "Keys to Harmony" },
  { slug: "drums", name: "Drums", tagline: "Find Your Rhythm" },
  { slug: "vocals", name: "Vocals", tagline: "Find Your Voice" },
] as const;

/**
 * Awaiting the academy. Do not guess these — they are rendered nowhere
 * until supplied, and several of them (address, phone) unlock the
 * LocalBusiness structured data in lib/jsonld.ts.
 */
export const PENDING = {
  address: null,
  phone: null,
  email: null,
  socialLinks: null,
  isoStandardNumber: null,
  sbskkFullName: null,
  foundedYear: null,
  logoFile: null,
} as const;

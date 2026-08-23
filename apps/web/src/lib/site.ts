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
    "The Music of Heart is an ISO Certified music academy in Nashik, affiliated with SBSKK — teaching guitar, keyboard, drums and vocals, and helping students find the confidence to be heard.",
  url: "https://themusicofheart.com", // TODO: confirm production domain with client
  credentials: {
    iso: "ISO Certified",
    affiliation: "Affiliated with SBSKK",
  },
  /** Confirmed by the academy. Street-level detail lives in UNVERIFIED below. */
  place: {
    city: "Nashik",
    region: "Maharashtra",
    country: "India",
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
  {
    slug: "guitar",
    name: "Guitar",
    tagline: "Strings to Success",
    lines: ["Explore your rhythm.", "Build your confidence.", "Find your sound."],
  },
  {
    slug: "keyboard",
    name: "Keyboard",
    tagline: "Keys to Harmony",
    lines: [
      "Hear how music is built.",
      "Train both hands to think.",
      "Play what you imagine.",
    ],
  },
  {
    slug: "drums",
    name: "Drums",
    tagline: "Find Your Rhythm",
    lines: ["Keep time, then bend it.", "Build control and stamina.", "Lead the room."],
  },
  {
    slug: "vocals",
    name: "Vocals",
    tagline: "Find Your Voice",
    lines: [
      "Breathe, support, project.",
      "Discover the range you have.",
      "Sing without apologising.",
    ],
  },
] as const;

/**
 * Found online, NOT yet confirmed by the academy — so it renders nowhere.
 *
 * Source: a Justdial listing for "The Music Of Heart — Near Rajkamal Sweets,
 * Datta Mandir, Nashik" (justdial.com/Nashik/The-Music-Of-Heart-Near-Rajkamal-
 * Sweets-Datta-Mandir/0253PX253-X253-230128192431-T1Z4_BZDET). The listing
 * page itself blocks automated reads, so the street line below came from a
 * search summary rather than a page we could verify. Move it into `site.place`
 * only once a human confirms it — a wrong address on a local business site is
 * worse than no address.
 */
export const UNVERIFIED = {
  streetAddress:
    "Flat No. 313, Rajan Complex, Datta Mandir Road, near Rajkamal Sweets, Deolali Gaon",
  locality: "Datta Mandir, Deolali Gaon",
  postalCode: "422101",
} as const;

/**
 * Awaiting the academy. Do not guess these — they are rendered nowhere
 * until supplied, and several of them (address, phone) unlock the
 * LocalBusiness structured data in lib/jsonld.ts.
 */
export const PENDING = {
  streetAddress: null,
  postalCode: null,
  mapsUrl: null,
  phone: null,
  whatsapp: null,
  email: null,
  socialLinks: null,
  openingHours: null,
  isoStandardNumber: null,
  sbskkFullName: null,
  foundedYear: null,
  founderName: null,
  logoFile: null,
} as const;

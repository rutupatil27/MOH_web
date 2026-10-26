/**
 * Initial course records. Names, levels and the teaching approach are
 * confirmed (docs/01-class-data.md). The descriptive sentences are drafts
 * built only from that confirmed approach — no curriculum, timings, fees or
 * claims — for the owner to approve or edit in /admin/courses.
 */

const beginner = (instrument) => ({
  level: "beginner",
  summary: `For students starting ${instrument} from the very beginning, from age 4 upward.`,
  points: [
    "Practical learning from the first lesson",
    "Music theory introduced step by step",
    "Structured lessons with one-to-one guidance",
  ],
});

const advanced = (instrument) => ({
  level: "advanced",
  summary: `For students who already play ${instrument} and want to go further.`,
  points: [
    "Deeper music theory and concept building",
    "Stage and performance training",
    "Guidance on creativity and expression",
  ],
});

export const SEED_COURSES = [
  {
    name: "Guitar",
    slug: "guitar",
    shortDescription: "Learn guitar in person, in structured one-to-one lessons, from first strum to the stage.",
    description:
      "Guitar at The Music of Heart is taught offline at the academy. Lessons combine practical playing with the music theory behind it, and every student is guided one-to-one — building the confidence to play for others.",
    levels: [beginner("guitar"), advanced("guitar")],
    featured: true,
    published: true,
    sortOrder: 0,
  },
  {
    name: "Keyboard",
    slug: "keyboard",
    shortDescription: "Learn keyboard in person, with music theory and practical playing side by side.",
    description:
      "Keyboard at The Music of Heart is taught offline at the academy. Students learn to play and to understand what they are playing, through structured lessons with one-to-one guidance and training for performance.",
    levels: [beginner("keyboard"), advanced("keyboard")],
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    name: "Vocals",
    slug: "vocals",
    shortDescription: "Train your voice in person, with structured lessons and performance training.",
    description:
      "Vocals at The Music of Heart are taught offline at the academy. Practical singing is paired with music theory and one-to-one guidance, with stage and performance training to help every student sing with confidence.",
    levels: [beginner("singing"), advanced("singing")],
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    name: "Drums",
    slug: "drums",
    shortDescription: "Learn drums in person, building rhythm and confidence through structured lessons.",
    description:
      "Drums at The Music of Heart are taught offline at the academy. Lessons are practical from the start, grounded in music theory, and guided one-to-one — with performance training for playing in front of an audience.",
    levels: [beginner("drums"), advanced("drums")],
    featured: true,
    published: true,
    sortOrder: 3,
  },
];

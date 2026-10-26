import { Course } from "../models/index.js";
import { SEED_COURSES } from "./seedData.js";
import { ensureSettings } from "./settingsService.js";

/** Idempotent: inserts the confirmed courses and settings only when absent. */
export async function ensureSeedData() {
  await ensureSettings();
  if ((await Course.estimatedDocumentCount()) === 0) {
    await Course.insertMany(SEED_COURSES);
  }
}

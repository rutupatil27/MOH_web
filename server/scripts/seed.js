/** Inserts the confirmed courses and site settings if they are missing. Safe to re-run. */
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { ensureSeedData } from "../src/services/seedService.js";

try {
  await connectDatabase();
  await ensureSeedData();
  console.log("Seed data is in place.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}

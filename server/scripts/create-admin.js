/**
 * Creates (or replaces) the single admin account.
 *   npm run create-admin -- admin@example.com "a long password"
 * or set ADMIN_EMAIL / ADMIN_PASSWORD in the environment.
 * Running it again with new values is how the password is reset.
 */
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { setAdmin } from "../src/services/authService.js";

const [email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> "<password of 12+ characters>"');
  process.exit(1);
}

try {
  await connectDatabase();
  const admin = await setAdmin({ email, password });
  console.log(`Admin account ready: ${admin.email}`);
} catch (error) {
  console.error(error.details?.fields ?? error.message);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}

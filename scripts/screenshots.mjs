/**
 * Captures pages at desktop and mobile widths using the locally installed Chrome.
 *   node scripts/screenshots.mjs [baseUrl] [outDir] [path ...]
 * Full-page shots use reduced motion so every section is in its settled state.
 */
import fs from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer-core";

const [base = "http://localhost:3000", outDir = ".impeccable/review", ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ["/", "/courses", "/courses/guitar", "/about", "/gallery", "/contact", "/enquire"];

const CHROME =
  process.env.CHROME_PATH ||
  ["C:/Program Files/Google/Chrome/Application/chrome.exe", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome"].find(
    Boolean,
  );

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const slug = (p) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "-"));

await fs.mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    for (const route of routes) {
      const url = `${base}${route}`;
      // First viewport with motion, after the stage sweep settles.
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
      await page.goto(url, { waitUntil: "load", timeout: 120_000 });
      await new Promise((r) => setTimeout(r, 3600));
      await page.screenshot({ path: path.join(outDir, `${slug(route)}-${vp.name}-fold.png`) });
      // Full page, settled.
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.goto(url, { waitUntil: "load", timeout: 120_000 });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(outDir, `${slug(route)}-${vp.name}.png`), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${vp.name.padEnd(8)} ${route.padEnd(18)} ${overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : "ok"}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

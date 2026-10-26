/**
 * Accessibility audit with axe-core (WCAG 2.0/2.1/2.2 A + AA rules) in real Chrome.
 *   node scripts/a11y.mjs [baseUrl]
 * Runs every public page at desktop and mobile widths, with reduced motion so
 * everything is in its settled, readable state; also the 404 and the admin sign-in.
 */
import { createRequire } from "node:module";
import fs from "node:fs/promises";

import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axeSource = await fs.readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const [base = "http://localhost:3000"] = process.argv.slice(2);
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROUTES = ["/", "/courses", "/courses/guitar", "/courses/drums", "/about", "/gallery", "/contact", "/enquire", "/not-a-page", "/admin/login"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
let failures = 0;
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    for (const route of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, route.startsWith("/admin") ? 1500 : 300));
      await page.evaluate(axeSource);
      const result = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
        });
        return r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(" ")} — ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`),
          count: v.nodes.length,
        }));
      });
      const serious = result.filter((v) => v.impact === "serious" || v.impact === "critical");
      failures += serious.length;
      console.log(`${vp.name.padEnd(8)} ${route.padEnd(16)} ${result.length ? `${result.length} issue(s)` : "clean"}`);
      for (const v of result) {
        console.log(`   [${v.impact}] ${v.id} (${v.count}): ${v.help}`);
        for (const n of v.nodes) console.log(`        ${n}`);
      }
    }
    // The phone menu, opened.
    if (vp.name === "mobile") {
      await page.goto(`${base}/`, { waitUntil: "load" });
      await page.click("button[popovertarget=site-menu]");
      await new Promise((r) => setTimeout(r, 300));
      await page.evaluate(axeSource);
      const open = await page.evaluate(async () => (await window.axe.run(document.getElementById("site-menu"))).violations.map((v) => `${v.impact} ${v.id}: ${v.help}`));
      console.log(`mobile   menu (open)      ${open.length ? open.join(" | ") : "clean"}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} serious/critical issue group(s).` : "\nNo serious or critical issues.");
process.exitCode = failures ? 1 : 0;

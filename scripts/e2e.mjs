/**
 * End-to-end smoke test against a running site, in real Chrome.
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/e2e.mjs [baseUrl] [outDir]
 * Covers: enquiry with and without JavaScript, admin sign-in, enquiry follow-up,
 * gallery upload → public gallery → delete, course hide/publish, settings save.
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import puppeteer from "puppeteer-core";
import sharp from "sharp";

const [base = "http://localhost:3000", outDir = ".impeccable/review/admin"] = process.argv.slice(2);
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (error) {
    results.push(["FAIL", name, error.message.split("\n")[0]]);
  }
};
const expect = (cond, message) => {
  if (!cond) throw new Error(message);
};
const textOf = (page) => page.evaluate(() => document.body.innerText);
const settle = (ms = 600) => new Promise((r) => setTimeout(r, ms));

await fs.mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await step("enquiry validates in place, then submits with JavaScript", async () => {
    await page.goto(`${base}/enquire`, { waitUntil: "load" });
    await settle(1200);
    const form = "#enquiry-form form";
    await page.click(`${form} button[type=submit]`);
    await page.waitForFunction((f) => document.querySelectorAll(`${f} [aria-invalid=true]`).length >= 3, { timeout: 15000 }, form);
    await page.type(`${form} input[name=name]`, "E2E Test Parent");
    await page.type(`${form} input[name=phone]`, "98765 43210");
    await page.select(`${form} select[name=course]`, "guitar");
    await page.select(`${form} select[name=level]`, "beginner");
    await page.click(`${form} button[type=submit]`);
    await page.waitForFunction(() => document.body.innerText.includes("Thank you, E2E"), { timeout: 15000 });
    expect(page.url() === `${base}/enquire`, "stayed on the page");
  });

  await step("enquiry works with JavaScript disabled", async () => {
    const nojs = await browser.newPage();
    await nojs.setJavaScriptEnabled(false);
    await nojs.goto(`${base}/enquire?course=drums`, { waitUntil: "load" });
    const selected = await nojs.$eval("select[name=course]", (s) => s.value);
    expect(selected === "drums", `course preselected from link (got ${selected})`);
    await nojs.type("input[name=name]", "No Script Student");
    await nojs.type("input[name=phone]", "+91 91234 56789");
    await nojs.select("select[name=level]", "advanced");
    await Promise.all([nojs.waitForNavigation({ waitUntil: "load" }), nojs.click("button[type=submit]")]);
    const body = await textOf(nojs);
    expect(body.includes("Thank you, No"), "confirmation rendered by the server");
    await nojs.close();
  });

  await step("server rejects an invalid enquiry without JavaScript", async () => {
    const nojs = await browser.newPage();
    await nojs.setJavaScriptEnabled(false);
    await nojs.goto(`${base}/enquire`, { waitUntil: "load" });
    await nojs.type("input[name=name]", "Bad Phone");
    await nojs.type("input[name=phone]", "12345");
    await nojs.select("select[name=course]", "vocals");
    await nojs.select("select[name=level]", "beginner");
    await Promise.all([nojs.waitForNavigation({ waitUntil: "load" }), nojs.click("button[type=submit]")]);
    const body = await textOf(nojs);
    expect(body.includes("10-digit Indian mobile number"), "phone error shown");
    const kept = await nojs.$eval("input[name=name]", (i) => i.value);
    expect(kept === "Bad Phone", "typed values kept");
    await nojs.close();
  });

  await step("admin routes redirect to sign-in", async () => {
    await page.goto(`${base}/admin/enquiries`, { waitUntil: "load" });
    await page.waitForSelector("input[name=email]", { timeout: 15000 });
    expect(page.url().includes("/admin/login"), "on login page");
    await page.screenshot({ path: path.join(outDir, "login.png") });
  });

  await step("wrong password is refused", async () => {
    await page.type("input[name=email]", ADMIN_EMAIL);
    await page.type("input[name=password]", "definitely-wrong-password");
    await page.click("button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("do not match"), { timeout: 15000 });
  });

  await step("admin signs in and lands where they were going", async () => {
    await page.$eval("input[name=password]", (i) => (i.value = ""));
    await page.type("input[name=password]", ADMIN_PASSWORD);
    await page.click("button[type=submit]");
    await page.waitForFunction(() => location.pathname === "/admin/enquiries", { timeout: 15000 });
    await page.waitForSelector("table", { timeout: 15000 });
    const body = await textOf(page);
    expect(body.includes("E2E Test Parent") && body.includes("No Script Student"), "both enquiries listed");
    await page.screenshot({ path: path.join(outDir, "enquiries.png"), fullPage: true });
  });

  await step("dashboard summarises", async () => {
    await page.goto(`${base}/admin`, { waitUntil: "load" });
    await page.waitForFunction(() => document.body.innerText.includes("New enquiries"), { timeout: 15000 });
    await page.screenshot({ path: path.join(outDir, "dashboard.png"), fullPage: true });
  });

  await step("enquiry can be marked contacted with a note", async () => {
    await page.goto(`${base}/admin/enquiries?status=new&q=E2E`, { waitUntil: "load" });
    await page.waitForSelector("table a[href^='/admin/enquiries/']", { timeout: 15000 });
    await page.click("table a[href^='/admin/enquiries/']");
    await page.waitForSelector("textarea[name=adminNote]", { timeout: 15000 });
    await page.click("input[name=status][value=contacted]");
    await page.type("textarea[name=adminNote]", "Called back, visiting Saturday.");
    await page.click("main form button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("Saved."), { timeout: 15000 });
    await page.screenshot({ path: path.join(outDir, "enquiry-detail.png"), fullPage: true });
  });

  let photoAlt = "E2E sample photo of the practice room";
  await step("gallery upload requires alt text, then publishes the photo", async () => {
    const tmp = path.join(os.tmpdir(), `moh-e2e-${Date.now()}.jpg`);
    await sharp({ create: { width: 1600, height: 1067, channels: 3, background: "#5b4630" } })
      .composite([{ input: Buffer.from('<svg width="1600" height="1067"><circle cx="800" cy="530" r="300" fill="#e8be83"/></svg>') }])
      .jpeg()
      .toFile(tmp);
    await page.goto(`${base}/admin/gallery`, { waitUntil: "load" });
    await page.waitForSelector("input[type=file][name=image]", { timeout: 15000 });
    const file = await page.$("input[type=file][name=image]");
    await file.uploadFile(tmp);
    await page.click("section[aria-labelledby=upload-title] button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("Alt text is required"), { timeout: 20000 });
    const file2 = await page.$("input[type=file][name=image]");
    await file2.uploadFile(tmp);
    await page.type("section[aria-labelledby=upload-title] input[name=altText]", photoAlt);
    await page.click("section[aria-labelledby=upload-title] button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("Photo added."), { timeout: 30000 });
    await settle(800);
    await page.screenshot({ path: path.join(outDir, "gallery.png"), fullPage: true });
    const pub = await browser.newPage();
    await pub.goto(`${base}/gallery`, { waitUntil: "load" });
    const alts = await pub.$$eval("img", (imgs) => imgs.map((i) => i.alt));
    expect(alts.includes(photoAlt), "photo visible on the public gallery");
    await pub.close();
    await fs.rm(tmp, { force: true });
  });

  await step("gallery photo can be deleted", async () => {
    page.once("dialog", (d) => d.accept());
    await page.click("ol li button.text-error");
    await page.waitForFunction(() => document.body.innerText.includes("No photos yet"), { timeout: 20000 });
  });

  await step("course can be hidden and published again", async () => {
    await page.goto(`${base}/admin/courses`, { waitUntil: "load" });
    await page.waitForSelector("ol li", { timeout: 15000 });
    await page.screenshot({ path: path.join(outDir, "courses.png"), fullPage: true });
    const toggle = "ol li:nth-child(4) form button";
    await page.click(toggle);
    await page.waitForFunction((s) => document.querySelector(s)?.innerText.includes("Hidden"), { timeout: 15000 }, toggle);
    const res = await fetch(`${base}/courses/drums`);
    expect(res.status === 404, `hidden course 404s publicly (got ${res.status})`);
    await page.click(toggle);
    await page.waitForFunction((s) => document.querySelector(s)?.innerText.includes("Published"), { timeout: 15000 }, toggle);
    expect((await fetch(`${base}/courses/drums`)).status === 200, "published again");
  });

  await step("course editor shows validation", async () => {
    await page.goto(`${base}/admin/courses`, { waitUntil: "load" });
    await page.waitForSelector("ol li a", { timeout: 15000 });
    await page.click("ol li:first-child a");
    await page.waitForSelector("input[name=slug]", { timeout: 15000 });
    await page.screenshot({ path: path.join(outDir, "course-edit.png"), fullPage: true });
    await page.$eval("input[name=slug]", (i) => i.focus());
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
    await page.keyboard.type("drums");
    await page.click("main form button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("Another course already uses this slug"), { timeout: 15000 });
  });

  await step("settings save and reject bad links", async () => {
    await page.goto(`${base}/admin/settings`, { waitUntil: "load" });
    await page.waitForSelector("input[name=youtubeUrl]", { timeout: 15000 });
    await page.type("input[name=youtubeUrl]", "youtube.com/nope");
    await page.click("main form button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("full https:// link"), { timeout: 15000 });
    await page.$eval("input[name=youtubeUrl]", (i) => (i.value = ""));
    await page.click("main form button[type=submit]");
    await page.waitForFunction(() => document.body.innerText.includes("Settings saved"), { timeout: 15000 });
    await page.screenshot({ path: path.join(outDir, "settings.png"), fullPage: true });
  });

  await step("mobile admin renders", async () => {
    const m = await browser.newPage();
    await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await m.goto(`${base}/admin/enquiries`, { waitUntil: "load" });
    await m.waitForSelector("h1", { timeout: 15000 });
    await m.screenshot({ path: path.join(outDir, "enquiries-mobile.png"), fullPage: true });
    await m.close();
  });

  await step("signs out", async () => {
    await page.goto(`${base}/admin`, { waitUntil: "load" });
    await page.waitForSelector("form[action='/admin/logout'] button", { timeout: 15000 });
    await page.click("form[action='/admin/logout'] button");
    await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 });
  });

  await step("no browser errors", async () => {
    const real = errors.filter((e) => !/Failed to load resource: the server responded with a status of (401|404|422)/.test(e));
    expect(real.length === 0, real.join(" | "));
  });
} finally {
  await browser.close();
}

for (const [status, name, detail] of results) console.log(`${status}  ${name}${detail ? `  — ${detail}` : ""}`);
process.exitCode = results.some((r) => r[0] === "FAIL") ? 1 : 0;

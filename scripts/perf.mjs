/**
 * Lab performance check on a mid-range phone profile:
 * 390px viewport, 4× CPU slowdown, slow-4G network (1.6 Mbps down, 150 ms RTT).
 *   node scripts/perf.mjs [baseUrl] [path ...]
 * Reports LCP, CLS, total blocking time and bytes transferred per page. Run it
 * against a production build — the dev server is unminified.
 */
import puppeteer from "puppeteer-core";

const [base = "http://localhost:3100", ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ["/", "/courses", "/courses/guitar", "/about", "/enquire"];
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const rows = [];
try {
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const cdp = await page.createCDPSession();
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    let bytes = 0;
    let jsBytes = 0;
    cdp.on("Network.loadingFinished", (e) => (bytes += e.encodedDataLength));
    const types = new Map();
    cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
    cdp.on("Network.loadingFinished", (e) => types.get(e.requestId) === "Script" && (jsBytes += e.encodedDataLength));

    await page.evaluateOnNewDocument(() => {
      window.__perf = { lcp: 0, cls: 0, tbt: 0, fcp: 0 };
      new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__perf.lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__perf.cls += e.value))).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__perf.tbt += Math.max(0, e.duration - 50)))).observe({ type: "longtask", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => e.name === "first-contentful-paint" && (window.__perf.fcp = e.startTime))).observe({ type: "paint", buffered: true });
    });

    await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 120_000 });
    await new Promise((r) => setTimeout(r, 4000));
    // LCP is final once the user interacts; scripted scrolling does not count as input, so read it now.
    const lcpBeforeScroll = await page.evaluate(() => window.__perf.lcp);
    // Scroll through to surface any late layout shifts.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    const m = await page.evaluate(() => window.__perf);
    rows.push({ route, fcp: Math.round(m.fcp), lcp: Math.round(lcpBeforeScroll), cls: m.cls.toFixed(3), tbt: Math.round(m.tbt), kb: Math.round(bytes / 1024), jsKb: Math.round(jsBytes / 1024) });
    await page.close();
  }
} finally {
  await browser.close();
}
console.table(rows);

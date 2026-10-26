/**
 * Checks each public page's SEO essentials in the server-rendered HTML:
 * one h1, unique title/description, canonical, Open Graph, valid JSON-LD.
 *   node scripts/seo-check.mjs [baseUrl]
 */
const [base = "http://localhost:3100"] = process.argv.slice(2);
const routes = ["/", "/about", "/courses", "/courses/guitar", "/courses/keyboard", "/courses/vocals", "/courses/drums", "/gallery", "/contact", "/enquire"];
const seen = { title: new Map(), desc: new Map() };
let problems = 0;
const pick = (html, re) => (re.exec(html) ?? [])[1];
for (const route of routes) {
  const html = await (await fetch(base + route)).text();
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
  const og = (html.match(/<meta property="og:/g) ?? []).length;
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1])["@type"]; } catch { return "INVALID"; }
  });
  const issues = [];
  if (!title) issues.push("no title");
  if (!desc) issues.push("no description");
  else if (desc.length > 170) issues.push(`description ${desc.length} chars`);
  if (title && title.length > 65) issues.push(`title ${title.length} chars`);
  if (!canonical?.endsWith(route === "/" ? "/" : route)) issues.push(`canonical ${canonical}`);
  if (og < 8) issues.push(`only ${og} og tags`);
  if (h1 !== 1) issues.push(`${h1} h1`);
  if (ld.includes("INVALID")) issues.push("invalid JSON-LD");
  if (/piano|testimonial|₹|fees?\b|online class/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) issues.push("forbidden word present");
  for (const [k, v] of [["title", title], ["desc", desc]]) {
    if (seen[k].has(v)) issues.push(`duplicate ${k} with ${seen[k].get(v)}`);
    seen[k].set(v, route);
  }
  problems += issues.length;
  console.log(`${route.padEnd(18)} ${issues.length ? "✗ " + issues.join("; ") : "✓"}  [${ld.join(", ") || "no JSON-LD"}]`);
  console.log(`${"".padEnd(18)} ${title}`);
}
process.exitCode = problems ? 1 : 0;

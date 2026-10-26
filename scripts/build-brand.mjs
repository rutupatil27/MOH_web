/**
 * Rebuilds the vector logo and every brand raster from source:
 *   - guitar mark: client/src/components/illustrations/instrumentShapes.js
 *   - wordmark: Abril Fatface (measured match for the supplied logo's lettering)
 *   - subline: Jost
 * Proportions follow assets/brand/the-music-of-heart-logo.png (357px original).
 *
 * Outputs:
 *   client/src/components/ui/logoPaths.js     path data for <Logo />
 *   assets/brand/*.svg                        vector logo for the owner to approve
 *   client/public/favicon.svg, *.png, og-image.png, brand/logo-mark-square.png
 *
 * Run: npm run brand
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import opentype from "opentype.js";
import sharp from "sharp";
import wawoff2 from "wawoff2";

import { GUITAR_MARK_PATH, GUITAR_MARK_VIEWBOX } from "../client/src/components/ui/guitarMark.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nm = (p) => path.join(root, "node_modules", p);

const GOLD = "#e8be83";
const WHITE = "#f7f2ea";
const BLACK = "#0b0a08";
const INK = "#1a1612";
const BRONZE = "#8a5a1f";

const toArrayBuffer = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

async function loadFonts() {
  const abril = opentype.parse(
    toArrayBuffer(await fs.readFile(nm("@fontsource/abril-fatface/files/abril-fatface-latin-400-normal.woff"))),
  );
  const jostTtf = await wawoff2.decompress(await fs.readFile(nm("@fontsource-variable/jost/files/jost-latin-wght-normal.woff2")));
  const jost = opentype.parse(toArrayBuffer(Buffer.from(jostTtf)));
  return { abril, jost };
}

const round = (n) => Math.round(n * 10) / 10;

/** Scales + translates an absolute-command SVG path (M L H V C A Z). */
function transformPath(d, s, tx, ty) {
  const tokens = d.match(/[MLHVCAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  const out = [];
  let cmd = null;
  let i = 0;
  const X = (v) => round(Number(v) * s + tx);
  const Y = (v) => round(Number(v) * s + ty);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[MLHVCAZ]$/i.test(t)) {
      cmd = t.toUpperCase();
      out.push(cmd);
      i++;
      if (cmd === "Z") continue;
    }
    switch (cmd) {
      case "M":
      case "L":
        out.push(X(tokens[i]), Y(tokens[i + 1]));
        i += 2;
        break;
      case "H":
        out.push(X(tokens[i]));
        i += 1;
        break;
      case "V":
        out.push(Y(tokens[i]));
        i += 1;
        break;
      case "C":
        for (let k = 0; k < 3; k++) out.push(X(tokens[i + k * 2]), Y(tokens[i + k * 2 + 1]));
        i += 6;
        break;
      case "A":
        out.push(round(tokens[i] * s), round(tokens[i + 1] * s), tokens[i + 2], tokens[i + 3], tokens[i + 4], X(tokens[i + 5]), Y(tokens[i + 6]));
        i += 7;
        break;
      default:
        i++;
    }
  }
  return out.join(" ").replace(/ ([MLHVCAZ])/g, "$1").replace(/([MLHVCAZ]) /g, "$1");
}

function capHeight(font) {
  return (font.tables.os2?.sCapHeight || font.charToGlyph("H").getMetrics().yMax) / font.unitsPerEm;
}

function textPath(font, text, { x, baseline, cap, tracking = 0, align = "left" }) {
  const size = cap / capHeight(font);
  const letterSpacing = tracking;
  const width = font.getAdvanceWidth(text, size, { letterSpacing });
  const startX = align === "right" ? x - width : x;
  const p = font.getPath(text, startX, baseline, size, { letterSpacing });
  return { d: p.toPathData(1), box: p.getBoundingBox(), width };
}

function unionBox(boxes) {
  return {
    x1: Math.min(...boxes.map((b) => b.x1)),
    y1: Math.min(...boxes.map((b) => b.y1)),
    x2: Math.max(...boxes.map((b) => b.x2)),
    y2: Math.max(...boxes.map((b) => b.y2)),
  };
}

async function main() {
  const { abril, jost } = await loadFonts();

  // Work in tenths of the original logo's pixels.
  const [mx, my, mw, mh] = GUITAR_MARK_VIEWBOX.split(" ").map(Number);
  const markHeight = 1180;
  const s = markHeight / mh;
  const markX = 240;
  const markTop = 1040;
  const mark = transformPath(GUITAR_MARK_PATH, s, markX - mx * s, markTop - my * s);
  const markBox = { x1: markX, y1: markTop, x2: markX + mw * s, y2: markTop + markHeight };

  const top = textPath(abril, "THE MUSIC", { x: 740, baseline: 1712, cap: 258 });
  const bottom = textPath(abril, "OF HEART", { x: 850, baseline: 2185, cap: 338 });
  const sub = textPath(jost, "MUSIC ACADEMY", { x: bottom.box.x2, baseline: 2338, cap: 92, tracking: 0.05, align: "right" });

  const pad = 30;
  const full = unionBox([markBox, top.box, bottom.box, sub.box]);
  const noSub = unionBox([markBox, top.box, bottom.box]);
  const vb = (b) => `${round(b.x1 - pad)} ${round(b.y1 - pad)} ${round(b.x2 - b.x1 + pad * 2)} ${round(b.y2 - b.y1 + pad * 2)}`;

  const LOGO = { viewBox: vb(full), viewBoxNoSub: vb(noSub), mark, top: top.d, bottom: bottom.d, sub: sub.d };

  await fs.writeFile(
    path.join(root, "client/src/components/ui/logoPaths.js"),
    `// Generated by scripts/build-brand.mjs — do not edit by hand.\nexport const LOGO = ${JSON.stringify(LOGO, null, 2)};\n`,
  );

  const lockup = (fg, accent, bg) => {
    const [x, y, w, h] = LOGO.viewBox.split(" ").map(Number);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}" width="${round(w / 4)}" height="${round(h / 4)}">${
      bg ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>` : ""
    }<path d="${LOGO.mark}" fill="${fg}"/><path d="${LOGO.top}" fill="${accent}"/><path d="${LOGO.bottom}" fill="${fg}"/><path d="${LOGO.sub}" fill="${fg}"/></svg>\n`;
  };

  const brandDir = path.join(root, "assets/brand");
  await fs.writeFile(path.join(brandDir, "the-music-of-heart-logo-dark.svg"), lockup(WHITE, GOLD, BLACK));
  await fs.writeFile(path.join(brandDir, "the-music-of-heart-logo-on-dark.svg"), lockup(WHITE, GOLD, null));
  await fs.writeFile(path.join(brandDir, "the-music-of-heart-logo-on-light.svg"), lockup(INK, BRONZE, null));

  const markSvg = (fg, bg, size, inset) => {
    const box = markHeight;
    const scale = (size - inset * 2) / box;
    const w = (markBox.x2 - markBox.x1) * scale;
    const tx = (size - w) / 2 - markBox.x1 * scale;
    const ty = inset - markBox.y1 * scale;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${
      bg ? `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${bg}"/>` : ""
    }<path d="${mark}" fill="${fg}" transform="translate(${round(tx)} ${round(ty)}) scale(${scale.toFixed(5)})"/></svg>\n`;
  };

  const pub = path.join(root, "client/public");
  await fs.mkdir(path.join(pub, "brand"), { recursive: true });
  await fs.writeFile(path.join(pub, "favicon.svg"), markSvg(GOLD, BLACK, 64, 9));
  await fs.writeFile(path.join(brandDir, "the-music-of-heart-mark.svg"), markSvg(WHITE, null, 512, 24));
  await sharp(Buffer.from(markSvg(GOLD, BLACK, 512, 70))).png().toFile(path.join(pub, "brand/logo-mark-square.png"));
  await sharp(Buffer.from(markSvg(GOLD, BLACK, 180, 26))).png().toFile(path.join(pub, "apple-touch-icon.png"));
  await sharp(Buffer.from(markSvg(GOLD, BLACK, 32, 4))).png().toFile(path.join(pub, "favicon-32.png"));

  // Open Graph card: the lockup on the black stage with one line of place.
  const [vx, vy, vw, vh] = LOGO.viewBox.split(" ").map(Number);
  const ogW = 1200;
  const ogH = 630;
  const lockupH = 330;
  const k = lockupH / vh;
  const lx = (ogW - vw * k) / 2 - vx * k;
  const ly = 110 - vy * k;
  const place = textPath(jost, "GUITAR · KEYBOARD · VOCALS · DRUMS  —  NASHIK ROAD, NASHIK", {
    x: ogW / 2,
    baseline: 540,
    cap: 15,
    tracking: 0.14,
  });
  const placeShift = -place.width / 2;
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}" viewBox="0 0 ${ogW} ${ogH}">
<rect width="${ogW}" height="${ogH}" fill="${BLACK}"/>
<g transform="translate(${round(lx)} ${round(ly)}) scale(${k.toFixed(5)})"><path d="${LOGO.mark}" fill="${WHITE}"/><path d="${LOGO.top}" fill="${GOLD}"/><path d="${LOGO.bottom}" fill="${WHITE}"/><path d="${LOGO.sub}" fill="${WHITE}"/></g>
<rect x="420" y="498" width="360" height="1" fill="${GOLD}" opacity="0.6"/>
<path d="${place.d}" fill="${GOLD}" transform="translate(${round(placeShift)} 0)"/>
</svg>`;
  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(path.join(pub, "og-image.png"));

  console.log("Brand assets written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

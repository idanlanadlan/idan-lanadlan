/**
 * Generates public/og-image.jpg — the 1200x630 card shown when a link to the
 * site is shared on WhatsApp / Facebook / X / LinkedIn. Referenced as the
 * site-wide openGraph.images entry in app/[locale]/layout.tsx.
 *
 * Re-run this after changing public/hero-telaviv.jpg or public/logo.png:
 *   node scripts/make-og-image.mjs
 *
 * Uses the `sharp` binary that ships with Next.js — no extra dependency.
 */
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");
const out = process.argv[2] || join(PUB, "og-image.jpg");

const W = 1200;
const H = 630;

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"    stop-color="#14181D" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="#14181D" stop-opacity="0.48"/>
      <stop offset="1"    stop-color="#14181D" stop-opacity="0.95"/>
    </linearGradient>
    <radialGradient id="corner" cx="0.9" cy="0.78" r="0.9">
      <stop offset="0"    stop-color="#14181D" stop-opacity="0.72"/>
      <stop offset="0.55" stop-color="#14181D" stop-opacity="0.28"/>
      <stop offset="1"    stop-color="#14181D" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <rect width="${W}" height="${H}" fill="url(#corner)"/>
</svg>`);

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .brand { font-family: "Segoe UI", Arial, sans-serif; font-weight: 700; fill: #FAF6EE; }
    .sub   { font-family: "Segoe UI", Arial, sans-serif; font-weight: 400; fill: #F1EADD; }
    .lic   { font-family: "Segoe UI", Arial, sans-serif; font-weight: 600; fill: #C9A96E; letter-spacing: 1px; }
  </style>
  <text x="${W - 64}" y="392" text-anchor="end" class="brand" font-size="84">עידן לנדל״ן</text>
  <rect x="${W - 64 - 250}" y="420" width="250" height="3" fill="#C9A96E"/>
  <text x="${W - 64}" y="476" text-anchor="end" class="sub" font-size="33">תיווך ושיווק נדל״ן יוקרתי · תל אביב וסביבתה</text>
  <text x="${W - 64}" y="526" text-anchor="end" class="lic" font-size="23">מתווך מורשה · מס׳ רישיון 3205360</text>
</svg>`);

const bg = await sharp(join(PUB, "hero-telaviv.jpg"))
  .resize(W, H, { fit: "cover", position: "attention" })
  .modulate({ brightness: 0.92 })
  .toBuffer();

// The circular "IH" mark from the top ~62% of the (trimmed) logo.
const logo = await sharp(join(PUB, "logo.png")).trim().toBuffer();
const lm = await sharp(logo).metadata();
const mark = await sharp(logo)
  .extract({ left: 0, top: 0, width: lm.width, height: Math.round(lm.height * 0.62) })
  .resize({ height: 150 })
  .toBuffer();
const markW = (await sharp(mark).metadata()).width;

await sharp(bg)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: text, top: 0, left: 0 },
    { input: mark, top: 60, left: W - 64 - markW },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out);

const m = await sharp(out).metadata();
console.log(`wrote ${out} — ${m.width}x${m.height}, ${(statSync(out).size / 1024).toFixed(0)} KB`);

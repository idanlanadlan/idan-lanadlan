/**
 * Builds the site favicon from public/logo.png — the gold "IH" emblem on the
 * brand's ink background, so it stays visible on Google's white results page
 * (the pale-gold logo alone would wash out).
 *
 * Outputs, all picked up automatically by the Next.js App Router:
 *   app/favicon.ico     16 / 32 / 48 px (PNG-in-ICO)
 *   app/icon.png        512 px  → <link rel="icon">
 *   app/apple-icon.png  180 px  → apple-touch-icon
 *
 * Re-run after changing public/logo.png:  node scripts/make-favicon.mjs
 * Uses the sharp binary that ships with Next.js — no extra dependency.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "app");

const INK = { r: 0x14, g: 0x18, b: 0x1d, alpha: 1 }; // --black
// The circular "IH" emblem in the top half of the 1024² logo — a square crop
// that bounds the emblem and stops short of the "IDAN HULI" wordmark below.
const EMBLEM = await sharp(join(ROOT, "public", "logo.png"))
  .extract({ left: 264, top: 140, width: 496, height: 496 })
  .toBuffer();

/** One square icon: ink field, rounded corners, emblem centred with padding. */
async function icon(size) {
  const pad = Math.round(size * 0.1);
  const inner = size - pad * 2;
  const radius = Math.round(size * 0.22);

  const mark = await sharp(EMBLEM)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .modulate({ brightness: 1.1, saturation: 1.12 }) // lift the pale gold so it reads small
    .toBuffer();

  const rounded = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`
  );

  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([
      { input: mark, top: pad, left: pad },
      { input: rounded, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

// ── ICO container (PNG frames — valid and universally supported) ─────────────
function pngToIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const dir = [];
  for (const { size, buf } of frames) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += buf.length;
  }
  return Buffer.concat([header, ...dir, ...frames.map((f) => f.buf)]);
}

const icoFrames = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, buf: await icon(size) }))
);
writeFileSync(join(APP, "favicon.ico"), pngToIco(icoFrames));
writeFileSync(join(APP, "icon.png"), await icon(512));
writeFileSync(join(APP, "apple-icon.png"), await icon(180));

console.log("✓ app/favicon.ico  (16/32/48)");
console.log("✓ app/icon.png     (512)");
console.log("✓ app/apple-icon.png (180)");

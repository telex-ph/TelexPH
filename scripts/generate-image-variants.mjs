/**
 * Generates responsive, downscaled copies of everything in public/images/.
 *
 * Originals are never modified — variants are written to public/images-opt/
 * mirroring the source layout (naming rule: src/shared/image-variants.js), e.g.
 *
 *   public/images/post4.webp   ->   public/images-opt/post4-webp-640.webp
 *                                   public/images-opt/post4-webp-1280.webp
 *                                   public/images-opt/post4-webp-1920.webp
 *
 * src/shared/Image.jsx picks the right one via srcSet at runtime. This exists
 * because next/image used to do the resizing for us: several source images are
 * 7000px+ wide but render at ~150px, and the browser still has to decode every
 * one of those pixels (measured: 1212 ms of image decode on one navigation).
 *
 * Safe to re-run — sources whose content hasn't changed are skipped, and
 * variants no current source produces (deleted or shrunk images) are removed.
 *
 * Variants are also kept in node_modules/.cache/image-variants/: Vercel
 * restores node_modules between builds but not public/, and a fresh clone
 * resets every mtime, so the cache is keyed by content hash, not mtime.
 *
 *   node scripts/generate-image-variants.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { VARIANT_WIDTHS as WIDTHS, variantName } from "../src/shared/image-variants.js";

// sharp is a devDependency. If the deploy installed with --omit=dev this fails
// here rather than silently shipping a site that serves 8 MB originals.
let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error(
    "sharp is not installed — image variants cannot be generated.\n" +
      "Install dev dependencies (npm install) before building, or run\n" +
      "`npm run images` separately and commit public/images-opt/."
  );
  process.exit(1);
}

const SRC = "public/images";
const OUT = "public/images-opt";
const CACHE = "node_modules/.cache/image-variants";
const CACHE_OUT = path.join(CACHE, "out");
const MANIFEST = path.join(CACHE, "manifest.json");
const QUALITY = 80;
// Bump when the output naming or encoding changes, to invalidate the cache.
const VERSION = 2;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const files = walk(SRC).filter((f) => /\.(webp|png|jpe?g)$/i.test(f));

// { [source rel path]: { key, outs: [variant paths relative to OUT] } }
fs.mkdirSync(OUT, { recursive: true });
let manifest = {};
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  fs.cpSync(CACHE_OUT, OUT, { recursive: true });
} catch {
  manifest = {};
}
const nextManifest = {};

let made = 0;
let skipped = 0;
let srcBytes = 0;
let outBytes = 0;

const sizeOf = (rel) => fs.statSync(path.join(OUT, rel)).size;

for (const file of files) {
  const rel = path.relative(SRC, file);
  fs.mkdirSync(path.join(OUT, path.dirname(rel)), { recursive: true });

  const buf = fs.readFileSync(file);
  srcBytes += buf.length;
  // Settings are part of the key so changing WIDTHS/QUALITY regenerates.
  const key = crypto
    .createHash("sha1")
    .update(buf)
    .update(`${WIDTHS}|${QUALITY}|${VERSION}`)
    .digest("hex");

  const prev = manifest[rel];
  if (
    prev?.key === key &&
    prev.outs.every((o) => fs.existsSync(path.join(OUT, o)))
  ) {
    nextManifest[rel] = prev;
    for (const o of prev.outs) outBytes += sizeOf(o);
    skipped += prev.outs.length;
    continue;
  }

  let meta;
  try {
    meta = await sharp(buf).metadata();
  } catch {
    console.log(`skip (unreadable): ${rel}`);
    continue;
  }

  // Never upscale — a 400px source has no business becoming 1920px.
  const widths = WIDTHS.filter(
    (w) => w === WIDTHS[0] || !meta.width || meta.width >= w
  );

  // Decode the (often 7000px) original once, at the largest width needed,
  // and derive the smaller widths from that instead of re-decoding per width.
  const { data, info } = await sharp(buf)
    .resize({ width: widths.at(-1), withoutEnlargement: true })
    .raw({ depth: "uchar" })
    .toBuffer({ resolveWithObject: true });
  const raw = { width: info.width, height: info.height, channels: info.channels };

  const outs = [];
  for (const w of widths) {
    const out = variantName(rel, w);
    await sharp(data, { raw })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(OUT, out));
    outs.push(out);
    outBytes += sizeOf(out);
    made++;
  }
  nextManifest[rel] = { key, outs };
}

// Drop variants no current source owns: deleted images, widths a replaced
// image no longer has, files from an older naming scheme.
const keep = new Set(Object.values(nextManifest).flatMap((m) => m.outs));
for (const f of walk(OUT)) {
  if (!keep.has(path.relative(OUT, f))) fs.rmSync(f);
}

// Manifest goes last: a build killed mid-copy leaves no manifest, so the next
// run regenerates instead of trusting a half-written cache.
fs.rmSync(MANIFEST, { force: true });
fs.rmSync(CACHE_OUT, { recursive: true, force: true });
fs.cpSync(OUT, CACHE_OUT, { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(nextManifest));

const mb = (b) => (b / 1048576).toFixed(1);
console.log(
  `\nsources: ${files.length} files, ${mb(srcBytes)} MB` +
    `\nvariants: ${made} written, ${skipped} up-to-date, ${mb(outBytes)} MB total`
);

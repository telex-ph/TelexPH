/**
 * Generates responsive, downscaled copies of everything in public/images/.
 *
 * Originals are never modified — variants are written to public/images-opt/
 * mirroring the source layout, e.g.
 *
 *   public/images/post4.webp   ->   public/images-opt/post4-640.webp
 *                                   public/images-opt/post4-1280.webp
 *                                   public/images-opt/post4-1920.webp
 *
 * src/shared/Image.jsx picks the right one via srcSet at runtime. This exists
 * because next/image used to do the resizing for us: several source images are
 * 7000px+ wide but render at ~150px, and the browser still has to decode every
 * one of those pixels (measured: 1212 ms of image decode on one navigation).
 *
 * Safe to re-run — existing, up-to-date variants are skipped.
 *
 *   node scripts/generate-image-variants.mjs
 */
import fs from "node:fs";
import path from "node:path";

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
const WIDTHS = [640, 1280, 1920];
const QUALITY = 80;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const files = walk(SRC).filter((f) => /\.(webp|png|jpe?g)$/i.test(f));

let made = 0;
let skipped = 0;
let srcBytes = 0;
let outBytes = 0;

for (const file of files) {
  const rel = path.relative(SRC, file);
  const dir = path.join(OUT, path.dirname(rel));
  const base = path.basename(rel).replace(/\.(webp|png|jpe?g)$/i, "");
  fs.mkdirSync(dir, { recursive: true });

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    console.log(`skip (unreadable): ${rel}`);
    continue;
  }

  srcBytes += fs.statSync(file).size;
  const srcMtime = fs.statSync(file).mtimeMs;

  for (const w of WIDTHS) {
    // Never upscale — a 400px source has no business becoming 1920px.
    if (meta.width && meta.width < w && w !== WIDTHS[0]) continue;

    const outFile = path.join(dir, `${base}-${w}.webp`);
    if (
      fs.existsSync(outFile) &&
      fs.statSync(outFile).mtimeMs >= srcMtime
    ) {
      outBytes += fs.statSync(outFile).size;
      skipped++;
      continue;
    }

    await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outFile);

    outBytes += fs.statSync(outFile).size;
    made++;
  }
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(
  `\nsources: ${files.length} files, ${mb(srcBytes)} MB` +
    `\nvariants: ${made} written, ${skipped} up-to-date, ${mb(outBytes)} MB total`
);

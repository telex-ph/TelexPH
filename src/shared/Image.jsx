/**
 * Drop-in replacement for `next/image`.
 *
 * Keeps the exact same prop surface used across the site so component markup
 * (and therefore the design) stays untouched. Next-only props that have no
 * meaning in a plain <img> are swallowed instead of leaking into the DOM.
 *
 * `next/image` also resized and re-encoded images on the fly. Losing that made
 * pages pull multi-megabyte originals (a single hero was 3.5 MB). Cloudinary —
 * which serves most of this site's uploads — can do the same work at the URL
 * level, so we re-add those transformations here.
 */

/** Widths we request from Cloudinary; also drives the srcSet. */
const WIDTHS = [640, 828, 1080, 1200, 1920];

/**
 * Widths that `scripts/generate-image-variants.mjs` produces for local files
 * under public/images/. Keep the two lists in sync.
 */
const LOCAL_WIDTHS = [640, 1280, 1920];

/**
 * Which local variants actually exist on disk, so we never point at a missing
 * file (the script skips upscales, so a small source has only the 640 variant).
 * Resolved at build time; the glob is erased from the bundle.
 */
const LOCAL_VARIANTS = new Set(
  Object.keys(import.meta.glob("/public/images-opt/**/*.webp", { eager: false }))
    .map((p) => p.replace("/public", ""))
);

const isCloudinary = (url) =>
  typeof url === "string" && url.includes("/upload/");

const isLocalImage = (url) =>
  typeof url === "string" && url.startsWith("/images/");

/** "/images/a/post4.webp" + 640 -> "/images-opt/a/post4-640.webp" */
const localVariant = (url, width) => {
  const base = url.replace(/^\/images\//, "").replace(/\.(webp|png|jpe?g)$/i, "");
  return `/images-opt/${base}-${width}.webp`;
};

/**
 * Injects Cloudinary delivery transforms after `/upload/`:
 *   f_auto  -> AVIF/WebP when the browser supports it
 *   q_auto  -> quality picked per-image
 *   w_<n>   -> resize to the width actually needed
 * Existing transforms are left alone so hand-tuned URLs keep working.
 */
export const cloudinaryUrl = (url, width, quality) => {
  // API records store some Cloudinary URLs as plain http://; on the HTTPS
  // site the browser blocks those as mixed content, so upgrade them here.
  url = url.replace(/^http:\/\//, "https://");
  const [head, ...tail] = url.split("/upload/");
  if (!tail.length) return url;
  const rest = tail.join("/upload/");

  // Already transformed (e.g. ".../upload/w_500,c_fill/...") — don't double up.
  if (/^(?:[a-z]{1,2}_[^/]+,?)+\//.test(rest)) return url;

  const parts = ["f_auto", `q_${quality || "auto"}`];
  if (width) parts.push(`w_${width}`, "c_limit");
  return `${head}/upload/${parts.join(",")}/${rest}`;
};

const Image = ({
  src,
  alt = "",
  width,
  height,
  fill,
  priority,
  quality,
  placeholder,
  blurDataURL,
  loader,
  unoptimized,
  sizes,
  style,
  className = "",
  ...rest
}) => {
  const resolvedSrc = typeof src === "object" && src !== null ? src.src : src;

  const useCloudinary = !unoptimized && isCloudinary(resolvedSrc);
  const useLocal = !unoptimized && isLocalImage(resolvedSrc);

  let finalSrc = resolvedSrc;
  let srcSet;

  if (useCloudinary) {
    finalSrc = cloudinaryUrl(resolvedSrc, width || 1200, quality);
    // Let the browser pick a size instead of always taking the largest.
    srcSet = WIDTHS.map(
      (w) => `${cloudinaryUrl(resolvedSrc, w, quality)} ${w}w`
    ).join(", ");
  } else if (useLocal) {
    // Only offer variants that were actually generated; fall back to the
    // original file when none exist so nothing 404s.
    const available = LOCAL_WIDTHS.filter((w) =>
      LOCAL_VARIANTS.has(localVariant(resolvedSrc, w))
    );
    if (available.length) {
      srcSet = available
        .map((w) => `${localVariant(resolvedSrc, w)} ${w}w`)
        .join(", ");
      finalSrc = localVariant(resolvedSrc, available.at(-1));
    }
  }

  const fillStyle = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }
    : style;

  return (
    <img
      src={finalSrc}
      srcSet={srcSet}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      /* Without an accurate `sizes` the browser assumes full viewport width and
         fetches the largest variant even for a thumbnail. Prefer an explicit
         prop, then the declared width. `fill` images have no intrinsic width,
         so cap them at half the viewport — they are decorative panels and
         slideshows here, not full-bleed heroes. Pass `sizes` to override. */
      sizes={
        sizes ||
        (srcSet ? (width ? `${width}px` : fill ? "50vw" : "100vw") : undefined)
      }
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={fillStyle}
      {...rest}
    />
  );
};

export default Image;

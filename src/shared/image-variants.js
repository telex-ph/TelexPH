/**
 * Naming rule for local image variants, shared by
 * scripts/generate-image-variants.mjs (writes the files) and
 * src/shared/Image.jsx (points srcSet at them), so the two can't drift.
 */
export const VARIANT_WIDTHS = [640, 1280, 1920];

/**
 * "a/post4.webp" + 640 -> "a/post4-webp-640.webp"
 *
 * The source extension stays in the name: services1.jpg and services1.webp are
 * different photos, and without it they overwrote each other's variants.
 */
export const variantName = (rel, width) =>
  `${rel.replace(/\.(webp|png|jpe?g)$/i, "-$1")}-${width}.webp`;

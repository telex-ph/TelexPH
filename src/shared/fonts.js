/**
 * Drop-in replacement for `next/font/google`.
 *
 * The real font files are loaded once via the <link> in index.html. These
 * factories exist purely so existing call sites like
 *
 *   const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins" });
 *   <nav className={poppins.variable}>
 *
 * keep working without touching the markup. `variable` maps to the Tailwind
 * font utility already defined in tailwind.config.js, and `className` applies
 * the family directly.
 */
const makeFont = (className) => () => ({
  className,
  variable: className,
  style: {},
});

export const Poppins = makeFont("font-poppins");
export const Open_Sans = makeFont("font-opensans");
export const Rubik = makeFont("font-rubik");
export const Barlow_Condensed = makeFont("font-barlow-condensed");

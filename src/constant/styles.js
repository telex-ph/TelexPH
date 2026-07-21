const COLORS = {
  primary: "#a10000",
  dark: "#282828",
  white: "#ffffff",
  black: "#000000",
  // NEW: Custom shades for feature and UI highlights
  primaryLight: "#fce5e5",
  primaryLightBorder: "#f0c4c4"
};
const SEMANTIC_COLORS = {
  text: {
    primary: COLORS.black,
    secondary: COLORS.dark,
    inverse: COLORS.white
  },
  background: {
    primary: COLORS.white,
    dark: COLORS.dark,
    accent: COLORS.primary,
    lightRed: COLORS.primaryLight
  },
  accent: COLORS.primary
};
const COLORS_RGB = {
  primary: "161, 0, 0",
  dark: "40, 40, 40",
  white: "255, 255, 255",
  black: "0, 0, 0",
  primaryLight: "252, 229, 229",
  primaryLightBorder: "240, 196, 196"
};
const getColorWithOpacity = (color, opacity) => {
  return `rgba(${COLORS_RGB[color]}, ${opacity})`;
};
const FONTS = {
  poppins: "var(--font-poppins), sans-serif",
  openSans: "var(--font-open-sans), sans-serif",
  rubik: "var(--font-rubik), sans-serif"
};
const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900
};
const TYPOGRAPHY = {
  heading: {
    fontFamily: FONTS.poppins,
    fontWeight: FONT_WEIGHTS.black
  },
  subheading: {
    fontFamily: FONTS.poppins,
    fontWeight: FONT_WEIGHTS.bold
  },
  emphasis: {
    fontFamily: FONTS.openSans,
    fontWeight: FONT_WEIGHTS.bold
  },
  body: {
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.regular
  }
};
const FONT_CLASSES = {
  poppinsBlack: "font-poppins-black",
  poppinsBold: "font-poppins-bold",
  openSansBold: "font-open-sans-bold",
  rubikRegular: "font-rubik-regular"
};
const LOGO_STYLES = {
  defaultLogoStyle: {
    opacity: 0.5,
    filter: "grayscale(10%)"
  },
  hoveredLogoStyle: {
    opacity: 1,
    filter: "grayscale(0%)"
  },
  baseLogoClasses: "w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out",
  enlargedSizeClasses: "h-[70px]",
  defaultSizeClasses: "h-[50px]"
};
const LOGO_IMAGE_CONFIG = {
  width: 200,
  height: 70
};
var stdin_default = {
  colors: COLORS,
  semanticColors: SEMANTIC_COLORS,
  colorsRgb: COLORS_RGB,
  fonts: FONTS,
  fontWeights: FONT_WEIGHTS,
  typography: TYPOGRAPHY,
  fontClasses: FONT_CLASSES
};
export {
  COLORS,
  COLORS_RGB,
  FONTS,
  FONT_CLASSES,
  FONT_WEIGHTS,
  LOGO_IMAGE_CONFIG,
  LOGO_STYLES,
  SEMANTIC_COLORS,
  TYPOGRAPHY,
  stdin_default as default,
  getColorWithOpacity
};

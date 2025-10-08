// @/constant/styles.ts

// ============================================
// COLORS (UPDATED)
// ============================================

export const COLORS = {
  primary: '#a10000',
  dark: '#282828',
  white: '#ffffff',
  black: '#000000',
  // NEW: Custom shades for the Feature Card
  primaryLight: '#fce5e5', 
  primaryLightBorder: '#f0c4c4',
} as const;

export type ColorKey = keyof typeof COLORS;

export const SEMANTIC_COLORS = {
  text: {
    primary: COLORS.black,
    secondary: COLORS.dark,
    inverse: COLORS.white,
  },
  background: {
    primary: COLORS.white,
    dark: COLORS.dark,
    accent: COLORS.primary,
    lightRed: COLORS.primaryLight,
  },
  accent: COLORS.primary,
} as const;

export const COLORS_RGB = {
  primary: '161, 0, 0',
  dark: '40, 40, 40',
  white: '255, 255, 255',
  black: '0, 0, 0',
  // NEW: Custom shades RGB
  primaryLight: '252, 229, 229', 
  primaryLightBorder: '240, 196, 196',
} as const;

/**
 * Helper function to get color with opacity
 */
export const getColorWithOpacity = (
  color: keyof typeof COLORS_RGB,
  opacity: number
): string => {
  return `rgba(${COLORS_RGB[color]}, ${opacity})`;
};

// ============================================
// FONTS
// ============================================

export const FONTS = {
  poppins: 'var(--font-poppins), sans-serif',
  openSans: 'var(--font-open-sans), sans-serif',
  rubik: 'var(--font-rubik), sans-serif',
} as const;

export type FontKey = keyof typeof FONTS;

export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const TYPOGRAPHY = {
  heading: {
    fontFamily: FONTS.poppins,
    fontWeight: FONT_WEIGHTS.black, 
  },
  subheading: {
    fontFamily: FONTS.poppins,
    fontWeight: FONT_WEIGHTS.bold,
  },
  
  emphasis: {
    fontFamily: FONTS.openSans,
    fontWeight: FONT_WEIGHTS.bold, 
  },
  
  body: {
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.regular, 
  },
} as const;

export const FONT_CLASSES = {
  poppinsBlack: 'font-poppins-black', 
  openSansBold: 'font-open-sans-bold', 
  rubikRegular: 'font-rubik-regular', 
} as const;


export default {
  colors: COLORS,
  semanticColors: SEMANTIC_COLORS,
  colorsRgb: COLORS_RGB,
  fonts: FONTS,
  fontWeights: FONT_WEIGHTS,
  typography: TYPOGRAPHY,
  fontClasses: FONT_CLASSES,
};

export const LOGO_STYLES = {
    // Kinopya ang iyong original CSS styles
    defaultLogoStyle: {
        opacity: 0.5, 
        filter: 'grayscale(10%)',
    } as React.CSSProperties,
    hoveredLogoStyle: {
        opacity: 1, 
        filter: 'grayscale(0%)', 
    } as React.CSSProperties,
    baseLogoClasses: 'w-auto object-contain cursor-pointer transition-all duration-300 ease-in-out',
    enlargedSizeClasses: 'h-[70px]', 
    defaultSizeClasses: 'h-[50px]', 
};

export const LOGO_IMAGE_CONFIG = {
    width: 200, 
    height: 70, 
};
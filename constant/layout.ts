// Container max width
export const DEFAULT_MAX_WIDTH_CLASS =
  "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

// Section height constraints
export const SECTION_HEIGHT = {
  hero: "min-h-[90vh] max-h-[850px]",
  standard: "min-h-[600px] max-h-[800px]",
  compact: "min-h-[500px] max-h-[650px]",
  full: "min-h-screen max-h-[1150px]",
} as const;

// Responsive height utilities
export const RESPONSIVE_HEIGHT = {
  hero: "h-[90vh] md:h-[100vh] max-h-[800px] md:max-h-[900px]",
  section: "min-h-[70vh] md:min-h-[80vh] max-h-[750px]",
  card: "min-h-[350px] max-h-[480px]",
} as const;
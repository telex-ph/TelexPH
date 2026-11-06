// Shapes for floating elements. Every path is drawn in a 0..100 box and stretched to the element's size.
// "rounded" is a <rect> (its corner radius is the element's `r`); "line" and "arrow-line" only have an outline.
export const SHAPES = {
  rect: { label: "Square", d: "M0 0H100V100H0Z" },
  rounded: { label: "Rounded", d: "" },
  circle: { label: "Circle", d: "M0 50a50 50 0 1 0 100 0a50 50 0 1 0 -100 0Z" },
  triangle: { label: "Triangle", d: "M50 0L100 100H0Z" },
  diamond: { label: "Diamond", d: "M50 0L100 50L50 100L0 50Z" },
  hexagon: { label: "Hexagon", d: "M25 3H75L100 50L75 97H25L0 50Z" },
  star: { label: "Star", d: "M50 2L61 38H98L68 60L79 96L50 74L21 96L32 60L2 38H39Z" },
  heart: { label: "Heart", d: "M50 92C20 68 4 50 4 30C4 15 15 6 28 6C38 6 46 12 50 20C54 12 62 6 72 6C85 6 96 15 96 30C96 50 80 68 50 92Z" },
  arrow: { label: "Arrow", d: "M0 30H60V5L100 50L60 95V70H0Z" },
  bubble: { label: "Speech", d: "M8 5H92Q98 5 98 11V62Q98 68 92 68H40L18 92L24 68H8Q2 68 2 62V11Q2 5 8 5Z" },
  line: { label: "Line", d: "M0 50H100", line: true },
  "arrow-line": { label: "Arrow line", d: "M0 50H92M80 36L96 50L80 64", line: true }
};

export const EMOJI = ["⭐", "✅", "🎉", "📣", "🏆", "❤️", "👍", "🔥", "💡", "📅", "📞", "📧", "📍", "🚀", "🎯", "💼", "🤝", "📈", "🌟", "🙌", "🎓", "🏅", "💬", "🔔"];

export const FONTS = {
  sans: { label: "Poppins", css: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif' },
  serif: { label: "Georgia", css: 'Georgia, "Times New Roman", serif' },
  display: { label: "Arial Black", css: '"Arial Black", Impact, sans-serif' },
  mono: { label: "Courier", css: '"Courier New", ui-monospace, monospace' },
  script: { label: "Script", css: '"Brush Script MT", "Segoe Script", cursive' }
};

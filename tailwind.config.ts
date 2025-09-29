import type { Config } from "tailwindcss";

// Import the required function from Tailwind's utility
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Define the stroke values for the custom utility
      textOutline: {
        "red-thin": "1px #ff4500",
        "red-thick": "2px #ff4500",
      },
    },
  },
  // 2. Add the custom plugin to generate the CSS utilities
  plugins: [
    plugin(function ({ addUtilities, theme, e }: any) {
      const textOutline = theme("textOutline", {});

      // Make utilities array with safe typing
      const utilities: Record<string, any>[] = Object.entries(textOutline).map(
        ([key, value]) => ({
          [`.text-outline-${e(key)}`]: {
            "-webkit-text-stroke": value,
          },
        })
      );

      // Add text fill transparent utility
      utilities.push({
        ".text-fill-transparent": {
          color: "transparent",
        },
      });

      addUtilities(utilities, ["responsive", "hover"]);
    }),
  ],
};

export default config;

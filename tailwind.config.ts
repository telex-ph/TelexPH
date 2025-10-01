// tailwind.config.ts

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";
// ------------------------

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // define ang font families
      fontFamily: {
        // Poppins (Default/Google Font)
        poppins: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans], 
        // Open Sans (Local Font)
        opensans: ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans],
        // Rubik (Local Font)
        rubik: ['var(--font-rubik)', ...defaultTheme.fontFamily.sans],
      },
      
      // Iyong text-outline configuration
      textOutline: {
        "thin": "1px #ff4500", 
        "thick": "2px #ff4500", 
        "white-2": "2px white", 
      },
    },
  },

  plugins: [
    // Iyong text-outline plugin (FINALLY FIXED)
    plugin(function ({ addUtilities, theme }) {
      const textOutline = theme("textOutline", {});
      
      // I-define ang type: Array of objects na may string keys
      const strokeUtilities: Record<string, any>[] = []; 

      for (const [key, value] of Object.entries(textOutline)) {
        strokeUtilities.push({
          [`.text-outline-${key}`]: {
            "-webkit-text-stroke": value, 
            "color": "transparent", 
          },
        });
      }

      addUtilities(strokeUtilities, ["responsive", "hover"]);
    }),
  ],
};

export default config;
// tailwind.config.ts

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";
// ------------------------

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/constant/**/*.{js,ts}",
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

      // ✅ Loading animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulseSlow 2s ease-in-out infinite',
        // 'progress': 'progressSlide 1.5s ease-in-out infinite, gradientShift 2s ease infinite', // COMMENTED OUT for ProgressProvider
        'logo-entrance': 'logoEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'logo-float-advanced': 'logoFloatAdvanced 4s ease-in-out infinite',
        'text-reveal': 'textReveal 1s ease-out 0.8s both',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'orbit-slow': 'orbitSpin 20s linear infinite',
        'orbit-reverse': 'orbitSpinReverse 15s linear infinite',
        'orbit-fast': 'orbitSpin 10s linear infinite',
        // 'glow-pulse': 'glowPulse 2s ease-in-out infinite', // COMMENTED OUT for ProgressProvider
        'float-1': 'floatParticle 6s ease-in-out infinite',
        'float-2': 'floatParticle 8s ease-in-out 1s infinite',
        'float-3': 'floatParticle 7s ease-in-out 2s infinite',
        'fade-in-delayed': 'fadeIn 0.8s ease-out 1.2s both',
        'bounce-dot-1': 'bounceDot 1.4s ease-in-out infinite',
        'bounce-dot-2': 'bounceDot 1.4s ease-in-out 0.2s infinite',
        'bounce-dot-3': 'bounceDot 1.4s ease-in-out 0.4s infinite',
      },

      // ✅ Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        // progressSlide: { // COMMENTED OUT for ProgressProvider
        //   '0%': { transform: 'translateX(-100%)' },
        //   '100%': { transform: 'translateX(400%)' },
        // },
        // gradientShift: { // COMMENTED OUT for ProgressProvider
        //   '0%, 100%': { backgroundPosition: '0% 50%' },
        //   '50%': { backgroundPosition: '100% 50%' },
        // },
        logoEntrance: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) rotate(-15deg)',
            filter: 'blur(10px)',
          },
          '60%': {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'blur(0px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) rotate(0deg)',
            filter: 'blur(0px)',
          },
        },
        logoFloatAdvanced: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg) scale(1)',
          },
          '25%': {
            transform: 'translateY(-12px) rotate(-2deg) scale(1.02)',
          },
          '50%': {
            transform: 'translateY(-8px) rotate(0deg) scale(1)',
          },
          '75%': {
            transform: 'translateY(-12px) rotate(2deg) scale(1.02)',
          },
        },
        textReveal: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
            letterSpacing: '0.1em',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
            letterSpacing: '0.35em',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.4',
            transform: 'scale(1.2)',
          },
        },
        orbitSpin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        orbitSpinReverse: {
          '0%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
        },
        // glowPulse: { // COMMENTED OUT for ProgressProvider
        //   '0%, 100%': {
        //     opacity: '0.3',
        //     transform: 'scale(0.95)',
        //   },
        //   '50%': {
        //     opacity: '0.6',
        //     transform: 'scale(1.05)',
        //   },
        // },
        floatParticle: {
          '0%, 100%': {
            transform: 'translate(0, 0)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'translate(20px, -30px)',
            opacity: '0.4',
          },
        },
        bounceDot: {
          '0%, 80%, 100%': {
            transform: 'scale(1)',
            opacity: '0.4',
          },
          '40%': {
            transform: 'scale(1.3)',
            opacity: '1',
          },
        },
      },

      // ✅ Background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },

  plugins: [
    // Iyong text-outline plugin
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
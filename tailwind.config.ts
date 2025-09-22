import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssForms from "@tailwindcss/forms";
import tailwindcssTypography from "@tailwindcss/typography";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "terminal-green": "hsl(var(--terminal-text))",
        "terminal-cyan": "hsl(var(--terminal-cyan))",
        // Intelligence context colors (placeholders)
        threat: "hsl(var(--terminal-red))",
        warning: "hsl(var(--terminal-gold))",
        secure: "#00ff00",
        unknown: "#808080",
        classified: "#ff00ff",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
      },
      keyframes: {
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glitch: {
          "0%": {
            transform: "translate(0)",
          },
          "20%": {
            transform: "translate(-2px, 2px)",
          },
          "40%": {
            transform: "translate(-2px, -2px)",
          },
          "60%": {
            transform: "translate(2px, 2px)",
          },
          "80%": {
            transform: "translate(2px, -2px)",
          },
          "100%": {
            transform: "translate(0)",
          },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "terminal-blink": "terminal-blink 1s infinite step-end",
        "scan-line": "scan-line 6s infinite linear",
        glitch: "glitch 0.5s infinite alternate",
        "matrix-rain": "matrix-rain 10s infinite linear",
      },
      boxShadow: {
        terminal: "0 0 5px hsl(var(--terminal-text)), 0 0 10px hsl(var(--terminal-text)), 0 0 15px hsl(var(--terminal-text))",
        cyber: "0 0 5px hsl(var(--terminal-cyan)), 0 0 10px hsl(var(--terminal-cyan)), 0 0 15px hsl(var(--terminal-cyan))",
        threat: "0 0 5px hsl(var(--terminal-red)), 0 0 10px hsl(var(--terminal-red)), 0 0 15px hsl(var(--terminal-red))",
      },
      dropShadow: {
        terminal: "0 0 5px hsl(var(--terminal-text))",
        cyber: "0 0 5px hsl(var(--terminal-cyan))",
        threat: "0 0 5px hsl(var(--terminal-red))",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssForms, tailwindcssTypography],
} satisfies Config;

export default config;
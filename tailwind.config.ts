import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
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
        "terminal-green": "#00ff88",
        "terminal-cyan": "#00ffff",
        // Intelligence context colors (placeholders)
        threat: "#ff0000",
        warning: "#ffff00",
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
        terminal: "0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88",
        cyber: "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff",
        threat: "0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000",
      },
      dropShadow: {
        terminal: "0 0 5px #00ff88",
        cyber: "0 0 5px #00ffff",
        threat: "0 0 5px #ff0000",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
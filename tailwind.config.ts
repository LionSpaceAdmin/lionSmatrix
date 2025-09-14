import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./agents/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/@lionspace/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        terminal: ["Space Mono", "monospace"],
        headline: ["Space Mono", "monospace"],
        body: ["Source Sans Pro", "system-ui", "sans-serif"],
        mono: ["Space Mono", "Courier New", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        terminal: {
          green: "#00ff88",
          cyan: "#00ffff",
          bg: "rgb(var(--terminal-bg))",
          secondary: "rgb(var(--terminal-secondary))",
          text: "rgb(var(--terminal-text))",
          gold: "rgb(var(--terminal-gold))",
          red: "rgb(var(--terminal-red))",
          border: "rgb(var(--terminal-border))",
          muted: "rgb(var(--terminal-muted))",
          success: "rgb(110, 231, 183)",
          warning: "rgb(var(--terminal-gold))",
          error: "rgb(var(--terminal-red))",
          info: "rgb(59 130 246)",
        },
        intelligence: {
            threat: 'hsl(var(--intelligence-threat))',
            warning: 'hsl(var(--intelligence-warning))',
            secure: 'hsl(var(--intelligence-secure))',
            unknown: 'hsl(var(--intelligence-unknown))',
            classified: 'hsl(var(--intelligence-classified))',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        terminal: "0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)",
        cyber: "0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)",
        threat: "0 0 12px rgba(255, 0, 0, 0.7), 0 0 25px rgba(255, 0, 0, 0.5)",
        "glow-cyan": "0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.2)",
        "glow-gold": "0 0 20px rgba(255, 183, 0, 0.3), 0 0 40px rgba(255, 183, 0, 0.2)",
        "glow-red": "0 0 20px rgba(255, 0, 0, 0.3), 0 0 40px rgba(255, 0, 0, 0.2)",
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.2)",
        "inner-glow": "inset 0 0 20px rgba(0, 255, 136, 0.1)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "terminal-blink": "terminal-blink 1.4s infinite both",
        "scan-line": "scan-line 10s linear infinite",
        "glitch": "glitch 0.5s linear infinite alternate-reverse",
        "matrix-rain": "matrix-rain 1.2s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "terminal-blink": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-3px, 3px)" },
          "40%": { transform: "translate(-3px, -3px)" },
          "60%": { transform: "translate(3px, 3px)" },
          "80%": { transform: "translate(3px, -3px)" },
          "100%": { transform: "translate(0)" },
        },
        "matrix-rain": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require("@tailwindcss/forms")],
}

export default config;

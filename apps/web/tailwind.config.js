/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./agents/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
      // Note: Font families are now configured in CSS using @theme directive
      // Keep this for backward compatibility with plugins
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
        // Note: Terminal colors are now configured in CSS using @theme directive
        // Keep this for backward compatibility with plugins
        terminal: {
          bg: "rgb(var(--terminal-bg))",
          secondary: "rgb(var(--terminal-secondary))", 
          text: "rgb(var(--terminal-text))",
          cyan: "rgb(var(--terminal-cyan))",
          gold: "rgb(var(--terminal-gold))",
          red: "rgb(var(--terminal-red))",
          border: "rgb(var(--terminal-border))",
          muted: "rgb(var(--terminal-muted))",
          green: "rgb(110, 231, 183)",
          success: "rgb(110, 231, 183)",
          warning: "rgb(var(--terminal-gold))",
          error: "rgb(var(--terminal-red))",
          info: "rgb(59 130 246)",
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
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 8s linear infinite",
        "data-flow": "dataFlow 3s ease-in-out infinite",
        "terminal-blink": "terminalBlink 1.5s step-end infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
        "status-ping": "statusPing 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "grid-fade": "gridFade 4s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
        // Progressive enhancement animations
        "stagger-fade": "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) var(--animation-delay, 0ms)",
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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        dataFlow: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        terminalBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        statusPing: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        gridFade: {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.06" },
        },
        glowPulse: {
          "0%": { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(110, 231, 183, 0.3), 0 0 40px rgba(110, 231, 183, 0.2)",
        "glow-gold": "0 0 20px rgba(255, 183, 0, 0.3), 0 0 40px rgba(255, 183, 0, 0.2)",
        "glow-red": "0 0 20px rgba(212, 63, 63, 0.3), 0 0 40px rgba(212, 63, 63, 0.2)",
        "inner-glow": "inset 0 0 20px rgba(110, 231, 183, 0.1)",
        terminal: "0 0 40px rgba(110, 231, 183, 0.05), inset 0 0 20px rgba(3, 7, 18, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "terminal-gradient":
          "linear-gradient(135deg, rgb(110, 231, 183) 0%, rgb(255, 183, 0) 50%, rgb(110, 231, 183) 100%)",
        "scan-line": "linear-gradient(180deg, transparent 0%, rgba(110, 231, 183, 0.1) 50%, transparent 100%)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.terminal.text"),
            "--tw-prose-headings": theme("colors.terminal.cyan"),
            "--tw-prose-links": theme("colors.terminal.cyan"),
            "--tw-prose-bold": theme("colors.terminal.text"),
            "--tw-prose-code": theme("colors.terminal.gold"),
            "--tw-prose-pre-bg": theme("colors.terminal.secondary"),
            "--tw-prose-quotes": theme("colors.terminal.muted"),
            "--tw-prose-hr": theme("colors.terminal.border"),
            "--tw-prose-bullets": theme("colors.terminal.cyan"),
            fontFamily: theme("fontFamily.body").join(", "),
            h1: { fontFamily: theme("fontFamily.headline").join(", ") },
            h2: { fontFamily: theme("fontFamily.headline").join(", ") },
            h3: { fontFamily: theme("fontFamily.headline").join(", ") },
            code: { fontFamily: theme("fontFamily.mono").join(", ") },
            pre: { fontFamily: theme("fontFamily.mono").join(", ") },
          },
        },
        invert: {
          css: {
            "--tw-prose-headings": theme("colors.terminal.cyan"),
            "--tw-prose-links": theme("colors.terminal.cyan"),
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
}

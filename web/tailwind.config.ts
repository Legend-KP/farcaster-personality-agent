import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16131f",
        surface: "#1e1a2b",
        "surface-2": "#241f34",
        paper: "#f3efe7",
        muted: "#9890a8",
        amber: {
          DEFAULT: "#e7a33e",
          dim: "#a9793a",
        },
        peri: "#7c8cf5",
        line: "rgba(243,239,231,0.12)",
        "line-strong": "rgba(243,239,231,0.22)",
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1120px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;

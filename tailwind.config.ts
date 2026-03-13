import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        accent:     "#c20000",
        "accent2":  "#a50000",
        "accent-l": "#f5a0a0",
        "accent-xl":"#fff0f0",
        navy:       "#1B2B4B",
        t1:         "#0D0D14",
        t2:         "#5A5A72",
        t3:         "#9898AB",
        border:     "#E8E0D8",
        "bg-base":  "#FFFFFF",
        "bg-2":     "#F0EEE9",
        green:      "#10B981",
      },
    },
  },
  plugins: [],
};

export default config;

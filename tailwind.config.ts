import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        accent: "#6C47FF",
        "accent-l": "#EDE9FF",
        "accent-xl": "#F5F2FF",
        navy: "#1B2B4B",
        t1: "#0D0D14",
        t2: "#5A5A72",
        t3: "#9898AB",
        border: "#E4E3EF",
        "bg-base": "#FAFAFA",
        "bg-2": "#F3F2F8",
        green: "#10B981",
      },
    },
  },
  plugins: [],
};

export default config;

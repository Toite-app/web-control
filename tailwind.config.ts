import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TOITE_CONFIG = require("./src/toite.config.ts");

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: TOITE_CONFIG.theme.colors.primary,
        secondary: TOITE_CONFIG.theme.colors.secondary,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};

export default config;

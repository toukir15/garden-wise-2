import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          sm: "100%",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

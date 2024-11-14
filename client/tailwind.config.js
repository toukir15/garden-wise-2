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
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            h1: {
              color: '#E5E7EB',
              "margin-top": "8px",
              "margin-bottom": "8px",
              padding: "0px"
            },
            h2: {
              color: '#fff',
              "margin-top": "8px",
              "margin-bottom": "8px",
              padding: "0px"
            },
            h3: {
              color: '#fff',
              "margin-top": "4px",
              "margin-bottom": "4px",
              padding: "0px"
            },
            p: {
              color: '#E5E7EB',
              "margin-top": "8px",
              "margin-bottom": "8px"
            },
            ol: {
              color: '#E5E7EB',
              "margin-bottom": "0px",
              "margin-top": "0px",
            },
            strong: {
              color: '#fff',
            },
            li: {
              color: '#E5E7EB',
              "margin-bottom": "0px",
              "margin-top": "0px",
            },
            ul: {
              color: '#E5E7EB',
              "margin-bottom": "8px",
              "margin-top": "8px",
            },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require('@tailwindcss/typography')
  ],
};

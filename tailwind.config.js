import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#196539',
        secondary: '#1a7a45',
        accent: '#196539',
        dark: '#196539',
        darker: '#134d2c',
        light: '#f7efdd',
        glass: 'rgba(247, 239, 221, 0.05)',
        'glass-border': 'rgba(25, 101, 57, 0.1)',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

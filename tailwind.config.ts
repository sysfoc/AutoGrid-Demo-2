import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional blue color scheme with perfect contrast
        primary: {
          DEFAULT: '#2563eb',  // Professional blue (buttons, links, brand)
          hover: '#1d4ed8',    // Darker blue for hover state
          light: '#eff6ff',   // Light blue backgrounds, secondary buttons
        },
        
        text: {
          DEFAULT: '#111827',  // Rich dark text for better readability
          secondary: '#6b7280', // Balanced gray for secondary text
          inverse: '#ffffff',   // Text on dark/blue backgrounds
        },
        
        background: {
          DEFAULT: '#ffffff',  // Clean white background
          secondary: '#f9fafb', // Subtle gray for cards, sections
          dark: '#111827',     // Professional dark mode background
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    function({ addBase }: { addBase: any }) {
      addBase({
        ':root': {
          '--primary': '#2563eb',
          '--primary-hover': '#1d4ed8',
          '--primary-light': '#eff6ff',
          '--text': '#111827',
          '--text-secondary': '#6b7280',
          '--text-inverse': '#ffffff',
          '--bg': '#ffffff',
          '--bg-secondary': '#f9fafb',
        },
        '.dark': {
          '--primary': '#3b82f6',      // Slightly lighter blue for dark mode visibility
          '--primary-hover': '#2563eb',
          '--primary-light': '#1e3a8a', // Dark blue for dark mode backgrounds
          '--text': '#f9fafb',
          '--text-secondary': '#d1d5db',
          '--text-inverse': '#111827',
          '--bg': '#111827',
          '--bg-secondary': '#374151',
        },
      })
    }
  ],
};

export default config;
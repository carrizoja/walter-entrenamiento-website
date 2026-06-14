/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector', // Tailwind v4 uses 'selector' instead of 'class'
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#701D2A',
          dark: '#3A0C13',
        },
        secondary: {
          DEFAULT: '#8C2A3B',
          light: '#C56C7A',
        },
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#C83B08',
        },
        blue: {
          DEFAULT: '#3A86FF',
          dark: '#124BA6',
        },
      },
    },
  },
  plugins: [],
};

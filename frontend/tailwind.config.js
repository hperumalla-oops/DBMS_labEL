/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'math-black': '#000000',
        'math-gray': '#1a1a1a',
        'math-border': '#333333',
      }
    },
  },
  plugins: [],
}
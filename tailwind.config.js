/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        PrimeNearshore: "#4f156c",
        PrimeNearshoreHover: "#6d1b96",
        PrimeNearshoreLighter: "#8a22bf"
      }
    },
  },
  plugins: [],
}
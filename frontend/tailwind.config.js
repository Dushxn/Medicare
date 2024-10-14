/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#D3EEFF',
        primaryGray: '#6D6D6D',
        secondaryGray: '#EFEFEF',
      },
    },
  },
  plugins: [],
}
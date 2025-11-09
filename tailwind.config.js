/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1E8',
        sage: '#A8C69F',
        moss: '#7A9B76',
        sand: '#E8DCC4',
        terracotta: '#D4A574',
      },
    },
  },
  plugins: [],
}

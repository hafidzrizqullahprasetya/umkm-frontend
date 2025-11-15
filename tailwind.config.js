/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        orange: 'var(--orange)',
        cream: 'var(--cream)',
        dark: 'var(--dark)',
        white: 'var(--white)',
      },
    },
  },
  plugins: [],
}
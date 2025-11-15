/** @type {import('tailwindcss').Config} */
export default {
  //presets: [require('tailwindcss/preset')],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#fff',
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        cyan: {
          400: '#22d3ee',
        },
      },
    },
  },
  // corePlugins: {
  //   textColor: true,
  //   backgroundColor: true,
  // },
  plugins: [],
}

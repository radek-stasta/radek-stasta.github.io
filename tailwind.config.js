/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'code-background': 'url("/images/code-background-nord.png")',
      },
    },
  },
  plugins: [
    createThemes({
      nord: {
        transparent: 'transparent',
        white: '#eceff4',
        red: '#bf616a',
      },
    }),
  ],
};

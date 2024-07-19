/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "code-background": "url('/img/code-background.jpg')",
      },
    },
  },
  plugins: [],
};

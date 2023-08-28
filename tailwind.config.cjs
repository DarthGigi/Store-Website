/** @type {import('tailwindcss').Config} */
const forms = require('@tailwindcss/forms');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [forms]
};

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const forms = require('@tailwindcss/forms');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sftext: ['SF Pro Text', ...defaultTheme.fontFamily.sans],
        sfdisplay: ['SF Pro Display', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [forms]
};

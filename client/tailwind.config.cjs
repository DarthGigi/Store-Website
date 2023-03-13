/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "../server/server.js"],
  theme: {
    extend: {
      fontFamily: {
        sftext: ["SF Pro Text", "Helvetica Neue", "Helvetica", ...defaultTheme.fontFamily.sans],
        sfdisplay: ["SF Pro Display", "Helvetica Neue", "Helvetica", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};

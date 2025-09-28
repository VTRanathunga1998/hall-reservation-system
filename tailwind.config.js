/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        HRSPurple: "#CFCEFF",
        HRSPurpleLight: "#F1F0FF",
        HRSYellow: "#FAE27C",
        HRSYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};

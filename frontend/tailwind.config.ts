/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#258cf4",
        "secondary-yellow": "#FFD600",
      },
      fontFamily: {
        display: ["Cairo", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

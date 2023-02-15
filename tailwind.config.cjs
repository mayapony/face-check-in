/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "login-page": "url('/background.svg')",
      },
    },
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};

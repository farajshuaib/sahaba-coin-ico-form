/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.tsx",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#5092F5",
        "telegram": "#0088cc"
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: "#071341",
        ink: "#171717",
        surface: "#F8FAFC",
      },
      borderRadius: {
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

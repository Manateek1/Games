/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        arcade: "0 24px 60px -28px rgba(71, 255, 238, 0.45)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004085", // Deep Blue
        secondary: "#007bff", // Bright Blue
        dark: "#343a40", // Dark Gray
        light: "#f8f9fa", // Light Gray
        success: "#28a745" // Green button color from reference
      }
    },
  },
  plugins: [],
}

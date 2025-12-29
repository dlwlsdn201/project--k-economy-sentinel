/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-safe': '#22c55e',      // green-500
        'status-warning': '#eab308',   // yellow-500
        'status-danger': '#ef4444',    // red-500
      },
    },
  },
  plugins: [],
}


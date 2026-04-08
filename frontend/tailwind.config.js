/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "system-ui", "sans-serif"],
        mono:  ["'DM Mono'", "monospace"],
      },
      colors: {
        accent: "var(--accent)",
        ink:    "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        surface: "var(--surface)",
        border:  "var(--border)",
        danger:  "var(--danger)",
        success: "var(--success)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        xl: "20px",
        "2xl": "28px",
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,ts}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#630ed4",
        "primary-container": "#7c3aed",
        "secondary-container": "#fed01b",
        "secondary-fixed": "#ffe083",
        "secondary-fixed-dim": "#eec200",
        "secondary": "#735c00",
        "tertiary-container": "#1e7451",
        "tertiary": "#005a3b",
        "background": "#fcf9f8",
        "surface-bright": "#fcf9f8",
        "surface-dim": "#dcd9d9",
        "on-tertiary-container": "#a4f7ca",
        "inverse-on-surface": "#f3f0ef",
        "error-container": "#ffdad6",
        "on-tertiary-fixed": "#002113",
        "surface-container": "#f0eded",
        "on-background": "#1c1b1b",
        "on-primary-fixed-variant": "#5a00c6",
        "error": "#ba1a1a",
        "outline": "#7b7487",
        "primary-fixed-dim": "#d2bbff",
        "on-secondary": "#ffffff",
        "primary-fixed": "#eaddff",
        "on-error": "#ffffff",
        "surface-variant": "#e5e2e1",
        "on-secondary-fixed": "#231b00",
        "on-secondary-fixed-variant": "#574500",
        "surface": "#fcf9f8",
        "on-surface": "#1c1b1b",
        "surface-container-low": "#f6f3f2",
        "tertiary-fixed-dim": "#86d7ac",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#25005a",
        "on-tertiary-fixed-variant": "#005235",
        "on-surface-variant": "#4a4455",
        "surface-container-highest": "#e5e2e1",
        "surface-container-lowest": "#ffffff",
        "on-error-container": "#93000a",
        "surface-container-high": "#eae7e7",
        "on-primary": "#ffffff",
        "inverse-surface": "#313030",
        "inverse-primary": "#d2bbff",
        "on-primary-container": "#ede0ff",
        "tertiary-fixed": "#a1f4c7",
        "surface-tint": "#732ee4",
        "outline-variant": "#ccc3d8",
        "on-secondary-container": "#6f5900"
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'geometric-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23630ed4\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ]
}


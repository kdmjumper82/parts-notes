/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ft: {
          pink: '#fff1e5',
          cream: '#fef9f0',
          blue: '#0f5499',
          'dark-blue': '#094470',
          red: '#990f3d',
          purple: '#593380',
          teal: '#0d7680',
          green: '#4a7c59',
          text: '#33302e',
          border: '#cec6b9',
        }
      },
      fontFamily: {
        serif: ['FinancierDisplayWeb', 'Georgia', 'serif'],
        sans: ['MetricWeb', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

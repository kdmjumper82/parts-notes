/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ft-cream': '#FFF1E0',
        'ft-blue': '#2E5F8A',
        'ft-red': '#A84E5C',
        'ft-purple': '#8B4A6F',
        'ft-gray': '#6B7C93',
        'ft-teal': '#4A7C8B',
        'ft-brown': '#8B6B4A',
      },
    },
  },
  plugins: [],
}

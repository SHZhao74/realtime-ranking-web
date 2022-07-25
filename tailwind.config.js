/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  theme: {
    // borderWidth: {},
  },
  daisyui: {
    themes: {
      vic: {
        primary: '#a991f7',
        secondary: '#f6d860',
        accent: '#37cdbe',
        neutral: '#454545',
        'base-100': '#ffffff',
      },
    },
  },
};

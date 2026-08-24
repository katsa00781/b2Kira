const palette = require('./constants/palette.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        'baloo-bold': ['Baloo2_700Bold'],
        'baloo-extrabold': ['Baloo2_800ExtraBold'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
};

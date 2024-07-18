// tailwind.config.js
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        violet: {
          DEFAULT: '#5C3B7C',
          light: '#8E6EAE',
          dark: '#2A184E',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

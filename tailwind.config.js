/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/newline-after-import, import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');
delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

module.exports = {
  darkMode: 'class',
  //purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        ...colors,
        homepageIcon: '#225da5',
        accent: colors.fuchsia['400'],
        'green-custom': '#64ffda',
        'green-custom-highlighted': '#51a27f',
      },
    },
    animation: {
      type: 'type 2.7s ease-out .8s infinite alternate both',
      animation: 'bounce 0.5s infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    },
    keyframes: {
      type: {
        '0%': { transform: 'translateX(0ch)' },
        '5%, 10%': { transform: 'translateX(1ch)' },
        '15%, 20%': { transform: 'translateX(2ch)' },
        '25%, 30%': { transform: 'translateX(3ch)' },
        '35%, 40%': { transform: 'translateX(4ch)' },
        '45%, 50%': { transform: 'translateX(5ch)' },
        '55%, 60%': { transform: 'translateX(6ch)' },
        '65%, 70%': { transform: 'translateX(7ch)' },
        '75%, 80%': { transform: 'translateX(8ch)' },
        '85%, 90%': { transform: 'translateX(9ch)' },
        '95%, 100%': { transform: 'translateX(11ch)' },
      },
    },
  },
  plugins: ['@emotion/babel-plugin', 'babel-plugin-macros'],
};

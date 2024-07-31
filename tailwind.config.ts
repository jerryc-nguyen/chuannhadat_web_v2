const konstaConfig = require('konsta/config');

const config = konstaConfig({
  darkMode: 'false',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/mobile/**/*.{js,ts,jsx,tsx,mdx}',
    './src/desktop/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
export default config;

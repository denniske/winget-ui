module.exports = {
  mode: 'jit',
  purge: [
      "./renderer/*.{js,ts,jsx,tsx}",
      "./renderer/components/*.{js,ts,jsx,tsx}",
      "./renderer/data/*.{js,ts,jsx,tsx}",
      "./renderer/helper/*.{js,ts,jsx,tsx}",
      "./renderer/pages/**/*.{js,ts,jsx,tsx}",
      "./renderer/public/*.{js,ts,jsx,tsx}",
      "./renderer/state/*.{js,ts,jsx,tsx}",
      "./renderer/styles/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
};

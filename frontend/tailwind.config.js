module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
     ...theme('colors'),
     'primary': '#4B5563',
     'secondary': '#ffed4a',
     'danger': '#e3342f',
    }),
    textColor: theme => ({
      ...theme('colors'),
      'primary': '#444',
      'secondary': '#ffed4a',
      'danger': '#e3342f',
     })

  },
  variants: {
    extend: {},
  },
  plugins: [],
}


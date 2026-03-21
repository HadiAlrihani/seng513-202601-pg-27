export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        italiana: ['Italiana', 'sans-serif'],
      },
      screens: {
        // wide BUT short (landscape phones, small windows)
        'md-short': {
          raw: '(min-width: 768px) and (max-height: 500px)',
        },
        'md-tall': {
          raw: '(min-width: 768px) and (min-height: 600px)',
        }
      }
    },
  },
  plugins: [],
}


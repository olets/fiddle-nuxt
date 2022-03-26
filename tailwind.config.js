const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "app.vue",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      animation: {
        'slide': 'slide 16s linear',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.animation-pause': {
          animationPlayState: 'paused'
        },
      })
    })
  ],
};
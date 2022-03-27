const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

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
        slide: "slide 16s linear",
      },
      borderWidth: {
        12: "12px",
        20: "20px",
      },
      colors: {
        link: {
          ...colors.blue,
          DEFAULT: colors.blue["500"],
        },
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".animation-pause": {
          animationPlayState: "paused",
        },
      });
    }),
  ],
};

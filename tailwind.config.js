module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js", "./lib/**/*.js"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: null,
          },
        },
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        "gray/100": "#f4f4f5",
        "gray/200": "#e4e4e7",
        "gray/500": "#71717a",
      },
      fontFamily: {
        "helvetica-neue": "Helvetica Neue",
      },
      boxShadow: {
        menu: "20px 20px 40px rgba(0, 0, 0, 0.25)",
      },
      width: {
        "40%": "40%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

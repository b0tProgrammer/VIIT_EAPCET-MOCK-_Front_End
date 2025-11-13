export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "scroll-left": "scroll-left 30s linear infinite",
      },
    },
  },
  plugins: [],
};

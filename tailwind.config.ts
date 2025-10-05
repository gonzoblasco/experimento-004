import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C4A8B",
          dark: "#54356C"
        },
        accent: "#F4A261"
      }
    }
  },
  plugins: []
};

export default config;

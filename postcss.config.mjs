const config = {
  plugins: {
    "@tailwindcss/postcss": {
      darkMode: "class",
      content: [
        "./app/**/*.{js,jsx,ts,tsx,mdx}",
        "./components/**/*.{js,jsx,ts,tsx,mdx}",
        "./pages/**/*.{js,jsx,ts,tsx,mdx}",
      ],
    },
  },
};

export default config;

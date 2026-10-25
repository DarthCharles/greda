module.exports = {
  plugins: [
    require("tailwindcss")(),
    require("./scripts/scope-tailwind-defaults.cjs")(),
    require("autoprefixer")(),
  ],
};

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";
import { colors, theme } from "./src/styles/tailwind-theme";

const spacing = Object.fromEntries(
  Object.entries(defaultTheme.spacing).map(([key, value]) => [
    key,
    Number.isFinite(Number(key))
      ? `var(--space-${key.replace(
          ".",
          "-"
        )}, calc(var(--spacing-unit) * ${key}))`
      : value,
  ])
);
export default {
  content: ["./src/components/ui/**/*.{ts,tsx}"],
  // Derive the public color utilities from the same mapping as the theme.
  safelist: Object.keys(colors).flatMap((name) =>
    ["bg", "text", "border"].flatMap((utility) =>
      ["", "hover:", "focus:", "focus-visible:"].map(
        (state) => `${state}${utility}-${name}`
      )
    )
  ),
  darkMode: ["class", '[data-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: { ...theme, spacing },
  plugins: [animate],
} satisfies Config;

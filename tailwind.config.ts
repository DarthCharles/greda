import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";
import { colorUtilities, roleColors, theme } from "./src/styles/tailwind-theme";

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
  safelist: colorUtilities.flatMap((utility) =>
    ["", "hover:", "focus:", "focus-visible:"].map(
      (state) => `${state}${utility}`
    )
  ),
  darkMode: ["class", '[data-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: { ...theme, spacing },
  plugins: [
    animate,
    plugin(({ matchUtilities }) => {
      matchUtilities(
        { surface: (value) => ({ backgroundColor: value }) },
        { values: roleColors("surface"), type: "color" }
      );
    }),
  ],
} satisfies Config;

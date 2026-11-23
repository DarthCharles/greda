import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";
import {
  namedSpacingSteps,
  namedSpacingUtilities,
  negativeNamedSpacingUtilities,
} from "./src/styles/spacing";
import { colorUtilities, roleColors, theme, typographyUtilities } from "./src/styles/tailwind-theme";

const spacing = Object.fromEntries(
  Object.entries(defaultTheme.spacing).map(([key, value]) => [
    key,
    Number.isFinite(Number(key))
      ? `calc(var(--spacing-unit) * ${key})`
      : value,
  ])
);
const namedSpacing = Object.fromEntries(
  namedSpacingSteps.map((step) => [step, `var(--space-${step})`])
);
const defaultTranslate = defaultTheme.translate;
const namedSiblingSpacing = (axis: "x" | "y", value: string) => {
  const reverse = `var(--tw-space-${axis}-reverse)`;
  const direction = axis === "x" ? "inline" : "block";
  return {
    ":where(& > :not(:last-child))": {
      [`--tw-space-${axis}-reverse`]: "0",
      [`margin-${direction}-start`]: `calc(${value} * ${reverse})`,
      [`margin-${direction}-end`]: `calc(${value} * (1 - ${reverse}))`,
    },
  };
};

export default {
  content: ["./src/components/ui/**/*.{ts,tsx}"],
  // Derive the public utilities from the same mappings as the theme.
  safelist: [
    ...namedSpacingUtilities.flatMap((utility) => namedSpacingSteps.map((step) => `${utility}-${step}`)),
    ...negativeNamedSpacingUtilities.flatMap((utility) => namedSpacingSteps.map((step) => `-${utility}-${step}`)),
    "space-x-reverse",
    "space-y-reverse",
    ...Object.keys(typographyUtilities),
    ...colorUtilities.flatMap((utility) =>
      ["", "hover:", "focus:", "focus-visible:"].map((state) => `${state}${utility}`)
    ),
  ],
  darkMode: ["class", '[data-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    ...theme,
    spacing: { ...spacing, ...namedSpacing },
    space: spacing,
    translate: (utils) => {
      const translate = typeof defaultTranslate === "function" ? defaultTranslate(utils) : defaultTranslate;
      return Object.fromEntries(
        Object.entries(translate ?? {}).filter(([step]) => !namedSpacingSteps.includes(step))
      );
    },
    extend: {
      ...theme.extend,
      // Tailwind 3's container widths override spacing keys by default.
      maxWidth: namedSpacing,
    },
  },
  plugins: [
    animate,
    plugin(({ addBase, addComponents, addUtilities, matchUtilities }) => {
      // Match Tailwind 4's properties and child selector for named utilities so
      // a layered consumer build applies each translation and sibling gap once.
      const translationDefault = { syntax: '"*"', inherits: "false", initialValue: "0px" };
      addBase({
        "@property --greda-translate-x": translationDefault,
        "@property --greda-translate-y": translationDefault,
      });
      const translate = "var(--greda-translate-x, 0px) var(--greda-translate-y, 0px)";
      addUtilities({
        ...Object.fromEntries(
          Object.entries(namedSpacing).flatMap(([step, value]) => {
            const lengths = [["", value], ["-", `calc(${value} * -1)`]];
            return lengths.flatMap(([prefix, length]) => [
              [`.${prefix}translate-x-${step}`, { "--greda-translate-x": length, translate }],
              [`.${prefix}translate-y-${step}`, { "--greda-translate-y": length, translate }],
              [`.${prefix}space-x-${step}`, namedSiblingSpacing("x", length)],
              [`.${prefix}space-y-${step}`, namedSiblingSpacing("y", length)],
            ]);
          })
        ),
        ":where(.space-x-reverse > :not(:last-child))": { "--tw-space-x-reverse": "1" },
        ":where(.space-y-reverse > :not(:last-child))": { "--tw-space-y-reverse": "1" },
      });
      // The animation plugin prepends a minus sign, which cannot negate var().
      addUtilities(Object.fromEntries(
        Object.entries(namedSpacing).flatMap(([step, value]) => [
          [`.slide-in-from-top-${step}`, { "--tw-enter-translate-y": `calc(${value} * -1)` }],
          [`.slide-in-from-bottom-${step}`, { "--tw-enter-translate-y": value }],
          [`.slide-in-from-left-${step}`, { "--tw-enter-translate-x": `calc(${value} * -1)` }],
          [`.slide-in-from-right-${step}`, { "--tw-enter-translate-x": value }],
        ])
      ));
      // Tables using an axis utility can sit outside Greda's scoped defaults.
      const borderSpacing = "var(--tw-border-spacing-x, 0px) var(--tw-border-spacing-y, 0px)";
      addUtilities(Object.fromEntries(namedSpacingSteps.flatMap((step) => [
        [`.border-spacing-x-${step}`, { borderSpacing }],
        [`.border-spacing-y-${step}`, { borderSpacing }],
      ])));
      // Before ordinary utilities, so font-medium, leading-* and other local
      // adjustments can override an individual part of a complete role.
      addComponents(Object.fromEntries(
        Object.entries(typographyUtilities).map(([name, style]) => [`.${name}`, style])
      ));
      matchUtilities(
        { surface: (value) => ({ backgroundColor: value }) },
        { values: roleColors("surface"), type: "color" }
      );
    }),
  ],
} satisfies Config;

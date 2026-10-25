import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;
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
  prefix: "ds-",
  darkMode: ["class", '[data-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    spacing,
    fontFamily: {
      sans: ["var(--font-sans)"],
      heading: ["var(--font-heading)"],
    },
    fontSize: {
      xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height)" }],
      sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height)" }],
      base: ["var(--font-size-md)", { lineHeight: "var(--line-height)" }],
      lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height)" }],
    },
    fontWeight: {
      medium: "var(--font-weight-medium)",
      semibold: "var(--font-weight-bold)",
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-lg)",
      full: "var(--radius-full)",
    },
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        card: { DEFAULT: color("card"), foreground: color("card-foreground") },
        popover: {
          DEFAULT: color("popover"),
          foreground: color("popover-foreground"),
        },
        primary: {
          DEFAULT: color("primary"),
          foreground: color("primary-foreground"),
          hover: color("primary-hover"),
        },
        secondary: {
          DEFAULT: color("secondary"),
          foreground: color("secondary-foreground"),
        },
        muted: {
          DEFAULT: color("muted"),
          foreground: color("muted-foreground"),
        },
        accent: {
          DEFAULT: color("accent"),
          foreground: color("accent-foreground"),
        },
        destructive: {
          DEFAULT: color("destructive"),
          foreground: color("destructive-foreground"),
        },
        border: color("border"),
        input: color("input"),
        ring: color("ring"),
        overlay: "hsl(var(--overlay))",
      },
      zIndex: {
        overlay: "var(--z-overlay)",
        popover: "var(--z-popover)",
        toast: "var(--z-toast)",
      },
      borderWidth: { DEFAULT: "var(--border-width)" },
      ringWidth: { 1: "var(--focus-width)", 2: "var(--focus-width)" },
      ringOffsetWidth: { 2: "var(--focus-offset)" },
      maxWidth: { lg: "var(--dialog-width)" },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow)",
        lg: "var(--shadow-dialog)",
      },
      opacity: { disabled: "var(--disabled-opacity)" },
      transitionDuration: { DEFAULT: "var(--duration)" },
    },
  },
  plugins: [animate],
} satisfies Config;

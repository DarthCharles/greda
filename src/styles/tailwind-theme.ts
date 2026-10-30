import type { Config } from "tailwindcss";

// Complete typographic roles shared by compiled CSS and Tailwind 4 utilities.
export const typographyRoles = {
  "text-display": "display",
  "text-title": "title",
  "text-body": "body",
  "text-label": "label",
  "text-caption": "caption",
  "text-eyebrow": "eyebrow",
} as const;

export const typographyUtilities = Object.fromEntries(
  Object.entries(typographyRoles).map(([utility, role]) => [utility, {
    fontFamily: `var(--type-${role}-family)`,
    fontSize: `var(--type-${role}-size)`,
    fontWeight: `var(--type-${role}-weight)`,
    lineHeight: `var(--type-${role}-leading)`,
    letterSpacing: `var(--type-${role}-tracking)`,
  }])
);

// Shared by Greda's compiled utilities and its Tailwind 4 token integration.
const colorTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "accent",
  "accent-foreground",
  "primary",
  "primary-foreground",
  "primary-hover",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "destructive",
  "destructive-foreground",
  "overlay",
];

export const colors = Object.fromEntries(
  colorTokens.map((name) => [
    name,
    name === "overlay"
      ? "hsl(var(--overlay))"
      : `hsl(var(--${name}) / <alpha-value>)`,
  ])
);

// These names describe roles within a category, independently of brand colors.
export const colorRoles = {
  surface: ["primary", "secondary", "tertiary", "raised", "inverse"],
  text: ["primary", "secondary", "muted", "inverse", "action"],
  border: ["primary", "secondary", "inverse", "action"],
};

export function roleColors(category: keyof typeof colorRoles) {
  // matchUtilities handles surface opacity itself; built-in color plugins
  // resolve their <alpha-value> placeholder through Tailwind's color helpers.
  const alpha = category === "surface" ? "" : " / <alpha-value>";
  return Object.fromEntries(
    colorRoles[category].map((name) => [
      name,
      `hsl(var(--${category}-${name})${alpha})`,
    ])
  );
}

export const colorUtilities = [
  ...Object.keys(colors).flatMap((name) =>
    ["bg", "text", "border"].map((utility) => `${utility}-${name}`)
  ),
  ...Object.entries(colorRoles).flatMap(([category, names]) =>
    names.map((name) => `${category}-${name}`)
  ),
];

export const theme = {
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
    colors,
    textColor: roleColors("text"),
    borderColor: roleColors("border"),
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
} satisfies Config["theme"];

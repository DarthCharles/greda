import css from "../../styles/tokens.css?raw";

export type TokenKind =
  | "color"
  | "font"
  | "fontSize"
  | "weight"
  | "leading"
  | "tracking"
  | "spacing"
  | "radius"
  | "border"
  | "width"
  | "shadow"
  | "focus"
  | "opacity"
  | "duration"
  | "layer";
export type TokenGroup =
  | "Palette"
  | "Surfaces"
  | "Text colors"
  | "Border colors"
  | "Typography"
  | "Spacing"
  | "Shape & elevation"
  | "Sizing & states";
export interface DesignToken {
  name: string;
  base: string;
  kind: TokenKind;
  group: TokenGroup;
  description: string;
  dark?: string;
}

function classify(name: string): [TokenKind, TokenGroup, string] | undefined {
  if (name.startsWith("--type-")) {
    const kinds: Partial<Record<string, TokenKind>> = {
      family: "font", size: "fontSize", weight: "weight",
      leading: "leading", tracking: "tracking",
    };
    const kind = kinds[name.split("-").pop() ?? ""];
    if (kind) return [kind, "Typography", "One property of a complete typography role. Override it on a theme boundary."];
  }
  if (name.startsWith("--base-"))
    return ["color", "Palette", "A generic base color. Override this value to customize the theme."];
  if (name.startsWith("--surface-"))
    return ["color", "Surfaces", "A surface role, independent of brand colors."];
  if (name.startsWith("--text-"))
    return ["color", "Text colors", "A text role, independent of surfaces and borders."];
  if (name.startsWith("--border-") && name !== "--border-width")
    return ["color", "Border colors", "A border role, independent of surfaces and text."];
  if (name.startsWith("--space-") || name === "--spacing-unit")
    return [
      "spacing",
      "Spacing",
      name === "--spacing-unit"
        ? "The base unit used to calculate the spacing scale."
        : "Use for padding, margins, gaps, and control dimensions.",
    ];
  if (name === "--font-sans" || name === "--font-heading")
    return [
      "font",
      "Typography",
      name === "--font-heading"
        ? "Typeface for component headings."
        : "Typeface for controls and body text.",
    ];
  if (name.startsWith("--font-size"))
    return ["fontSize", "Typography", "Text rendered at this font size."];
  if (name.startsWith("--font-weight"))
    return ["weight", "Typography", "The same text rendered at this weight."];
  if (name === "--line-height")
    return ["leading", "Typography", "Vertical rhythm between lines of text."];
  if (name.startsWith("--radius"))
    return ["radius", "Shape & elevation", "Corner curvature on a surface."];
  if (name === "--border-width")
    return ["border", "Shape & elevation", "Thickness of a surface border."];
  if (name.startsWith("--shadow"))
    return [
      "shadow",
      "Shape & elevation",
      "Elevation and depth beneath a surface.",
    ];
  if (name.startsWith("--focus"))
    return [
      "focus",
      "Sizing & states",
      "Keyboard focus outline thickness or distance from the control.",
    ];
  if (name.endsWith("-width"))
    return [
      "width",
      "Sizing & states",
      "Maximum content width. The preview is constrained to its card.",
    ];
  if (name === "--disabled-opacity")
    return [
      "opacity",
      "Sizing & states",
      "Opacity applied to an unavailable control.",
    ];
  if (name === "--duration")
    return [
      "duration",
      "Sizing & states",
      "Click the sample to preview this transition duration.",
    ];
  if (name.startsWith("--z-"))
    return [
      "layer",
      "Sizing & states",
      "Stacking order of overlay, popover, and notification surfaces.",
    ];
}

const darkValues = new Map(
  Array.from(
    css.split("/* Opt in")[1].matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm),
    ([, name, value]) => [name, value.trim()]
  )
);

export const tokens: DesignToken[] = Array.from(
  css.split("/* Opt in")[0].matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)
).flatMap(([, name, base]) => {
  const classification = classify(name);
  if (!classification) return [];
  const [kind, group, description] = classification;
  return [{
    name,
    base: base.replace(/\s+/g, " ").trim(),
    kind,
    group,
    description,
    dark: darkValues.get(name),
  }];
});

export type TokenPage =
  | "overview"
  | "palette"
  | "roles"
  | "typography"
  | "spacing"
  | "shape-and-elevation"
  | "sizing-and-states";

export const tokenPages: {
  id: TokenPage;
  title: string;
  description: string;
  groups: TokenGroup[];
}[] = [
  { id: "overview", title: "Overview", description: "Start with base colors. Greda turns them into roles and component styles.", groups: [] },
  {
    id: "palette",
    title: "Base colors",
    description: "The color palette you customize. Every theme uses the same generic names.",
    groups: ["Palette"],
  },
  {
    id: "roles",
    title: "Color roles",
    description: "How Greda assigns base colors to surfaces, text, borders, and components.",
    groups: ["Surfaces", "Text colors", "Border colors"],
  },
  {
    id: "typography",
    title: "Typography",
    description: "Choose a shared style, customize your theme, or explore the type foundations.",
    groups: ["Typography"],
  },
  {
    id: "spacing",
    title: "Spacing",
    description: "One scale for padding, margins, gaps, and control dimensions.",
    groups: ["Spacing"],
  },
  {
    id: "shape-and-elevation",
    title: "Shape & elevation",
    description: "Corner radii, border thickness, and shadows.",
    groups: ["Shape & elevation"],
  },
  {
    id: "sizing-and-states",
    title: "Sizing & states",
    description: "Content widths, focus, disabled opacity, motion, and stacking order.",
    groups: ["Sizing & states"],
  },
];

export function tokenPageHref(page: TokenPage) {
  return `/?path=/story/design-tokens--${page}`;
}

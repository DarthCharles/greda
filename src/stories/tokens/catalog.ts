import css from "../../styles/tokens.css?raw";

export type TokenKind =
  | "color"
  | "font"
  | "fontSize"
  | "weight"
  | "leading"
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
  | "Colors"
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
}

function classify(name: string): [TokenKind, TokenGroup, string] {
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
  return [
    "color",
    "Colors",
    name.endsWith("foreground")
      ? "A text color, shown as a swatch."
      : "A semantic color used by components.",
  ];
}

export const tokens: DesignToken[] = Array.from(
  css.split("/* Opt in")[0].matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm),
  ([, name, base]) => {
    const [kind, group, description] = classify(name);
    return {
      name,
      base: base.replace(/\s+/g, " ").trim(),
      kind,
      group,
      description,
    };
  }
);
export const groups: TokenGroup[] = [
  "Colors",
  "Typography",
  "Spacing",
  "Shape & elevation",
  "Sizing & states",
];

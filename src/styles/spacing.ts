export const namedSpacingSteps = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

export const negativeNamedSpacingUtilities = [
  "m", "mx", "my", "ms", "me", "mt", "mr", "mb", "ml",
  "inset", "inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left",
  "translate-x", "translate-y", "space-x", "space-y", "indent",
  "scroll-m", "scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml",
] as const;

export const namedSpacingUtilities = [
  ...negativeNamedSpacingUtilities,
  "p", "px", "py", "ps", "pe", "pt", "pr", "pb", "pl",
  "gap", "gap-x", "gap-y",
  "w", "h", "size", "min-w", "min-h", "max-w", "max-h",
  "basis", "border-spacing", "border-spacing-x", "border-spacing-y",
  "scroll-p", "scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl",
] as const;

import postcss from "postcss";
import { colors, colorRoles, theme } from "../src/styles/tailwind-theme.ts";

// Keep Tailwind 4 aliases in a layer so the runtime token defaults (and consumer
// overrides) take precedence, including tokens sharing a Tailwind theme name.
export function createTailwindTheme(tokens) {
  const aliases = new Map();
  const utilities = new Map();
  const categoryNames = new Set([...colorRoles.text, ...colorRoles.border]);
  for (const [name, value] of Object.entries(colors)) {
    // A global --color-primary would also generate text-primary and
    // border-primary from the brand color, overriding the category roles.
    if (categoryNames.has(name)) {
      for (const category of ["bg", "text", "border"]) {
        aliases.set(`--greda-${category}-${name}`, `var(--${name})`);
      }
    } else {
      aliases.set(`--color-${name}`, value.replace(" / <alpha-value>", ""));
    }
  }
  for (const [category, names] of Object.entries(colorRoles)) {
    for (const name of names) {
      aliases.set(`--greda-${category}-${name}`, `var(--${category}-${name})`);
    }
  }
  for (const [category, property] of Object.entries({
    bg: "background-color",
    surface: "background-color",
    text: "color",
    border: "border-color",
  })) {
    const value = `--value(--greda-${category}-*)`;
    utilities.set(`${category}-*`, [
      `${property}: hsl(${value});`,
      `${property}: hsl(${value} / calc(--modifier(integer) * 1%));`,
      `${property}: hsl(${value} / --modifier([number], [percentage]));`,
    ].join("\n  "));
  }
  aliases.set("--spacing", "var(--spacing-unit)");
  const source = postcss.parse(tokens);
  source.walkDecls(/^--space-/, (declaration) => {
    const step = declaration.prop.slice("--space-".length).replace("-", ".");
    aliases.set(
      `--spacing-${step.replace(".", "\\.")}`,
      `var(${declaration.prop})`
    );
  });
  for (const [name, value] of Object.entries(theme.fontFamily)) {
    aliases.set(`--font-${name}`, value.join(", "));
  }
  for (const [name, [size, options]] of Object.entries(theme.fontSize)) {
    aliases.set(`--text-${name}`, size);
    aliases.set(`--text-${name}--line-height`, options.lineHeight);
  }
  for (const [name, value] of Object.entries(theme.fontWeight)) {
    aliases.set(`--font-weight-${name}`, value);
  }
  for (const [name, value] of Object.entries(theme.borderRadius)) {
    aliases.set(`--radius-${name}`, value);
  }
  for (const [name, value] of Object.entries(theme.extend.boxShadow)) {
    aliases.set(name === "DEFAULT" ? "--shadow" : `--shadow-${name}`, value);
  }
  for (const [name, value] of Object.entries(theme.extend.maxWidth)) {
    aliases.set(`--container-${name}`, value);
  }
  aliases.set(
    "--default-transition-duration",
    theme.extend.transitionDuration.DEFAULT
  );
  for (const [name, value] of Object.entries(theme.extend.zIndex)) {
    utilities.set(`z-${name}`, `z-index: ${value};`);
  }
  for (const [name, value] of Object.entries(theme.extend.opacity)) {
    utilities.set(`opacity-${name}`, `opacity: ${value};`);
  }
  aliases.set("--default-border-width", theme.extend.borderWidth.DEFAULT);
  for (const [name, value] of Object.entries(theme.extend.ringWidth)) {
    aliases.set(`--ring-width-${name}`, value);
  }
  for (const [name, value] of Object.entries(theme.extend.ringOffsetWidth)) {
    aliases.set(`--ring-offset-width-${name}`, value);
  }
  return `\n/* Tailwind 4: import this file from your Tailwind CSS entry point. */
@layer theme {
  @theme inline {
${[...aliases].map(([name, value]) => `    ${name}: ${value};`).join("\n")}
  }
}

@custom-variant dark (&:where([data-color-scheme="dark"], [data-color-scheme="dark"] *));

${[...utilities]
  .map(([name, declarations]) => `@utility ${name} {\n  ${declarations}\n}`)
  .join("\n\n")}
`;
}

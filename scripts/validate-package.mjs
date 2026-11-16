import assert from "node:assert/strict";
import postcss from "postcss";
import { access, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { build } from "vite";
import { colors as semanticColors, colorUtilities, colorRoles } from "../src/styles/tailwind-theme.ts";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const packed = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    encoding: "utf8",
  })
)[0];
const paths = new Set(packed.files.map(({ path }) => path));
for (const value of Object.values(pkg.exports)) {
  for (const target of typeof value === "string"
    ? [value]
    : Object.values(value)) {
    await access(target);
    assert(
      paths.has(target.replace(/^\.\//, "")),
      `Missing packed export: ${target}`
    );
  }
}
// Check the actual compiled stylesheet, including minified pseudo selectors.
const stylesheet = postcss.parse(await readFile("dist/styles.css", "utf8"));
const selectors = new Set();
const globalSelectors = new Set([
  "*",
  ":before",
  ":after",
  "::before",
  "::after",
  "::backdrop",
]);
stylesheet.walkRules((rule) => {
  for (const selector of rule.selectors) selectors.add(selector.trim());
  const initializesTailwind = rule.nodes.some(
    (node) => node.type === "decl" && node.prop.startsWith("--tw-")
  );
  assert(
    !initializesTailwind ||
      !rule.selectors.some((selector) => globalSelectors.has(selector.trim())),
    `Unscoped Tailwind initialization: ${rule.selector}`
  );
});
// Semantic color utilities are public even if a component never uses them.
const tokens = await readFile("dist/tokens.css", "utf8");
const colors = new Set(Object.keys(semanticColors));
assert(colors.has("primary"), "Missing semantic color tokens");
for (const name of colors) {
  assert(tokens.includes(`--${name}:`), `Missing semantic token: ${name}`);
}
for (const [category, names] of Object.entries(colorRoles)) {
  for (const name of names) {
    assert(tokens.includes(`--${category}-${name}:`), `Missing role: ${category}-${name}`);
  }
}
for (const utility of colorUtilities) {
  for (const state of ["", "hover", "focus", "focus-visible"]) {
    const selector = state
      ? `.${state}\\:${utility}:${state}`
      : `.${utility}`;
    assert(selectors.has(selector), `Missing public color utility: ${selector}`);
  }
}
const api = await import("../dist/index.js");
const icons = await import("@darthcharles/greda/icons");
const lucide = await import("lucide-react");
for (const name of Object.keys(lucide)) {
  // Node adds a default for Lucide's CommonJS build; export * exposes named exports.
  if (name === "default") continue;
  assert.equal(icons[name], lucide[name], `Changed Lucide export: ${name}`);
}
// Bundle through the public subpath to catch regressions in consumer tree shaking.
const iconBundle = await build({
  configFile: false,
  logLevel: "silent",
  plugins: [{
    name: "icon-consumer",
    resolveId: (id) => id === "virtual:icon-consumer" ? id : undefined,
    load: (id) => id === "virtual:icon-consumer"
      ? 'export { Plus } from "@darthcharles/greda/icons";'
      : undefined,
  }],
  build: {
    write: false,
    rollupOptions: {
      input: "virtual:icon-consumer",
      preserveEntrySignatures: "strict",
      external: ["react"],
      output: { format: "es" },
    },
  },
});
assert(!Array.isArray(iconBundle) && "output" in iconBundle);
const iconChunk = iconBundle.output.find((output) => output.type === "chunk");
assert(iconChunk, "Missing consumer icon bundle");
const includedModules = Object.entries(iconChunk.modules)
  .filter(([, module]) => module.renderedLength > 0)
  .map(([id]) => id);
assert(includedModules.some((id) => id.endsWith("/icons/plus.js")));
assert(!includedModules.some((id) => id.endsWith("/icons/search.js")), "Unused icon bundled");
assert(!includedModules.some((id) => id.endsWith("/dist/index.js")), "Component entry bundled with icons");
for (const name of [
  "Button",
  "Input",
  "Textarea",
  "Label",
  "Select",
  "Combobox",
  "ComboboxInput",
  "ComboboxContent",
  "Dialog",
  "Card",
  "Badge",
  "Checkbox",
  "Tabs",
  "Toast",
  "Tooltip",
  "Popover",
  "PopoverTrigger",
  "PopoverContent",
  "PopoverClose",
  "PopoverAnchor",
  "cn",
]) {
  assert(name in api, `Missing public export: ${name}`);
}
assert(
  ![...paths].some((path) =>
    /^(src|node_modules|storybook-static)\//.test(path)
  )
);
console.log(`Validated exports and ${paths.size} packed files.`);

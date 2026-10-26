import assert from "node:assert/strict";
import postcss from "postcss";
import { access, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

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
const colors = new Set(
  [...tokens.matchAll(/--([\w-]+):\s*[\d.]+\s+[\d.]+%\s+[\d.]+%/g)].map(
    ([, name]) => name
  )
);
assert(colors.has("primary"), "Missing semantic color tokens");
for (const name of colors) {
  for (const utility of ["bg", "text", "border"]) {
    for (const state of ["", "hover", "focus", "focus-visible"]) {
      const selector = state
        ? `.${state}\\:${utility}-${name}:${state}`
        : `.${utility}-${name}`;
      assert(selectors.has(selector), `Missing public color utility: ${selector}`);
    }
  }
}
const api = await import("../dist/index.js");
for (const name of [
  "Button",
  "Input",
  "Textarea",
  "Label",
  "Select",
  "Dialog",
  "Card",
  "Badge",
  "Checkbox",
  "Tabs",
  "Toast",
  "Tooltip",
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

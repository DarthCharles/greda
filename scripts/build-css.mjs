import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
import scopeTailwindDefaults from "./scope-tailwind-defaults.cjs";
import { createTailwindTheme } from "./tailwind-theme.mjs";

const tokens = await readFile("src/styles/tokens.css", "utf8");
const utilities = await readFile("dist/styles.css", "utf8");
const scoped = await postcss([scopeTailwindDefaults()]).process(utilities, {
  from: "dist/styles.css",
  map: false,
});
await writeFile("dist/styles.css", `${tokens}\n${scoped.css}`);
await writeFile("dist/tokens.css", `${tokens}\n${createTailwindTheme(tokens)}`);

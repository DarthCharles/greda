import { readFile, writeFile } from "node:fs/promises";

const source = (await readFile("src/styles/tokens.css", "utf8")).split(
  "/* Opt in"
)[0];
const tokens = [...source.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map(
  ([, name, value]) => [name, value.replace(/\s+/g, " ").trim()]
);
const readme = await readFile("README.md", "utf8");
const markdown = `| Token | Default |\n| --- | --- |\n${tokens
  .map(([name, value]) => `| \`${name}\` | \`${value}\` |`)
  .join("\n")}`;
await writeFile(
  "README.md",
  readme.replace(/\| Token\s*\| Default[\s\S]*?(?=\n\n)/, markdown)
);
console.log(`Updated README reference for ${tokens.length} tokens.`);

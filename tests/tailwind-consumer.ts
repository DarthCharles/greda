import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss-v4";

// Resolve the real public CSS exports as a consumer's Tailwind build would.
export async function buildConsumerCss(
  candidates: string[],
  components = false,
  theme?: "cobalto" | "comal"
) {
  const compiler = await compile(
    `@import "tailwindcss";
${components ? '@import "@darthcharles/greda/styles.css" layer(components);' : ""}
@import "@darthcharles/greda/tokens.css";
${theme ? `@import "@darthcharles/greda/themes/${theme}.css";` : ""}`,
    {
      base: process.cwd(),
      loadStylesheet: async (id, base) => {
        const path =
          id === "tailwindcss"
            ? fileURLToPath(import.meta.resolve("tailwindcss-v4/index.css"))
            : id.startsWith("@darthcharles/greda/")
            ? fileURLToPath(import.meta.resolve(id))
            : resolve(base, id);
        return {
          path,
          base: dirname(path),
          content: await readFile(path, "utf8"),
        };
      },
    }
  );
  return compiler.build(candidates);
}

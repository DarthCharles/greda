import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const componentNames = [
  "button",
  "input",
  "textarea",
  "label",
  "select",
  "dialog",
  "card",
  "badge",
  "checkbox",
  "tabs",
  "toast",
  "tooltip",
  "popover",
];
const requestedNames = process.argv.slice(2);
for (const name of requestedNames) {
  if (!componentNames.includes(name)) throw new Error(`Unknown component: ${name}`);
}
const names = requestedNames.length ? [...new Set(requestedNames)] : componentNames;
const previousManifest = requestedNames.length
  ? JSON.parse(await readFile("upstream/shadcn-ui/manifest.json", "utf8"))
  : null;
const retrieved = new Date().toISOString();
await mkdir("upstream/shadcn-ui", { recursive: true });
const records = await Promise.all(
  names.map(async (name) => {
    const url = `https://ui.shadcn.com/r/styles/new-york/${name}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    const item = await response.json();
    await writeFile(
      `upstream/shadcn-ui/${name}.json`,
      JSON.stringify(item, null, 2) + "\n"
    );
    return {
      name,
      url,
      sha256: createHash("sha256").update(JSON.stringify(item)).digest("hex"),
      dependencies: item.dependencies ?? [],
      ...(previousManifest && { retrieved }),
    };
  })
);
if (!previousManifest) {
  const license = await fetch(
    "https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md"
  );
  if (!license.ok) throw new Error(`License: ${license.status}`);
  await writeFile("upstream/shadcn-ui/LICENSE.md", await license.text());
}
const components = previousManifest
  ? [
      ...previousManifest.components.map((record) =>
        records.find(({ name }) => name === record.name) ?? record
      ),
      ...records.filter(({ name }) =>
        !previousManifest.components.some((record) => record.name === name)
      ),
    ]
  : records;
await writeFile(
  "upstream/shadcn-ui/manifest.json",
  JSON.stringify(
    {
      style: "new-york",
      retrieved: previousManifest?.retrieved ?? retrieved,
      components,
    },
    null,
    2
  ) + "\n"
);
console.log(
  JSON.stringify(
    records.map(({ name, dependencies }) => ({ name, dependencies })),
    null,
    2
  )
);

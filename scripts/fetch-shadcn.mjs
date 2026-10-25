import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const names = [
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
];
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
    };
  })
);
const license = await fetch(
  "https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md"
);
if (!license.ok) throw new Error(`License: ${license.status}`);
await writeFile("upstream/shadcn-ui/LICENSE.md", await license.text());
await writeFile(
  "upstream/shadcn-ui/manifest.json",
  JSON.stringify(
    {
      style: "new-york",
      retrieved: new Date().toISOString(),
      components: records,
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

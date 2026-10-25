import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const components = (await readdir("src/components/ui")).filter((name) =>
  name.endsWith(".tsx")
);
const stories = await readdir("src/stories");
for (const file of components) {
  const name = file.replace(".tsx", "");
  const story = stories.find(
    (entry) => entry.toLowerCase() === `${name}.stories.tsx`
  );
  assert(story, `${name} needs its own Storybook file`);
  const content = await readFile(`src/stories/${story}`, "utf8");
  assert(
    content.includes("export const Default"),
    `${story} needs a default usage story`
  );
}
console.log(
  `Verified a separate Storybook file for all ${components.length} components.`
);

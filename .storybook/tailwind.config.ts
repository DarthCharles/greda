import type { Config } from "tailwindcss";
import packageConfig from "../tailwind.config";

// Recipe layout utilities belong to the catalog, not the published CSS.
export default {
  ...packageConfig,
  content: {
    relative: true,
    files: [
      "../src/components/ui/**/*.{ts,tsx}",
      "../src/stories/Comal.stories.tsx",
      "../src/stories/Cobalto.stories.tsx",
    ],
  },
} satisfies Config;

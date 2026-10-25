import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: { index: "src/index.ts", utils: "src/lib/utils.ts" },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) =>
        /^(react|react-dom|@radix-ui\/[^/]+|clsx|class-variance-authority|tailwind-merge|lucide-react)(\/|$)/.test(
          id
        ),
    },
    sourcemap: true,
  },
});

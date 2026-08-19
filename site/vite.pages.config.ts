import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const siteRoot = path.dirname(fileURLToPath(import.meta.url));
const pagesRoot = path.join(siteRoot, "pages-client");

export default defineConfig({
  base: "/ai-adoption-playbook/",
  root: pagesRoot,
  publicDir: path.join(siteRoot, "public"),
  plugins: [react()],
  build: {
    outDir: path.join(siteRoot, "pages-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.join(pagesRoot, "index.html"),
        fr: path.join(pagesRoot, "fr", "index.html"),
      },
    },
  },
});

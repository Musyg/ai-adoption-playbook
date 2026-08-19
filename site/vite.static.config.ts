import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const siteRoot = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.join(siteRoot, "static-client");
const configuredBasePath = process.env.STATIC_BASE_PATH?.trim() || "/";
const basePath = `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

export default defineConfig({
  base: basePath,
  root: staticRoot,
  publicDir: path.join(siteRoot, "public"),
  plugins: [react()],
  build: {
    outDir: path.join(siteRoot, "static-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.join(staticRoot, "index.html"),
        fr: path.join(staticRoot, "fr", "index.html"),
      },
    },
  },
});

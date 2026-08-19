import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(siteRoot, "pages-dist");

await Promise.all([
  access(path.join(outputRoot, "index.html")),
  access(path.join(outputRoot, "fr", "index.html")),
  access(path.join(outputRoot, "favicon.svg")),
  access(path.join(outputRoot, "og.png")),
  access(path.join(outputRoot, "data", "control-crosswalk.v1.json")),
  access(path.join(outputRoot, "data", "control-crosswalk.schema.json")),
]);

await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");
console.log(`GitHub Pages client build ready: ${outputRoot}`);

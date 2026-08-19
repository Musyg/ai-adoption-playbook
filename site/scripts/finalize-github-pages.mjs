import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";

await Promise.all([
  access(path.join(outputRoot, "index.html")),
  access(path.join(outputRoot, "fr", "index.html")),
  access(path.join(outputRoot, "favicon.svg")),
  access(path.join(outputRoot, "og.png")),
  access(path.join(outputRoot, "data", "control-crosswalk.v1.json")),
  access(path.join(outputRoot, "data", "control-crosswalk.schema.json")),
]);

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("prerender", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(pathname) {
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    throw new Error(`Server render failed for ${pathname}: ${response.status}`);
  }

  const html = await response.text();
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error(`Server render returned no body for ${pathname}`);

  let rendered = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<(?:meta|link)\b[^>]*>/gi, "")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replaceAll('href="/fr/"', `href="${basePath}/fr/"`)
    .replaceAll('href="/"', `href="${basePath}/"`)
    .replaceAll('href="/data/', `href="${basePath}/data/`)
    .trim();

  if (pathname === "/fr" && rendered.startsWith('<div lang="fr">') && rendered.endsWith("</div>")) {
    rendered = rendered.slice('<div lang="fr">'.length, -"</div>".length);
  }

  return rendered;
}

for (const [pathname, relativePath] of [
  ["/", "index.html"],
  ["/fr", path.join("fr", "index.html")],
]) {
  const outputPath = path.join(outputRoot, relativePath);
  const shell = await readFile(outputPath, "utf8");
  const rendered = await render(pathname);
  const hydrated = shell.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root" data-prerendered="true">${rendered}</div>`,
  );

  if (hydrated === shell) {
    throw new Error(`Could not find the client root in ${relativePath}`);
  }
  await writeFile(outputPath, hydrated, "utf8");
}

await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");
console.log(`Prerendered GitHub Pages build ready: ${outputRoot}`);

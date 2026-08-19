import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientRoot = path.join(siteRoot, "dist", "client");
const outputRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";
const publicOrigin = "https://musyg.github.io";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const workerEnvironment = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const workerContext = { waitUntil() {}, passThroughOnException() {} };

function addBasePath(html) {
  return html
    .replaceAll("http://localhost:3000/og.png", `${publicOrigin}${basePath}/og.png`)
    .replace(/(["'])\/_next\//g, `$1${basePath}/_next/`)
    .replace(/(["'])\/data\//g, `$1${basePath}/data/`)
    .replace(/(["'])\/favicon\.svg/g, `$1${basePath}/favicon.svg`)
    .replace(/(["'])\/og\.png/g, `$1${basePath}/og.png`)
    .replaceAll('href="/fr/"', `href="${basePath}/fr/"`)
    .replaceAll('href="/"', `href="${basePath}/"`)
    .replaceAll('href=\\"/fr/\\"', `href=\\"${basePath}/fr/\\"`)
    .replaceAll('href=\\"/\\"', `href=\\"${basePath}/\\"`);
}

async function render(route, destination) {
  const response = await worker.fetch(
    new Request(`${publicOrigin}${route}`, { headers: { accept: "text/html" } }),
    workerEnvironment,
    workerContext,
  );
  if (!response.ok) {
    throw new Error(`Static render failed for ${route}: HTTP ${response.status}`);
  }

  const html = addBasePath(await response.text());
  const forbidden = [
    'href="/_next/',
    'src="/_next/',
    'href="/data/',
    'href="/fr/"',
    'href="/favicon.svg"',
  ];
  for (const value of forbidden) {
    if (html.includes(value)) {
      throw new Error(`Unprefixed GitHub Pages path remains in ${route}: ${value}`);
    }
  }

  const target = path.join(outputRoot, destination);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

await rm(outputRoot, { recursive: true, force: true });
await cp(clientRoot, outputRoot, { recursive: true });
await render("/", "index.html");
await render("/fr", path.join("fr", "index.html"));
await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages export ready: ${outputRoot}`);

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";
const canonicalBase = "https://musyg.github.io/ai-adoption-playbook";
const geoArticles = JSON.parse(await readFile(path.join(siteRoot, "app", "geo-pages.json"), "utf8"));

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
    .replace(/href="\/(?!\/)/g, `href="${basePath}/`)
    .trim();

  if (pathname.startsWith("/fr") && rendered.startsWith('<div lang="fr">') && rendered.endsWith("</div>")) {
    rendered = rendered.slice('<div lang="fr">'.length, -"</div>".length);
  }

  return rendered;
}

const shells = {
  en: await readFile(path.join(outputRoot, "index.html"), "utf8"),
  fr: await readFile(path.join(outputRoot, "fr", "index.html"), "utf8"),
};

function injectRenderedBody(shell, rendered, label) {
  const hydrated = shell.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root" data-prerendered="true">${rendered}</div>`,
  );
  if (hydrated === shell) throw new Error(`Could not find the client root in ${label}`);
  return hydrated;
}

for (const [pathname, relativePath, locale] of [
  ["/", "index.html", "en"],
  ["/fr", path.join("fr", "index.html"), "fr"],
]) {
  const outputPath = path.join(outputRoot, relativePath);
  const rendered = await render(pathname);
  const hydrated = injectRenderedBody(shells[locale], rendered, relativePath);
  await writeFile(outputPath, hydrated, "utf8");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function articlePath(article) {
  return article.locale === "fr" ? `/fr/${article.slug}/` : `/${article.slug}/`;
}

function alternateFor(article) {
  return geoArticles.find((candidate) => candidate.id === article.id && candidate.locale !== article.locale);
}

function articleJsonLd(article) {
  const alternate = alternateFor(article);
  const canonical = `${canonicalBase}${articlePath(article)}`;
  const home = article.locale === "fr" ? `${canonicalBase}/fr/` : `${canonicalBase}/`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.description,
        url: canonical,
        mainEntityOfPage: canonical,
        inLanguage: article.locale,
        dateModified: "2026-08-19",
        isAccessibleForFree: true,
        author: { "@type": "Organization", name: "Musyg", url: "https://github.com/Musyg" },
        publisher: { "@type": "Organization", name: "Musyg", url: "https://github.com/Musyg" },
        isPartOf: { "@id": `${canonicalBase}/#website` },
        citation: article.sources.map((source) => source.url),
        translationOfWork: alternate ? { "@id": `${canonicalBase}${articlePath(alternate)}#article` } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AI Adoption Playbook", item: home },
          { "@type": "ListItem", position: 2, name: article.title, item: canonical },
        ],
      },
    ],
  }).replaceAll("<", "\\u003c");
}

function articleShell(article) {
  const alternate = alternateFor(article);
  const canonical = `${canonicalBase}${articlePath(article)}`;
  const enUrl = article.locale === "en" ? canonical : `${canonicalBase}${articlePath(alternate)}`;
  const frUrl = article.locale === "fr" ? canonical : `${canonicalBase}${articlePath(alternate)}`;
  const title = escapeHtml(article.title);
  const description = escapeHtml(article.description);
  const locale = article.locale === "fr" ? "fr_FR" : "en_US";
  const alternateLocale = article.locale === "fr" ? "en_US" : "fr_FR";

  return shells[article.locale]
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*" \/>/, `<link rel="alternate" hreflang="en" href="${enUrl}" />`)
    .replace(/<link rel="alternate" hreflang="fr" href="[^"]*" \/>/, `<link rel="alternate" hreflang="fr" href="${frUrl}" />`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/, `<link rel="alternate" hreflang="x-default" href="${enUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${locale}" />`)
    .replace(/<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${alternateLocale}" />`)
    .replace(/\s*<meta property="og:image" content="[^"]*" \/>/, "")
    .replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />')
    .replace('<meta name="twitter:card" content="summary_large_image" />', '<meta name="twitter:card" content="summary" />')
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/\s*<meta name="twitter:image" content="[^"]*" \/>/, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${articleJsonLd(article)}</script>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
}

for (const article of geoArticles) {
  const pathname = articlePath(article);
  const relativePath = article.locale === "fr"
    ? path.join("fr", article.slug, "index.html")
    : path.join(article.slug, "index.html");
  const outputPath = path.join(outputRoot, relativePath);
  const rendered = await render(pathname.slice(0, -1));
  const hydrated = injectRenderedBody(articleShell(article), rendered, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, hydrated, "utf8");
}

const sitemapEntries = [
  { locale: "en", path: "/", alternatePath: "/fr/" },
  { locale: "fr", path: "/fr/", alternatePath: "/" },
  ...geoArticles.map((article) => ({
    locale: article.locale,
    path: articlePath(article),
    alternatePath: articlePath(alternateFor(article)),
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map((entry) => {
  const enPath = entry.locale === "en" ? entry.path : entry.alternatePath;
  const frPath = entry.locale === "fr" ? entry.path : entry.alternatePath;
  return `  <url>
    <loc>${canonicalBase}${entry.path}</loc>
    <lastmod>2026-08-19</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${canonicalBase}${enPath}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${canonicalBase}${frPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalBase}${enPath}" />
  </url>`;
}).join("\n")}
</urlset>
`;
await writeFile(path.join(outputRoot, "sitemap.xml"), sitemap, "utf8");

await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");
console.log(`Prerendered GitHub Pages build ready: ${geoArticles.length + 2} routes in ${outputRoot}`);

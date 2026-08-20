import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(siteRoot, "static-dist");
const configuredBasePath = process.env.STATIC_BASE_PATH?.trim() || "/";
const basePath = configuredBasePath === "/"
  ? ""
  : `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`;
const siteUrl = resolveSiteUrl(process.env.PUBLIC_SITE_URL);
const geoArticles = JSON.parse(await readFile(path.join(siteRoot, "app", "geo-pages.json"), "utf8"));

function resolveSiteUrl(value) {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("PUBLIC_SITE_URL must be an absolute HTTP or HTTPS URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.search || parsed.hash) {
    throw new Error("PUBLIC_SITE_URL must be an HTTP or HTTPS URL without a query or fragment.");
  }
  return parsed.toString().replace(/\/$/, "");
}

function absoluteUrl(pathname) {
  if (!siteUrl) return undefined;
  return `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

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
const handleRequest = typeof worker === "function"
  ? worker
  : (request) => worker.fetch(
      request,
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );

async function render(pathname) {
  const response = await handleRequest(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
    .trim();

  if (basePath) {
    rendered = rendered.replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}/`);
  }

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

function hostedMetadata(locale, pathname, alternatePathname, includeImage) {
  if (!siteUrl) return "";
  const canonical = absoluteUrl(pathname);
  const alternate = absoluteUrl(alternatePathname);
  const englishUrl = locale === "en" ? canonical : alternate;
  const frenchUrl = locale === "fr" ? canonical : alternate;
  const imageTags = includeImage
    ? `\n    <meta property="og:image" content="${absoluteUrl("/og.png")}" />\n    <meta name="twitter:image" content="${absoluteUrl("/og.png")}" />`
    : "";

  return `
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${englishUrl}" />
    <link rel="alternate" hreflang="fr" href="${frenchUrl}" />
    <link rel="alternate" hreflang="x-default" href="${englishUrl}" />
    <link rel="sitemap" type="application/xml" href="${absoluteUrl("/sitemap.xml")}" />
    <meta property="og:url" content="${canonical}" />${imageTags}`;
}

function applyHostingMetadata(shell, locale, pathname, alternatePathname, includeImage = false) {
  if (!siteUrl) return shell;
  return shell
    .replace('<meta name="robots" content="noindex, nofollow" />', '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />')
    .replace("  </head>", `${hostedMetadata(locale, pathname, alternatePathname, includeImage)}\n  </head>`);
}

for (const [pathname, relativePath, locale, alternatePathname] of [
  ["/", "index.html", "en", "/fr/"],
  ["/fr", path.join("fr", "index.html"), "fr", "/"],
]) {
  const outputPath = path.join(outputRoot, relativePath);
  const rendered = await render(pathname);
  const hydrated = injectRenderedBody(shells[locale], rendered, relativePath);
  await writeFile(outputPath, applyHostingMetadata(hydrated, locale, pathname === "/fr" ? "/fr/" : "/", alternatePathname, true), "utf8");
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
  const canonical = absoluteUrl(articlePath(article));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    ...(canonical ? { "@id": `${canonical}#article`, url: canonical, mainEntityOfPage: canonical } : {}),
    headline: article.title,
    description: article.description,
    inLanguage: article.locale,
    dateModified: "2026-08-19",
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "Musyg", url: "https://github.com/Musyg" },
    publisher: { "@type": "Organization", name: "Musyg", url: "https://github.com/Musyg" },
    citation: article.sources.map((source) => source.url),
    ...(canonical && alternate ? { translationOfWork: { "@id": `${absoluteUrl(articlePath(alternate))}#article` } } : {}),
  }).replaceAll("<", "\\u003c");
}

function articleShell(article) {
  const alternate = alternateFor(article);
  const title = escapeHtml(article.title);
  const description = escapeHtml(article.description);
  const locale = article.locale === "fr" ? "fr_FR" : "en_US";
  const alternateLocale = article.locale === "fr" ? "en_US" : "fr_FR";

  const shell = shells[article.locale]
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${locale}" />`)
    .replace(/<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${alternateLocale}" />`)
    .replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />')
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${articleJsonLd(article)}</script>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  return applyHostingMetadata(shell, article.locale, articlePath(article), articlePath(alternate));
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

if (siteUrl) {
  await writeFile(path.join(outputRoot, ".nojekyll"), "", "utf8");

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
    <loc>${absoluteUrl(entry.path)}</loc>
    <lastmod>2026-08-19</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${absoluteUrl(enPath)}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${absoluteUrl(frPath)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(enPath)}" />
  </url>`;
}).join("\n")}
</urlset>
`;
  await writeFile(path.join(outputRoot, "sitemap.xml"), sitemap, "utf8");
}

const mode = siteUrl ? `host-ready metadata for ${siteUrl}` : "neutral noindex metadata";
console.log(`Prerendered static build ready: ${geoArticles.length + 2} routes in ${outputRoot} (${mode}).`);

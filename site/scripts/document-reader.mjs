import { readFile } from "node:fs/promises";
import path from "node:path";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import GithubSlugger from "github-slugger";
import { decodeHTML } from "entities";
import { documents, categories, libraryPath, alternateDocument, documentForSource, downloads } from "../app/document-manifest.mjs";
import { authorFor } from "../app/editorial-metadata.mjs";

const repositoryRoot = path.resolve(process.cwd(), path.basename(process.cwd()) === "site" ? ".." : ".");
const repository = "https://github.com/Musyg/ai-adoption-playbook";
export const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const plain = (html) => decodeHTML(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }));
export const downloadPath = (source) => `/downloads/${source}`;

export function rewriteDocumentLink(href, doc) {
  // Absolute citations are retained; dangerous schemes are stripped by the sanitizer.
  if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(href)) {
    const own = `${repository}/blob/main/`;
    if (href.startsWith(own)) return rewriteDocumentLink(`/${href.slice(own.length)}`, doc);
    return href;
  }
  if (href.startsWith("#")) return href;
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  const target = path.posix.normalize(href.startsWith("/") ? match[1].slice(1) : path.posix.join(path.posix.dirname(doc.source), match[1]));
  const suffix = match[2] || "";
  const linked = documentForSource(target);
  if (linked) return linked.path + suffix;
  if (downloads.includes(target)) return downloadPath(target) + suffix;
  if (target.startsWith("site/public/data/") && /^[\w.-]+\.json$/.test(target.slice(17))) return `/data/${target.slice(17)}${suffix}`;
  if (["README.md", "README.fr.md"].includes(target)) return `${target === "README.fr.md" ? "/fr/" : "/"}${suffix}`;
  if (target.replace(/\/$/, "") === "templates") return `${libraryPath(doc.locale)}#templates`;
  if (target.startsWith(".github/PULL_REQUEST_TEMPLATE/field-report")) return `${repository}/blob/main/${target}${suffix}`;
  throw new Error(`Unapproved document link: ${doc.source} -> ${href} (${target})`);
}

export function compileMarkdown(markdown, doc) {
  const slugger = new GithubSlugger();
  const headings = [];
  let title = "";
  const parser = new Marked({ gfm: true, renderer: {
    // Markdown is content, never executable raw HTML. Preserve literal placeholders.
    html({ text }) { return escapeHtml(text); },
    heading({ tokens, depth }) {
      const content = this.parser.parseInline(tokens);
      const label = plain(content);
      const id = slugger.slug(label);
      if (depth === 1 && !title) {
        title = label;
        return `<span id="${escapeHtml(id)}"></span>`;
      }
      if (depth <= 3) headings.push({ id, label, depth });
      return `<h${Math.max(2, depth)} id="${escapeHtml(id)}">${content}</h${Math.max(2, depth)}>`;
    },
    link({ href, title: linkTitle, tokens }) {
      const resolved = rewriteDocumentLink(href, doc);
      return `<a href="${escapeHtml(resolved)}"${linkTitle ? ` title="${escapeHtml(linkTitle)}"` : ""}>${this.parser.parseInline(tokens)}</a>`;
    },
    image({ href, text }) {
      const resolved = href.startsWith("http") ? href : rewriteDocumentLink(href, doc);
      return `<img src="${escapeHtml(resolved)}" alt="${escapeHtml(text)}" loading="lazy" />`;
    },
  } });
  const rendered = parser.parse(markdown);
  const html = sanitizeHtml(rendered, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "input"],
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, "*": ["id"], img: ["src", "alt", "loading"], input: ["type", "checked", "disabled"], a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: { input: (tagName, attribs) => ({ tagName, attribs: { type: "checkbox", disabled: "", ...(Object.hasOwn(attribs, "checked") ? { checked: "" } : {}) } }) },
  }).replace(/<table>/g, `<div class="document-table" tabindex="0" role="region" aria-label="${doc.locale === "fr" ? "Tableau défilant" : "Scrollable table"}"><table>`).replaceAll("</table>", "</table></div>");
  if (!title) throw new Error(`Missing document title: ${doc.source}`);
  return { title, html, headings };
}

export async function loadDocument(doc) {
  if (!documents.includes(doc)) throw new Error("Document must belong to the publication allowlist.");
  const markdown = await readFile(path.join(repositoryRoot, doc.source), "utf8");
  const compiled = compileMarkdown(markdown, doc);
  const description = doc.locale === "fr"
    ? `${compiled.title} : document complet du guide d’adoption de l’IA, avec repères pratiques, ressources et liens utiles.`
    : `${compiled.title}: a complete AI adoption playbook document with practical guidance, resources and related reading.`;
  return { ...doc, ...compiled, description, markdown };
}

const copyFor = (locale) => locale === "fr" ? {
  library: "Bibliothèque du guide", skip: "Aller au contenu", contents: "Dans ce document", download: "Télécharger le Markdown", source: "Source et historique", back: "Tous les documents", print: "Pour imprimer ou enregistrer en PDF : Ctrl+P (⌘P sur Mac).", intro: "Parcours, cas d’école, modèles et méthodes : l’ensemble du guide, à lire ici et à utiliser à votre rythme.",
} : {
  library: "Guide library", skip: "Skip to content", contents: "On this page", download: "Download Markdown", source: "Source and history", back: "All documents", print: "To print or save as PDF: Ctrl+P (⌘P on Mac).", intro: "Tracks, worked examples, templates and methods: the complete guide, ready to read and use at your own pace.",
};

function header(locale, alternate) {
  const copy = copyFor(locale);
  return `<a class="skip-link" href="#main">${copy.skip}</a><header class="geo-header"><a class="brand" href="${locale === "fr" ? "/fr/" : "/"}"><span aria-hidden="true"></span>MUSYG · AI ADOPTION</a><nav aria-label="Navigation"><a href="${locale === "fr" ? "/fr/" : "/"}">Playbook</a><a href="${libraryPath(locale)}">${copy.library}</a>${alternate ? `<a class="lang" href="${alternate.path}" lang="${alternate.locale}">${alternate.locale.toUpperCase()}</a>` : ""}</nav></header>`;
}

export function documentBody(doc) {
  const copy = copyFor(doc.locale);
  const alternate = alternateDocument(doc);
  const siblings = documents.filter((item) => item.category === doc.category && item.locale === doc.locale);
  const position = siblings.findIndex((item) => item.id === doc.id);
  const adjacent = [siblings[position - 1], siblings[position + 1]].filter(Boolean);
  return `<div class="geo-page document-page">${header(doc.locale, alternate)}<main id="main"><article><header class="geo-hero"><nav class="geo-breadcrumb" aria-label="${doc.locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}"><a href="${libraryPath(doc.locale)}">${copy.library}</a><span>/</span><a href="${libraryPath(doc.locale)}#${doc.category}">${categories[doc.category][doc.locale]}</a></nav><p class="eyebrow">${categories[doc.category][doc.locale]}</p><h1>${escapeHtml(doc.title)}</h1><div class="geo-meta"><a href="${authorFor(doc.locale).url}" rel="author">Gilles Musy · Musyg</a><a href="${downloadPath(doc.source)}" download>${copy.download}</a></div></header><div class="geo-layout"><aside class="geo-rail document-toc" aria-label="${copy.contents}"><p>${copy.contents}</p>${doc.headings.map((item) => `<a href="#${escapeHtml(item.id)}" class="depth-${item.depth}">${escapeHtml(item.label)}</a>`).join("")}</aside><div class="geo-content"><div class="document-prose">${doc.html}</div><nav class="document-actions" aria-label="${doc.locale === "fr" ? "Continuer la lecture" : "Continue reading"}"><a href="${libraryPath(doc.locale)}#${doc.category}">${copy.back}</a>${adjacent.map((item) => `<a href="${item.path}">${doc.locale === "fr" ? (item === siblings[position - 1] ? "Document précédent" : "Document suivant") : (item === siblings[position - 1] ? "Previous document" : "Next document")} ${item === siblings[position - 1] ? "←" : "→"}</a>`).join("")}</nav><p class="document-print">${copy.print}</p><a class="document-source" href="${repository}/blob/main/${doc.source}">${copy.source} · GitHub</a></div></div></article></main></div>`;
}

export async function libraryBody(locale) {
  const copy = copyFor(locale);
  const entries = await Promise.all(documents.filter((doc) => doc.locale === locale).map(loadDocument));
  return `<div class="geo-page document-page">${header(locale, { locale: locale === "fr" ? "en" : "fr", path: libraryPath(locale === "fr" ? "en" : "fr") })}<main id="main"><header class="geo-hero"><p class="eyebrow">AI ADOPTION PLAYBOOK</p><h1>${copy.library}</h1><p class="geo-answer">${copy.intro}</p></header><div class="geo-layout"><nav class="geo-rail" aria-label="${copy.contents}"><p>${copy.contents}</p>${Object.entries(categories).filter(([key]) => entries.some((item) => item.category === key)).map(([key, value]) => `<a href="#${key}">${value[locale]}</a>`).join("")}</nav><div class="geo-content document-index">${Object.entries(categories).map(([key, value]) => {
    const group = entries.filter((item) => item.category === key);
    if (!group.length) return "";
    return `<section id="${key}" aria-labelledby="${key}-title"><h2 id="${key}-title">${value[locale]}</h2><ul>${group.map((doc) => `<li><a href="${doc.path}">${escapeHtml(doc.title)}</a></li>`).join("")}</ul>${key === "templates" ? `<a href="${downloadPath("templates/ai-system-register.csv")}" download>${locale === "fr" ? "Télécharger le registre des systèmes IA (CSV)" : "Download the AI system register (CSV)"}</a>` : ""}</section>`;
  }).join("")}</div></div></main></div>`;
}

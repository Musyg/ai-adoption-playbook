import { createRoot, hydrateRoot } from "react-dom/client";

import { GeoArticlePage } from "../app/GeoArticlePage";
import { Playbook } from "../app/Playbook";
import { getGeoArticle } from "../app/geo-content";
import "../app/globals.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const pathname = window.location.pathname;
const localPath = basePath && pathname === basePath
  ? "/"
  : basePath && pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length)
    : pathname;
const locale = localPath === "/fr" || localPath.startsWith("/fr/") ? "fr" : "en";
const pathParts = localPath.split("/").filter(Boolean);
const articleSlug = locale === "fr" ? pathParts[1] : pathParts[0];
const article = articleSlug ? getGeoArticle(locale, articleSlug) : undefined;
const root = document.getElementById("root");

document.documentElement.lang = locale;
document.title = article?.title ?? (locale === "fr"
  ? "Playbook d’adoption de l’IA : pilotes, agents et gouvernance"
  : "AI Adoption Playbook: pilots, agents and governance");

if (!root) {
  throw new Error("Missing #root mount point");
}

const page = article ? <GeoArticlePage article={article} /> : <Playbook locale={locale} />;

if (root.dataset.prerendered === "true") {
  hydrateRoot(root, page);
} else {
  createRoot(root).render(page);
}

function scrollToCurrentHash() {
  const rawId = window.location.hash.slice(1);
  if (!rawId) return;

  let id = rawId;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    // Keep the literal fragment when it is not valid URI-encoded text.
  }
  document.getElementById(id)?.scrollIntoView();
}

window.addEventListener("hashchange", scrollToCurrentHash);
window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToCurrentHash));

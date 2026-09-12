import { createRoot, hydrateRoot } from "react-dom/client";

import { Playbook } from "../app/Playbook";
import "../app/globals.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const pathname = window.location.pathname;
const localPath = basePath && pathname === basePath
  ? "/"
  : basePath && pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length)
    : pathname;
const locale = localPath === "/fr" || localPath.startsWith("/fr/") ? "fr" : "en";
const root = document.getElementById("root");

document.documentElement.lang = locale;
document.title = locale === "fr"
  ? "Playbook d’adoption de l’IA : pilotes, agents et gouvernance"
  : "AI Adoption Playbook: pilots, agents and governance";

if (!root) {
  throw new Error("Missing #root mount point");
}

// Editorial routes are complete HTML documents and do not load this client.
const page = <Playbook locale={locale} />;

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

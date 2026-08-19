import { createRoot, hydrateRoot } from "react-dom/client";

import { Playbook } from "../app/Playbook";
import "../app/globals.css";

const basePath = "/ai-adoption-playbook";
const localPath = window.location.pathname.startsWith(`${basePath}/`)
  ? window.location.pathname.slice(basePath.length)
  : window.location.pathname;
const locale = localPath === "/fr" || localPath.startsWith("/fr/") ? "fr" : "en";
const root = document.getElementById("root");

document.documentElement.lang = locale;
document.title = locale === "fr"
  ? "Playbook d’adoption de l’IA : pilotes, agents et gouvernance"
  : "AI Adoption Playbook: pilots, agents and governance";

if (!root) {
  throw new Error("Missing #root mount point");
}

if (root.dataset.prerendered === "true") {
  hydrateRoot(root, <Playbook locale={locale} />);
} else {
  createRoot(root).render(<Playbook locale={locale} />);
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

import { createRoot } from "react-dom/client";

import { Playbook } from "../app/Playbook";
import "../app/globals.css";

const basePath = "/ai-adoption-playbook";
const localPath = window.location.pathname.startsWith(`${basePath}/`)
  ? window.location.pathname.slice(basePath.length)
  : window.location.pathname;
const locale = localPath === "/fr" || localPath.startsWith("/fr/") ? "fr" : "en";
const root = document.getElementById("root");

document.documentElement.lang = locale;
document.title = locale === "fr" ? "Playbook d’adoption de l’IA" : "AI Adoption Playbook";

if (!root) {
  throw new Error("Missing #root mount point");
}

createRoot(root).render(<Playbook locale={locale} />);

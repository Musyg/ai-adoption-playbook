import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

for (const [pathname, language, title] of [
  ["/", "en", "AI Adoption Playbook"],
  ["/fr", "fr", "Playbook d’adoption de l’IA"],
]) {
  test(`server-renders the ${language} playbook`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(title, "i"));
    assert.match(html, /Evidence before autonomy|La preuve avant l’autonomie/i);
    assert.match(html, /Atelier Horizon/);
    assert.match(html, /8 min 35/);
    assert.match(html, /Continue conditionally|Continuer sous conditions/i);
    assert.match(html, /Camille Rey/);
    assert.match(html, /44 to 34 minutes|44 à 34 minutes/i);
    assert.match(html, /4\/14/);
    assert.match(html, /Extend the draft-only copilot|Prolonger 30 jours/i);
    assert.match(html, /Copilot, business agent|Copilote, agent métier/i);
    assert.match(html, /Why only|Pourquoi seulement/i);
    assert.match(html, /×5–12/);
    assert.match(html, /og\.png/i);
    assert.match(html, /href=["']#paths["']/i);
    assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
  });
}

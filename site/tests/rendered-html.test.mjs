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
    const renderedText = html.replaceAll("<!-- -->", "");
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
    assert.match(html, /Camille Rey · Phase 2/);
    assert.match(html, /44 → 14 min/);
    assert.match(html, /13\/20/);
    assert.match(html, /Keep A2 for 60 days|Conserver A2 pendant 60 jours/i);
    assert.match(html, /Do not claim A3|Ne pas revendiquer A3/i);
    assert.match(html, /Camille Rey · Standard diagnostic|Camille Rey · Diagnostic standard/i);
    assert.match(html, /7h 40|7 h 40/);
    assert.match(html, /×7[.,]9/);
    assert.match(html, /8\/17/);
    assert.match(html, /A4 remains unproven|A4 reste non démontré/i);
    assert.match(html, /Talos\/Hermes analogy|Analogie Talos\/Hermes/i);
    assert.match(html, /Calibrate before you promise|Calibrez avant de promettre/i);
    assert.match(renderedText, /14–21 h/);
    assert.match(renderedText, /35–52[.,]5%/);
    assert.match(renderedText, /×2–4/);
    assert.match(html, /A range is not a plan|Une fourchette n’est pas un plan/i);
    assert.match(html, /Pilot preregistered|Pilote préenregistré/i);
    assert.match(renderedText, /≥ 35%/);
    assert.match(html, /REWORK \+ RERUN|CORRIGER \+ REJOUER/i);
    assert.match(html, /id=["']evidence-gate["']/i);
    assert.match(html, /GATE LEDGER|REGISTRE DES GATES/i);
    assert.match(html, /CONTINUE BOUNDED|CONTINUER BORNÉ/i);
    assert.match(renderedText, /35[.,]8%/);
    assert.match(renderedText, /20\/20/);
    assert.match(html, /id=["']operations["']/i);
    assert.match(html, /Production is a reversible operating state|La production est un état réversible/i);
    assert.match(html, /LIVE · BOUNDED|ACTIF · BORNÉ/i);
    assert.match(html, /ROLLBACK IN FIVE PROVABLE STEPS|ROLLBACK EN CINQ ÉTAPES PROUVABLES/i);
    assert.match(renderedText, /1 September 2026|1 septembre 2026/i);
    assert.match(html, /id=["']decision-dossier["']/i);
    assert.match(html, /DRAFT DOSSIER|DOSSIER BROUILLON/i);
    assert.match(html, /ATTACH OR REFERENCE THESE SIX RECORDS|JOINDRE OU RÉFÉRENCER CES SIX ENREGISTREMENTS/i);
    assert.match(html, /Download Markdown dossier|Télécharger le dossier Markdown/i);
    assert.match(html, /Guided decision path|Parcours de décision guidé/i);
    assert.match(html, /href=["']#calibrator["']/i);
    assert.match(html, /href=["']#pilot-plan["']/i);
    assert.match(html, /href=["']#decision-dossier["']/i);
    assert.match(html, /og\.png/i);
    assert.match(html, /href=["']#integration-levels["']/i);
    assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
  });
}
